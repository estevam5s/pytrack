// remonta a cada navegação → entrada suave de todas as páginas do dashboard
export default function Template({ children }: { children: React.ReactNode }) {
  return <div className="animate-slide-up-fade">{children}</div>;
}
