import { FC, StrictMode, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { WebSocketProvider } from './context/WebSocketContext';

const initializeMatomo = () => {
    const _paq = (window as any)._paq = (window as any)._paq || [];
    _paq.push(['trackPageView']);
    _paq.push(['enableLinkTracking']);

    const matomoURL = 'https://shutter.matomo.cloud/';
    _paq.push(['setTrackerUrl', matomoURL + 'matomo.php']);
    _paq.push(['setSiteId', '5']);

    const scriptElement = document.createElement('script');
    scriptElement.async = true;
    scriptElement.src = 'https://cdn.matomo.cloud/shutter.matomo.cloud/matomo.js';

    const firstScript = document.getElementsByTagName('script')[0];
    firstScript.parentNode?.insertBefore(scriptElement, firstScript);
};

const MatomoInitializer: FC = () => {
    useEffect(() => {
        // Only initialize Matomo if the environment is 'staging'
        if (process.env.REACT_APP_ENV === 'staging') {
            console.log("Initializing Matomo Tracking!")
            initializeMatomo();
        }
    }, []);
    return null;
};

const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
);

root.render(
    <StrictMode>
        <MatomoInitializer />
        <WebSocketProvider>
            <App />
        </WebSocketProvider>
    </StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
