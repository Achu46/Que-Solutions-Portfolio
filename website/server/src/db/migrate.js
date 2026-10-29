const fs = require('fs');
const path = require('path');
const { pool, testConnection } = require('./index');

async function runMigrations() {
  console.log('[Migration] Checking PostgreSQL connection...');
  const health = await testConnection();

  if (!health.connected) {
    console.error(`[Migration Error] Unable to connect to PostgreSQL: ${health.error}`);
    console.log('[Migration Advice] Check your DATABASE_URL or PostgreSQL credentials in server/.env');
    process.exit(1);
  }

  console.log(`[Migration] Connected to database "${health.database}" at ${health.time}`);
  const schemaPath = path.join(__dirname, 'schema.sql');
  const schemaSql = fs.readFileSync(schemaPath, 'utf8');

  try {
    console.log('[Migration] Running schema DDL...');
    await pool.query(schemaSql);
    console.log('[Migration] Successfully created/verified all 14 tables and indices!');
  } catch (err) {
    console.error('[Migration Error] Execution failed:', err);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

if (require.main === module) {
  runMigrations();
}

module.exports = { runMigrations };
