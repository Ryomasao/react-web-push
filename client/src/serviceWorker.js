const SW_URL = `${process.env.PUBLIC_URL}/sw.js`;
// https://web-push-codelab.glitch.me/

const workerStatusElement = document.getElementById("worker-status");

export const register = async () => {
  if (!("serviceWorker" in navigator && "PushManager" in window)) {
    const errorMessage = "Service Worker and Push is supported\n";
    workerStatusElement.textContent = errorMessage;
    console.error(errorMessage);
    return;
  }
  const worker = await navigator.serviceWorker
    .register(SW_URL)
    .catch((error) => {
      const errorMessage = "Service Worker Error\n";
      workerStatusElement.textContent = errorMessage;
      console.error(errorMessage, error);
      return;
    });

  if (Notification.permission === "denied") {
    const errorMessage = "Notification permission is denied\n";
    workerStatusElement.textContent = errorMessage;
    console.error(errorMessage);
    return;
  }
};
