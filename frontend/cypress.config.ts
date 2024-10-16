import { defineConfig } from 'cypress';
import * as dotenv from 'dotenv';
import * as path from 'path';

const envFile = process.env.NODE_ENV === 'production' ? '.env.production' : '.env.development';
dotenv.config({ path: path.resolve(__dirname, envFile) });


export default defineConfig({
  env: {
    REACT_APP_EXPLORER_URL: process.env.REACT_APP_EXPLORER_URL,
  },
  component: {
    specPattern: 'cypress/components/**/*.cy.{js,jsx,ts,tsx}',
    devServer: {
      framework: "create-react-app",
      bundler: "webpack",
    },
    viewportWidth: 1280,
    viewportHeight: 720,
  },
});