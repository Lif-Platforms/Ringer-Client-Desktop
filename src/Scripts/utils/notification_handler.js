import RingerLogo from "../../Images/Ringer-Icon.png";

function send_notification(title, body) {
    const { Notification } = require('electron');

    // Create notification
    new Notification({ title: title, body: body }).show()
}

export default send_notification;