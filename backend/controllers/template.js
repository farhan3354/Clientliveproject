const { query } = require("../database");
exports.insert = async (req, res) => {
  try {
    const { templateText, programId } = req.body;
    console.log(templateText, programId);

    const text = `${templateText}`;
    const insertTemplateRows = await query(
      "INSERT INTO PostTemplates (templateText, programId) VALUES (?, ?)",
      [text, programId]
    );

    if (insertTemplateRows.affectedRows === 1) {
      res.status(201).json({ message: "saved" });
    } else {
      res
        .status(500)
        .json({ error: "An error occurred while adding the post template." });
    }
  } catch (error) {
    console.error("Error adding post template:", error);
    res
      .status(500)
      .json({ error: "An error occurred while adding the post template." });
  }
};

exports.getAllTemplatesWithLinks = async (req, res) => {
  try {
    const userId = req.body.userId.id;

    // Fetch user by ID
    const userRows = await query(
      "SELECT * FROM UserPrograms WHERE userId = ?",
      [userId]
    );

    if (userRows.length === 0) {
      throw new Error("User not found");
    }

    const user = userRows;
    console.log(user);

    // Fetch all templates
    const templateRows = await query("SELECT * FROM PostTemplates");

    const templates = templateRows.map((template) => {
      const record = user.find((rec) => rec.programId === template.programId);
      const programLink = record ? record.programLink : "";

      return {
        id: template.templateId, // Assuming the column name is "templateId"
        programLink: programLink,
        templateText: template.templateText,
      };
    });

    res.json(templates);
  } catch (error) {
    console.error("Error getting program templates with links:", error);
    return res.status(500).json([]);
  }
};

exports.getAllTemplatesWithLinksforadmin = async (req, res) => {
  try {
    const templateRows = await query(
      "SELECT templateId, templateText FROM PostTemplates"
    );

    const templateArray = templateRows.map((template) => {
      return {
        id: template.templateId,
        templateText: template.templateText,
      };
    });

    res.json(templateArray);
  } catch (error) {
    console.error("Error getting program templates with links:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.deleteTemp = async (req, res) => {
  try {
    const templateId = req.params.tempid;

    // Delete the template by its ID
    const deleteTemplateRows = await query(
      "DELETE FROM PostTemplates WHERE templateId = ?",
      [templateId]
    );

    if (deleteTemplateRows.affectedRows === 1) {
      res.json({ success: true, message: "Template deleted successfully" });
    } else {
      res.json({ success: false, message: "Template not found" });
    }
  } catch (error) {
    console.error("Error deleting template:", error);
    res.json({
      success: false,
      message: "An error occurred while deleting the template",
    });
  }
};
