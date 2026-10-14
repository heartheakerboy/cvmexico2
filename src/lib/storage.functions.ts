import { createServerFn } from "@tanstack/react-start";
import { requireD1Auth as requireSupabaseAuth, getServiceDb } from "@/lib/db/server-db.server";

export type StorageFile = {
  id: string;
  file_name: string;
  file_size: number;
  file_type: string;
  storage_path: string;
  file_url: string;
  status: "uploading" | "completed" | "failed" | "deleted";
  is_public: boolean;
  owner_id: string | null;
  created_at: string;
  updated_at: string;
};

type UploadArgs = {
  fileName: string;
  fileType: string;
  fileSize: number;
  isPublic: boolean;
  folder: string;
};

// 1. Get Presigned Upload URL
export const getUploadUrl = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((args: UploadArgs) => args)
  .handler(async ({ context, data: args }) => {
    const { r2Client, r2BucketName, r2PublicUrl } = await import("./r2.server");
    const { PutObjectCommand } = await import("@aws-sdk/client-s3");
    const { getSignedUrl } = await import("@aws-sdk/s3-request-presigner");

    const cleanName = args.fileName.replace(/[^a-zA-Z0-9.-]/g, "_");
    const uniqueName = `${Date.now()}-${cleanName}`;
    const folderClean = args.folder.replace(/\/$/, "").replace(/^\//, "");
    const storagePath = `${folderClean}/${uniqueName}`;

    const accountId = process.env.CLOUDFLARE_R2_ACCOUNT_ID || "";
    const base = r2PublicUrl || `https://pub-${accountId}.r2.dev/${r2BucketName}`;
    const fileUrl = `${base.replace(/\/$/, "")}/${storagePath}`;

    // Get signed PUT URL (expires in 15 minutes)
    const command = new PutObjectCommand({
      Bucket: r2BucketName,
      Key: storagePath,
      ContentType: args.fileType,
    });

    const uploadUrl = await getSignedUrl(r2Client, command, { expiresIn: 900 });

    // Save in storage_files table as 'uploading'
    const { data: fileRow, error } = await (context.supabase as any)
      .from("storage_files")
      .insert({
        file_name: args.fileName,
        file_size: args.fileSize,
        file_type: args.fileType,
        storage_path: storagePath,
        file_url: fileUrl,
        status: "uploading",
        is_public: args.isPublic,
        owner_id: context.userId,
      })
      .select()
      .single();

    if (error) {
      console.error("[Storage] Database insert error:", error);
      throw new Error("Failed to register file upload in database");
    }

    return {
      uploadUrl,
      storagePath,
      fileUrl,
      fileId: fileRow.id,
    };
  });

// 2. Confirm Upload Completion
export const confirmUpload = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((args: { fileId: string; fileSize?: number }) => args)
  .handler(async ({ context, data: args }) => {
    const { data, error } = await (context.supabase as any)
      .from("storage_files")
      .update({
        status: "completed",
        ...(args.fileSize ? { file_size: args.fileSize } : {}),
      })
      .eq("id", args.fileId)
      .select()
      .single();

    if (error) {
      console.error("[Storage] Database update error:", error);
      throw new Error("Failed to confirm file upload");
    }

    return { success: true, file: data };
  });

// 3. Get Signed Download URL (for private files)
export const getSignedDownloadUrl = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((args: { storagePath: string; expiresInSeconds?: number }) => args)
  .handler(async ({ context, data: args }) => {
    // Verify user owns the file or is admin
    const { data: fileRow, error } = await (context.supabase as any)
      .from("storage_files")
      .select("id, is_public")
      .eq("storage_path", args.storagePath)
      .maybeSingle();

    if (error || !fileRow) {
      throw new Error("File not found or unauthorized");
    }

    // If it's public, return the direct URL
    if (fileRow.is_public) {
      const { r2PublicUrl, r2BucketName } = await import("./r2.server");
      const accountId = process.env.CLOUDFLARE_R2_ACCOUNT_ID || "";
      const base = r2PublicUrl || `https://pub-${accountId}.r2.dev/${r2BucketName}`;
      return { signedUrl: `${base.replace(/\/$/, "")}/${args.storagePath}` };
    }

    const { r2Client, r2BucketName } = await import("./r2.server");
    const { GetObjectCommand } = await import("@aws-sdk/client-s3");
    const { getSignedUrl } = await import("@aws-sdk/s3-request-presigner");

    const command = new GetObjectCommand({
      Bucket: r2BucketName,
      Key: args.storagePath,
    });

    const signedUrl = await getSignedUrl(r2Client, command, {
      expiresIn: args.expiresInSeconds || 3600,
    });

    return { signedUrl };
  });

// 4. Delete File
export const deleteFile = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((args: { storagePath: string }) => args)
  .handler(async ({ context, data: args }) => {
    const { r2Client, r2BucketName } = await import("./r2.server");
    const { DeleteObjectCommand } = await import("@aws-sdk/client-s3");

    // Check ownership/permissions (Supabase RLS handles this, but let's select first to ensure it's deleted only if allowed)
    const { data: fileRow, error: findErr } = await (context.supabase as any)
      .from("storage_files")
      .select("id")
      .eq("storage_path", args.storagePath)
      .single();

    if (findErr || !fileRow) {
      throw new Error("File not found or unauthorized to delete");
    }

    // Delete from R2
    try {
      const command = new DeleteObjectCommand({
        Bucket: r2BucketName,
        Key: args.storagePath,
      });
      await r2Client.send(command);
    } catch (err) {
      console.error("[Storage] R2 deletion failed:", err);
      // Proceed with DB update anyway so user interface doesn't get stuck
    }

    // Update database status to 'deleted' or delete row
    const { error: dbErr } = await (context.supabase as any)
      .from("storage_files")
      .delete()
      .eq("id", fileRow.id);

    if (dbErr) {
      console.error("[Storage] Database deletion error:", dbErr);
      throw new Error("Failed to delete file from database");
    }

    return { success: true };
  });

// 5. Rename File
export const renameFile = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((args: { fileId: string; newName: string }) => args)
  .handler(async ({ context, data: args }) => {
    const { data, error } = await (context.supabase as any)
      .from("storage_files")
      .update({ file_name: args.newName })
      .eq("id", args.fileId)
      .select()
      .single();

    if (error) {
      throw new Error("Failed to rename file");
    }

    return { success: true, file: data };
  });

// 6. Get User Storage Usage
export const getUserStorageUsage = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await (context.supabase as any)
      .from("storage_files")
      .select("file_size")
      .eq("owner_id", context.userId)
      .eq("status", "completed");

    if (error) throw new Error("Failed to load storage usage");

    const totalBytes = (data ?? []).reduce((acc: number, row: any) => acc + Number(row.file_size), 0);
    const fileCount = data.length;

    return {
      totalBytes,
      fileCount,
    };
  });

