export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-4">
      <div className="pointer-events-none absolute inset-0 opacity-[0.15] [background:radial-gradient(60%_60%_at_50%_0%,#8257E5_0%,transparent_60%)]" />
      <div className="pointer-events-none absolute -bottom-40 right-0 h-96 w-96 rounded-full bg-secondary/10 blur-3xl" />
      <div className="relative z-10 w-full max-w-md rounded-2xl border border-border bg-card/80 p-8 backdrop-blur-sm">
        {children}
      </div>
    </div>
  );
}
