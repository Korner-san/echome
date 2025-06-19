import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://bivtrfniocvgyrjlhdpk.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJpdnRyZm5pb2N2Z3lyamxoZHBrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAyNTAxOTUsImV4cCI6MjA2NTgyNjE5NX0.BeM-3LjpL-FCo1KZEuXYKGP9HJYXuQuInHWHemW5hso'

export const supabase = createClient(supabaseUrl, supabaseAnonKey) 