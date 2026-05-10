const { Client } = require('pg');

async function run() {
  const client = new Client({
    connectionString: process.env.DIRECT_URL,
    ssl: { rejectUnauthorized: false }
  });
  
  try {
    await client.connect();
    console.log("Connected directly to Supabase DB!");
    
    // Add columns if they don't exist
    await client.query(`
      ALTER TABLE kanakademi_test_results 
      ADD COLUMN IF NOT EXISTS "name" TEXT NOT NULL DEFAULT 'Anonim',
      ADD COLUMN IF NOT EXISTS "bloodType" TEXT NOT NULL DEFAULT 'Bilinmiyor';
    `);
    console.log("Columns added successfully!");
  } catch (err) {
    console.error("Error executing SQL:", err);
  } finally {
    await client.end();
  }
}
run();
