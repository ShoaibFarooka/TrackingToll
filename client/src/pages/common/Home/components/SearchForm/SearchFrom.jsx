import React, { useState } from 'react';
import './SearchForm.css';
import { message, Button } from 'antd';
import { useDispatch } from 'react-redux';
import { HideLoading, ShowLoading } from '../../../../../redux/loaderSlice';
import FileSaver from 'file-saver';
import CustomRangePicker from '../RangePicker/RangePicker';
import MultipleInput from '../MultipleInput/MultipleInput';
import SelectOption from '../SelectOption/SelectOption';
import orderHeaderOptions from '../../options/orderHeaderOptions';
import equipmentHeaderOptions from '../../options/equipmentHeaderOptions';
import orderStateOptions from '../../options/orderStateOptions';
import orderService from '../../../../../services/orderService';

const SearchForm = React.memo(({ orderItems, setOrderItems }) => {
    const [clients, setClients] = useState([]);
    const [locations, setLocations] = useState([]);
    const [selectedDateRange, setSelectedDateRange] = useState(['', '']);
    const [orderHeaderType, setOrderHeaderType] = useState('');
    const [orderHeaderNumbers, setOrderHeaderNumbers] = useState([]);
    const [carCodes, setCarCodes] = useState([]);
    const [equipmentHeaderType, setEquipmentHeaderType] = useState('');
    const [equipmentHeaderNumbers, setEquipmentHeaderNumbers] = useState([]);
    const [orderStatus, setOrderStatus] = useState('');

    const dispatch = useDispatch();

    const handleSearch = async () => {
        const data = {
            clients,
            locations,
            selectedDateRange,
            orderHeaderType,
            orderHeaderNumbers,
            carCodes,
            equipmentHeaderType,
            equipmentHeaderNumbers,
            orderStatus
        };
        // console.log('Data: ', data);
        dispatch(ShowLoading());
        try {
            const response = await orderService.searchOrderItems(data);
            if (response.orderItems) {
                console.log('Order Items: ', response.orderItems);
                setOrderItems(response.orderItems);
            }
        } catch (error) {
            message.error(error.response.data);
        }
        dispatch(HideLoading());
    };

    const handleExport = async () => {
        console.log('Exporting...');
        dispatch(ShowLoading());
        try {
            const response = await orderService.exportItemsCSV({ orderItems });
            const blob = new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
            FileSaver.saveAs(blob, 'OrderItems.xlsx');
        } catch (error) {
            message.error(error.response.data);
        }
        dispatch(HideLoading());
    };

    return (
        <div className='search-form'>
            <div className="form-item">
                <label className="label">Date Range:</label>
                <CustomRangePicker selectedDateRange={selectedDateRange} setSelectedDateRange={setSelectedDateRange} />
            </div>

            <div className="form-item">
                <label className="label">Customer Names:</label>
                <MultipleInput tags={clients} setTags={setClients} placeholder="Enter customer names" />
            </div>

            <div className="form-item">
                <label className="label">Locations:</label>
                <MultipleInput tags={locations} setTags={setLocations} placeholder="Enter locations" />
            </div>

            <div className="form-item">
                <label className="label">Order Header Type:</label>
                <SelectOption setValue={setOrderHeaderType} OptionsData={orderHeaderOptions} placeholder="Select order header" />
            </div>

            {orderHeaderType &&
                <div className="form-item">
                    <label className="label">{`Enter ${orderHeaderType}s:`}</label>
                    <MultipleInput tags={orderHeaderNumbers} setTags={setOrderHeaderNumbers} placeholder={`Enter ${orderHeaderType}s`} />
                </div>
            }

            <div className="form-item">
                <label className="label">Car Codes:</label>
                <MultipleInput tags={carCodes} setTags={setCarCodes} placeholder="Enter car codes" />
            </div>

            <div className="form-item">
                <label className="label">Equipment Header Type:</label>
                <SelectOption setValue={setEquipmentHeaderType} OptionsData={equipmentHeaderOptions} placeholder="Select equipment header" />
            </div>

            {equipmentHeaderType &&
                <div className="form-item">
                    <label className="label">{`Enter ${equipmentHeaderType}s:`}</label>
                    <MultipleInput tags={equipmentHeaderNumbers} setTags={setEquipmentHeaderNumbers} placeholder={`Enter ${equipmentHeaderType}s`} />
                </div>
            }

            <div className="form-item">
                <label className="label">Order State:</label>
                <SelectOption setValue={setOrderStatus} OptionsData={orderStateOptions} placeholder="Select order state" />
            </div>
            <div className='btns-container'>
                <Button type="primary" onClick={handleSearch} className='search-btn'>Search</Button>
                {(orderItems && !orderItems.length <= 0) &&
                    < Button className="export-btn" disabled={orderItems?.length <= 0} onClick={handleExport}>Export CSV</Button>
                }
            </div>
        </div >
    )
});

export default SearchForm;
