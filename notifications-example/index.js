const notificationsButton = document.querySelector('#grant-button');
const showNotificationButton = document.querySelector('#notifications-button');
let notificationPermission = '';

function createNotification() {
    const text = 'Detta är en notifikation!';

    const notification = new Notification('Notis', { body: text });

    notification.addEventListener('click', () => {
        window.open('https://localhost:4000');
    });
}

function requestNotificationsPermission() {
    Notification.requestPermission().then((permission) => {
        console.log(permission);
        notificationPermission = permission;
    });
}

notificationsButton.addEventListener('click', () => {
    requestNotificationsPermission();
});

showNotificationButton.addEventListener('click', () => {
    if (notificationPermission === 'granted') {
        createNotification();
    }
});