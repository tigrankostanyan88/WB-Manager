// Migration script to add name and profession columns to instructors table
const DB = require('./src/models');

async function migrate() {
    try {
        const [results] = await DB.con.query(`
            SELECT COLUMN_NAME 
            FROM INFORMATION_SCHEMA.COLUMNS 
            WHERE TABLE_NAME = 'instructors' 
            AND TABLE_SCHEMA = DATABASE()
        `);
        
        const columns = results.map(r => r.COLUMN_NAME);
        
        if (!columns.includes('name')) {
            console.log('Adding "name" column to instructors table...');
            await DB.con.query('ALTER TABLE instructors ADD COLUMN name VARCHAR(255) NULL');
            console.log('✓ name column added');
        } else {
            console.log('✓ name column already exists');
        }
        
        if (!columns.includes('profession')) {
            console.log('Adding "profession" column to instructors table...');
            await DB.con.query('ALTER TABLE instructors ADD COLUMN profession VARCHAR(255) NULL');
            console.log('✓ profession column added');
        } else {
            console.log('✓ profession column already exists');
        }
        
        console.log('\nMigration completed successfully!');
        process.exit(0);
    } catch (error) {
        console.error('Migration failed:', error);
        process.exit(1);
    }
}

migrate();
