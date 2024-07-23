const salesColumns = [
    {
        title: 'Car Code',
        dataIndex: ['package', 'carCode'],
        key: 'carCode',
        render: carCode => carCode.join(', '),
    },
    { title: 'Part Num', dataIndex: ['package', 'partNum'], key: 'partNum' },
    { title: 'Row Line Num', dataIndex: ['package', 'rowLineNum'], key: 'rowLineNum' },
    { title: 'SAP Num', dataIndex: ['package', 'sapNum'], key: 'sapNum' },
    { title: 'Description', dataIndex: ['package', 'description'], key: 'description' },
    { title: 'Unit Of Measurement', dataIndex: ['package', 'unitOfMeasurement'], key: 'unitOfMeasurement' },
    { title: 'Quantity', dataIndex: 'quantity', key: 'quantity' },
    { title: 'Unit Price (EGP)', dataIndex: ['package', 'unitPriceEGP'], key: 'unitPriceEGP' },
    {
        title: 'Total Price (EGP)',
        key: 'totalPriceEGP',
        render: (text, record) => {
            const quantity = record.quantity;
            const unitPrice = record.package.unitPriceEGP;
            const totalPrice = quantity * unitPrice;
            return totalPrice;
        },
    },
];

export default salesColumns;