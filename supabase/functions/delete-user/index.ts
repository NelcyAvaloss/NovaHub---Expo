import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

Deno.serve(async (req) => {
  const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
  const SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

  const { user_id } = await req.json();

  // ✅ Seguridad: solo aceptar llamadas internas
  const authHeader = req.headers.get("authorization");
  if (authHeader !== `Bearer ${SERVICE_ROLE_KEY}`) {
    return new Response("Unauthorized", { status: 401 });
  }

  const { error } = await supabase.auth.admin.deleteUser(user_id);

  if (error) {
    return new Response(`Error deleting user: ${error.message}`, { status: 400 });
  }

  return new Response("User deleted", { status: 200 });
});
