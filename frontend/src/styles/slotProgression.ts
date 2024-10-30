import styled from 'styled-components';
import { ReactComponent as ShutterLogoIcon } from '../assets/icons/shutter.svg';

interface SlotBlockProps {
        isActive: boolean;
        isShutterized: boolean;
        isPassed: boolean;
}

export const SlotBlock = styled.div.attrs<SlotBlockProps>(props => ({
        className: `slot-block ${props.isActive ? 'active' : ''} ${props.isPassed ? 'passed' : ''} ${props.isShutterized ? 'shutterized' : ''}`,
}))<SlotBlockProps>`
    position: relative;
    border-radius: 4px;
    width: 64px;
    height: 48px;
    flex: 1;
    overflow: hidden;
    background-color: ${(props) =>
    props.isActive
        ? 'var(--jade-jade-500, #44ca85)'
        : props.isPassed
            ? props.isShutterized
                ? 'var(--jade-jade-600, #006400)' /* Darker green for passed shutterized slots */
                : 'var(--jade-jade-500, #44ca85)' /* Light green for passed slots */
            : 'var(--gray-gray-50, #f7f9fb)'}; /* Grey for upcoming slots */

    @media (max-width: 900px) {
        width: 38px;
        height: 36px;
    }

    @media (max-width: 786px) {
        width: 28px;
        height: 36px;
    }

    @media (max-width: 480px) {
        width: 13px;
        height: 30px;
    }
`;

export const StyledShutterLogoIcon = styled(ShutterLogoIcon)<{ isActive: boolean; isPassed: boolean }>`
    position: absolute;
    top: 50%;
    left: 50%;
    width: 20px;
    height: 20px;
    transform: translate(-50%, -50%);
    z-index: 2;
    fill: ${(props) =>
    props.isActive ? '#ffffff' : props.isPassed ? '#ffffff' : '#555555'};
    
    @media (max-width: 786px) {
        width: 10px;
        height: 10px;
    }
`;

export const SlotVisualizer = styled.div.attrs({
        className: 'slot-visualizer',
})`
    display: flex;
    margin-top: 16px;
    min-height: 48px;
    width: 100%;
    gap: 8px;
    flex-wrap: wrap;
`;

export const SlotDetailsWrapper = styled.section.attrs({
        className: 'slot-details-wrapper',
})`
    display: flex;
    flex-direction: column;
    width: 100%;
    padding-top: 16px;
`;

export const PreviousSlotDetails = styled.div.attrs({
        className: 'previous-slot-details',
})`
    display: flex;
    flex-direction: column;
    width: 100%;
    padding-top: 32px;
    font-family: Space Grotesk, sans-serif;
`;

export const DetailsGrid = styled.div.attrs({
        className: 'details-grid',
})`
    display: flex;
    margin-top: 20px;
    width: 100%;
    gap: 20px;
    flex-wrap: wrap;

    @media (max-width: 900px) {
        flex-direction: column;
    }
`;

export const Card = styled.div.attrs({
        className: 'card',
})`
    align-items: start;
    border-radius: 4px;
    border: 1px solid var(--gray-gray-100, #ccced0);
    background-color: var(--gray-gray-0, #fff);
    display: flex;
    flex-direction: column;
    min-width: 240px;
    flex: 1;
    padding: 16px 20px;

    @media (max-width: 900px) {
        min-width: 200px;
        padding: 12px 16px;
    }

    @media (max-width: 480px) {
        min-width: 160px;
        padding: 8px 12px;
    }
`;

export const CardValue = styled.div.attrs({
        className: 'card-value',
})`
    font-size: 20px;
    color: var(--gray-gray-1000, #051016);
    letter-spacing: -0.2px;
    line-height: 1;
    font-weight: 600;

    @media (max-width: 900px) {
        font-size: 18px;
    }

    @media (max-width: 480px) {
        font-size: 16px;
    }
`;

export const CardTitle = styled.div.attrs({
        className: 'card-title',
})`
    display: flex;
    align-items: center;
    gap: 4px;
    font-size: 14px;
    color: var(--gray-gray-300, #989ca2);
    letter-spacing: -0.7px;
    line-height: 1;
    margin-top: 4px;
`;