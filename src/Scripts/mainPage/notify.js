import { Notification } from 'electron-notification';

function send_notification(title, content) {
    // Create a new notification
    const notification = new Notification({
        title: title,
        body: content,
    });
    
    // Show the notification
    notification.show();
}

export default send_notification;