const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'https://gaunbvghpechybavxtdp.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdhdW5idmdocGVjaHliYXZ4dGRwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ3NzA5NjksImV4cCI6MjA4MDM0Njk2OX0.bTM6RND_a_yLY8JoTteYQ3-S_M810KJ1TipIXclTyFQ'
);

async function deleteVince() {
  // First find both Vince D profiles
  const { data: profiles, error: findError } = await supabase
    .from('profiles')
    .select('id, display_name, tagline')
    .ilike('display_name', '%Vince D%');
  
  if (findError) {
    console.error('Error finding profiles:', findError.message);
    return;
  }
  
  console.log('Found Vince D profiles:');
  profiles.forEach(p => console.log(`- ${p.display_name} (${p.tagline || 'no tagline'}) - ID: ${p.id}`));
  
  // Delete them
  for (const profile of profiles) {
    const { error: deleteError } = await supabase
      .from('profiles')
      .delete()
      .eq('id', profile.id);
    
    if (deleteError) {
      console.error(`Error deleting ${profile.display_name}:`, deleteError.message);
    } else {
      console.log(`✅ Deleted: ${profile.display_name}`);
    }
  }
  
  // Verify
  const { data: remaining } = await supabase
    .from('profiles')
    .select('display_name')
    .order('created_at', { ascending: false });
  
  console.log('\nRemaining profiles:');
  remaining.forEach(p => console.log(`- ${p.display_name}`));
}

deleteVince();
