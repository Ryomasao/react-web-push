import React from "react";
import "./App.css";

import { subscribe, registerSubscription, push } from "./services/subscribe";

function App() {
  const [subscription, setSubscription] = React.useState(null);
  const [worker, setWorker] = React.useState(null);

  React.useEffect(() => {
    if (!("serviceWorker" in navigator && "PushManager" in window)) {
      return;
    }

    async function fetchWorker() {
      const sw = await navigator.serviceWorker.ready;
      const sub = await sw.pushManager.getSubscription();
      setWorker(sw);
      setSubscription(sub);
    }
    fetchWorker();
  }, []);

  const handlePush = () => {
    push();
  };

  const handleUnsubscribe = async () => {
    await subscription.unsubscribe();
    setSubscription(null);
  };

  const handleSubscribe = async () => {
    const sub = await subscribe(worker);
    await registerSubscription(sub);
    setSubscription(sub);
  };

  return (
    <div className="App">
      {subscription !== null ? (
        <div>
          <h1>Now You will be able to receive push notifycation.</h1>
          <button onClick={handleUnsubscribe}>UNSUBSCRIBE</button>
          <div>{JSON.stringify(subscription)}</div>
        </div>
      ) : (
        <div>
          <h1>You need subscribe to receive push notifycation.</h1>
          <button onClick={handleSubscribe}>SUBSCRIBE</button>
        </div>
      )}
      <button onClick={handlePush}>PUSH</button>
    </div>
  );
}

export default App;
