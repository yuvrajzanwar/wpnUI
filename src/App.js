import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import RegisterPage from './components/RegisterPage';
import NotificationPage from './components/NotificationPage';
import './App.css';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" exact element={<RegisterPage/>}/>
                <Route path="/notification" element={<NotificationPage/>} />
            </Routes>
        </Router>
    );
}

export default App;
