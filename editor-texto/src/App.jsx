import { useEffect, useState, useRef } from "react";

function App() {
  const [content, setContent] = useState("");
  const textareaRef = useRef(null);
  const lineNumbersRef = useRef(null);

  const handleScroll = () => {
    if (lineNumbersRef.current && textareaRef.current) {
      requestAnimationFrame(() => {
        lineNumbersRef.current.scrollTop = textareaRef.current.scrollTop;
      });
    }
  };

  const lineNumbers = content.split("\n").map((_, index) => index + 1);

  useEffect(() => {
    if (window.electronAPI) {
      window.electronAPI.onFileOpened((data) => setContent(data));

      const removeSaveListener = window.electronAPI.onRequestSave(() => {
        window.electronAPI.sendContentToSave(content);
      });

      const removeNewListener = window.electronAPI.onNewFile(() => {
        if (content.length > 0) {
          const confirmClear = confirm(
            "¿Estás seguro de que quieres crear un nuevo archivo? Se perderán los cambios no guardados.",
          );
          if (confirmClear) setContent("");
        } else {
          setContent("");
        }
      });

      return () => {
        removeSaveListener();
        removeNewListener();
      };
    }
  }, [content]);

  return (
    <div className="h-screen w-screen bg-[#1e1e1e] flex flex-col m-0 p-0 overflow-hidden text-[#cccccc]">
      <div className="flex flex-1 overflow-hidden">
        {/* Columna de Números de Línea (Estilo VS Code) */}
        <div
          ref={lineNumbersRef}
          className="w-14 bg-[#1e1e1e] text-[#858585] text-right pr-4 pt-4 font-mono text-[14px] overflow-hidden select-none"
        >
          {lineNumbers.map((number) => (
            <div key={number} className="h-6 leading-6">
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
          className="flex-1 p-0 pt-4 resize-none bg-[#1e1e1e] text-[#d4d4d4] font-mono text-[14px] focus:outline-none border-none leading-6 outline-none"
          autoFocus
        />
      </div>
    </div>
  );
}

export default App;
