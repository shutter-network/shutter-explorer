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
        body2: {
            fontSize: '14px',
            fontWeight: 600,
            lineHeight: '145%',
            letterSpacing: '-0.7px',
            color: 'black',
        },
    },
    components: {
        MuiLink: {
            styleOverrides: {
                root: {
                    color: '#0044A4',
                    fontWeight: 600,
                    textDecoration: 'none',
                    '&:hover': {
                        textDecoration: 'underline',
                    },
                },
            },
        },
        MuiAlert: {
            styleOverrides: {
                root: {
                    textAlign: 'left',
                    marginTop: '16px',
                    marginBottom: '16px'
                },
            },
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
        gray: '#989CA2',
        lightBlue: '#F7F9FB'
    },
};

export { muiTheme, customTheme };
