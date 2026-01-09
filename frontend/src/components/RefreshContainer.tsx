import React, { FC } from 'react';
import { ReactComponent as UpdIcon } from '../assets/icons/upd.svg';
import { RefreshContainerHolder } from 'styles/refreshCard';

interface RefreshContainerProps {
    time: string;
    style?: React.CSSProperties;
}

const RefreshContainer: FC<RefreshContainerProps> = ({ time, style }) => {
    return (
        <RefreshContainerHolder style={style}>
            <UpdIcon />
            <span style={{ marginLeft: "3px", color: "#0044A4" }}>{time}</span>
        </RefreshContainerHolder>
    )
}

export default RefreshContainer