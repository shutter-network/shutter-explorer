import * as React from 'react';
import { FC, useState, useEffect } from 'react';
import { LinePlot, MarkPlot } from '@mui/x-charts/LineChart';
import dayjs from 'dayjs';
import { ChartsXAxis, ChartsYAxis, LineSeriesType } from '@mui/x-charts';
import { ResponsiveChartContainer } from '@mui/x-charts/ResponsiveChartContainer';
import { CustomAxisTooltip } from "./CustomAxisToolTip";
import Box from '@mui/material/Box';
import { Typography } from "@mui/material";
import RevertedInfoBox from "./RevertedInfoBox";
import { formatTime } from "../utils/utils";

interface CustomLineChartProps {
    data: {
        day: number;
        averageInclusionTime: number;
    }[];
    title?: string;
    estimatedInclusionTime: number;
}

const CustomLineChart: FC<CustomLineChartProps> = ({ data, title = 'Inclusion Time Chart', estimatedInclusionTime }) => {
    const [isMobile, setIsMobile] = useState(false);
    
    const handleResize = () => {
        setIsMobile(window.innerWidth <= 768); // Adjust breakpoint as needed
    };

    useEffect(() => {
        handleResize(); // Set initial value
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const sortedData = data.sort((a, b) => a.day - b.day);
    const dataset = (isMobile ? sortedData.slice(-10) : sortedData).map(point => ({
        x: point.day * 1000,
        y: point.averageInclusionTime,
    }));

    const formatDate = (timestamp: number) => {
        let formattedDate = dayjs(timestamp).format('DD MMM');
        const parts = formattedDate.split(' ');
        parts[1] = parts[1].toUpperCase();
        return parts.join(' ');
    };

    const xAxis = {
        scaleType: 'band' as const,
        dataKey: 'x',
        valueFormatter: formatDate,
    };

    const series: LineSeriesType[] = [{
        type: 'line',
        dataKey: 'y',
        label: 'Average Inclusion Time',
        curve: "linear",
        color: '#0044A4',
    }];

    const yAxis = {
        valueFormatter: formatTime,
    };

    return (
        <Box position="relative">
            <Box position={isMobile? "relative":"absolute"} top={0} right={0} zIndex={2}> {/* Add zIndex to RevertedInfoBox */}
                <Typography variant="h6" align="center" gutterBottom>
                    {title}
                </Typography>
                {estimatedInclusionTime && (
                    <RevertedInfoBox
                        title="Estimated Inclusion Time"
                        tooltip="Average time for a transaction to be included"
                        value={formatTime(estimatedInclusionTime)}
                    />
                )}
            </Box>
            <ResponsiveChartContainer
                height={300}
                dataset={dataset}
                series={series}
                xAxis={[xAxis]}
                yAxis={[yAxis]}
            >
                <LinePlot />
                <MarkPlot />
                <ChartsXAxis />
                <ChartsYAxis />
                <CustomAxisTooltip />
            </ResponsiveChartContainer>
        </Box>
    );
};

export default CustomLineChart;
