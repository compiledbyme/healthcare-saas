import { useEffect, useState } from "react";
import { showNotification } from "../store/slices/uiSlice";
import { useDispatch } from "react-redux";

export const useNotifications = () => {
  const [permission, setPermission] =
    useState<NotificationPermission>("default");
  const dispatch = useDispatch();

  const requestPermission = async (): Promise<boolean> => {
    if (!("Notification" in window)) {
      dispatch(
        showNotification({
          message: "Notifications are not supported in this browser.",
          type: "error",
        }),
      );
      return false;
    }

    if (permission === "granted") return true;

    const nextPermission = await Notification.requestPermission();
    setPermission(nextPermission);

    if (nextPermission === "granted") {
      dispatch(
        showNotification({
          message: "Notifications enabled. We’ll keep you posted.",
          type: "success",
        }),
      );
      return true;
    }

    return false;
  };

  const sendNotification = async (
    title: string,
    options?: NotificationOptions,
  ): Promise<boolean> => {
    const allowed = await requestPermission();
    if (!allowed) return false;

    if ("serviceWorker" in navigator) {
      const registration = await navigator.serviceWorker.ready;
      await registration.showNotification(title, {
        icon: "/logo192.png",
        badge: "/logo192.png",
        ...options,
      });
      return true;
    }

    const notification = new Notification(title, options);
    notification.onclick = () => {
      window.focus();
      notification.close();
    };
    return true;
  };

  useEffect(() => {
    if ("Notification" in window) {
      setPermission(Notification.permission);
    }
  }, []);

  return { requestPermission, sendNotification, permission };
};
