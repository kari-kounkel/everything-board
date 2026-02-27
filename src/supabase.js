import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://iwrrkhzjfjlgpqmzlxqb.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml3cnJraHpqZmpsZ3BxbXpseHFiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzIyMzM1ODksImV4cCI6MjA4NzgwOTU4OX0.q0DnXWbRL10AOzILD5IOBrb_rChlby30Zn4da7luMYI'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
