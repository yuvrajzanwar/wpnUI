self.addEventListener('push', function(event) {
    console.log('Push received:', event);
    let data = {};
    if (event.data) {
        data = event.data.json();
    }

    const title = data.title || 'Notification';
    const options = {
        body: data.body || 'You have a new notification.',
        icon: data.icon || '/icon.png',
        badge: data.badge || '/badge.png'
    };

    event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', function(event) {
    event.notification.close();
    event.waitUntil(clients.openWindow('/'));
});
