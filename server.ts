import { serve } from "https://deno.land/std@0.192.0/http/server.ts";

const handler = async (request) => {
  const url = new URL(request.url);

  // Serve the map.html file for the root path
  if (url.pathname === "/") {
    try {
      const htmlContent = await Deno.readTextFile("./map.html");
      return new Response(htmlContent, {
        headers: { "Content-Type": "text/html" },
      });
    } catch (error) {
      return new Response("Error: Could not find map.html", { status: 500 });
    }
  }

  // 404 Not Found for any other routes
  return new Response("404 Not Found", { status: 404 });
};

console.log("Server is running on http://localhost:8000");
serve(handler);