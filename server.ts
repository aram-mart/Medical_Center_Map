import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import "https://deno.land/x/dotenv@v3.2.2/load.ts";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY")!;
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const HTML_PAGE = await Deno.readTextFile("map.html");

serve(async (req) => {
  const url = new URL(req.url);

  if (url.pathname === "/") {
    return new Response(HTML_PAGE, {
      headers: { "Content-Type": "text/html" },
    });
  }

  if (url.pathname === "/api/centers") {
    const { data, error } = await supabase
      .from("medical_centers")
      .select("id, name, address, lat, lng, phone_number, categori");

    if (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
      });
    }

    return new Response(JSON.stringify(data), {
      headers: { "Content-Type": "application/json" },
    });
  }

  return new Response("Not Found", { status: 404 });
});
