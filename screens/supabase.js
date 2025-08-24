import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://gyuiofyyqsgvwhyoszmo.supabase.co';
const supabaseKey = 'sb_publishable_84vx7iwCU7XUyuJyDDJKDQ_aiaotiWI';
export const supabase = createClient(supabaseUrl, supabaseKey);
