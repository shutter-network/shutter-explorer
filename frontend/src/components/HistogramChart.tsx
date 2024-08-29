import React, {FC} from 'react';
import {BarChart} from '@mui/x-charts/BarChart';

interface HistogramData {
    xAxis: {
        scaleType: 'band' | 'point' | 'log' | 'pow' | 'sqrt' | 'time' | 'utc' | 'linear';
        data: string[];
    };
    series: {
        data: number[];
    }[];
}

const HistogramChart: FC = () => {
    // Example data for the histogram
    const data: HistogramData = {
        xAxis: {
            scaleType: 'band',
            data: ['0-1 min', '1-2 min', '2-3 min', '3-4 min', '4-5 min'],
        },
        series: [{ data: [10, 20, 15, 25, 30] }],
    };

    return (
        <BarChart
            xAxis={[data.xAxis]}
    series={data.series}
    width={400}
    height={300}
    />
);
};

export default HistogramChart;
