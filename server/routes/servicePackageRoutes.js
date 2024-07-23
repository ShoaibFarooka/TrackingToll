const router = require("express").Router();
const controller = require("../controllers/servicePackageController");
const authMiddleware = require("../middleware/authMiddleware");
const servicePackageSchemas = require('../schemas/servicePackageSchema');
const validationMiddleware = require('../middleware/validationMiddleware');

router.get(
    "/search-service-packages",
    authMiddleware.stripToken,
    authMiddleware.verifyAccessToken,
    validationMiddleware.validateQuery(servicePackageSchemas.searchServicePackagesSchema),
    controller.SearchServicePackages
);
router.post(
    "/add-service-packages",
    authMiddleware.stripToken,
    authMiddleware.verifyAccessToken,
    validationMiddleware.validateRequest(servicePackageSchemas.addServicePackageSchema),
    controller.AddServicePackage
);
router.put(
    "/update-service-packages/:id",
    authMiddleware.stripToken,
    authMiddleware.verifyAccessToken,
    validationMiddleware.validateParams(servicePackageSchemas.packageIdSchema),
    validationMiddleware.validateRequest(servicePackageSchemas.updateServicePackageSchema),
    controller.UpdateServicePackage
);
router.delete(
    "/remove-service-packages/:id",
    authMiddleware.stripToken,
    authMiddleware.verifyAccessToken,
    validationMiddleware.validateParams(servicePackageSchemas.packageIdSchema),
    controller.RemoveServicePackage
);


module.exports = router;
