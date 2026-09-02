export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="hud-grid-bg relative flex min-h-screen items-center justify-center px-4 py-10">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_20%,rgba(0,217,255,0.09),transparent)]" />
      <div className="relative w-full max-w-sm">{children}</div>
    </div>
  );
}
