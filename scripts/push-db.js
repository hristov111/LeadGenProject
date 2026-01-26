
const { createClient } = require('@libsql/client');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

async function main() {
    const url = process.env.TURSO_DATABASE_URL;
    const authToken = process.env.TURSO_AUTH_TOKEN;

    if (!url || !authToken) {
        console.error('Missing TURSO_DATABASE_URL or TURSO_AUTH_TOKEN in .env');
        process.exit(1);
    }

    console.log(`Connecting to Turso: ${url}`);
    const client = createClient({ url, authToken });

    try {
        const sqlPath = path.join(__dirname, 'migration.sql');
        const sql = fs.readFileSync(sqlPath, 'utf8');

        // Split by semi-colon to get individual statements if needed, 
        // but execute helper often takes multiple statements or we can execute raw.
        // LibSQL client might prefer single statements.
        // Simple split by ';' might be brittle for complex SQL but fine for generated DDL.
        const statements = sql.split(';')
            .map(s => s.trim())
            .filter(s => s.length > 0);

        console.log(`Found ${statements.length} statements to execute.`);

        for (const stmt of statements) {
            // console.log('Executing:', stmt.substring(0, 50) + '...');
            await client.execute(stmt);
        }

        console.log('✅ Migration setup successfully!');
    } catch (e) {
        console.error('Error executing migration:', e);
        process.exit(1);
    } finally {
        client.close();
    }
}

main();
