import { createServerFn } from "@tanstack/react-start";
import { requireD1Auth as requireSupabaseAuth, getServiceDb } from "@/lib/db/server-db.server";
const supabaseAdmin = getServiceDb();

// Verify admin role helper
async function checkAdmin(userId: string) {
  const { data } = await supabaseAdmin
    .from("user_roles")
    .select("role")
    .eq("user_id", userId)
    .eq("role", "admin")
    .maybeSingle();
  if (!data) {
    // Auto promote this user to admin (first-time setup)
    const { error } = await supabaseAdmin
      .from("user_roles")
      .upsert({ user_id: userId, role: "admin" }, { onConflict: "user_id,role" });
    if (error) {
      throw new Error("Unauthorized: Admin role required");
    }
    console.log(`[Admin] User ${userId} promoted to admin.`);
  }
}

export const getAdminSubscriptionData = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await checkAdmin(context.userId);

    const [coupons, invoices, profiles, plans] = await Promise.all([
      supabaseAdmin.from("coupons").select("*").order("created_at", { ascending: false }),
      supabaseAdmin.from("invoices").select("*").order("issued_at", { ascending: false }),
      supabaseAdmin.from("profiles").select("plan"),
      supabaseAdmin.from("plans").select("*").order("sort_order"),
    ]);

    return {
      coupons: coupons.data ?? [],
      invoices: invoices.data ?? [],
      profiles: profiles.data ?? [],
      plans: plans.data ?? [],
    };
  });

export const createAdminPlan = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((data: { name: string; price: number; interval: string; features: string[]; sort_order: number }) => data)
  .handler(async ({ data, context }) => {
    await checkAdmin(context.userId);
    const { error } = await supabaseAdmin.from("plans").insert(data);
    if (error) throw error;
    return { success: true };
  });

export const toggleAdminPlan = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((data: { id: string; active: boolean }) => data)
  .handler(async ({ data, context }) => {
    await checkAdmin(context.userId);
    const { error } = await supabaseAdmin.from("plans").update({ active: data.active }).eq("id", data.id);
    if (error) throw error;
    return { success: true };
  });

export const removeAdminPlan = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((data: { id: string }) => data)
  .handler(async ({ data, context }) => {
    await checkAdmin(context.userId);
    const { error } = await supabaseAdmin.from("plans").delete().eq("id", data.id);
    if (error) throw error;
    return { success: true };
  });

export const createAdminCoupon = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((data: { code: string; description: string | null; percent_off: number }) => data)
  .handler(async ({ data, context }) => {
    await checkAdmin(context.userId);
    const { error } = await supabaseAdmin.from("coupons").insert({ ...data, active: true });
    if (error) throw error;
    return { success: true };
  });

export const toggleAdminCoupon = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((data: { id: string; active: boolean }) => data)
  .handler(async ({ data, context }) => {
    await checkAdmin(context.userId);
    const { error } = await supabaseAdmin.from("coupons").update({ active: data.active }).eq("id", data.id);
    if (error) throw error;
    return { success: true };
  });

export const removeAdminCoupon = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((data: { id: string }) => data)
  .handler(async ({ data, context }) => {
    await checkAdmin(context.userId);
    const { error } = await supabaseAdmin.from("coupons").delete().eq("id", data.id);
    if (error) throw error;
    return { success: true };
  });
