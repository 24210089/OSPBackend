const mysql = require("mysql2/promise");
const path = require("path");
const dotenv = require("dotenv");

// Load environment variables from project root (works locally and on Railway when .env is present)
dotenv.config({ path: path.resolve(__dirname, "../../.env") });

const basePoolOptions = {
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0,
  multipleStatements: false,
  supportBigNumbers: true,
  bigNumberStrings: true,
};

const buildPool = () => {
  if (process.env.DATABASE_URL) {
    // Prefer Railway-provided DATABASE_URL; pass it directly to mysql2
    // and append common pool options via query params.
    const url = new URL(process.env.DATABASE_URL);
    const params = url.searchParams;
    params.set("waitForConnections", "true");
    params.set("connectionLimit", String(basePoolOptions.connectionLimit));
    params.set("queueLimit", String(basePoolOptions.queueLimit));
    params.set("enableKeepAlive", String(basePoolOptions.enableKeepAlive));
    params.set(
      "keepAliveInitialDelay",
      String(basePoolOptions.keepAliveInitialDelay)
    );
    params.set("multipleStatements", String(basePoolOptions.multipleStatements));
    params.set("supportBigNumbers", String(basePoolOptions.supportBigNumbers));
    params.set("bigNumberStrings", String(basePoolOptions.bigNumberStrings));

    return mysql.createPool(url.toString());
  }

  // Local development fallback
  return mysql.createPool({
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME || "osp_db",
    port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 3306,
    ...basePoolOptions,
  });
};

const pool = buildPool();

pool
  .getConnection()
  .then((connection) => {
    console.log("✅ Database connected successfully");
    connection.release();
  })
  .catch((err) => {
    console.error("❌ Database connection failed:", err.message);
    process.exit(1);
  });

module.exports = pool;
