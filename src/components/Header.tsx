"use client";

import React from "react";
import { Vote, Shield, User, Monitor, AlertCircle, RefreshCw } from "lucide-react";

interface HeaderProps {
  institutionName?: string;
  year?: number;
  currentStudent?: {
    fullName: string;
    documentId: string;
    groupName: string;
  } | null;
  isAdmin?: boolean;
  onOpenAdminLogin?: () => void;
  onLogout?: () => void;
  electionStatus?: string;
  kioskMode?: boolean;
  onToggleKiosk?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  institutionName = "Institución Prueba",
  year = 2026,
  currentStudent,
  isAdmin,
  onOpenAdminLogin,
  onLogout,
  electionStatus = "active",
  kioskMode,
  onToggleKiosk,
}) => {
  return (
    <header className="w-full shadow-md select-none">
      {/* Top Banner with Institution Color Gradient */}
      <div className="bg-gradient-to-r from-brand-700 via-brand-600 to-grape-500 text-white px-4 py-3 md:px-8 border-b-4 border-brand-300">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
          
          {/* Institution Crest & Title */}
          <div className="flex items-center space-x-3 text-center md:text-left">
            {/* Left Institutional Badge */}
            <div className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-white text-brand-700 flex items-center justify-center font-black text-xl shadow-lg border-2 border-brand-200 shrink-0 animate-floaty">
              <span className="text-2xl">🎓</span>
            </div>

            <div>
              <div className="flex items-center space-x-2 justify-center md:justify-start">
                <span className="bg-white/90 text-brand-800 font-extrabold text-xs px-2.5 py-0.5 rounded-full shadow-sm uppercase tracking-wide">
                  DIRECCIÓN DE BIENESTAR SOCIAL
                </span>
                {electionStatus === "paused" && (
                  <span className="bg-amber-500 text-white text-xs px-2 py-0.5 rounded flex items-center gap-1 font-semibold">
                    <AlertCircle className="w-3 h-3" /> VOTACIÓN PAUSADA
                  </span>
                )}
                {electionStatus === "closed" && (
                  <span className="bg-red-600 text-white text-xs px-2 py-0.5 rounded font-semibold">
                    JORNADA FINALIZADA
                  </span>
                )}
              </div>
              <h1 className="text-xl md:text-3xl font-black tracking-tight text-white drop-shadow-sm font-sans uppercase mt-0.5">
                SISTEMA DE VOTACIONES {year}
              </h1>
              <p className="text-xs md:text-sm text-brand-100 font-medium">
                {institutionName} • Elección de Personería y Contraloría Estudiantil
              </p>
            </div>
          </div>

          {/* Right Badge / Student Info / Admin Quick Nav */}
          <div className="flex items-center gap-3">
            {currentStudent ? (
              <div className="bg-brand-800/80 border border-brand-300/60 rounded-2xl px-4 py-2 text-right shadow-inner flex items-center space-x-3">
                <div className="hidden sm:block">
                  <span className="text-[10px] uppercase font-bold text-gray-200 tracking-wider block">
                    BIENVENIDO ESTUDIANTE:
                  </span>
                  <span className="text-sm font-bold text-white block uppercase max-w-[200px] truncate">
                    {currentStudent.fullName}
                  </span>
                  <span className="text-[11px] text-brand-200">
                    ID: {currentStudent.documentId} | Grado: {currentStudent.groupName}
                  </span>
                </div>
                <div className="w-10 h-10 rounded-full bg-brand-500 border-2 border-white flex items-center justify-center text-white font-bold text-lg shadow">
                  <User className="w-6 h-6" />
                </div>
                {onLogout && (
                  <button
                    onClick={onLogout}
                    className="text-xs text-gray-200 hover:text-white underline font-semibold ml-2 cursor-pointer"
                    title="Salir de la sesión"
                  >
                    Salir
                  </button>
                )}
              </div>
            ) : isAdmin ? (
              <div className="flex items-center gap-2">
                <span className="bg-gray-100 text-brand-900 text-xs font-bold px-3 py-1.5 rounded-md flex items-center gap-1.5 shadow">
                  <Shield className="w-4 h-4 text-brand-800" /> ADMIN CONECTADO
                </span>
                {onLogout && (
                  <button
                    onClick={onLogout}
                    className="bg-brand-950 hover:bg-brand-900 text-white text-xs px-3 py-1.5 rounded border border-brand-600 font-medium cursor-pointer"
                  >
                    Cerrar Sesión
                  </button>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                {onToggleKiosk && (
                  <button
                    onClick={onToggleKiosk}
                    className={`text-xs px-3 py-1.5 rounded-md font-bold transition flex items-center gap-1 cursor-pointer border ${
                      kioskMode
                        ? "bg-gray-200 text-brand-950 border-gray-300"
                        : "bg-brand-800 text-brand-100 hover:bg-brand-900 border-brand-600"
                    }`}
                  >
                    <Monitor className="w-3.5 h-3.5" />
                    {kioskMode ? "Salir Modo Kiosco" : "Modo Kiosco / Mesa"}
                  </button>
                )}
                {onOpenAdminLogin && (
                  <button
                    onClick={onOpenAdminLogin}
                    className="bg-gray-100 hover:bg-white text-brand-950 text-xs font-black px-3 py-1.5 rounded-md shadow transition flex items-center gap-1.5 cursor-pointer"
                  >
                    <Shield className="w-3.5 h-3.5 text-brand-800" />
                    Ingreso Admin
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
