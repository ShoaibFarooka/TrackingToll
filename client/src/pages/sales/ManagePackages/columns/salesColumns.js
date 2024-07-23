const salesColumns = [
    {
        title: 'Car Code',
        dataIndex: 'carCode',
        key: 'carCode',
        sorter: (a, b) => a.carCode.join(', ').localeCompare(b.carCode.join(', ')),
        render: carCode => carCode.join(', '),
    },
    { title: 'Part Num', dataIndex: 'partNum', key: 'partNum', sorter: (a, b) => a.partNum.localeCompare(b.partNum) },
    { title: 'Row Line Num', dataIndex: 'rowLineNum', key: 'rowLineNum', sorter: (a, b) => a.rowLineNum.localeCompare(b.rowLineNum) },
    { title: 'SAP Num', dataIndex: 'sapNum', key: 'sapNum', sorter: (a, b) => a.sapNum.localeCompare(b.sapNum) },
    { title: 'Description', dataIndex: 'description', key: 'description' },
    { title: 'Unit Of Measurement', dataIndex: 'unitOfMeasurement', key: 'unitOfMeasurement' },
    { title: 'Quantity', dataIndex: 'quantity', key: 'quantity', sorter: (a, b) => a.quantity - b.quantity },
    { title: 'Unit Price (EGP)', dataIndex: 'unitPriceEGP', key: 'unitPriceEGP', sorter: (a, b) => a.unitPriceEGP - b.unitPriceEGP },
    { title: 'Total Price (EGP)', dataIndex: 'totalPriceEGP', key: 'totalPriceEGP', sorter: (a, b) => a.totalPriceEGP - b.totalPriceEGP },
];

export default salesColumns;