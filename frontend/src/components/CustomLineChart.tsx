import { LineChart, LineChartProps } from '@mui/x-charts/LineChart';
import { FC } from 'react';
import { Typography, Box } from '@mui/material';
import dayjs from 'dayjs';
import { LineSeriesType } from '@mui/x-charts';

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
        label: 'Inclusion time (secs)',
        color: '#0044A4'
    }]

    const chartProps: LineChartProps = {
        xAxis: [xAxis],
        series: yAxis,
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
