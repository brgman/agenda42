import React from 'react';
import Header, { HeaderLeft } from '../../../layout/Header/Header';
import CommonHeaderChat from './CommonHeaderChat';
import CommonHeaderRight from './CommonHeaderRight';
import Logo42 from './Logo42';

const DashboardHeader = () => {
    return (
        <Header>
            <HeaderLeft>
                <Logo42 />
            </HeaderLeft>
            <CommonHeaderRight afterChildren={<CommonHeaderChat />} />
        </Header>
    );
};

export default DashboardHeader;
