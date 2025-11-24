// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs
import "jsr:@supabase/functions-js/edge-runtime.d.ts"

console.log("Hello from Functions!")

Deno.serve(async (req) => {
  const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
    const SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);
  
    const { id_usuario, titulo, cuerpo } = await req.json();

  // ✅ Seguridad: solo aceptar llamadas internas
  const authHeader = req.headers.get("authorization");
  if (authHeader !== `Bearer ${SERVICE_ROLE_KEY}`) {
    return new Response("Unauthorized", { status: 401 });
  }

    const { data: tokens, error } = await supabase
      .from("tokenes_notificaciones")
      .select("token")
      .eq("id_usuario", id_usuario);
  
    if (error) {
      return new Response(`Error fetching tokens: ${error.message}`, { status: 400 });
    }

    for(const {token} of tokens) {
      await fetch("https://exp.host/--/api/v2/push/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          to: token,
          title: titulo,
          body: cuerpo,
          sound: "default"
        })
      })
      .catch((error) => {
        console.error("Error sending notification:", error);
        //Verificar si el token es inválido y eliminarlo de la base de datos
        if (error.message.includes("DeviceNotRegistered || NotRegistered || InvalidCredentials")) {
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
      return new Response("Notificaciones enviadas", { status: 200 });
    }

})

/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/NotificarUsuario' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
    --header 'Content-Type: application/json' \
    --data '{"name":"Functions"}'

*/
