const Order = require('../models/orderModel');
const ExcelJS = require('exceljs');

const createOrder = async (data) => {
    const { userTeam, userId, teamCode, teamComments, clientInfo, salesOrderItems, serviceOrderItems, currentTeamProcessing, dtNumber, wptsNumber, cparNumber } = data;
    const initialTeamResponse = {
        teamName: userTeam,
        user: userId,
        code: teamCode,
        status: 'approved',
        comments: teamComments,
    };

    const newOrder = {
        clientInfo,
        initialSalesOrderItems: salesOrderItems,
        initialServiceOrderItems: serviceOrderItems,
        status: 'processing',
        currentTeamProcessing,
        teamResponses: [initialTeamResponse],
        dtNumber,
        wptsNumber,
        cparNumber
    };
    const order = new Order(newOrder);
    await order.save();
    return order;
};

const getAllOrders = async () => {
    const orders = await Order.find()
        .populate({
            path: 'teamResponses.user',
            select: '-password -refreshToken -__v -updatedAt'
        })
        .populate({
            path: 'initialSalesOrderItems.package',
            select: '-__v'
        })
        .populate({
            path: 'initialServiceOrderItems.package',
            select: '-__v'
        })
        .populate({
            path: 'finalSalesOrderItems.package',
            select: '-__v'
        })
        .populate({
            path: 'finalServiceOrderItems.package',
            select: '-__v'
        })
        .exec();
    if (!orders || orders.length <= 0) {
        throw new Error('Orders not found');
    }
    else {
        return orders;
    }
};

const updateTeamResponse = async (orderId, userId, userTeam, teamCode, teamComments, status, dtNumber, wptsNumber, cparNumber) => {
    const order = await Order.findById(orderId);
    if (!order) {
        throw new Error('Order not found');
    }

    const newTeamResponse = {
        teamName: userTeam,
        user: userId,
        code: teamCode,
        status: status,
        comments: teamComments,
    };

    order.teamResponses.push(newTeamResponse);
    const teamSequence = ["sales", "application", "operations_support", "asset_inventory", "repair_maintenance", "logistics", "field_operation"];
    const currentIndex = teamSequence.indexOf(order.currentTeamProcessing);

    if (status === 'approved') {
        order.currentTeamProcessing = teamSequence[currentIndex + 1] || order.currentTeamProcessing;
    }

    else {
        order.currentTeamProcessing = teamSequence[currentIndex - 1] || order.currentTeamProcessing;
    }

    if (dtNumber) {
        order.dtNumber = dtNumber;
    }
    if (wptsNumber) {
        order.wptsNumber = wptsNumber;
    }
    if (cparNumber) {
        order.cparNumber = cparNumber;
    }

    await order.save();
    return order;
};

const approveOrder = async (orderId, userId, userTeam, teamCode, teamComments, status, finalSalesOrderItems, finalServiceOrderItems, engineers, dtNumber, wptsNumber, cparNumber) => {
    const order = await Order.findById(orderId);
    if (!order) {
        throw new Error('Order not found');
    }

    const newTeamResponse = {
        teamName: userTeam,
        user: userId,
        code: teamCode,
        status: status,
        comments: teamComments,
    };

    order.teamResponses.push(newTeamResponse);
    order.finalSalesOrderItems = finalSalesOrderItems;
    order.finalServiceOrderItems = finalServiceOrderItems;
    order.engineers = engineers;
    order.currentTeamProcessing = '-';
    order.status = 'completed';
    if (dtNumber) {
        order.dtNumber = dtNumber;
    }
    if (wptsNumber) {
        order.wptsNumber = wptsNumber;
    }
    if (cparNumber) {
        order.cparNumber = cparNumber;
    }
    await order.save();
    return order;
};

const getOrderById = async (orderId) => {
    const order = await Order.findById(orderId)
        .populate({
            path: 'teamResponses.user',
            select: '-password -refreshToken -__v -updatedAt'
        })
        .populate({
            path: 'initialSalesOrderItems.package',
            select: '-__v'
        })
        .populate({
            path: 'initialServiceOrderItems.package',
            select: '-__v'
        })
        .populate({
            path: 'finalSalesOrderItems.package',
            select: '-__v'
        })
        .populate({
            path: 'finalServiceOrderItems.package',
            select: '-__v'
        })
        .lean()
    if (!order) {
        throw new Error('Order not found');
    }
    else {
        return order;
    }
};

