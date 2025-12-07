// src/controllers/lookupController.js
const JourneyStageModel = require("../models/JourneyStageModel");
const SisterStatusModel = require("../models/SisterStatusModel");
const VocationJourneyModel = require("../models/VocationJourneyModel");

// ============ Journey Stages ============

const getJourneyStages = async (req, res) => {
  try {
    const stages = await JourneyStageModel.getActiveStages();
    return res.status(200).json({
      success: true,
      data: stages,
    });
  } catch (error) {
    console.error("getJourneyStages error:", error.message);
    return res.status(500).json({ message: "Failed to fetch journey stages" });
  }
};

const getAllJourneyStages = async (req, res) => {
  try {
    const stages = await JourneyStageModel.getAll();
    return res.status(200).json({
      success: true,
      data: stages,
    });
  } catch (error) {
    console.error("getAllJourneyStages error:", error.message);
    return res.status(500).json({ message: "Failed to fetch journey stages" });
  }
};

const createJourneyStage = async (req, res) => {
  try {
    const { code, name, description, display_order, color } = req.body;

    if (!code || !name) {
      return res.status(400).json({ message: "Code and name are required" });
    }

    // Check if code already exists
    const existing = await JourneyStageModel.findByCode(code);
    if (existing) {
      return res.status(400).json({ message: "Code already exists" });
    }

    const stage = await JourneyStageModel.create({
      code,
      name,
      description,
      display_order: display_order || 0,
      color: color || "#6c757d",
      is_active: true,
    });

    return res.status(201).json({
      success: true,
      data: stage,
    });
  } catch (error) {
    console.error("createJourneyStage error:", error.message);
    return res.status(500).json({ message: "Failed to create journey stage" });
  }
};

const updateJourneyStage = async (req, res) => {
  try {
    const { id } = req.params;
    const existing = await JourneyStageModel.findById(id);

    if (!existing) {
      return res.status(404).json({ message: "Journey stage not found" });
    }

    const updated = await JourneyStageModel.update(id, req.body);
    return res.status(200).json({
      success: true,
      data: updated,
    });
  } catch (error) {
    console.error("updateJourneyStage error:", error.message);
    return res.status(500).json({ message: "Failed to update journey stage" });
  }
};

const deleteJourneyStage = async (req, res) => {
  try {
    const { id } = req.params;
    const existing = await JourneyStageModel.findById(id);

    if (!existing) {
      return res.status(404).json({ message: "Journey stage not found" });
    }

    // Check if stage is being used in vocation_journey table
    const usageCount = await VocationJourneyModel.executeQuery(
      "SELECT COUNT(*) as count FROM vocation_journey WHERE stage = ?",
      [existing.code]
    );

    if (usageCount[0].count > 0) {
      return res.status(400).json({
        message: `Không thể xóa giai đoạn này vì đang được sử dụng bởi ${usageCount[0].count} hành trình ơn gọi`,
        usageCount: usageCount[0].count,
      });
    }

    // Hard delete if not used
    await JourneyStageModel.delete(id);
    return res.status(200).json({
      success: true,
      message: "Đã xóa giai đoạn thành công",
    });
  } catch (error) {
    console.error("deleteJourneyStage error:", error.message);
    return res.status(500).json({ message: "Failed to delete journey stage" });
  }
};

// ============ Sister Statuses ============

const getSisterStatuses = async (req, res) => {
  try {
    const statuses = await SisterStatusModel.getActiveStatuses();
    return res.status(200).json({
      success: true,
      data: statuses,
    });
  } catch (error) {
    console.error("getSisterStatuses error:", error.message);
    return res.status(500).json({ message: "Failed to fetch sister statuses" });
  }
};

const getAllSisterStatuses = async (req, res) => {
  try {
    const statuses = await SisterStatusModel.getAll();
    return res.status(200).json({
      success: true,
      data: statuses,
    });
  } catch (error) {
    console.error("getAllSisterStatuses error:", error.message);
    return res.status(500).json({ message: "Failed to fetch sister statuses" });
  }
};

const createSisterStatus = async (req, res) => {
  try {
    const { code, name, description, display_order, color } = req.body;

    if (!code || !name) {
      return res.status(400).json({ message: "Code and name are required" });
    }

    // Check if code already exists
    const existing = await SisterStatusModel.findByCode(code);
    if (existing) {
      return res.status(400).json({ message: "Code already exists" });
    }

    const status = await SisterStatusModel.create({
      code,
      name,
      description,
      display_order: display_order || 0,
      color: color || "#6c757d",
      is_active: true,
    });

    return res.status(201).json({
      success: true,
      data: status,
    });
  } catch (error) {
    console.error("createSisterStatus error:", error.message);
    return res.status(500).json({ message: "Failed to create sister status" });
  }
};

const updateSisterStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const existing = await SisterStatusModel.findById(id);

    if (!existing) {
      return res.status(404).json({ message: "Sister status not found" });
    }

    const updated = await SisterStatusModel.update(id, req.body);
    return res.status(200).json({
      success: true,
      data: updated,
    });
  } catch (error) {
    console.error("updateSisterStatus error:", error.message);
    return res.status(500).json({ message: "Failed to update sister status" });
  }
};

const deleteSisterStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const existing = await SisterStatusModel.findById(id);

    if (!existing) {
      return res.status(404).json({ message: "Sister status not found" });
    }

    // Soft delete by setting is_active to false
    await SisterStatusModel.update(id, { is_active: false });
    return res.status(200).json({
      success: true,
      message: "Sister status deactivated",
    });
  } catch (error) {
    console.error("deleteSisterStatus error:", error.message);
    return res.status(500).json({ message: "Failed to delete sister status" });
  }
};

// ============ User Roles ============

const getUserRoles = async (req, res) => {
  try {
    const roles = [
      { value: "admin", label: "Quản trị viên" },
      { value: "superior_general", label: "Bề trên Tổng Quyền" },
      { value: "superior_provincial", label: "Bề trên Tỉnh Dòng" },
      { value: "superior_community", label: "Bề trên Cộng đoàn" },
      { value: "secretary", label: "Thư ký" },
      { value: "viewer", label: "Người xem" },
    ];

    return res.status(200).json({
      success: true,
      data: roles,
    });
  } catch (error) {
    console.error("getUserRoles error:", error.message);
    return res.status(500).json({ message: "Failed to fetch user roles" });
  }
};

module.exports = {
  getJourneyStages,
  getAllJourneyStages,
  createJourneyStage,
  updateJourneyStage,
  deleteJourneyStage,
  getSisterStatuses,
  getAllSisterStatuses,
  createSisterStatus,
  updateSisterStatus,
  deleteSisterStatus,
  getUserRoles,
};
