const serviceColumns = [
    { title: 'Car Code', dataIndex: 'carCode', key: 'carCode', sorter: (a, b) => a.carCode.localeCompare(b.carCode) },
    { title: 'Table Num', dataIndex: 'tableNum', key: 'tableNum', sorter: (a, b) => a.tableNum.localeCompare(b.tableNum) },
    { title: 'Item Num', dataIndex: 'itemNum', key: 'itemNum', sorter: (a, b) => a.itemNum.localeCompare(b.itemNum) },
    { title: 'Description', dataIndex: 'description', key: 'description' },
    { title: 'Unit Of Measurement', dataIndex: 'unitOfMeasurement', key: 'unitOfMeasurement' },
    { title: 'Quantity', dataIndex: 'quantity', key: 'quantity', sorter: (a, b) => a.quantity - b.quantity },
    { title: 'Unit Price (EGP)', dataIndex: 'unitPriceEGP', key: 'unitPriceEGP', sorter: (a, b) => a.unitPriceEGP - b.unitPriceEGP },
    { title: 'Total Price (EGP)', dataIndex: 'totalPriceEGP', key: 'totalPriceEGP', sorter: (a, b) => a.totalPriceEGP - b.totalPriceEGP },
];

export default serviceColumns;
