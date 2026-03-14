require('dotenv').config();
const DB = require('./src/models');

async function checkTables() {
    const [modules] = await DB.con.query("SHOW CREATE TABLE modules");
    const [lessons] = await DB.con.query("SHOW CREATE TABLE lessons");
    
    console.log("=== MODULES TABLE ===");
    console.log(modules[0]['Create Table']);
    
    console.log("\n=== LESSONS TABLE ===");
    console.log(lessons[0]['Create Table']);
    
    process.exit(0);
}

checkTables().catch(e => {
    console.error(e);
    process.exit(1);
});
