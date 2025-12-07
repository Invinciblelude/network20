const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'https://gaunbvghpechybavxtdp.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdhdW5idmdocGVjaHliYXZ4dGRwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ3NzA5NjksImV4cCI6MjA4MDM0Njk2OX0.bTM6RND_a_yLY8JoTteYQ3-S_M810KJ1TipIXclTyFQ'
);

async function checkSetup() {
  console.log('=== NETWORK 20 SETUP CHECK ===\n');

  // 1. Check profiles table
  console.log('1. PROFILES TABLE');
  const { data: profiles, error: profilesError } = await supabase
    .from('profiles')
    .select('id, display_name, tagline')
    .order('created_at', { ascending: false });
  
  if (profilesError) {
    console.log('   ❌ Error:', profilesError.message);
  } else {
    console.log('   ✅ Profiles table exists');
    console.log(`   📊 ${profiles.length} profiles found:`);
    profiles.forEach(p => console.log(`      - ${p.display_name} (${p.tagline || 'no tagline'})`));
  }

  // 2. Check jobs table
  console.log('\n2. JOBS TABLE');
  const { data: jobs, error: jobsError } = await supabase
    .from('jobs')
    .select('id, company_name, job_title');
  
  if (jobsError) {
    console.log('   ❌ Jobs table error:', jobsError.message);
    console.log('   ⚠️  You may need to run the CREATE TABLE SQL');
  } else {
    console.log('   ✅ Jobs table exists');
    console.log(`   📊 ${jobs.length} jobs posted`);
    if (jobs.length > 0) {
      jobs.forEach(j => console.log(`      - ${j.job_title} at ${j.company_name}`));
    }
  }

  // 3. Check for Vince D profiles
  console.log('\n3. VINCE D CHECK');
  const vinceProfiles = profiles?.filter(p => p.display_name.toLowerCase().includes('vince')) || [];
  if (vinceProfiles.length > 0) {
    console.log('   ⚠️  Vince D profiles still exist:');
    vinceProfiles.forEach(p => console.log(`      - ${p.display_name} (${p.tagline || 'no tagline'})`));
    console.log('   💡 Run this SQL to delete: DELETE FROM profiles WHERE display_name ILIKE \'%Vince%\';');
  } else {
    console.log('   ✅ No Vince D profiles found');
  }

  // 4. Test job creation (dry run)
  console.log('\n4. JOB POSTING TEST');
  const { error: insertError } = await supabase
    .from('jobs')
    .insert({
      company_name: 'TEST_COMPANY_DELETE_ME',
      job_title: 'TEST_JOB_DELETE_ME',
      contact_email: 'test@test.com'
    })
    .select()
    .single();
  
  if (insertError) {
    console.log('   ❌ Cannot post jobs:', insertError.message);
    console.log('   ⚠️  Check RLS policies for jobs table');
  } else {
    console.log('   ✅ Job posting works!');
    // Clean up test
    await supabase.from('jobs').delete().eq('company_name', 'TEST_COMPANY_DELETE_ME');
    console.log('   🧹 Test job cleaned up');
  }

  console.log('\n=== CHECK COMPLETE ===');
}

checkSetup();
