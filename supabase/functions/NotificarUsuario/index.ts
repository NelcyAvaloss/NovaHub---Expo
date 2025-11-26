// ...existing code...
import "jsr:@supabase/functions-js/edge-runtime.d.ts"
import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";
// ...existing code...

console.log("Hello from Functions!")

Deno.serve(async (req) => {
  const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
  const SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const FCM_SERVER_KEY = Deno.env.get("FCM_SERVER_KEY")!;
  const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

  const { id_usuario, titulo, cuerpo, llave } = await req.json();

  // ✅ Seguridad: solo aceptar llamadas internas
  if (llave !== SERVICE_ROLE_KEY) {
    return new Response("Unauthorized", { status: 401 });
  }

  const { data: tokens, error } = await supabase
    .from("Tokens_Notificaciones")
    .select("token")
    .eq("id_usuario", id_usuario);

  if (error) {
    return new Response(`Error fetching tokens: ${error.message}`, { status: 400 });
  }

  const listaTokens = tokens ?? [];

  for (const { token } of listaTokens) {
    await fetch("https://fcm.googleapis.com/fcm/send", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `key=${FCM_SERVER_KEY}`
      },
      body: JSON.stringify({
        to: token,
        notification: {
          title: titulo,
          body: cuerpo,
        }
      })
    })
    .catch((error) => {
      console.error("Error sending notification:", error);
      // Verificar si el token es inválido y eliminarlo de la base de datos
      const msg = String(error?.message ?? "");
      if (msg.includes("DeviceNotRegistered") || msg.includes("NotRegistered") || msg.includes("InvalidCredentials")) {
        supabase
          .from("Tokens_Notificaciones")
          .delete()
          .eq("token", token)
          .then(({ error }) => {
            if (error) {
              console.error("Error deleting invalid token:", error);
            } else {
              console.log("Invalid token deleted:", token);
            }
          });
      }
    });
    console.log(`Notificación enviada al token: ${token}`);
  }

  return new Response("Notificaciones enviadas", { status: 200 });
})
// ...existing code...

/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/NotificarUsuario' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
    --header 'Content-Type: application/json' \
    --data '{"name":"Functions"}'

*/
