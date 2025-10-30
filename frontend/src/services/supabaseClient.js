// src/services/supabaseClient.js
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

// create a single client for the whole app
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
