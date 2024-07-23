const itemsColumns = [
    { title: 'Date', dataIndex: ['orderDate'], key: 'orderDate' },
    { title: 'Customer Name', dataIndex: ['customerName'], key: 'customerName' },
    { title: 'Location', dataIndex: ['location'], key: 'location' },
    {
        title: 'Car Code',
        dataIndex: ['carCode'],
        key: 'carCode',
        render: carCode => carCode.join(', '),
    },
    { title: 'Part Num', dataIndex: ['partNum'], key: 'partNum' },
    { title: 'Row Line Num', dataIndex: ['rowLineNum'], key: 'rowLineNum' },
    { title: 'SAP Num', dataIndex: ['sapNum'], key: 'sapNum' },
    { title: 'Description', dataIndex: ['description'], key: 'description' },
    { title: 'Unit Of Measurement', dataIndex: ['unitOfMeasurement'], key: 'unitOfMeasurement' },
    { title: 'Quantity', dataIndex: 'quantity', key: 'quantity' },
    { title: 'Unit Price (EGP)', dataIndex: ['unitPriceEGP'], key: 'unitPriceEGP' },
    { title: 'Total Price (EGP)', dataIndex: ['totalPriceEGP'], key: 'totalPriceEGP' },
];

export default itemsColumns;