import { useEffect, useState } from "react";
import { showNotification } from "../store/slices/uiSlice";
import { useDispatch } from "react-redux";

export const useNotifications = () => {
  const [permission, setPermission] =
    useState<NotificationPermission>("default");
  const [swReady, setSwReady] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.ready
        .then(() => setSwReady(true))
        .catch(() => setSwReady(false));
    }
  }, []);

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

    // Ensure SW is ready before prompting to avoid first-load misses
    if ("serviceWorker" in navigator && !swReady) {
      try {
        await navigator.serviceWorker.ready;
        setSwReady(true);
      } catch {
        /* ignore */
      }
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

  return { requestPermission, sendNotification, permission, swReady };
};
