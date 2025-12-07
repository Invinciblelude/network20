const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'https://gaunbvghpechybavxtdp.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdhdW5idmdocGVjaHliYXZ4dGRwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ3NzA5NjksImV4cCI6MjA4MDM0Njk2OX0.bTM6RND_a_yLY8JoTteYQ3-S_M810KJ1TipIXclTyFQ'
);

async function check() {
  const { data, error } = await supabase
    .from('profiles')
    .select('id, display_name, tagline, user_id')
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error('Error:', error.message);
    return;
  }
  
  console.log('All profiles in database:');
  data.forEach((p, i) => {
    console.log(`${i+1}. ${p.display_name} - ${p.tagline || '(no tagline)'}`);
    console.log(`   ID: ${p.id}`);
    console.log(`   user_id: ${p.user_id || 'NULL (anonymous)'}`);
    console.log('');
  });
}

check();
