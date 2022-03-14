import logo from "./logo.svg";
import { useState, useRef, useEffect } from "react";
import "./App.css";
// import { VRSetup } from "./ThreeJSComponents/VRSetup";
import { Moving } from "./ThreeJSComponents/Moving";
import { Architecture } from "./ThreeJSComponents/Architecture";
import { Archi } from "./ThreeJSComponents/Archi";
import { FinalArchi } from "./ThreeJSComponents/FinalArchi";
import { PFE } from "./ThreeJSComponents/PFE";
import { PFETEST } from "./ThreeJSComponents/PFETEST";
import { Controls } from "./ThreeJSComponents/Controls.js";
import { Thumb } from "./ThreeJSComponents/Thumb.js";

function App() {
  const container = useRef(null);

  useEffect(() => {
    if (container) {
      let loader = new Controls(container.current)
    }
  },[container])

  return (
    <div className="App" ref={container}>
    </div>
  )
}

export default App;
