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

    const formatDate = (timestamp: number) => dayjs(timestamp).format('DD MMM'); 

    const xAxis = {
        scaleType: 'time' as const,
        data: xAxisData,
        label: 'Date',
        valueFormatter: formatDate
    };
    
    const yAxis = {
        data: seriesData,
        label: 'Inclusion time (secs)'
    }

    const chartProps: LineChartProps = {
        xAxis: [xAxis],
        series: [yAxis],
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
