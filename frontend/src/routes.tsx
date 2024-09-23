import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Transaction from "./pages/Transaction";
import Slot from "./pages/Slot";
import System from "./pages/System";
import NotFound from "./components/NotFound";
import Transactions from './pages/Transactions';

const AppRoutes = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<System />} />
                <Route path="/system-overview" element={<System />} />
                <Route path="/slot-overview" element={<Slot />} />
                <Route path="/transaction-details/:txHash" element={<Transaction />} />
                <Route path="/transactions" element={<Transactions />} />
                <Route path="*" element={<NotFound />} />
            </Routes>
        </Router>
    );
};

export default AppRoutes;
