const SUPABASE_URL = "https://ponzxsvzmvbvhwuddxeo.supabase.co";

const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBvbnp4c3Z6bXZidmh3dWRkeGVvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODkyNTYzNDYsImV4cCI6MjEwNDgzMjM0Nn0.RYYVKNfjuYiDXKuhvw_NmHurEP5wvVCVz6iDgnGbPpw

";

const db = supabase.createClient(
  SUPABASE_URL,
  SUPABASE_KEY
);
