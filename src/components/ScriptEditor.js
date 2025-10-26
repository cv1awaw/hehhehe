import React, { useState } from "react";

function ScriptEditor() {
  const [script, setScript] = useState("// Write your k6 script here");

  const handleRun = () => {
    alert("This would run the k6 script: \n\n" + script);
  };

  return (
    <div style={{ marginTop: "20px" }}>
      <textarea
        rows={15}
        cols={80}
        value={script}
        onChange={(e) => setScript(e.target.value)}
      />
      <br />
      <button onClick={handleRun} style={{ marginTop: "10px", padding: "10px 20px" }}>
        Run Script
      </button>
    </div>
  );
}

export default ScriptEditor;
