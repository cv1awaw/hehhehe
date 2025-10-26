import React from "react";
import ScriptEditor from "./components/ScriptEditor";
import "./App.css";

function App() {
  return (
    <div className="App">
      <h1>My K6 Load Testing Dashboard</h1>
      <ScriptEditor />
    </div>
  );
}

export default App;
