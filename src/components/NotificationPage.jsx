import React, { useState } from 'react';
import '../App.css';
import { useLocation } from 'react-router-dom';

function NotificationPage({id}) {
    const location = useLocation();
    const kioskId = location.state.id;
    const [message, setMessage] = useState({
        title: 'Printer Alert',
        body: 'The printer is out of pages.',
        icon: '/icon.png'
    });
    console.log('Notification kioskId:', kioskId);
    const sendNotification = () => {
        fetch(`${process.env.REACT_APP_URL}/notify`, {
            method: 'POST',
            body: JSON.stringify({ message, kiosk_id: kioskId }),
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(response => response.json())
        .then(data => console.log('Notification response:', data))
        .catch(error => console.error('Error sending notification:', error));
    };
    return (
        <div className="App">
            <h2>Test Notification</h2>
            <button className="notification-button" onClick={sendNotification}>Send Notification</button>
        </div>
    );
}

export default NotificationPage;
