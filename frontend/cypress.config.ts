import { defineConfig } from 'cypress';
import dotenv from 'dotenv';
import path from 'path';

const envFile = process.env.NODE_ENV === 'production' ? '.env.production' : '.env.development';
dotenv.config({ path: path.resolve(__dirname, envFile) });


export default defineConfig({
  env: {
    REACT_APP_EXPLORER_URL: process.env.REACT_APP_EXPLORER_URL,
  },
  component: {
    devServer: {
      framework: "create-react-app",
      bundler: "webpack",
    },
    viewportWidth: 1280, // Set your desired width
    viewportHeight: 720, // Set your desired height
  },
  e2e: {
    viewportWidth: 1280, // Set your desired width for e2e tests if you're using them
    viewportHeight: 720, // Set your desired height for e2e tests if you're using them
  }
});