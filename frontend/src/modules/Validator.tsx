import React, {useEffect, useState} from 'react';
import {Box, Typography} from '@mui/material';
import Grid from '@mui/material/Grid';
import axios from "axios";
import InfoBox from "../components/InfoBox";

const Validator = () => {
    // State variables to hold the data
    const [shutterizedValidators, setShutterizedValidators] = useState(null);
    const [validatorPercentage, setValidatorPercentage] = useState(null);
    const [totalValidators, setTotalValidators] = useState(null);

    useEffect(() => {
        // Function to fetch data from the API
        const fetchData = async () => {
            try {
                // Example API endpoints - replace with your actual API endpoints
                const response1 = await axios.get('/api/shutterizedValidators');
                const response2 = await axios.get('/api/validatorPercentage');
                const response3 = await axios.get('/api/totalValidators');

                // Set the state with the fetched data
                setShutterizedValidators(response1.data.count);
                setValidatorPercentage(response2.data.percentage);
                setTotalValidators(response3.data.total);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        // Initial fetch when the component mounts
        fetchData();

        // Set up an interval to fetch data every 10 seconds
        const intervalId = setInterval(fetchData, 10000); // 10000 ms = 10 seconds

        // Clean up the interval on component unmount
        return () => clearInterval(intervalId);
    }, []); // Empty dependency array ensures this runs only once on mount


    return (
        <Box sx={{ flexGrow: 1, marginTop: 4 }}>
            {/* Section Title */}
            <Typography variant="h5" align="left">
                Validator Overview
            </Typography>
            <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                    <InfoBox
                        title="# Shutterized Validators"
                        tooltip="Total number of shutterized validators"
                        value={shutterizedValidators !== null ? shutterizedValidators : 'Loading...'}
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <InfoBox
                        title="Validator Percentage"
                        tooltip="Percentage amongst all validators"
                        value={validatorPercentage !== null ? `${validatorPercentage}%` : 'Loading...'}
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <InfoBox
                        title="# Validators"
                        tooltip="TBD"
                        value={totalValidators !== null ? totalValidators : 'Loading...'}
                    />
                </Grid>
            </Grid>
        </Box>
    );
};

export default Validator;
