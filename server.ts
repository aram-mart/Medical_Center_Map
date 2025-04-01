// import { serve } from "https://deno.land/std@0.192.0/http/server.ts";

// const handler = async (request) => {
//   const url = new URL(request.url);

//   // Serve the map.html file for the root path
//   if (url.pathname === "/") {
//     try {
//       const htmlContent = await Deno.readTextFile("./map.html");
//       return new Response(htmlContent, {
//         headers: { "Content-Type": "text/html" },
//       });
//     } catch (error) {
//       return new Response("Error: Could not find map.html", { status: 500 });
//     }
//   }

//   // 404 Not Found for any other routes
//   return new Response("404 Not Found", { status: 404 });
// };

// console.log("Server is running on http://localhost:8000");
// serve(handler);


import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import "https://deno.land/x/dotenv@v3.2.2/load.ts";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY")!;
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const HTML_PAGE = await Deno.readTextFile("map.html");

serve(async (req) => {
  const url = new URL(req.url);
  
  // Serve the HTML page when accessing the root
  if (url.pathname === "/") {
    return new Response(HTML_PAGE, {
      headers: { "Content-Type": "text/html" },
    });
  }

  // API route to return JSON data
  if (url.pathname === "/api/centers") {
    const { data, error } = await supabase.from("medical_centers").select("id, name, address, lat, lng, phone_number");
  
    if (error) {
      return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }
  
    return new Response(JSON.stringify(data), {
      headers: { "Content-Type": "application/json" },
    });
  }

  return new Response("Not Found", { status: 404 });
});
