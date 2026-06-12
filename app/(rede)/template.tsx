// remonta a cada navegação → entrada suave das páginas da comunidade
export default function Template({ children }: { children: React.ReactNode }) {
  return <div className="animate-slide-up-fade">{children}</div>;
}
