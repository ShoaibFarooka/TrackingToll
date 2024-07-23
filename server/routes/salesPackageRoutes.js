const router = require("express").Router();
const controller = require("../controllers/salesPackageController");
const authMiddleware = require("../middleware/authMiddleware");
const salesPackageSchemas = require('../schemas/salesPackageSchemas');
const validationMiddleware = require('../middleware/validationMiddleware');

router.get(
    "/search-sales-packages",
    authMiddleware.stripToken,
    authMiddleware.verifyAccessToken,
    validationMiddleware.validateQuery(salesPackageSchemas.searchSalesPackagesSchema),
    controller.SearchSalesPackages
);
router.post(
    "/add-sales-packages",
    authMiddleware.stripToken,
    authMiddleware.verifyAccessToken,
    validationMiddleware.validateRequest(salesPackageSchemas.addSalesPackageSchema),
    controller.AddSalesPackage
);
router.put(
    "/update-sales-packages/:id",
    authMiddleware.stripToken,
    authMiddleware.verifyAccessToken,
    validationMiddleware.validateParams(salesPackageSchemas.packageIdSchema),
    validationMiddleware.validateRequest(salesPackageSchemas.updateSalesPackageSchema),
    controller.UpdateSalesPackage
);
router.delete(
    "/remove-sales-packages/:id",
    authMiddleware.stripToken,
    authMiddleware.verifyAccessToken,
    validationMiddleware.validateParams(salesPackageSchemas.packageIdSchema),
    controller.RemoveSalesPackage
);


module.exports = router;
