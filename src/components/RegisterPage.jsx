import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../App.css';

function RegisterPage() {
    const [kioskId, setKioskId] = useState('');
    const navigate = useNavigate();

    const handleKioskIdSubmit = async (event) => {
        event.preventDefault();
        
        const registration = await navigator.serviceWorker.register('/service-worker.js');
        console.log('Service Worker registered:', registration);

        const permission = await Notification.requestPermission();
        console.log('Notification permission:', permission);

        if (permission === 'granted') {
            const subscription = await registration.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: urlBase64ToUint8Array('BN8qkCUgRcHzXucfH0iSbSSZgeqLxlTfqEBoluOZEUqpqK2LV14SNciJCqkY7P963rFRakkKoMF9eEzgsVDVJ6Y')
            });

            await fetch(`${process.env.REACT_APP_URL}/subscribe`, {
                method: 'POST',
                body: JSON.stringify({ subscription, kiosk_id: kioskId }),
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            navigate('/notification', {
                state: { id : kioskId }
            });
        } else {
            console.error('Notification permission denied');
        }
    };

    const urlBase64ToUint8Array = (base64String) => {
        const padding = '='.repeat((4 - base64String.length % 4) % 4);
        const base64 = (base64String + padding)
            .replace(/-/g, '+')
            .replace(/_/g, '/');

        const rawData = window.atob(base64);
        const outputArray = new Uint8Array(rawData.length);

        for (let i = 0; i < rawData.length; ++i) {
            outputArray[i] = rawData.charCodeAt(i);
        }
        return outputArray;
    };

    return (
        <div className="App">
            <h2>Register Kiosk</h2>
            <form onSubmit={handleKioskIdSubmit}>
                <input
                    type="text"
                    value={kioskId}
                    onChange={(e) => setKioskId(e.target.value)}
                    placeholder="Enter Kiosk ID"
                    required
                />
                <button type="submit">Submit Kiosk ID</button>
            </form>
        </div>
    );
}

export default RegisterPage;
