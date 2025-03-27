import { serve } from "https://deno.land/std@0.192.0/http/server.ts";

const SUPABASE_URL = "https://rdlvbyljjvnqhqnuuedh.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJkbHZieWxqanZucWhxbnV1ZWRoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDMwNzE0NjMsImV4cCI6MjA1ODY0NzQ2M30.Mrk2TybfM8u5O8qNJ_WN2XPVfGmAkNQxx6UU6ZsOXKo";

async function fetchMedicalCenters() {
  const response = await fetch(`${SUPABASE_URL}/rest/v1/medical_centers`, {
    method: "GET",
    headers: {
      "apikey": SUPABASE_KEY,
      "Authorization": `Bearer ${SUPABASE_KEY}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    console.error("Error fetching medical centers:", await response.text());
    return new Response("Failed to fetch data", { status: 500 });
  }

  const data = await response.json();
  return new Response(JSON.stringify(data), {
    headers: { "Content-Type": "application/json" },
  });
}

serve(async (req) => {
  const url = new URL(req.url);
  if (url.pathname === "/api/medical-centers") {
    return await fetchMedicalCenters();
  }

  return new Response("Not Found", { status: 404 });
});
