import { createTheme } from '@mui/material/styles';

const muiTheme = createTheme({
    palette: {
        primary: {
            main: '#0044a4',
        },
        secondary: {
            main: '#fde12d',
        },
        text: {
            primary: '#051016',
            secondary: '#989ca2',
        },
    },
    typography: {
        fontFamily: "'Space Grotesk', sans-serif",
        h1: {
            fontSize: '32px',
            fontWeight: 600,
        },
        h4: {
            fontSize: '24px',
            fontWeight: 600,
        },
        body1: {
            fontSize: '14px',
            fontWeight: 600,
        },
    },
    spacing: 8,
});

const customTheme = {
    ...muiTheme,
    colors: {
        primary: '#0044a4',
        secondary: '#fde12d',
        textPrimary: '#051016',
        textSecondary: '#989ca2',
    },
};

export { muiTheme, customTheme };
