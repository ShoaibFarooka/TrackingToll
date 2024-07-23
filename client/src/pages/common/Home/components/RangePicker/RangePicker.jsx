import React from 'react';
import './RangePicker.css';
import { DatePicker } from 'antd';
import dayjs from "dayjs";

const { RangePicker } = DatePicker;

const CustomRangePicker = React.memo(({ selectedDateRange, setSelectedDateRange }) => {
    const dateFormat = 'YYYY-MM-DD';

    const handleRangePickerChange = (dates, dateStrings) => {
        setSelectedDateRange(dateStrings);
    };

    return (
        <div className='range-picker'>
            <RangePicker
                format={dateFormat}
                maxDate={dayjs(new Date())}
                defaultValue={selectedDateRange}
                onChange={handleRangePickerChange}
            />
        </div>
    )
});

export default CustomRangePicker;