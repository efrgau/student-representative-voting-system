"use client";

import React, { useState } from "react";
import { Vote, Lock, AlertTriangle, CheckCircle, Search, HelpCircle, ArrowRight } from "lucide-react";

interface StudentLoginProps {
  onSubmitDoc: (docId: string) => Promise<void>;
  isLoading: boolean;
  errorMessage?: string | null;
  onOpenAdminModal: () => void;
  onVerifyReceipt: (query: string) => void;
}

export const StudentLogin: React.FC<StudentLoginProps> = ({
  onSubmitDoc,
  isLoading,
  errorMessage,
  onOpenAdminModal,
  onVerifyReceipt,
}) => {
  const [docId, setDocId] = useState("");
  const [checkReceiptDoc, setCheckReceiptDoc] = useState("");
  const [showReceiptInput, setShowReceiptInput] = useState(false);

  const sampleStudents = [
    { doc: "1085234543", name: "EDWIN PACHECO FIGUEROA", grade: "11-1" },
    { doc: "1085299102", name: "MARÍA ALEJANDRA BENAVIDES", grade: "11-1" },
    { doc: "1085312489", name: "CARLOS ANDRÉS VILLOTA", grade: "11-1" },
    { doc: "1085421990", name: "DANIELA FERNANDA GUERRERO", grade: "11-2" },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!docId.trim()) return;
    onSubmitDoc(docId.trim());
  };

  const handleSelectSample = (sampleDoc: string) => {
    setDocId(sampleDoc);
    onSubmitDoc(sampleDoc);
  };

  return (
    <div className="w-full flex flex-col items-center justify-center py-6 px-4">
      {/* Main Form Card matching reference Image 1 */}
      <div className="w-full max-w-lg bg-gray-100 border-2 border-orange-600/30 rounded-2xl shadow-xl p-6 md:p-8 text-center transition-all">
        <h2 className="text-lg md:text-xl font-extrabold text-orange-950 mb-6 font-sans">
          Escribe tu número de identificación:
        </h2>

        {errorMessage && (
          <div className="mb-5 bg-red-100 border-2 border-red-400 text-red-800 px-4 py-3 rounded-lg text-sm font-semibold flex items-center gap-2 text-left animate-shake">
            <AlertTriangle className="w-5 h-5 shrink-0 text-red-600" />
            <div>{errorMessage}</div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <label htmlFor="student-id-input" className="text-orange-950 font-black text-sm md:text-base tracking-wider uppercase">
              NÚMERO:
            </label>
            <input
              id="student-id-input"
              type="text"
              pattern="[0-9]*"
              inputMode="numeric"
              value={docId}
              onChange={(e) => setDocId(e.target.value)}
              placeholder="1085234543"
              autoFocus
              className="w-full sm:w-64 px-4 py-2.5 text-center text-xl md:text-2xl font-bold bg-white text-gray-900 border-2 border-black rounded-md focus:outline-none focus:ring-4 focus:ring-orange-500 shadow-inner"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading || !docId.trim()}
            className="w-full sm:w-64 mx-auto py-3 px-6 bg-orange-600 hover:bg-orange-700 text-white font-black text-base md:text-lg border-2 border-orange-800 rounded-xl shadow-md hover:shadow-lg active:scale-95 transition-transform duration-150 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 uppercase tracking-wider"
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <span className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin"></span>
                VERIFICANDO...
              </span>
            ) : (
              "VOTAR AQUÍ"
            )}
          </button>
        </form>

        {/* Demo Fast Selector Helper */}
        <div className="mt-8 pt-6 border-t border-orange-700/20 text-left">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-orange-900 uppercase tracking-wide flex items-center gap-1">
              ⚡ Estudiantes Demo (Clic para Probar):
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {sampleStudents.map((s) => (
              <button
                key={s.doc}
                type="button"
                onClick={() => handleSelectSample(s.doc)}
                className="bg-white/80 hover:bg-white text-orange-950 text-xs font-semibold p-2.5 rounded-lg border border-orange-400/60 hover:border-orange-600 shadow-sm flex items-center justify-between transition text-left cursor-pointer"
              >
                <div>
                  <div className="font-bold text-orange-900 truncate max-w-[150px]">{s.name}</div>
                  <div className="text-[10px] text-orange-700 font-mono">ID: {s.doc} ({s.grade})</div>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-orange-600 shrink-0 ml-1" />
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Auxiliary links section */}
      <div className="mt-6 flex flex-wrap items-center justify-center gap-4 text-xs font-semibold text-orange-900">
        <button
          onClick={() => setShowReceiptInput(!showReceiptInput)}
          className="hover:underline flex items-center gap-1 cursor-pointer bg-gray-100 px-3 py-1.5 rounded-full border border-gray-300"
        >
          <Search className="w-3.5 h-3.5" />
          Consultar Comprobante de Voto
        </button>

        <button
          onClick={onOpenAdminModal}
          className="hover:underline flex items-center gap-1 cursor-pointer bg-orange-700 text-white px-3 py-1.5 rounded-full border border-orange-900"
        >
          <Lock className="w-3.5 h-3.5" />
          Acceso Administrador
        </button>
      </div>

      {/* Modal / Collapse for Certificate lookup */}
      {showReceiptInput && (
        <div className="mt-4 max-w-md w-full bg-white p-4 rounded-xl border border-gray-300 shadow-lg animate-fadeIn">
          <h4 className="text-xs font-bold text-gray-800 mb-2 flex items-center gap-1">
            <CheckCircle className="w-4 h-4 text-orange-600" />
            Consulta tu Certificado de Votación
          </h4>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Ingresa Documento o Código de Voto"
              value={checkReceiptDoc}
              onChange={(e) => setCheckReceiptDoc(e.target.value)}
              className="flex-1 text-xs px-3 py-2 border rounded-md focus:ring-2 focus:ring-orange-500"
            />
            <button
              onClick={() => {
                if (checkReceiptDoc.trim()) {
                  onVerifyReceipt(checkReceiptDoc.trim());
                }
              }}
              className="bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold px-3 py-2 rounded-md cursor-pointer"
            >
              Consultar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
