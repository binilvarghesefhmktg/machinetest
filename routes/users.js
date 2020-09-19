const express = require("express");
const router = express.Router();
const { check } = require("express-validator");

const usersController = require("../controllers/users");
const checkAuth = require("../middleware/checkAuth");

router.post(
  "/register",
  [
    check("name").not().isEmpty(),
    check("email").normalizeEmail().isEmail(),
    check("password").isLength({ min: 6 }),
  ],
  usersController.register
);

router.post("/login", usersController.login);

router.use(checkAuth);
router.get("/profile", usersController.getProfile);

router.get("/list", usersController.getUsersList);

module.exports = router;
