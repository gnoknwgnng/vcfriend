// This Service Worker handles push notifications from the VC Friend server.
// It must be at the root (/sw.js) to have scope over the entire site.

self.addEventListener('push', (event) => {
  if (!event.data) return;

  let data = {};
  try {
    data = event.data.json();
  } catch {
    data = { title: '🎉 New Feedback!', body: event.data.text(), url: '/ideas' };
  }

  const title = data.title || '🎉 New Feedback on Your Pitch!';
  const options = {
    body: data.body || 'Someone just left feedback on your startup pitch.',
    icon: '/favicon.ico',
    badge: '/favicon.ico',
    tag: 'pitch-feedback',
    renotify: true,
    data: { url: data.url || '/ideas' },
    actions: [
      { action: 'view', title: 'View Feedback' },
    ]
  };

  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const url = event.notification.data?.url || '/ideas';

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      // If a window is already open, focus it and navigate
      for (const client of clientList) {
        if (client.url.includes(self.location.origin) && 'focus' in client) {
          client.focus();
          client.navigate(url);
          return;
        }
      }
      // Otherwise open a new window
      if (clients.openWindow) {
        return clients.openWindow(url);
      }
    })
  );
});
