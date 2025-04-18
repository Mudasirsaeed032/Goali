import { useEffect, useState } from "react";
import axios from "axios";

function App() {
  const [msg, setMsg] = useState("Loading...");

  useEffect(() => {
    axios.get("http://localhost:5000/api/ping")
      .then(res => setMsg(res.data.message))
      .catch(() => setMsg("Error"));
  }, []);

  return <h1>{msg}</h1>;
}

export default App;
