import { MemoryRouter } from 'react-router-dom';
import SlotProgression from '../../src/modules/SlotProgression';
import { mount } from "cypress/react18";
import React from 'react';
import { ThemeProvider as MUIThemeProvider } from '@mui/material/styles';
import { ThemeProvider as StyledThemeProvider } from 'styled-components';
import { muiTheme, customTheme } from '../../src/theme';
