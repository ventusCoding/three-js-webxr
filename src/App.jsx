import logo from "./logo.svg";
import { useState, useRef, useEffect } from "react";
import "./App.css";
// import { VRSetup } from "./ThreeJSComponents/VRSetup";
import { PFE } from "./ThreeJSComponents/PFE";

import { Thumb } from "./ThreeJSComponents/Thumb.js";

function App() {
  const container = useRef(null);

  useEffect(() => {
    if (container) {
      let loader = new Thumb(container.current);
    }
  }, [container]);

  return <div className="App" ref={container}></div>;
}

export default App;
