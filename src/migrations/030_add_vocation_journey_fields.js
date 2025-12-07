const db = require("../config/database");

const up = async () => {
  const connection = await db.getConnection();
  try {
    // Add location, superior, and formation_director fields to vocation_journey table
    await connection.query(`
      ALTER TABLE vocation_journey 
      ADD COLUMN IF NOT EXISTS location VARCHAR(255) NULL AFTER end_date,
      ADD COLUMN IF NOT EXISTS superior VARCHAR(255) NULL AFTER location,
      ADD COLUMN IF NOT EXISTS formation_director VARCHAR(255) NULL AFTER superior
    `);
    console.log(
      "✅ Added location, superior, formation_director columns to vocation_journey table"
    );
  } catch (error) {
    // Check if columns already exist
    if (error.code === "ER_DUP_FIELDNAME") {
      console.log("⚠️ Columns already exist in vocation_journey table");
    } else {
      throw error;
    }
  } finally {
    connection.release();
  }
};

const down = async () => {
  const connection = await db.getConnection();
  try {
    await connection.query(`
      ALTER TABLE vocation_journey 
      DROP COLUMN IF EXISTS location,
      DROP COLUMN IF EXISTS superior,
      DROP COLUMN IF EXISTS formation_director
    `);
    console.log(
      "✅ Dropped location, superior, formation_director columns from vocation_journey table"
    );
  } finally {
    connection.release();
  }
};

module.exports = { up, down };