const searchOrderItems = async (filters) => {
    console.log(filters);
    const {
        clients,
        locations,
        selectedDateRange,
        orderHeaderType,
        orderHeaderNumbers,
        carCodes,
        equipmentHeaderType,
        equipmentHeaderNumbers,
        jdeHeaderType,
        jdeHeaderNumbers,
        orderStatus
    } = filters;

    // Initialize the match query
    const matchQuery = {};

    // Handle clients filter with case-insensitive comparison
    if (clients && clients.length > 0) {
        matchQuery.$expr = {
            $in: [
                { $toLower: '$clientInfo.customerName' },
                clients.map(client => client.toLowerCase())
            ]
        };
    }

    // Handle locations filter with case-insensitive comparison
    if (locations && locations.length > 0) {
        matchQuery.$expr = {
            ...matchQuery.$expr, // Preserve existing conditions
            $in: [
                { $toLower: '$clientInfo.location' },
                locations.map(location => location.toLowerCase())
            ]
        };
    }

    // Handle date range filter
    if (selectedDateRange && selectedDateRange.length === 2 && selectedDateRange[0] && selectedDateRange[1]) {
        matchQuery.updatedAt = {
            $gte: new Date(selectedDateRange[0]),
            $lte: new Date(selectedDateRange[1])
        };
    }

    // Handle order header filter with case-insensitive comparison
    if (orderHeaderType && orderHeaderNumbers && orderHeaderNumbers.length > 0) {
        matchQuery.$expr = {
            ...matchQuery.$expr, // Preserve existing conditions
            $in: [
                { $toLower: `$clientInfo.${orderHeaderType}` },
                orderHeaderNumbers.map(orderHeaderNumber => orderHeaderNumber.toLowerCase())
            ]
        };
    }

    // Handle JDE header filter with case-insensitive comparison
    if (jdeHeaderType && jdeHeaderNumbers && jdeHeaderNumbers.length > 0) {
        matchQuery.$expr = {
            ...matchQuery.$expr, // Preserve existing conditions
            $in: [
                { $toLower: `$${jdeHeaderType}` },
                jdeHeaderNumbers.map(jdeHeaderNumber => jdeHeaderNumber.toLowerCase())
            ]
        };
    }

    // Handle order status filter
    if (orderStatus) {
        matchQuery.status = orderStatus;
    }

    console.log('Match Query: ', matchQuery);

    const lookupStage = {
        $lookup: {
            from: 'sales-packages',
            localField: orderStatus === 'completed' ? 'finalSalesOrderItems.package' : 'initialSalesOrderItems.package',
            foreignField: '_id',
            as: 'salesItems'
        }
    };

    const addFieldsStage = {
        $addFields: {
            salesItems: {
                $map: {
                    input: "$salesItems",
                    as: "item",
                    in: {
                        itemInfo: "$$item",
                        itemQuantity: {
                            $cond: {
                                if: { $eq: ["$status", "completed"] },
                                then: { $arrayElemAt: ["$finalSalesOrderItems.quantity", { $indexOfArray: ["$finalSalesOrderItems.package", "$$item._id"] }] },
                                else: { $arrayElemAt: ["$initialSalesOrderItems.quantity", { $indexOfArray: ["$initialSalesOrderItems.package", "$$item._id"] }] }
                            }
                        }
                    }
                }
            }
        }
    };

    const projectStage = {
        $project: {
            orderDate: { $dateToString: { format: "%Y-%m-%d", date: "$updatedAt" } },
            clientInfo: 1,
            orderStatus: "$status",
            salesItems: {
                $filter: {
                    input: '$salesItems',
                    as: 'item',
                    cond: {
                        $and: [
                            ...(carCodes && carCodes.length > 0 ? [{
                                $anyElementTrue: {
                                    $map: {
                                        input: '$$item.itemInfo.carCode',
                                        as: 'code',
                                        in: { $in: [{ $toLower: '$$code' }, carCodes.map(carCode => carCode.toLowerCase())] }
                                    }
                                }
                            }] : []),
                            ...(equipmentHeaderType && equipmentHeaderNumbers && equipmentHeaderNumbers.length > 0 ? [{
                                $in: [{ $toLower: `$$item.itemInfo.${equipmentHeaderType}` }, equipmentHeaderNumbers.map(num => num.toLowerCase())]
                            }] : [])
                        ]
                    }
                }
            }
        }
    };

    const pipeline = [
        { $match: matchQuery },
        lookupStage,
        addFieldsStage,
        projectStage
    ];

    const orders = await Order.aggregate(pipeline);

    const formattedData = [];

    orders.forEach(order => {
        order.salesItems.forEach(item => {
            const { _id, __v, ...itemInfoWithoutIdAndVersion } = item.itemInfo;
            formattedData.push({
                orderId: order._id,
                orderDate: order.orderDate,
                orderStatus: order.orderStatus,
                customerName: order.clientInfo.customerName,
                location: order.clientInfo.location,
                ...itemInfoWithoutIdAndVersion,
                quantity: item.itemQuantity,
                unitPriceEGP: item.itemInfo.unitPriceEGP,
                totalPriceEGP: item.itemInfo.unitPriceEGP * item.itemQuantity
            });
        });
    });

    console.log('Orders: ', orders);
    console.log('Items: ', formattedData);
    return formattedData;
};

