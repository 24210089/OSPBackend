const BaseModel = require("./BaseModel");

class HealthRecordModel extends BaseModel {
  constructor() {
    super({ tableName: "health_records", primaryKey: "id" });
    this.allowedFields = [
      "sister_id",
      "general_health",
      "chronic_diseases",
      "work_limitations",
      "checkup_date",
      "next_checkup_date",
      "checkup_place",
      "doctor",
      "blood_pressure",
      "heart_rate",
      "weight",
      "height",
      "diagnosis",
      "treatment",
      "notes",
      "documents",
      "created_at",
      "updated_at",
    ];
    this.requiredFields = ["sister_id", "general_health"];
  }

  validateData(data = {}, { partial = false } = {}) {
    const sanitized = {};

    // Remove non-allowed fields silently instead of throwing error
    Object.entries(data).forEach(([key, value]) => {
      if (this.allowedFields.includes(key)) {
        sanitized[key] = value;
      }
      // Skip fields like 'id', 'created_at', 'updated_at', 'next_check_date' silently
    });

    if (!partial) {
      this.requiredFields.forEach((field) => {
        if (sanitized[field] === undefined || sanitized[field] === null) {
          throw new Error(`Field ${field} is required for HealthRecord model.`);
        }
      });
    }

    return sanitized;
  }

  async create(data = {}) {
    const sanitized = this.validateData(data);
    return super.create(sanitized);
  }

  async update(id, data = {}) {
    const sanitized = this.validateData(data, { partial: true });
    return super.update(id, sanitized);
  }

  async findBySisterId(sisterId) {
    if (!sisterId) {
      throw new Error("findBySisterId requires a sister id.");
    }

    const sql = `SELECT * FROM ${this.tableName} WHERE sister_id = ? ORDER BY checkup_date DESC`;
    return this.executeQuery(sql, [sisterId]);
  }

  async getLatestRecord(sisterId) {
    if (!sisterId) {
      throw new Error("getLatestRecord requires a sister id.");
    }

    const sql = `
      SELECT * FROM ${this.tableName}
      WHERE sister_id = ?
      ORDER BY checkup_date DESC, id DESC
      LIMIT 1
    `;
    const rows = await this.executeQuery(sql, [sisterId]);
    return rows[0] || null;
  }

  async findAllWithSister({
    limit = 12,
    offset = 0,
    search = "",
    sortBy = "created_at",
    sortOrder = "desc",
  } = {}) {
    const allowedSortColumns = [
      "id",
      "checkup_date",
      "general_health",
      "created_at",
      "updated_at",
    ];
    const safeSort = allowedSortColumns.includes(sortBy)
      ? sortBy
      : "created_at";
    const safeOrder = sortOrder.toLowerCase() === "asc" ? "ASC" : "DESC";

    let whereClause = "WHERE 1=1";
    const params = [];

    if (search) {
      whereClause += ` AND (
        s.saint_name LIKE ? OR
        s.birth_name LIKE ? OR
        s.code LIKE ? OR
        hr.diagnosis LIKE ? OR
        hr.checkup_place LIKE ?
      )`;
      const searchPattern = `%${search}%`;
      params.push(
        searchPattern,
        searchPattern,
        searchPattern,
        searchPattern,
        searchPattern
      );
    }

    // Count total
    const countSql = `
      SELECT COUNT(*) as total 
      FROM ${this.tableName} hr
      LEFT JOIN sisters s ON hr.sister_id = s.id
      ${whereClause}
    `;
    const countResult = await this.executeQuery(countSql, params);
    const total = countResult[0]?.total || 0;

    // Get items
    const sql = `
      SELECT 
        hr.*,
        s.code as sister_code,
        s.saint_name as sister_religious_name,
        s.birth_name as sister_birth_name,
        s.saint_name as sister_saint_name
      FROM ${this.tableName} hr
      LEFT JOIN sisters s ON hr.sister_id = s.id
      ${whereClause}
      ORDER BY hr.${safeSort} ${safeOrder}
      LIMIT ? OFFSET ?
    `;
    params.push(limit, offset);
    const items = await this.executeQuery(sql, params);

    return { items, total };
  }
}

module.exports = new HealthRecordModel();
