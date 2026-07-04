import { createClient } from '@supabase/supabase-js';
import xlsx from 'xlsx';
import path from 'path';

// Load keys (Assuming you run this script with `node --env-file=.env.local scripts/seed.mjs`)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase keys in environment");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function seed() {
  console.log("Reading Excel file...");
  const filePath = path.resolve('./Oct 2025 - OpenVC (1).xlsx');
  const wb = xlsx.readFile(filePath);
  const ws = wb.Sheets[wb.SheetNames[0]];
  const data = xlsx.utils.sheet_to_json(ws);
  
  console.log(`Found ${data.length} records. Uploading in batches to Supabase...`);
  
  // Clear existing to avoid duplicates
  await supabase.from('VC').delete().neq('name', 'impossible_name_to_match_all');

  const batchSize = 500;
  for (let i = 0; i < data.length; i += batchSize) {
    const chunk = data.slice(i, i + batchSize).map((row) => ({
      name: row['Investor name'] || 'Unknown',
      website: row['Website'] || null,
      city: row['Global HQ'] ? row['Global HQ'].split(',')[0].trim() : null,
      country: row['Global HQ'] ? row['Global HQ'].split(',')[1]?.trim() : null,
      investmentThesis: row['Investment thesis'] || null,
      sector: row['Sector'] || 'All Sectors',
      minCheck: row['First cheque minimum'] || null,
      maxCheck: row['First cheque maximum'] || null,
      description: `Focuses on: ${row['Countries of investment'] || 'Global'} | Stages: ${row['Stage of investment'] || 'Any'}`,
      isApproved: true,
    }));

    const { data: inserted, error } = await supabase.from('VC').insert(chunk).select();
    if (error) {
      console.error(`Error inserting batch ${i}:`, error);
    } else {
      console.log(`Successfully inserted batch of ${inserted.length} VC firms!`);
    }
  }
}

seed();
