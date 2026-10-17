"use client";

import React, { useState } from "react";
import { Shield, Lock, User, X, KeyRound, AlertCircle } from "lucide-react";

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (adminData: any) => void;
}

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
}) => {
  const [username, setUsername] = useState("admin@colegio.edu.co");
  const [password, setPassword] = useState("admin123");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/auth/admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data: any = await res.json();
      if (data.success) {
        onLoginSuccess(data.user);
        onClose();
      } else {
        setError(data.error || "Credenciales incorrectas");
      }
    } catch (err: any) {
      setError("Error al conectar con el servidor.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickDemoFill = () => {
    setUsername("admin@colegio.edu.co");
    setPassword("admin123");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 backdrop-blur-sm p-4 animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden border border-gray-200">
        
        {/* Header */}
        <div className="bg-brand-600 text-white p-5 flex items-center justify-between border-b-4 border-brand-100">
          <div className="flex items-center space-x-2">
            <div className="w-9 h-9 bg-white text-brand-700 rounded-xl flex items-center justify-center font-bold">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base uppercase">Acceso Administrador</h3>
              <p className="text-[11px] text-brand-100">Panel de Control & Jurado Electoral</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:bg-brand-500 p-1.5 rounded-full transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="bg-coral-50 border border-coral-200 text-coral-700 px-3.5 py-2.5 rounded-2xl text-xs font-semibold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-coral-500 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
              Usuario Administrador:
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="w-full pl-9 pr-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-brand-500 focus:outline-none"
                placeholder="admin@colegio.edu.co"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
              Contraseña de Seguridad:
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full pl-9 pr-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-brand-500 focus:outline-none"
                placeholder="••••••••"
              />
            </div>
          </div>

          <div className="bg-brand-50 p-3 rounded-lg border border-brand-200 flex items-center justify-between text-xs">
            <span className="text-brand-900 font-semibold">Credenciales demo prellenadas:</span>
            <button
              type="button"
              onClick={handleQuickDemoFill}
              className="text-brand-700 hover:text-brand-900 font-bold underline cursor-pointer"
            >
              Usar Demo
            </button>
          </div>

          <div className="pt-2 flex items-center justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold text-gray-600 hover:bg-gray-100 rounded-lg cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-6 py-2 bg-brand-500 hover:bg-brand-600 text-white font-black text-xs uppercase tracking-wider rounded-2xl shadow border border-brand-300 cursor-pointer disabled:opacity-50"
            >
              {isLoading ? "Ingresando..." : "Iniciar Sesión"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
