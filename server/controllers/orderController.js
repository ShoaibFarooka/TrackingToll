const path = require('path');
const handlebarHelpers = require('../utils/handlebarHelpers');
const orderService = require('../services/orderService');
const userService = require('../services/userService');
const emailService = require('../services/emailService');
const pdfService = require('../services/pdfService');

const CreateOrder = async (req, res) => {
    try {
        const userId = res.locals.payload.id;
        const userTeam = res.locals.payload.team;
        if (userTeam !== 'sales' && userTeam !== 'admin') {
            return res.status(401).send('Unauthorized!');
        }

        const data = {
            ...req.body,
            currentTeamProcessing: 'application',
            userId,
            userTeam
        }
        const order = await orderService.createOrder(data);
        const allUsers = await userService.fetchAllUsersForEmail();
        allUsers.forEach(async (user) => {
            const emailSubject = `VMI Tracking tool notification from RO# ${order.clientInfo.roNumber} MR# ${order.clientInfo.mrNumber} Custome Name ${order.clientInfo.customerName} Car Model ${order.clientInfo.carModel}`;
            const emailText = `
            This is an automated notification from the VMI Tracking System.\n
            Event Date: ${new Date().toDateString()}\n
            RO Number: ${order.clientInfo.roNumber}\n
            MR Number: ${order.clientInfo.mrNumber}\n
            Customer Name: ${order.clientInfo.customerName}\n
            Current Phase: New Order Submitted\n
            Required Action: prcoessing by ${order.currentTeamProcessing} team \n
            Order Link: ${process.env.CLIENT_URL}/view-order/${order._id}
            `
            await emailService.sendEmail(user.email, emailSubject, emailText);
        });

        res.status(201).send('Order created successfully');
    } catch (error) {
        res.status(500).send('Internal Server Error');
    }
};

const GetAllOrders = async (req, res) => {
    try {
        const orders = await orderService.getAllOrders();
        res.status(200).json({ orders });
    } catch (error) {
        if (error.message === 'Orders not found') {
            res.status(404).send(error.message);
        } else {
            res.status(500).send('Internal Server Error');
        }
    }
};

const UpdateTeamResponse = async (req, res) => {
    try {
        const { orderId } = req.params;
        const { teamCode, teamComments, status, dtNumber, wptsNumber, cparNumber } = req.body;
        const userId = res.locals.payload.id;
        const userTeam = res.locals.payload.team;

        const order = await orderService.updateTeamResponse(orderId, userId, userTeam, teamCode, teamComments, status, dtNumber, wptsNumber, cparNumber);
        const allUsers = await userService.fetchAllUsersForEmail();
        allUsers.forEach(async (user) => {
            const emailSubject = `VMI Tracking tool notification from RO# ${order.clientInfo.roNumber} MR# ${order.clientInfo.mrNumber} Custome Name ${order.clientInfo.customerName} Car Model ${order.clientInfo.carModel}`;
            const emailText = `
            This is an automated notification from the VMI Tracking System.\n
            Event Date: ${new Date().toDateString()}\n
            RO Number: ${order.clientInfo.roNumber}\n
            MR Number: ${order.clientInfo.mrNumber}\n
            Customer Name: ${order.clientInfo.customerName}\n
            Current Phase: ${status === 'approved' ? 'Approved' : 'Returned'} by ${userTeam} team \n
            Required Action: ${status === 'approved' && userTeam === 'field_operation' ? 'Completed' : `prcoessing by ${order.currentTeamProcessing}`} team \n
            Order Link: ${process.env.CLIENT_URL}/view-order/${order._id}
            `
            await emailService.sendEmail(user.email, emailSubject, emailText);
        });

        res.status(200).send('Order updated successfully');
    } catch (error) {
        if (error.message === 'Order not found') {
            res.status(404).send(error.message);
        } else {
            res.status(500).send('Internal Server Error');
        }
    }
};

const ApproveOrder = async (req, res) => {
    try {
        const { orderId } = req.params;
        const { teamCode, teamComments, status, finalSalesOrderItems, finalServiceOrderItems, engineers, dtNumber, wptsNumber, cparNumber } = req.body;
        const userId = res.locals.payload.id;
        const userTeam = res.locals.payload.team;
        const order = await orderService.approveOrder(orderId, userId, userTeam, teamCode, teamComments, status, finalSalesOrderItems, finalServiceOrderItems, engineers, dtNumber, wptsNumber, cparNumber);
        res.status(200).send('Order approved successfully');
    } catch (error) {
        if (error.message === 'Order not found') {
            res.status(404).send(error.message);
        } else {
            res.status(500).send('Internal Server Error');
        }
    }
};

const GetOrderById = async (req, res) => {
    try {
        const { orderId } = req.params;
        const order = await orderService.getOrderById(orderId);
        res.status(200).json({ order });
    } catch (error) {
        console.log(error);
        if (error.message === 'Order not found') {
            res.status(404).send(error.message);
        } else {
            res.status(500).send('Internal Server Error');
        }
    }
};

const SearchOrderItems = async (req, res) => {
    try {
        const data = req.query;
        const orderItems = await orderService.searchOrderItems(data);
        res.status(200).json({ orderItems });
    } catch (error) {
        console.log(error);
        if (error.message === 'Order Items not found') {
            res.status(404).send(error.message);
        } else {
            res.status(500).send('Internal Server Error');
        }
    }
};

const ExportItemsCSV = async (req, res) => {
    try {
        const { orderItems } = req.body;
        const buffer = await orderService.exportItemsCSV(orderItems);
        res.status(200).send(buffer);
    } catch (error) {
        console.log(error);
        if (error.message === 'Order Items not found') {
            res.status(404).send(error.message);
        } else {
            res.status(500).send('Internal Server Error');
        }
    }
};

const DownloadOrderPDF = async (req, res) => {
    try {
        const { orderId } = req.params;
        const order = await orderService.getOrderById(orderId);
        const templatePath = path.join(__dirname, '../templates/pdfTemplate.hbs');
        const pdfStream = await pdfService.generatePDF(order, templatePath);
        res.setHeader('Content-disposition', `attachment; filename=order_${orderId}.pdf`);
        res.setHeader('Content-type', 'application/pdf');
        pdfStream.pipe(res);
    } catch (error) {
        console.log(error);
        if (error.message === 'Order not found') {
            res.status(404).send(error.message);
        } else if (error.message === 'Failed to generate pdf!') {
            res.status(500).send(error.message);
        } else {
            res.status(500).send('Internal Server Error');
        }
    }
};

const DeleteOrderById = async (req, res) => {
    try {
        const { orderId } = req.params;
        await orderService.deleteOrderById(orderId);
        res.status(200).send('Order deleted successfully!');
    } catch (error) {
        console.log(error);
        if (error.message === 'Order not found') {
            res.status(404).send(error.message);
        } else {
            res.status(500).send('Internal Server Error');
        }
    }
};

module.exports = {
    CreateOrder,
    GetAllOrders,
    UpdateTeamResponse,
    ApproveOrder,
    GetOrderById,
    SearchOrderItems,
    ExportItemsCSV,
    DownloadOrderPDF,
    DeleteOrderById
};
