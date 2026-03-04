#!/bin/sh
set -e

echo "Running database migrations..."
npx drizzle-kit migrate
echo "Migrations complete."

echo "Running seed migrations..."
node -e "
const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');
const seedFile = path.join(__dirname, 'src/database/migrations/0002_seed_business_accounts.sql');
if (!fs.existsSync(seedFile)) { console.log('No seed file found, skipping.'); process.exit(0); }
const sql = fs.readFileSync(seedFile, 'utf8');
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
pool.query(sql)
  .then(() => { console.log('Seed complete.'); return pool.end(); })
  .catch(e => { console.error('Seed error:', e.message); return pool.end().then(() => process.exit(1)); });
"
echo "Seed migrations complete."

exec node dist/main
