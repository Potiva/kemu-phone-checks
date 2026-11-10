// Service worker for the notification check. Shows the test notification with two buttons and reports when it arrived.
importScripts('config.js');
const c = self.KEMU_CHECK || {};
const report = body => fetch(c.supabaseUrl + '/functions/v1/kt-push', { method: 'POST', headers: { 'content-type': 'application/json', apikey: c.publishableKey, authorization: 'Bearer ' + c.functionsKey }, body: JSON.stringify(body) }).catch(() => {});
self.addEventListener('push', e => {
  const d = e.data ? e.data.json() : {};
  e.waitUntil(Promise.all([
    self.registration.showNotification('Kemu test', { body: 'Test notification (' + (d.label || '') + '). Tap a button.', tag: 'kt-' + d.test, data: d, actions: [{ action: 'accept', title: 'Kubali' }, { action: 'open', title: 'Fungua' }] }),
    report({ action: 'receipt', test: d.test }),
  ]));
});
self.addEventListener('notificationclick', e => {
  e.notification.close();
  e.waitUntil(report({ action: 'click', test: e.notification.data && e.notification.data.test, clicked: e.action || 'body' }));
});
