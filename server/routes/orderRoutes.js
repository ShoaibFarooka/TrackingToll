const router = require("express").Router();
const controller = require("../controllers/orderController");
const authMiddleware = require("../middleware/authMiddleware");
const orderSchemas = require('../schemas/orderSchemas');
const validationMiddleware = require('../middleware/validationMiddleware');

router.post(
    "/create-new-order",
    authMiddleware.stripToken,
    authMiddleware.verifyAccessToken,
    validationMiddleware.validateRequest(orderSchemas.createOrderSchema),
    controller.CreateOrder
);

router.get(
    "/get-all-orders",
    authMiddleware.stripToken,
    authMiddleware.verifyAccessToken,
    controller.GetAllOrders
);

router.patch(
    "/update-order-team-response/:orderId",
    authMiddleware.stripToken,
    authMiddleware.verifyAccessToken,
    validationMiddleware.validateParams(orderSchemas.orderIdSchema),
    validationMiddleware.validateRequest(orderSchemas.updateOrderSchema),
    controller.UpdateTeamResponse
);

router.post(
    "/approve-order/:orderId",
    authMiddleware.stripToken,
    authMiddleware.verifyAccessToken,
    validationMiddleware.validateParams(orderSchemas.orderIdSchema),
    validationMiddleware.validateRequest(orderSchemas.approveOrderSchema),
    controller.ApproveOrder
);

router.get(
    "/get-order-by-id/:orderId",
    authMiddleware.stripToken,
    authMiddleware.verifyAccessToken,
    validationMiddleware.validateParams(orderSchemas.orderIdSchema),
    controller.GetOrderById
);

router.get(
    "/search-order-items",
    authMiddleware.stripToken,
    authMiddleware.verifyAccessToken,
    // validationMiddleware.validateQuery(orderSchemas.),
    controller.SearchOrderItems
);

router.post(
    "/export-items-csv",
    authMiddleware.stripToken,
    authMiddleware.verifyAccessToken,
    // validationMiddleware.validateQuery(orderSchemas.),
    controller.ExportItemsCSV
);

router.get(
    "/download-order-pdf/:orderId",
    authMiddleware.stripToken,
    authMiddleware.verifyAccessToken,
    validationMiddleware.validateParams(orderSchemas.orderIdSchema),
    controller.DownloadOrderPDF
);

module.exports = router;
