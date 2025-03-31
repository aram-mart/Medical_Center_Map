import { serve } from "https://deno.land/std@0.192.0/http/server.ts";

// Function to get the appropriate content type for static files
function getContentType(filePath: string): string {
  const extension = filePath.split(".").pop();
  const contentTypes: Record<string, string> = {
    html: "text/html",
    css: "text/css",
    js: "application/javascript",
    png: "image/png",
    jpg: "image/jpeg",
    jpeg: "image/jpeg",
    svg: "image/svg+xml",
    json: "application/json",
  };
  return contentTypes[extension || ""] || "application/octet-stream";
}


const SUPABASE_URL = "https://rdlvbyljjvnqhqnuuedh.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJkbHZieWxqanZucWhxbnV1ZWRoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDMwNzE0NjMsImV4cCI6MjA1ODY0NzQ2M30.Mrk2TybfM8u5O8qNJ_WN2XPVfGmAkNQxx6UU6ZsOXKo";


const handler = async (request: Request): Promise<Response> => {
  const url = new URL(request.url);
  
  // Serve the map.html file for the root path
  if (url.pathname === "/") {
    try {
      const htmlContent = await Deno.readTextFile("./map.html");
      return new Response(htmlContent, {
        headers: {
          "Content-Type": "text/html",
          "Access-Control-Allow-Origin": "*",
        },
      });
    } catch (error) {
      return new Response("Error: Could not find map.html", { status: 500 });
    }
  }

  // Serve static assets (CSS, JS, Images)
  if (url.pathname.startsWith("/assets/")) {
    try {
      const filePath = `.${url.pathname}`;
      const fileContent = await Deno.readFile(filePath);
      return new Response(fileContent, {
        headers: { "Content-Type": getContentType(filePath) },
      });
    } catch (error) {
      return new Response("Error: Asset not found", { status: 404 });
    }
  }

  // API Endpoint to Fetch Medical Centers from Supabase
  if (url.pathname === "/api/medical-centers") {
    try {
      const response = await fetch(`${SUPABASE_URL}/rest/v1/medical_centers`, {
        headers: {
          "apikey": SUPABASE_KEY,
          "Authorization": `Bearer ${SUPABASE_KEY}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }

      const data = await response.json();
      return new Response(JSON.stringify(data), {
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      });
    } catch (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }
  }

  // 404 Not Found for any other routes
  return new Response("404 Not Found", { status: 404 });
};

// Start the server
console.log("Server is running on http://localhost:8000");
serve(handler);
