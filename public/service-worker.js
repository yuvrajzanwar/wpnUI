self.addEventListener('push', event => {
    const data = event.data.json();
    console.log('Push event received:', data);
    self.registration.showNotification(data.title, {
        body: data.body,
        icon: data.icon,
    });
});
