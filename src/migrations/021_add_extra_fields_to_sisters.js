// Migration: Add extra fields to sisters table
// Run: node src/migrations/021_add_extra_fields_to_sisters.js

const pool = require("../config/database");

const up = async () => {
  const connection = await pool.getConnection();
  try {
    console.log("Adding extra fields to sisters table...");

    // Add id_card fields
    await connection
      .query(
        `
      ALTER TABLE sisters 
      ADD COLUMN IF NOT EXISTS id_card VARCHAR(20) NULL AFTER nationality
    `
      )
      .catch(() => console.log("id_card column might already exist"));

    await connection
      .query(
        `
      ALTER TABLE sisters 
      ADD COLUMN IF NOT EXISTS id_card_date DATE NULL AFTER id_card
    `
      )
      .catch(() => console.log("id_card_date column might already exist"));

    await connection
      .query(
        `
      ALTER TABLE sisters 
      ADD COLUMN IF NOT EXISTS id_card_place VARCHAR(150) NULL AFTER id_card_date
    `
      )
      .catch(() => console.log("id_card_place column might already exist"));

    // Add current_address
    await connection
      .query(
        `
      ALTER TABLE sisters 
      ADD COLUMN IF NOT EXISTS current_address VARCHAR(255) NULL AFTER permanent_address
    `
      )
      .catch(() => console.log("current_address column might already exist"));

    // Add family-related fields
    await connection
      .query(
        `
      ALTER TABLE sisters 
      ADD COLUMN IF NOT EXISTS father_occupation VARCHAR(100) NULL AFTER father_name
    `
      )
      .catch(() => console.log("father_occupation column might already exist"));

    await connection
      .query(
        `
      ALTER TABLE sisters 
      ADD COLUMN IF NOT EXISTS mother_occupation VARCHAR(100) NULL AFTER mother_name
    `
      )
      .catch(() => console.log("mother_occupation column might already exist"));

    await connection
      .query(
        `
      ALTER TABLE sisters 
      ADD COLUMN IF NOT EXISTS siblings_count INT NULL AFTER mother_occupation
    `
      )
      .catch(() => console.log("siblings_count column might already exist"));

    await connection
      .query(
        `
      ALTER TABLE sisters 
      ADD COLUMN IF NOT EXISTS family_address VARCHAR(255) NULL AFTER siblings_count
    `
      )
      .catch(() => console.log("family_address column might already exist"));

    // Add current_stage field for quick access (denormalized from vocation_journey)
    await connection
      .query(
        `
      ALTER TABLE sisters 
      ADD COLUMN IF NOT EXISTS current_stage ENUM('inquiry','postulant','aspirant','novice','temporary_vows','perpetual_vows','left') NULL AFTER status
    `
      )
      .catch(() => console.log("current_stage column might already exist"));

    // Add community_id for current community (denormalized)
    await connection
      .query(
        `
      ALTER TABLE sisters 
      ADD COLUMN IF NOT EXISTS current_community_id INT UNSIGNED NULL AFTER current_stage
    `
      )
      .catch(() =>
        console.log("current_community_id column might already exist")
      );

    // Add foreign key for current_community_id (optional, may fail if already exists)
    await connection
      .query(
        `
      ALTER TABLE sisters 
      ADD CONSTRAINT fk_sisters_current_community 
      FOREIGN KEY (current_community_id) REFERENCES communities(id)
      ON DELETE SET NULL ON UPDATE CASCADE
    `
      )
      .catch(() =>
        console.log("FK for current_community_id might already exist")
      );

    console.log("Extra fields added successfully!");
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
    console.log("Removing extra fields from sisters table...");

    await connection
      .query(
        `ALTER TABLE sisters DROP FOREIGN KEY IF EXISTS fk_sisters_current_community`
      )
      .catch(() => {});
    await connection.query(
      `ALTER TABLE sisters DROP COLUMN IF EXISTS current_community_id`
    );
    await connection.query(
      `ALTER TABLE sisters DROP COLUMN IF EXISTS current_stage`
    );
    await connection.query(
      `ALTER TABLE sisters DROP COLUMN IF EXISTS family_address`
    );
    await connection.query(
      `ALTER TABLE sisters DROP COLUMN IF EXISTS siblings_count`
    );
    await connection.query(
      `ALTER TABLE sisters DROP COLUMN IF EXISTS mother_occupation`
    );
    await connection.query(
      `ALTER TABLE sisters DROP COLUMN IF EXISTS father_occupation`
    );
    await connection.query(
      `ALTER TABLE sisters DROP COLUMN IF EXISTS current_address`
    );
    await connection.query(
      `ALTER TABLE sisters DROP COLUMN IF EXISTS id_card_place`
    );
    await connection.query(
      `ALTER TABLE sisters DROP COLUMN IF EXISTS id_card_date`
    );
    await connection.query(`ALTER TABLE sisters DROP COLUMN IF EXISTS id_card`);

    console.log("Extra fields removed!");
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