// const searchOrderItems = async (filters) => {
//     console.log(filters);
//     const {
//         clients,
//         locations,
//         selectedDateRange,
//         orderHeaderType,
//         orderHeaderNumbers,
//         carCodes,
//         equipmentHeaderType,
//         equipmentHeaderNumbers,
//         jdeHeaderType,
//         jdeHeaderNumbers,
//         orderStatus
//     } = filters;
//     const matchQuery = {};

//     if (clients && clients.length > 0) {
//         matchQuery.$expr = {
//             $in: [
//                 { $toLower: '$clientInfo.customerName' },
//                 clients.map(client => client.toLowerCase())
//             ]
//         };
//     }
//     if (locations && locations.length > 0) {
//         matchQuery.$expr = {
//             $in: [
//                 { $toLower: '$clientInfo.location' },
//                 locations.map(location => location.toLowerCase())
//             ]
//         };
//     }
//     if (selectedDateRange && selectedDateRange.length === 2 && selectedDateRange[0] && selectedDateRange[1]) {
//         matchQuery.$expr = {
//             $and: [
//                 { $gte: [{ $dateFromString: { dateString: { $dateToString: { format: "%Y-%m-%d", date: "$updatedAt" } } } }, new Date(selectedDateRange[0])] },
//                 { $lte: [{ $dateFromString: { dateString: { $dateToString: { format: "%Y-%m-%d", date: "$updatedAt" } } } }, new Date(selectedDateRange[1])] }
//             ]
//         };
//     }
//     if (orderHeaderType && orderHeaderNumbers && orderHeaderNumbers.length > 0) {
//         matchQuery.$expr = {
//             $in: [
//                 { $toLower: `$clientInfo.${orderHeaderType}` },
//                 orderHeaderNumbers.map(orderHeaderNumber => orderHeaderNumber.toLowerCase())
//             ]
//         };
//     }
//     if (jdeHeaderType && jdeHeaderNumbers && jdeHeaderNumbers.length > 0) {
//         matchQuery.$expr = {
//             $in: [
//                 { $toLower: `${jdeHeaderType}` },
//                 jdeHeaderNumbers.map(jdeHeaderNumbers => jdeHeaderNumbers.toLowerCase())
//             ]
//         };
//     }
//     if (orderStatus) {
//         matchQuery.status = orderStatus;
//     }
//     console.log('Match Query: ', matchQuery);

//     const lookupStage = {
//         $lookup: {
//             from: 'sales-packages',
//             localField: orderStatus === 'completed' ? 'finalSalesOrderItems.package' : 'initialSalesOrderItems.package',
//             foreignField: '_id',
//             as: 'salesItems'
//         }
//     };

//     const addFieldsStage = {
//         $addFields: {
//             salesItems: {
//                 $map: {
//                     input: "$salesItems",
//                     as: "item",
//                     in: {
//                         itemInfo: "$$item",
//                         itemQuantity: {
//                             $cond: {
//                                 if: { $eq: ["$status", "completed"] },
//                                 then: { $arrayElemAt: ["$finalSalesOrderItems.quantity", { $indexOfArray: ["$finalSalesOrderItems.package", "$$item._id"] }] },
//                                 else: { $arrayElemAt: ["$initialSalesOrderItems.quantity", { $indexOfArray: ["$initialSalesOrderItems.package", "$$item._id"] }] }
//                             }
//                         }
//                     }
//                 }
//             }
//         }
//     };

