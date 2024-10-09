import styled from 'styled-components';
import { ReactComponent as ShutterLogoIcon } from '../assets/icons/shutter.svg';

export const SlotBlock = styled.div<{ isActive: boolean; isShutterized: boolean; isPassed: boolean }>`
    position: relative; /* Ensures the logo stays within this block */
    border-radius: 4px;
    background-color: ${(props) =>
    props.isActive
        ? 'var(--jade-jade-500, #44ca85)'
        : props.isPassed
            ? props.isShutterized
                ? 'var(--jade-jade-600, #006400)' /* Darker green for passed shutterized slots */
                : 'var(--jade-jade-500, #44ca85)' /* Light green for passed slots */
            : 'var(--gray-gray-50, #f7f9fb)'}; /* Grey for upcoming slots */
    width: 64px;
    height: 48px;
    flex: 1;
    overflow: hidden;
`;

export const StyledShutterLogoIcon = styled(ShutterLogoIcon)<{ isActive: boolean; isPassed: boolean }>`
    position: absolute;
    top: 50%;
    left: 50%;
    width: 20px;
    height: 20px;
    transform: translate(-50%, -50%);
    z-index: 2; /* Keeps the logo above the slot block background */
    fill: ${(props) =>
    props.isActive
        ? '#ffffff'  /* White when the slot is active */
        : props.isPassed
            ? '#ffffff' /* White when the slot is passed */
            : '#555555' /* Dark grey when the slot is not passed yet */
};
`;

export const SlotDetailsWrapper = styled.section`
    display: flex;
    flex-direction: column;
    width: 100%;
    padding-top: 16px;
`;

export const SlotVisualizer = styled.div`
    display: flex;
    margin-top: 16px;
    min-height: 48px;
    width: 100%;
    gap: 8px;
    flex-wrap: wrap;
`;

export const PreviousSlotDetails = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
    padding-top: 32px;
    font-family: Space Grotesk, sans-serif;
`;

export const DetailsGrid = styled.div`
    display: flex;
    margin-top: 20px;
    width: 100%;
    gap: 20px;
    flex-wrap: wrap;
`;

export const Card = styled.div`
    align-items: start;
    border-radius: 4px;
    border: 1px solid var(--gray-gray-100, #ccced0);
    background-color: var(--gray-gray-0, #fff);
    display: flex;
    flex-direction: column;
    min-width: 240px;
    flex: 1;
    padding: 16px 20px;
`;

export const CardValue = styled.div`
    font-size: 20px;
    color: var(--gray-gray-1000, #051016);
    letter-spacing: -0.2px;
    line-height: 1;
    font-weight: 600;
`;

export const CardTitle = styled.div`
    display: flex;
    align-items: center;
    gap: 4px;
    font-size: 14px;
    color: var(--gray-gray-300, #989ca2);
    letter-spacing: -0.7px;
    line-height: 1;
    margin-top: 4px;
`;
