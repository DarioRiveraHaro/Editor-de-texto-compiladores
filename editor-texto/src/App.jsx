import { useEffect, useState, useRef } from "react";

function App() {
  const [content, setContent] = useState("");
  const textareaRef = useRef(null);
  const lineNumbersRef = useRef(null);

  // Sincronizar el scroll de los números con el del textarea
  const handleScroll = () => {
    if (lineNumbersRef.current && textareaRef.current) {
      lineNumbersRef.current.scrollTop = textareaRef.current.scrollTop;
    }
  };

  // Generar el array de números basado en los saltos de línea
  const lineNumbers = content.split("\n").map((_, index) => index + 1);

  useEffect(() => {
    if (window.electronAPI) {
      window.electronAPI.onFileOpened((data) => setContent(data));
      window.electronAPI.onRequestSave(() => {
        window.electronAPI.sendContentToSave(content);
      });
    }
  }, [content]);

  return (
    <div className="h-screen w-screen bg-slate-900 flex flex-col m-0 p-0 overflow-hidden text-slate-300">
      <div className="flex flex-1 overflow-hidden">
        {/* Columna de Números de Línea */}
        <div
          ref={lineNumbersRef}
          className="w-12 bg-slate-950 text-slate-600 text-right pr-3 pt-8 font-mono text-sm overflow-hidden select-none border-r border-slate-800"
        >
          {lineNumbers.map((number) => (
            <div key={number} className="h-6">
              {number}
            </div>
          ))}
        </div>

        {/* Editor (Textarea) */}
        <textarea
          ref={textareaRef}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onScroll={handleScroll}
          spellCheck="false"
          className="flex-1 p-8 pt-8 resize-none bg-transparent text-white font-mono text-sm focus:outline-none border-none leading-6 outline-none"
          placeholder="Comienza a programar..."
          autoFocus
        />
      </div>
    </div>
  );
}

export default App;
