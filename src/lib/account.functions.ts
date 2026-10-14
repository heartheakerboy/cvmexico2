import { createServerFn } from "@tanstack/react-start";
import { requireD1Auth as requireSupabaseAuth, workerDb } from "@/lib/db/server-db.server";
import { deleteUserCompletely } from "@/lib/auth-d1/users.server";

export const deleteMyAccount = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await deleteUserCompletely(workerDb(), context.userId);
    return { ok: true };
  });
