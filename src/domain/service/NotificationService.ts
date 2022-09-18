import INotification from "../../presentation/interfaces/notification";
import {toast} from "react-toastify";

export default function showNotification(notification: INotification) {
    toast(notification.message, {
        type: notification.type,
        hideProgressBar: true,
        theme: "colored",
        autoClose: notification.ttl,
        draggable: true,
        position: "bottom-right"
    });

}

