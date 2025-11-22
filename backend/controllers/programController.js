const { query } = require("../database"); // Import the database query function
const moment = require("moment");
const fs = require("fs").promises; // Import the fs module

const enrolProgram = async (userId, programId) => {
  const userProgram = {
    userId: userId,
    programId: programId,
    programLink: `mba/${userId}/${programId}`,
    enrollmentDate: moment().format("YYYY-MM-DD HH:mm:ss"),
  };

  try {
    const rows = await query(
      "INSERT INTO UserPrograms (userId, programId, programLink, enrollmentDate) VALUES (?, ?, ?, ?)",
      [
        userProgram.userId,
        userProgram.programId,
        userProgram.programLink,
        userProgram.enrollmentDate,
      ]
    );

    if (rows.affectedRows === 1) {
      console.log("User enrolled in program:", programId);
    }
  } catch (error) {
    console.error("Error enrolling user in program:", error);
  }
};

exports.add = async (req, res) => {
  console.log(req.file);
  const { name, points, description, promotionLink } = req.body;
  const totalMembers = 0; // Initial total members

  const imageFilePath = req.file ? req.file.path : null; // Assuming image file path is stored in req.file.path

  try {
    const insertProgramRows = await query(
      "INSERT INTO Programs (programId, name, points, images, description, totalMembers, promotionLink) VALUES (LAST_INSERT_ID() + 1, ?, ?, ?, ?, ?, ?)",
      [name, points, imageFilePath, description, totalMembers, promotionLink]
    );

    if (insertProgramRows.affectedRows === 1) {
      // Get the newly inserted program's ID
      const programId = insertProgramRows.insertId;

      const updateProgramIdQuery = `
        UPDATE Programs
        SET programId = ${programId}
        WHERE id = ${programId};
      `;
      // Update the programId of the newly inserted row
      await query(updateProgramIdQuery);
      // Fetch all user IDs
      const userRows = await query("SELECT userId FROM Users where role='mba'");

      // Enroll the program for each user
      for (const userRow of userRows) {
        await enrolProgram(userRow.userId, programId);
      }

      res.status(200).json({ message: "Program added successfully" });
    } else {
      res
        .status(500)
        .json({ error: "An error occurred while adding the program" });
    }
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ error: "An error occurred while adding the program" });
  }
};

exports.get = async (req, res) => {
  try {
    // Fetch all programs from the database
    const programsRows = await query("SELECT * FROM Programs");

    // Send the programs to the frontend in JSON format
    res.json(programsRows);
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
};

exports.delete = async (req, res) => {
  try {
    const programId = req.params.id;

    // Fetch the program details to get the image file path
    const fetchProgramQuery = "SELECT * FROM Programs WHERE programId = ?";
    const programRows = await query(fetchProgramQuery, [programId]);

    if (programRows.length === 0) {
      return res.status(404).send();
    }
    // Delete program from UserPrograms
    await query("DELETE FROM UserPrograms WHERE programId = ?", [programId]);

    // Delete points with the programId
    await query("DELETE FROM Points WHERE programId = ?", [programId]);

    // Delete the program
    const deleteProgramRows = await query(
      "DELETE FROM Programs WHERE programId = ?",
      [programId]
    );

    if (deleteProgramRows.affectedRows === 0) {
      return res.status(404).send();
    }

    // Delete the image file from the folder
    const imagePath = programRows[0].images;
    if (imagePath) {
      await fs.unlink(`${imagePath}`);
      console.log("Image deleted successfully:", imagePath);
    }

    res.send(deleteProgramRows);
  } catch (error) {
    res.status(500).send(error);
  }
};

exports.send = async (req, res) => {
  try {
    const programId = req.params.id;

    // Fetch the program by programId
    const programRows = await query(
      "SELECT * FROM Programs WHERE programId = ?",
      [programId]
    );

    if (programRows.length === 0) {
      return res.status(404).json({ error: "Program not found" });
    }

    const program = programRows[0];
    res.json(program);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

exports.edit = async (req, res) => {
  try {
    const programId = req.params.id;
    const newpoints = req.params.newpoints;

    // Update the points
    const updateProgramRows = await query(
      "UPDATE Programs SET points = ? WHERE programId = ?",
      [newpoints, programId]
    );

    if (updateProgramRows.affectedRows === 0) {
      return res.status(404).json({ error: "Program not found" });
    }

    res.json({ message: "Program points updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.editLink = async (req, res) => {
  try {
    const programId = req.params.id;
    const { promotionLink } = req.body;

    // Update the promotion link
    const updateProgramRows = await query(
      "UPDATE Programs SET promotionLink = ? WHERE programId = ?",
      [promotionLink, programId]
    );

    if (updateProgramRows.affectedRows === 0) {
      return res.status(404).json({ error: "Program not found" });
    }

    res.json({ message: "Program promotion link updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};
