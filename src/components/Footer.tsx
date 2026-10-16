"use client";

import React from "react";

export const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-orange-600 text-white py-3 px-4 text-xs font-semibold select-none border-t-2 border-orange-700">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-left">
        <div>
          <span>Sistema Institucional de Votaciones Estudiantiles Grado 11</span>
          <span className="hidden sm:inline"> • </span>
          <span className="text-orange-100">Institución Prueba</span>
        </div>
        <div className="text-orange-100 font-mono text-[11px]">
          Créditos : Edwin Pacheco Figueroa | edwin.f.pacheco@gmail.com
        </div>
      </div>
    </footer>
  );
};
