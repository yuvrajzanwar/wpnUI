import React, { useEffect, useState } from 'react';

function App() {
    const [kioskId, setKioskId] = useState('');
    const [message, setMessage] = useState({
        title: 'Printer Alert',
        body: 'The printer is out of pages.',
        icon: '/icon.png'
    });
    const [subscribed, setSubscribed] = useState(false);
    useEffect(() => {
        if(subscribed)
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('/service-worker.js')
                .then(registration => {
                    console.log('Service Worker registered:', registration);

                    Notification.requestPermission().then(permission => {
                        console.log('Notification permission:', permission)
                        if (permission === 'granted') {
                            registration.pushManager.subscribe({
                                userVisibleOnly: true,
                                applicationServerKey: urlBase64ToUint8Array('BN8qkCUgRcHzXucfH0iSbSSZgeqLxlTfqEBoluOZEUqpqK2LV14SNciJCqkY7P963rFRakkKoMF9eEzgsVDVJ6Y')
                            }).then(subscription => {
                                fetch(`${process.env.REACT_APP_URL}/subscribe`, {
                                    method: 'POST',
                                    body: JSON.stringify({ subscription, kiosk_id: kioskId }),
                                    headers: {
                                        'Content-Type': 'application/json'
                                    }
                                });
                            });
                        }
                        else
                            console.error('Notification permission denied');
                    });
                }).catch(error => console.error('Service Worker registration failed:', error));
        }
    }, [subscribed]);

    //     useEffect(() => {
    //     if (subscribed) {
    //         if ('serviceWorker' in navigator) {
    //             navigator.serviceWorker.ready.then(registration => {
    //                 registration.pushManager.getSubscription().then(subscription => {
    //                     if (!subscription) {
    //                         registration.pushManager.subscribe({
    //                             userVisibleOnly: true,
    //                             applicationServerKey: urlBase64ToUint8Array('Your VAPID Public Key')
    //                         }).then(subscription => {
    //                             console.log('Subscribed:', subscription);
    //                             fetch('http://localhost:5000/subscribe', {
    //                                 method: 'POST',
    //                                 body: JSON.stringify({ subscription, kiosk_id: kioskId }),
    //                                 headers: {
    //                                     'Content-Type': 'application/json'
    //                                 }
    //                             }).then(response => response.json())
    //                               .then(data => console.log('Subscription response:', data))
    //                               .catch(error => console.error('Subscription error:', error));
    //                         }).catch(error => console.error('Subscription failed:', error));
    //                     } else {
    //                         console.log('Already subscribed:', subscription);
    //                     }
    //                 }).catch(error => console.error('Error getting subscription:', error));
    //             });
    //         }
    //     }
    // }, [subscribed]);
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
    const handleKioskIdSubmit = (event) => {
        event.preventDefault();
        setSubscribed(true);
    };
    return (
        <div className="App">
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
            <button onClick={sendNotification}>Send Notification</button>
        </div>
    );
}

export default App;
