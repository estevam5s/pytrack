/* eslint-disable @typescript-eslint/no-explicit-any */
// Loader único do Pyodide, compartilhado entre o editor e o terminal interativo.
declare global {
  interface Window {
    loadPyodide?: (opts: { indexURL: string }) => Promise<any>;
  }
}

export const PYODIDE_VERSION = "0.27.2";
const CDN = `https://cdn.jsdelivr.net/pyodide/v${PYODIDE_VERSION}/full/`;

let pyodidePromise: Promise<any> | null = null;

export function getPyodide() {
  if (pyodidePromise) return pyodidePromise;
  pyodidePromise = (async () => {
    if (!window.loadPyodide) {
      await new Promise<void>((res, rej) => {
        const s = document.createElement("script");
        s.src = `${CDN}pyodide.js`;
        s.onload = () => res();
        s.onerror = () => rej(new Error("Falha ao carregar o Pyodide (CDN)."));
        document.head.appendChild(s);
      });
    }
    const py = await window.loadPyodide!({ indexURL: CDN });
    // garante um diretório de trabalho persistente p/ o terminal
    try {
      await py.runPythonAsync(`
import os
os.makedirs('/home/pytrack', exist_ok=True)
os.chdir('/home/pytrack')
`);
    } catch { /* ignore */ }
    return py;
  })();
  return pyodidePromise;
}