// Helper: Check if user is Admin
async function checkAdmin(supabaseClient: any, userId: string) {
  const { data: isAdmin, error } = await supabaseClient.rpc("has_role", {
    _user_id: userId,
    _role: "admin",
  });
  if (error || !isAdmin) {
    throw new Error("Forbidden: Admin access required");
  }
}

// 7. Get Admin Storage Analytics
export const getAdminStorageAnalytics = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await checkAdmin(context.supabase, context.userId);
    const supabaseAdmin = getServiceDb();

    // Fetch all storage files (excluding deleted/uploading depending on metrics)
    const { data: allFiles, error } = await (supabaseAdmin as any)
      .from("storage_files")
      .select("*")
      .order("created_at", { ascending: false });

    if (error || !allFiles) throw new Error("Failed to load storage files");
    
    const rows = allFiles as StorageFile[];
    const activeFiles = rows.filter((f) => f.status === "completed");
    const failedFiles = rows.filter((f) => f.status === "failed");
    const deletedFiles = rows.filter((f) => f.status === "deleted");

    const totalBytes = activeFiles.reduce((acc, f) => acc + Number(f.file_size), 0);
    
    // Group by User
    const userMap: Record<string, number> = {};
    activeFiles.forEach((f) => {
      if (f.owner_id) {
        userMap[f.owner_id] = (userMap[f.owner_id] || 0) + Number(f.file_size);
      }
    });

    // Group by Mime-type
    const typeMap: Record<string, { size: number; count: number }> = {};
    activeFiles.forEach((f) => {
      const type = f.file_type || "unknown";
      if (!typeMap[type]) typeMap[type] = { size: 0, count: 0 };
      typeMap[type].size += Number(f.file_size);
      typeMap[type].count += 1;
    });

    // Storage Growth (over last 30 days)
    const growth: { date: string; bytes: number }[] = [];
    const last30Days = Array.from({ length: 30 }).map((_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - i);
      return d.toISOString().split("T")[0];
    }).reverse();

    let rollingSum = 0;
    // Calculate cumulative size before 30 days ago
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    activeFiles.forEach((f) => {
      if (new Date(f.created_at) < thirtyDaysAgo) {
        rollingSum += Number(f.file_size);
      }
    });

    last30Days.forEach((dateStr) => {
      const dayFiles = activeFiles.filter((f) => f.created_at.split("T")[0] === dateStr);
      const dayBytes = dayFiles.reduce((acc, f) => acc + Number(f.file_size), 0);
      rollingSum += dayBytes;
      growth.push({ date: dateStr, bytes: rollingSum });
    });

    // Cost estimate
    const gbUsed = totalBytes / (1024 * 1024 * 1024);
    // Cloudflare R2 is $0.015 per GB, first 10 GB free
    const costEstimate = Math.max(0, (gbUsed - 10) * 0.015);

    // Largest files
    const largestFiles = [...activeFiles]
      .sort((a, b) => Number(b.file_size) - Number(a.file_size))
      .slice(0, 10);

    // Recent uploads
    const recentUploads = activeFiles.slice(0, 10);

    return {
      totalBytes,
      activeFilesCount: activeFiles.length,
      failedFilesCount: failedFiles.length,
      deletedFilesCount: deletedFiles.length,
      storagePerUser: Object.entries(userMap).map(([userId, size]) => ({ userId, size })),
      storagePerType: Object.entries(typeMap).map(([type, val]) => ({ type, ...val })),
      growth,
      largestFiles,
      recentUploads,
      costEstimate,
    };
  });

// 8. Auto Cleanup Jobs
export const cleanupStorage = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await checkAdmin(context.supabase, context.userId);
    const supabaseAdmin = getServiceDb();
    const { r2Client, r2BucketName } = await import("./r2.server");
    const { DeleteObjectCommand } = await import("@aws-sdk/client-s3");

    // Clean uploads stuck in 'uploading' for > 24 hours (assumed failed)
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
    const { data: stuckFiles } = await (supabaseAdmin as any)
      .from("storage_files")
      .select("*")
      .eq("status", "uploading")
      .lt("created_at", twentyFourHoursAgo);

    let cleanedCount = 0;
    const filesToClean = (stuckFiles ?? []) as StorageFile[];

    if (filesToClean.length > 0) {
      for (const file of filesToClean) {
        try {
          const command = new DeleteObjectCommand({
            Bucket: r2BucketName,
            Key: file.storage_path,
          });
          await r2Client.send(command);
        } catch {}
        await (supabaseAdmin as any).from("storage_files").delete().eq("id", file.id);
        cleanedCount++;
      }
    }

    return { success: true, cleanedCount };
  });
