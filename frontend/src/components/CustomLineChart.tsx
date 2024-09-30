import { LineChart, LineChartProps } from '@mui/x-charts/LineChart';
import { FC } from 'react';
import { Typography, Box } from '@mui/material';
import dayjs from 'dayjs';
import { LineSeriesType } from '@mui/x-charts';
import RevertedInfoBox from './RevertedInfoBox';
import { formatTime } from '../utils/utils';

interface CustomLineChartProps {
    data: {
        day: number;
        averageInclusionTime: number;
    }[];
    title?: string;
    estimatedInclusionTime: number;
}

const CustomLineChart: FC<CustomLineChartProps> = ({ data, title = 'Inclusion Time Chart', estimatedInclusionTime }) => {
    const xAxisData = data.map(point => point.day * 1000);
    const seriesData = data.map(point => point.averageInclusionTime);

    const formatDate = (timestamp: number) => { 
        let formattedDate= dayjs(timestamp).format('DD MMM')
        const parts = formattedDate.split(' ');
        parts[1] = parts[1].toUpperCase(); 
        return parts.join(' ');
    }; 

    const xAxis = {
        scaleType: 'time' as const,
        data: xAxisData,
        valueFormatter: formatDate
    };
    
    const yAxis: LineSeriesType[] = [{
        type: 'line',
        data: seriesData,
        curve: "linear",
        color: '#0044A4',
    }]

    const chartProps: LineChartProps = {
        xAxis: [xAxis],
        series: yAxis,
        yAxis: [{
            valueFormatter: formatTime
        }],
        width: 600,
        height: 400,
    };

    return (
        <Box position="relative">
            <Box position="absolute" top={0} right={0}>
                <Typography variant="h6" align="center" gutterBottom>
                    {title}
                </Typography>
                {estimatedInclusionTime && (
                    <RevertedInfoBox title="Estimated Inclusion Time"
                                     tooltip="Estimated time for a transaction to be included"
                                     value={formatTime(estimatedInclusionTime)} />
                )}
            </Box>

            <LineChart {...chartProps} />
        </Box>
    );
};

export default CustomLineChart;
