self.addEventListener('push', function(event) {
  const data = event.data?.json() || {};
  const title = data.title || 'Weather Alert';
  const options = {
    body: data.body || 'Check your weather app for more details.',
  };
  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', function(event) {
  event.notification.close();
  event.waitUntil(clients.openWindow('/'));
});
