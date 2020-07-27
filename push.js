let webPush = require('web-push');
 
const vapidKeys = {
   "publicKey": "BNgjNLTH6YyBXZa5PuuAAGa6lpLFHukJdz4aznYoQejlLN8Hm23fqBVQ8rc6jHOZIm5y9IytCbXavHjOQC3ytL8",
   "privateKey": "LUgGCaMGPfStjTQO8jrnGCCO9bccJTcGMeAFQCm8pY0"
};
 
 
webPush.setVapidDetails(
   'mailto:example@yourdomain.org',
   vapidKeys.publicKey,
   vapidKeys.privateKey
)
let pushSubscription = {
   "endpoint": "https://fcm.googleapis.com/fcm/send/dS4kaTC4NEw:APA91bGgGwRjusSKCeZ2HvpcqouoGRY9WooL9UPINFfqiUyX57YqJZQHqPMK8yBWhHOUZJ_E0KBnb9HQdRKHBJpfq9qJMF4rUhSpRS50Njv6XOKEKNEmFN4Xg2xZJfX-WFMA_qBDbD9k",
   "keys": {
       "p256dh": "BKp7TLj3BqmgvlYfZ+3HJvFxVw9fGj4yRTwgEO+Z450d4pJwqVg+nzFcvdVGgAYLL+kZHA8TsAQWLC3NGmLXB+Q=",
       "auth": "a/Vtq+hcJtzmEN4ALKPbTA=="
   }
};
let payload = 'Selamat! Aplikasi Anda sudah dapat menerima push notifikasi!';
 
let options = {
   gcmAPIKey: '51445511453',
   TTL: 60
};
webPush.sendNotification(
   pushSubscription,
   payload,
   options
);