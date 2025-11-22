const express = require("express");
const multer = require("multer");
const template = require("../controllers/template");

// Create a storage configuration for Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Define the destination folder for uploaded files
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    // Define the filename for uploaded files
    cb(null, file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  // Customize the file filter as needed, e.g., check file types, size, etc.
  if (file.fieldname === "images") {
    // Apply specific file filter for the "images" fieldname
    cb(null, true); // Allow the file to be uploaded
  } else {
    cb(new Error("Unexpected field")); // Reject the file upload for other fieldnames
  }
};
// Create the Multer middleware
const upload = multer({ storage: storage, fileFilter });

const router = express.Router();
const userController = require("../controllers/userController");
const admindata = require("../controllers/adminController");
const program = require("../controllers/programController");
const points = require("../controllers/pointsController");
const rewardConroller = require("../controllers/rewardsController");
;



router.post("/api/addTemplate", template.insert);
router.post("/api/getAllTemplates", template.getAllTemplatesWithLinks);
router.get(
  "/api/getAllTemplatesforadmin",
  template.getAllTemplatesWithLinksforadmin
);
router.delete("/api/deleteTemp/:tempid", template.deleteTemp);

router.post("/changeReward/:type/:value", rewardConroller.changeReward);
router.post(
  "/changeImageReward/:type",
  upload.single("images"),
  rewardConroller.changeImgReward
);
router.get("/rewards", rewardConroller.getall);
router.post("/addReward", rewardConroller.addReward);
router.delete("/deleteReward/:id", rewardConroller.deleteReward);
router.get('/generateReferralLink', userController.generateReferralLink);
router.get('/validateReferral', userController.validateReferral);

router.post("/register/register", userController.register);
router.post("/signin", userController.signIn);
router.get("/user/:id", userController.getbyid);
router.get("/program-details/:userId", userController.programs);
router.get("/program-detailwithpoints/:userId", userController.pointsbyprogram);
router.get("/program-link/:userId", userController.programsLink);
router.get("/mba/:id", userController.dash);
router.get("/getallusers/location", userController.getAllLocations);
router.get("/mba2/:id", userController.getUserDetail);
router.put("/edituser/:id", userController.edit);
router.put("/passwordChange/:id", userController.passwordChange);
router.get("/getallusers", userController.getalluser);
router.get("/getmailstatus/:id", userController.userMail);
router.get("/toggleMailStatus/:id", userController.toggleMailStatus);
router.get("/forgotpass/:mail", userController.mailSender);
router.post("/forgotpassReset/:mail", userController.resetPass);
router.get("/globalRankMonthly", userController.getUserRankingsMonthly);
router.get("/globalRankLastMonthly", userController.getUserRankingsLastMonth);
router.get("/globalRankYearly", userController.getUserRankingsYearly);
router.get("/getAllPoints", userController.getUserAllPoints);
router.get("/getAllPoints23", userController.getUserAllPoints23);

router.post("/sendMailtomba", async (req, res) => {
  try {
    const stats = await admindata.sendMailtomba(req, res);
    console.log(stats);
    res.json(stats);
  } catch (err) {
    res.status(500).send("Internal server error");
  }
});

router.get("/admindashboard", async (req, res) => {
  try {
    const stats = await admindata.fetchAdminStats();
    res.json(stats);
  } catch (err) {
    res.status(500).send("Internal server error");
  }
});
const { query } = require("../database");
const { appBaseUrl } = require("../env");
router.get("/getProgramDetail", async (req, res) => {
  try {
    console.log(req.query.id);
    const data = await admindata.getDetailByProgram(req.query.id);

    res.json(data);
  } catch (e) {
    res.status(500).send("Internal server error," + e);
  }
});
router.get("/getAllProgramsId", async (req, res) => {
  try {
    const data = await admindata.getAllProgramIds();
    res.json(data);
  } catch (e) {
    res.status(500).send("Internal server error," + e);
  }
});

router.get("/fastDataAdmin", async (req, res) => {
  try {
    const stats = await admindata.getFirstData();
    res.json(stats);
  } catch (err) {
    res.status(500).send("Internal server error");
  }
});

router.post("/addprogram", upload.single("images"), program.add);
router.put("/edit/:id/:newpoints", program.edit);
router.put("/editPromotion/:id", program.editLink);
router.get("/programs", program.get);
router.delete("/deleteprogram/:id", program.delete);
router.get("/programs/:id", program.send);

router.get("/mba/:userId/:programId", points.linkHandler);


module.exports = router;