//     const projectStage = {
//         $project: {
//             orderDate: { $dateToString: { format: "%Y-%m-%d", date: "$updatedAt" } },
//             clientInfo: 1,
//             orderStatus: "$status",
//             salesItems: {
//                 $filter: {
//                     input: '$salesItems',
//                     as: 'item',
//                     cond: {
//                         $and: [
//                             ...(carCodes && carCodes.length > 0 ? [{
//                                 $anyElementTrue: {
//                                     $map: {
//                                         input: '$$item.itemInfo.carCode',
//                                         as: 'code',
//                                         in: { $in: [{ $toLower: '$$code' }, carCodes.map(carCode => carCode.toLowerCase())] }
//                                     }
//                                 }
//                             }] : []),
//                             ...(equipmentHeaderType && equipmentHeaderNumbers && equipmentHeaderNumbers.length > 0 ? [{
//                                 $in: [{ $toLower: `$$item.itemInfo.${equipmentHeaderType}` }, equipmentHeaderNumbers.map(num => num.toLowerCase())]
//                             }] : [])
//                         ]
//                     }
//                 }
//             }
//         }
//     };

//     const pipeline = [
//         { $match: matchQuery },
//         lookupStage,
//         addFieldsStage,
//         projectStage
//     ];

//     const orders = await Order.aggregate(pipeline);

//     const formattedData = [];

//     orders.forEach(order => {
//         order.salesItems.forEach(item => {
//             const { _id, __v, ...itemInfoWithoutIdAndVersion } = item.itemInfo;
//             formattedData.push({
//                 orderId: order._id,
//                 orderDate: order.orderDate,
//                 orderStatus: order.orderStatus,
//                 customerName: order.clientInfo.customerName,
//                 location: order.clientInfo.location,
//                 ...itemInfoWithoutIdAndVersion,
//                 quantity: item.itemQuantity,
//                 unitPriceEGP: item.itemInfo.unitPriceEGP,
//                 totalPriceEGP: item.itemInfo.unitPriceEGP * item.itemQuantity
//             });
//         });
//     });
//     console.log('Orders: ', orders);
//     console.log('Items: ', formattedData);
//     return formattedData;
// };

const exportItemsCSV = async (orderItems) => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Order Items');

    worksheet.columns = [
        { header: 'Order ID', key: 'orderId', width: 30 },
        { header: 'Order Date', key: 'orderDate', width: 20 },
        { header: 'Order Status', key: 'orderStatus', width: 20 },
        { header: 'Customer Name', key: 'customerName', width: 30 },
        { header: 'Location', key: 'location', width: 20 },
        { header: 'Car Code', key: 'carCode', width: 20 },
        { header: 'Part Number', key: 'partNum', width: 20 },
        { header: 'Row Line Number', key: 'rowLineNum', width: 30 },
        { header: 'SAP Number', key: 'sapNum', width: 20 },
        { header: 'Description', key: 'description', width: 40 },
        { header: 'Unit of Measurement', key: 'unitOfMeasurement', width: 20 },
        { header: 'Quantity', key: 'quantity', width: 15 },
        { header: 'Unit Price (EGP)', key: 'unitPriceEGP', width: 20 },
        { header: 'Total Price (EGP)', key: 'totalPriceEGP', width: 20 }
    ];

    worksheet.getRow(1).font = {
        bold: true,
        size: 15,  // Font size
    };

    orderItems.forEach(item => {
        worksheet.addRow({
            orderId: item.orderId,
            orderDate: item.orderDate,
            orderStatus: item.orderStatus,
            customerName: item.customerName,
            location: item.location,
            carCode: item.carCode.join(', '),
            partNum: item.partNum,
            rowLineNum: item.rowLineNum,
            sapNum: item.sapNum,
            description: item.description,
            unitOfMeasurement: item.unitOfMeasurement,
            quantity: item.quantity,
            unitPriceEGP: item.unitPriceEGP,
            totalPriceEGP: item.totalPriceEGP
        });
    });

    const buffer = await workbook.xlsx.writeBuffer();
    return buffer;
};

module.exports = {
    createOrder,
    getAllOrders,
    updateTeamResponse,
    approveOrder,
    getOrderById,
    searchOrderItems,
    exportItemsCSV
};
