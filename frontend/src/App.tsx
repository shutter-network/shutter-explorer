import './App.css';
import AppRoutes from "./routes";
import { ThemeProvider as MUIThemeProvider } from '@mui/material/styles';
import { ThemeProvider as StyledThemeProvider } from 'styled-components';
import CssBaseline from '@mui/material/CssBaseline';
import { muiTheme, customTheme } from './theme';

function App() {
  return (
      <MUIThemeProvider theme={muiTheme}>
          <StyledThemeProvider theme={customTheme}>
              <CssBaseline />
              <div className="App">
                  <AppRoutes></AppRoutes>
              </div>
          </StyledThemeProvider>
      </MUIThemeProvider>
  );
}

export default App;
