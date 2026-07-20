type WeatherIconProps = {
  name: string;
  className?: string;
};

export function WeatherIcon({ name, className = "h-6 w-6" }: WeatherIconProps) {
  const stroke = "currentColor";
  const common = {
    fill: "none" as const,
    stroke,
    strokeWidth: 1.5,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };

  switch (name) {
    case "sun":
      return (
        <svg viewBox="0 0 24 24" className={className} aria-hidden>
          <circle cx="12" cy="12" r="4" {...common} />
          <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" {...common} />
        </svg>
      );
    case "moon":
      return (
        <svg viewBox="0 0 24 24" className={className} aria-hidden>
          <path d="M21 14.5A8.5 8.5 0 1 1 9.5 3 7 7 0 0 0 21 14.5z" {...common} />
        </svg>
      );
    case "cloud-sun":
      return (
        <svg viewBox="0 0 24 24" className={className} aria-hidden>
          <path d="M10 4v1.5M4.5 9H3M6.2 6.2l-1 1" {...common} />
          <circle cx="9" cy="9" r="2.5" {...common} />
          <path d="M8 18h9a4 4 0 0 0 .3-8 5.5 5.5 0 0 0-10.6 1.5A3.5 3.5 0 0 0 8 18z" {...common} />
        </svg>
      );
    case "cloud":
      return (
        <svg viewBox="0 0 24 24" className={className} aria-hidden>
          <path d="M7 18h10a4 4 0 0 0 .4-8 5.5 5.5 0 0 0-10.7 1.6A3.5 3.5 0 0 0 7 18z" {...common} />
        </svg>
      );
    case "fog":
      return (
        <svg viewBox="0 0 24 24" className={className} aria-hidden>
          <path d="M7 15h10a3.5 3.5 0 0 0 .3-7 5 5 0 0 0-9.7 1.4A3 3 0 0 0 7 15zM5 18h14M7 21h10" {...common} />
        </svg>
      );
    case "drizzle":
      return (
        <svg viewBox="0 0 24 24" className={className} aria-hidden>
          <path d="M7 15h10a3.5 3.5 0 0 0 .3-7 5 5 0 0 0-9.7 1.4A3 3 0 0 0 7 15zM9 18v2M12 17v2M15 18v2" {...common} />
        </svg>
      );
    case "rain":
      return (
        <svg viewBox="0 0 24 24" className={className} aria-hidden>
          <path d="M7 14h10a3.5 3.5 0 0 0 .3-7 5 5 0 0 0-9.7 1.4A3 3 0 0 0 7 14zM8 17l-1 3M12 16l-1 3M16 17l-1 3" {...common} />
        </svg>
      );
    case "snow":
      return (
        <svg viewBox="0 0 24 24" className={className} aria-hidden>
          <path d="M7 14h10a3.5 3.5 0 0 0 .3-7 5 5 0 0 0-9.7 1.4A3 3 0 0 0 7 14zM9 17h.01M12 18h.01M15 17h.01" {...common} />
        </svg>
      );
    case "storm":
      return (
        <svg viewBox="0 0 24 24" className={className} aria-hidden>
          <path d="M7 14h10a3.5 3.5 0 0 0 .3-7 5 5 0 0 0-9.7 1.4A3 3 0 0 0 7 14zM13 14l-3 5h3l-2 4" {...common} />
        </svg>
      );
    default:
      return (
        <svg viewBox="0 0 24 24" className={className} aria-hidden>
          <path d="M7 18h10a4 4 0 0 0 .4-8 5.5 5.5 0 0 0-10.7 1.6A3.5 3.5 0 0 0 7 18z" {...common} />
        </svg>
      );
  }
}
