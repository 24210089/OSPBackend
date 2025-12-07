// Migration: Add profile fields to users table
// Run: node src/migrations/020_add_profile_fields_to_users.js

const pool = require("../config/database");

const up = async () => {
  const connection = await pool.getConnection();
  try {
    console.log("Adding profile fields to users table...");

    // Add full_name column
    await connection
      .query(
        `
      ALTER TABLE users 
      ADD COLUMN IF NOT EXISTS full_name VARCHAR(150) NULL AFTER email
    `
      )
      .catch(() => {
        // Column might already exist
      });

    // Add phone column
    await connection
      .query(
        `
      ALTER TABLE users 
      ADD COLUMN IF NOT EXISTS phone VARCHAR(30) NULL AFTER full_name
    `
      )
      .catch(() => {
        // Column might already exist
      });

    // Add avatar column
    await connection
      .query(
        `
      ALTER TABLE users 
      ADD COLUMN IF NOT EXISTS avatar VARCHAR(500) NULL AFTER phone
    `
      )
      .catch(() => {
        // Column might already exist
      });

    console.log("Profile fields added successfully!");
  } catch (error) {
    console.error("Migration failed:", error.message);
    throw error;
  } finally {
    connection.release();
  }
};

const down = async () => {
  const connection = await pool.getConnection();
  try {
    console.log("Removing profile fields from users table...");

    await connection.query(`ALTER TABLE users DROP COLUMN IF EXISTS avatar`);
    await connection.query(`ALTER TABLE users DROP COLUMN IF EXISTS phone`);
    await connection.query(`ALTER TABLE users DROP COLUMN IF EXISTS full_name`);

    console.log("Profile fields removed!");
  } catch (error) {
    console.error("Rollback failed:", error.message);
    throw error;
  } finally {
    connection.release();
  }
};

// Run migration
if (require.main === module) {
  up()
    .then(() => {
      console.log("Migration completed!");
      process.exit(0);
    })
    .catch((err) => {
      console.error("Migration error:", err);
      process.exit(1);
    });
}

module.exports = { up, down };
