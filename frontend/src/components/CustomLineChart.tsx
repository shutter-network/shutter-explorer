import {LineChart, LineChartProps} from '@mui/x-charts/LineChart';
import {FC} from "react";

const CustomLineChart: FC = () => {
    // Example data for the line chart
    const xAxis = {
        scaleType: 'linear' as const, // Use 'as const' to narrow the type to the specific string literal
        data: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
    };

    const series = [{data: [5, 10, 8, 12, 15]}];

    // The props might need to be spread or structured differently, depending on the library's API
    const chartProps: LineChartProps = {
        xAxis: [xAxis],
        series,
        width: 400,
        height: 300,
    };

    return (
        <LineChart {...chartProps} />
    );
};


export default CustomLineChart;
