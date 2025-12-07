const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'https://gaunbvghpechybavxtdp.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdhdW5idmdocGVjaHliYXZ4dGRwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ3NzA5NjksImV4cCI6MjA4MDM0Njk2OX0.bTM6RND_a_yLY8JoTteYQ3-S_M810KJ1TipIXclTyFQ'
);

async function backup() {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error('Error:', error.message);
    return;
  }
  
  console.log('=== PROFILES BACKUP ===');
  console.log('Total profiles:', data.length);
  console.log('\n');
  
  const fs = require('fs');
  const timestamp = new Date().toISOString().split('T')[0];
  const filename = `backup_profiles_${timestamp}.json`;
  
  fs.writeFileSync(filename, JSON.stringify(data, null, 2));
  console.log(`Saved to: ${filename}`);
  
  // Also show summary
  data.forEach((p, i) => {
    console.log(`${i+1}. ${p.display_name} - ${p.tagline || 'No tagline'} (${p.id})`);
  });
}

backup();
