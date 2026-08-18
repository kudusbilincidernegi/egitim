
const APP_URL='./';
self.addEventListener('install',()=>self.skipWaiting());
self.addEventListener('activate',e=>e.waitUntil(self.clients.claim()));
self.addEventListener('push',event=>{
  let data={};
  try{data=event.data?event.data.json():{}}catch{data={body:event.data?.text()||''}}
  // Safari 18.4+ can handle declarative payloads directly; this remains fallback for standard Web Push.
  if(data.web_push)return;
  const n=data.notification||data;
  event.waitUntil(self.registration.showNotification(n.title||'Kudüs Bilinci',{
    body:n.body||'Yeni bir bildiriminiz var.',
    icon:n.icon,
    badge:n.badge,
    data:{url:n.navigate||n.url||APP_URL}
  }));
});
self.addEventListener('notificationclick',event=>{
  event.notification.close();
  const url=event.notification.data?.url||APP_URL;
  event.waitUntil(clients.matchAll({type:'window',includeUncontrolled:true}).then(list=>{
    for(const c of list){if('focus'in c){c.navigate(url);return c.focus()}}
    if(clients.openWindow)return clients.openWindow(url)
  }));
});
