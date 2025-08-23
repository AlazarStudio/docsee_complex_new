import React, { useEffect, useState } from "react";
import classes from './Notification.module.css';

const Notification = ({ message, status, clearNotification }) => {
    const [visible, setVisible] = useState(false);

    // console.log(status)

    useEffect(() => {
        if (message) {
            setVisible(true);

            const hideTimer = setTimeout(() => {
                setVisible(false);
            }, 3000);

            const clearTimer = setTimeout(() => {
                clearNotification();  // Чистим сообщение только после того, как анимация завершена
            }, 3500);

            return () => {
                clearTimeout(hideTimer);
                clearTimeout(clearTimer);
            };
        }
    }, [message, clearNotification]);

    return (
        <div className={`${classes.notification} ${visible ? classes.show : ""} ${status === 'success' ? classes.success : classes.error}`}>
            {message}
        </div>
    );
};

export default Notification;
