// Temas de interface da IDE (mudam TODAS as cores: barras, sidebar, editor, status).
export interface IdeUiTheme {
  id: string;
  name: string;
  editorTheme: string;       // id do tema do editor (CodeMirror) correspondente
  bg: string;                // fundo do editor/área principal
  panel: string;            // fundo de painéis (sidebar/explorer)
  activity: string;         // activity bar
  title: string;            // title bar
  tabbar: string;           // barra de abas
  terminal: string;         // terminal
  status: string;           // status bar
  statusText: string;
  text: string;             // texto principal
  textDim: string;          // texto secundário
  accent: string;           // cor de destaque (ativo, ícones)
  border: string;
  hover: string;            // fundo hover de itens
}

export const IDE_UI_THEMES: IdeUiTheme[] = [
  { id: "dark-plus", name: "Dark+ (VS Code)", editorTheme: "vscodeDark", bg: "#1e1e1e", panel: "#252526", activity: "#333333", title: "#323233", tabbar: "#252526", terminal: "#181818", status: "#007acc", statusText: "#ffffff", text: "#cccccc", textDim: "#858585", accent: "#0e639c", border: "#00000050", hover: "#37373d" },
  { id: "light-plus", name: "Light+", editorTheme: "githubLight", bg: "#ffffff", panel: "#f3f3f3", activity: "#2c2c2c", title: "#dddddd", tabbar: "#ececec", terminal: "#f8f8f8", status: "#007acc", statusText: "#ffffff", text: "#333333", textDim: "#6c6c6c", accent: "#0066b8", border: "#0000001a", hover: "#e8e8e8" },
  { id: "monokai", name: "Monokai", editorTheme: "monokai", bg: "#272822", panel: "#2d2e27", activity: "#1e1f1c", title: "#1e1f1c", tabbar: "#2d2e27", terminal: "#1e1f1c", status: "#a6e22e", statusText: "#000000", text: "#f8f8f2", textDim: "#75715e", accent: "#a6e22e", border: "#00000040", hover: "#3e3d32" },
  { id: "dracula", name: "Dracula", editorTheme: "dracula", bg: "#282a36", panel: "#21222c", activity: "#191a21", title: "#191a21", tabbar: "#21222c", terminal: "#191a21", status: "#bd93f9", statusText: "#282a36", text: "#f8f8f2", textDim: "#6272a4", accent: "#bd93f9", border: "#00000040", hover: "#44475a" },
  { id: "one-dark", name: "One Dark", editorTheme: "atomone", bg: "#282c34", panel: "#21252b", activity: "#333842", title: "#21252b", tabbar: "#21252b", terminal: "#1b1d23", status: "#61afef", statusText: "#ffffff", text: "#abb2bf", textDim: "#5c6370", accent: "#61afef", border: "#00000040", hover: "#2c313a" },
  { id: "github-dark", name: "GitHub Dark", editorTheme: "githubDark", bg: "#0d1117", panel: "#161b22", activity: "#0d1117", title: "#161b22", tabbar: "#161b22", terminal: "#010409", status: "#1f6feb", statusText: "#ffffff", text: "#c9d1d9", textDim: "#8b949e", accent: "#1f6feb", border: "#30363d", hover: "#21262d" },
  { id: "night-owl", name: "Night Owl", editorTheme: "tokyoNight", bg: "#011627", panel: "#01111d", activity: "#011627", title: "#01111d", tabbar: "#01111d", terminal: "#000d18", status: "#7e57c2", statusText: "#ffffff", text: "#d6deeb", textDim: "#637777", accent: "#82aaff", border: "#0000004d", hover: "#0b2942" },
  { id: "solarized-dark", name: "Solarized Dark", editorTheme: "solarizedDark", bg: "#002b36", panel: "#073642", activity: "#002028", title: "#073642", tabbar: "#073642", terminal: "#002028", status: "#268bd2", statusText: "#ffffff", text: "#93a1a1", textDim: "#586e75", accent: "#2aa198", border: "#00000040", hover: "#0a4453" },
  { id: "synthwave", name: "Synthwave '84", editorTheme: "aura", bg: "#262335", panel: "#241b2f", activity: "#1a1426", title: "#241b2f", tabbar: "#241b2f", terminal: "#1a1426", status: "#ff7edb", statusText: "#262335", text: "#f0eff1", textDim: "#848bbd", accent: "#ff7edb", border: "#00000050", hover: "#34294f" },
];

export const DEFAULT_UI_THEME = "dark-plus";
