import React from "react";

interface LogoProps {
  className?: string;
  size?: number;
  title?: string;
}

/**
 * Logotipo del sistema de votaciones: una urna con un voto marcado.
 * Autocontenido (fondo degradado incluido) para verse bien sobre cualquier color.
 */
export const Logo: React.FC<LogoProps> = ({
  className = "",
  size,
  title = "Sistema de Votaciones",
}) => {
  return (
    <svg
      viewBox="0 0 64 64"
      width={size}
      height={size}
      className={className}
      role="img"
      aria-label={title}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="votingLogoGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#5fb0f4" />
          <stop offset="1" stopColor="#8a6ce8" />
        </linearGradient>
      </defs>

      <circle cx="32" cy="32" r="32" fill="url(#votingLogoGrad)" />
      <circle cx="32" cy="32" r="28.5" fill="none" stroke="#ffffff" strokeOpacity="0.28" strokeWidth="1.5" />

      <rect x="25" y="14" width="14" height="20" rx="2" fill="#ffffff" />
      <path
        d="M28.5 23.2 L31.3 26 L36.6 19.4"
        fill="none"
        stroke="#2fa96c"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      <rect x="14" y="30.5" width="36" height="19.5" rx="4.5" fill="#ffffff" />
      <rect x="24" y="33.5" width="16" height="3" rx="1.5" fill="#274f80" />
      <path
        d="M26 42.5 L30 46.5 L38.5 37.5"
        fill="none"
        stroke="#2fa96c"
        strokeWidth="2.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};
