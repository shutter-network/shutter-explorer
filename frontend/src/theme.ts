import { createTheme } from '@mui/material/styles';

const muiTheme = createTheme({
    palette: {
        primary: {
            main: '#0044A4',
        },
        secondary: {
            main: '#051016',
        },
        background: {
            default: '#FFFFFF',
        },
        text: {
            primary: '#051016',
            secondary: '#656B73',
        },
        success: {
            main: '#44CA85',
        },
        error: {
            main: '#D9125B',
        },
    },
    typography: {
        fontFamily: "'Space Grotesk', sans-serif",
        h1: {
            fontSize: '32px',
            fontWeight: 600,
            lineHeight: '95%',
            letterSpacing: '-1.6px',
            color: '#051016',
        },
        h2: {
            fontSize: '24px',
            fontWeight: 600,
            lineHeight: '95%',
            letterSpacing: '-1.2px',
            color: '#051016',
        },
        subtitle1: {
            fontSize: '20px',
            fontWeight: 600,
            lineHeight: '95%',
            letterSpacing: '-0.2px',
            color: '#051016',
        },
        body1: {
            fontSize: '14px',
            fontWeight: 600,
            lineHeight: '145%',
            letterSpacing: '-0.7px',
            color: '#656B73',
        },
    },
});

const customTheme = {
    ...muiTheme,
    colors: {
        primary: '#051016',
        secondary: '#0044A4',
        background: '#FFFFFF',
        textPrimary: '#051016',
        textSecondary: '#656B73',
    },
};

export { muiTheme, customTheme };