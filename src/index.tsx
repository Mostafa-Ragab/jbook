import { useState, useEffect, useRef } from "react";
import * as esbuild from "esbuild-wasm";
import ReactDom from "react-dom";
import { unpkgPathPlugin } from "./plugins/unpkg-path-plugin";
const App = () => {
  const ref = useRef<any>();
  const [input, setinput] = useState("");
  const [code, setCode] = useState("");

  const startService = async () => {
    ref.current = await esbuild.startService({
      worker: true,
      wasmURL: "/esbuild.wasm",
    });
  };
  useEffect(() => {
    startService();
  }, []);
  const OnClick = async () => {
    if (!ref.current) {
      return;
    }
    const result = await ref.current.build({
      entryPoints: ["index.js"],
      bundle: true,
      write: false,
      plugins: [unpkgPathPlugin(input)],
      define: {
        "process.env.NODE_ENV": '"production"',
        global: "window",
      },
    });

    setCode(result.code.outputfiles[0].text);
  };
  return (
    <div>
      <textarea onChange={(e) => setinput(e.target.value)}></textarea>
      <div>
        <button onClick={OnClick}>Submit</button>
        <pre>{code}</pre>
      </div>
    </div>
  );
};

ReactDom.render(<App />, document.querySelector("#root"));
