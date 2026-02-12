import { useState } from "react";

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
      <button onClick={handleOpen}>Abrir Archivo</button>
      <button onClick={handleSave}>Guardar Como</button>
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
