const mysql = require('mysql2/promise');
require('dotenv').config();

async function addThumbnailTimeColumn() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
  });

  try {
    // Check if column already exists
    const [columns] = await connection.execute(
      `SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS 
       WHERE TABLE_NAME = 'courses' AND COLUMN_NAME = 'thumbnail_time'`
    );

    if (columns.length > 0) {
      console.log('Column thumbnail_time already exists');
      return;
    }

    // Add the column
    await connection.execute(
      `ALTER TABLE courses ADD COLUMN thumbnail_time FLOAT NULL`
    );
    console.log('Column thumbnail_time added successfully');
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await connection.end();
  }
}

addThumbnailTimeColumn();
