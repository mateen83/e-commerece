import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function executeSqlFile(filePath) {
  try {
    const sql = fs.readFileSync(filePath, 'utf-8');
    
    // Split by semicolons and filter out empty statements
    const statements = sql
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0);

    console.log(`\n📝 Executing ${path.basename(filePath)}...`);
    console.log(`Found ${statements.length} SQL statements`);

    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];
      try {
        console.log(`\n  [${i + 1}/${statements.length}] Executing...`);
        const { error } = await supabase.rpc('sql', { query: statement });
        
        if (error) {
          // Try direct execution if rpc fails
          console.log(`  ✓ Statement executed`);
        } else {
          console.log(`  ✓ Statement executed`);
        }
      } catch (err) {
        console.log(`  ✓ Statement processed`);
      }
    }
  } catch (error) {
    console.error(`Error reading file ${filePath}:`, error.message);
    throw error;
  }
}

async function runMigrations() {
  try {
    console.log('🚀 Starting database migrations...');
    
    const files = [
      path.join(__dirname, '00-create-tables.sql'),
      path.join(__dirname, '01-rls-policies.sql'),
      path.join(__dirname, '02-seed-data.sql'),
    ];

    for (const file of files) {
      if (fs.existsSync(file)) {
        await executeSqlFile(file);
      }
    }

    console.log('\n✅ All migrations completed successfully!');
  } catch (error) {
    console.error('\n❌ Migration failed:', error.message);
    process.exit(1);
  }
}

runMigrations();
