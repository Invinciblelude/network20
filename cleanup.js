const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'https://gaunbvghpechybavxtdp.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdhdW5idmdocGVjaHliYXZ4dGRwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ3NzA5NjksImV4cCI6MjA4MDM0Njk2OX0.bTM6RND_a_yLY8JoTteYQ3-S_M810KJ1TipIXclTyFQ'
);

async function cleanup() {
  // Delete test jobs
  const { error } = await supabase
    .from('jobs')
    .delete()
    .ilike('company_name', '%TEST%');
  
  if (error) {
    console.log('Error:', error.message);
  } else {
    console.log('✅ Test jobs deleted');
  }

  // Show remaining jobs
  const { data } = await supabase.from('jobs').select('company_name, job_title');
  console.log('Remaining jobs:', data?.length || 0);
  data?.forEach(j => console.log(`- ${j.job_title} at ${j.company_name}`));
}

cleanup();
