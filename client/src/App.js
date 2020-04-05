import React from "react";
import "./App.css";
import firebase from "./services/push";

function App() {
  const handleClick = async () => {
    const push = firebase.functions().httpsCallable("/push");
    await push().catch((error) => {
      console.error(error);
    });
  };

  return (
    <div className="App">
      <button onClick={handleClick}>push</button>
    </div>
  );
}

export default App;
