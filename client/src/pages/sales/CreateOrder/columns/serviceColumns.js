const serviceColumns = [
    { title: 'Car Code', dataIndex: 'carCode', key: 'carCode', sorter: (a, b) => a.carCode.localeCompare(b.carCode) },
    { title: 'Table Num', dataIndex: 'tableNum', key: 'tableNum', sorter: (a, b) => a.tableNum.localeCompare(b.tableNum) },
    { title: 'Item Num', dataIndex: 'itemNum', key: 'itemNum', sorter: (a, b) => a.itemNum.localeCompare(b.itemNum) },
    { title: 'Description', dataIndex: 'description', key: 'description' },
    { title: 'Unit Of Measurement', dataIndex: 'unitOfMeasurement', key: 'unitOfMeasurement' },
    { title: 'Unit Price (EGP)', dataIndex: 'unitPriceEGP', key: 'unitPriceEGP', sorter: (a, b) => a.unitPriceEGP - b.unitPriceEGP },
];

export default serviceColumns;
