import { createClient } from "@supabase/supabase-js";
import type { Database } from "./types";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseServiceRoleKey) {
  throw new Error(
    "Missing Supabase environment variables. Please check your .env.local file."
  );
}

// Admin client with service role key - bypasses RLS
export const supabaseAdmin = createClient<Database>(
  supabaseUrl,
  supabaseServiceRoleKey,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);

// Helper function to check if a user is admin
export async function verifyAdminUser(userId: string): Promise<boolean> {
  try {
    const { data: user, error } = await supabaseAdmin.auth.admin.getUserById(
      userId
    );

    if (error || !user) {
      return false;
    }

    const role =
      user.user.app_metadata?.role || user.user.user_metadata?.role;
    return role === "admin";
  } catch (error) {
    console.error("Error verifying admin user:", error);
    return false;
  }
}
