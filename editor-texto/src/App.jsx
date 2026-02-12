import { useState } from "react";
import { Button } from "./components/ui/button";

function App() {
  const [content, setContent] = useState("");

  const handleOpen = async () => {
    const data = await window.electronAPI.readFile();
    if (data) setContent(data);
  };

  const handleSave = async () => {
    await window.electronAPI.saveFile(content);
    alert("¡Archivo guardado!");
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Mi Editor Simple</h1>
      <Button onClick={handleOpen}>Abrir Archivo</Button>
      <Button onClick={handleSave}>Guardar Como</Button>
      <br />
      <br />
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        style={{ width: "100%", height: "400px", fontFamily: "monospace" }}
      />
    </div>
  );
}

export default App;
