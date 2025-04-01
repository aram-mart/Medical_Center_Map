import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import "https://deno.land/x/dotenv@v3.2.2/load.ts";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY")!;
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

serve(async (req) => {
  const url = new URL(req.url);
  const city = url.searchParams.get("city"); // Get city from URL parameters

  if (url.pathname === "/") {
    return new Response("API is running. Use /api/centers for data.", { status: 200 });
  }

  if (url.pathname === "/api/centers") {
    let query = supabase.from("medical_centers").select("id, name, address, lat, lng");

    if (city) {
      query = query.ilike("address", `%${city}%`); // Case-insensitive search for city in address
    }

    const { data, error } = await query;

    if (error) {
      return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }

    return new Response(JSON.stringify(data), {
      headers: { "Content-Type": "application/json" },
    });
  }

  return new Response("Not Found", { status: 404 });
});
