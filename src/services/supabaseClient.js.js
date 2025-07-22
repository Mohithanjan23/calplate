import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://fmghhijqnfvhcddktirw.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZtZ2hoaWpxbmZ2aGNkZGt0aXJ3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTExOTg1NTcsImV4cCI6MjA2Njc3NDU1N30.CQfspGDrZPoHUSnsnBiFXN_IYRCyGLT6KRz-6QS-HTo';

export const supabase = createClient(supabaseUrl, supabaseKey);
