import Link from "next/link";
import { AppNav } from "@/components/app-nav";

type MarketingShellProps = {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
};

/** Shell estático para páginas SEO (clima index, blog) — tema clear-day. */
export function MarketingShell({ title, subtitle, children }: MarketingShellProps) {
  return (
    <div className="weather-shell atmosphere theme-clear-day is-day min-h-dvh">
      <div className="atmosphere-overlay pointer-events-none absolute inset-0" />
      <div className="relative z-10 mx-auto flex min-h-dvh w-full max-w-lg flex-col gap-6 px-5 pb-28 pt-8 sm:px-6">
        <header className="flex flex-col gap-2">
          <Link
            href="/"
            className="font-[family-name:var(--font-display)] text-2xl tracking-tight text-white/90 transition hover:text-white"
          >
            Weatherly
          </Link>
          <h1 className="font-[family-name:var(--font-display)] text-3xl tracking-tight text-white">
            {title}
          </h1>
          {subtitle ? (
            <p className="text-sm text-white/75">{subtitle}</p>
          ) : null}
        </header>
        {children}
        <footer className="mt-4 flex flex-wrap gap-4 border-t border-white/15 pt-4 text-sm text-white/70">
          <Link href="/clima" className="hover:text-white">
            Clima por cidade
          </Link>
          <Link href="/blog" className="hover:text-white">
            Blog
          </Link>
          <Link href="/" className="hover:text-white">
            Abrir app
          </Link>
        </footer>
      </div>
      <AppNav />
    </div>
  );
}
