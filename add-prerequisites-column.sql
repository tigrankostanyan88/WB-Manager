/**
 * Database sync script for adding prerequisites column
 * 
 * Run this script manually to add the prerequisites column to the courses table:
 * 
 * MySQL/MariaDB:
 * ALTER TABLE courses ADD COLUMN prerequisites TEXT AFTER whatToLearn;
 * 
 * Or if whatToLearn doesn't exist:
 * ALTER TABLE courses ADD COLUMN prerequisites TEXT;
 * 
 * PostgreSQL:
 * ALTER TABLE courses ADD COLUMN prerequisites TEXT;
 * 
 * SQLite:
 * ALTER TABLE courses ADD COLUMN prerequisites TEXT;
 */

console.log(`
To fix the 500 error, run this SQL command in your database:

MySQL/MariaDB:
-------------------
ALTER TABLE courses ADD COLUMN prerequisites TEXT;
-------------------

Then restart the server.
`);
