const serviceColumns = [
    { title: 'Car Code', dataIndex: ['package', 'carCode'], key: 'carCode' },
    { title: 'Table Num', dataIndex: ['package', 'tableNum'], key: 'tableNum' },
    { title: 'Item Num', dataIndex: ['package', 'itemNum'], key: 'itemNum' },
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

export default serviceColumns;
