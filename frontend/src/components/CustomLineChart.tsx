import { LineChart, LineChartProps } from '@mui/x-charts/LineChart';
import { FC } from 'react';
import { Typography, Box } from '@mui/material';
import dayjs from 'dayjs';

interface CustomLineChartProps {
    data: {
        day: number;
        averageInclusionTime: number;
    }[];
    title?: string;
}

const CustomLineChart: FC<CustomLineChartProps> = ({ data, title = 'Inclusion Time Chart' }) => {
    const xAxisData = data.map(point => point.day * 1000);
    const seriesData = data.map(point => point.averageInclusionTime);

    const formatDate = (timestamp: number) => dayjs(timestamp).format('D MMM'); 

    const xAxis = {
        scaleType: 'time' as const,
        data: xAxisData,
        label: 'Date',
        valueFormatter: formatDate
    };

    const series = [{ data: seriesData }];

    const chartProps: LineChartProps = {
        xAxis: [xAxis],
        series,
        width: 600,
        height: 400,
    };

    return (
        <Box>
            {/* Display the chart title */}
            <Typography variant="h6" align="center" gutterBottom>
                {title}
            </Typography>
            {/* Render the LineChart */}
            <LineChart {...chartProps} />
        </Box>
    );
};

export default CustomLineChart;
