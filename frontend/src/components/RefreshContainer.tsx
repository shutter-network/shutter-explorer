import React, { FC } from 'react';
import { ReactComponent as UpdIcon } from '../assets/icons/upd.svg';
import { RefreshContainerHolder } from 'styles/refreshCard';

interface RefreshContainerProps {
    time: string;
}

const RefreshContainer: FC<RefreshContainerProps> = ({ time }) => {
    return (
        <RefreshContainerHolder>
            <UpdIcon />
            <span style={{ marginLeft: "3px", color: "#0044A4" }}>{time}</span>
        </RefreshContainerHolder>
    )
}

export default RefreshContainer