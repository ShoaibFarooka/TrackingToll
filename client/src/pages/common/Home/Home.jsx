import React, { useState } from 'react';
import './Home.css';
import { Table } from 'antd';
import itemsColumns from './columns/itemsColumns';
import teamViews from './config/teamViews';
import SearchForm from './components/SearchForm/SearchFrom';

const Home = React.memo(({ userTeam }) => {
    const TeamViewComponent = teamViews[userTeam] || (() => <div>Unknown Team</div>);
    const [orderItems, setOrderItems] = useState([]);

    const memoizedItemsColumns = React.useMemo(() => itemsColumns, []);

    return (
        <div className='home'>
            {/* <TeamViewComponent /> */}
            <div className='heading'>Search Orders</div>
            <SearchForm orderItems={orderItems} setOrderItems={setOrderItems} />
            <Table
                columns={memoizedItemsColumns}
                dataSource={orderItems.map((item, index) => ({
                    ...item,
                    key: index,
                }))}
                rowKey="key"
                className='table'
                pagination={{ pageSize: 10, position: ['bottomCenter'] }}
                scroll={orderItems.length > 10 ? { y: 400 } : undefined}
            />
        </div>
    )
});

export default Home;