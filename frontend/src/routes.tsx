import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Transaction from "./pages/Transaction";
import Slot from "./pages/Slot";
import System from "./pages/System";

const AppRoutes = () => {
    return (
        <Router>
            <Routes>
                <Route path="/system-overview" element={<System />} />
                <Route path="/slot-overview" element={<Slot />} />
                <Route path="/transaction-detail" element={<Transaction />} />
            </Routes>
        </Router>
    );
};

export default AppRoutes;
