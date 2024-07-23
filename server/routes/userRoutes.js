const router = require("express").Router();
const controller = require("../controllers/userController");
const authMiddleware = require("../middleware/authMiddleware");
const userSchemas = require('../schemas/userSchemas');
const validationMiddleware = require('../middleware/validationMiddleware');

router.post(
  "/register",
  validationMiddleware.validateRequest(userSchemas.registerSchema),
  controller.Register
);
router.post(
  "/login",
  validationMiddleware.validateRequest(userSchemas.loginSchema),
  controller.Login
);
router.get(
  "/fetch-user-info",
  authMiddleware.stripToken,
  authMiddleware.verifyAccessToken,
  controller.FetchUserInfo
);
router.get(
  "/fetch-all-users-info",
  authMiddleware.stripToken,
  authMiddleware.verifyAccessToken,
  authMiddleware.verifyAdmin,
  controller.FetchAllUsersInfo
);
router.post(
  "/refresh-token",
  controller.RefreshToken
);
router.post(
  "/logout",
  controller.Logout
);
router.post(
  "/add-user",
  authMiddleware.stripToken,
  authMiddleware.verifyAccessToken,
  authMiddleware.verifyAdmin,
  validationMiddleware.validateRequest(userSchemas.addUserSchema),
  controller.AddUser
);
router.patch(
  "/update-user-info/:userId",
  authMiddleware.stripToken,
  authMiddleware.verifyAccessToken,
  authMiddleware.verifyAdmin,
  validationMiddleware.validateParams(userSchemas.userIdSchema),
  validationMiddleware.validateRequest(userSchemas.updateUserInfoSchema),
  controller.UpdateUser
);
router.delete(
  "/delete-user/:userId",
  authMiddleware.stripToken,
  authMiddleware.verifyAccessToken,
  authMiddleware.verifyAdmin,
  validationMiddleware.validateParams(userSchemas.userIdSchema),
  controller.DeleteUser
);


module.exports = router;
