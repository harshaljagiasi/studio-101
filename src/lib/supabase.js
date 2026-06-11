import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// This will print to your VS Code Terminal so we can see what is happening!
console.log("CHECKING URL:", supabaseUrl); 
console.log("CHECKING KEY:", supabaseKey ? "Key Exists" : "Key is Missing");

export const supabase = createClient(supabaseUrl, supabaseKey);