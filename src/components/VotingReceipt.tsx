"use client";

import React, { useEffect } from "react";
import confetti from "canvas-confetti";
import { CheckCircle2, Printer, ArrowRight, ShieldCheck, Download, Award, Calendar, Hash, UserCheck } from "lucide-react";

interface VotingReceiptProps {
  receipt: {
    documentId: string;
    fullName: string;
    grade: string;
    groupName: string;
    votedAt: string | Date;
    verificationCode: string;
    institutionName?: string;
    year?: number;
  };
  onDone: () => void;
  autoResetSeconds?: number | null;
}

export const VotingReceipt: React.FC<VotingReceiptProps> = ({
  receipt,
  onDone,
  autoResetSeconds,
}) => {
  const [countdown, setCountdown] = React.useState<number | null>(autoResetSeconds || null);

  useEffect(() => {
    // Fire festive confetti effect
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#ea580c", "#fdba74", "#9ca3af", "#ffffff"],
      });
    } catch (e) {
      // ignore
    }
  }, []);

  useEffect(() => {
    if (countdown === null) return;

    if (countdown <= 0) {
      onDone();
      return;
    }

    const timer = setInterval(() => {
      setCountdown((prev) => (prev !== null && prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, [countdown, onDone]);

  const handlePrint = () => {
    window.print();
  };

  const formattedDate = new Date(receipt.votedAt).toLocaleString("es-CO", {
    dateStyle: "full",
    timeStyle: "medium",
  });

  return (
    <div className="w-full max-w-xl mx-auto py-8 px-4 animate-fadeIn">
      {/* Printable Certificate Box */}
      <div className="bg-white rounded-3xl shadow-2xl border-4 border-orange-600 overflow-hidden print:border-2 print:shadow-none">
        
        {/* Banner Header */}
        <div className="bg-gradient-to-r from-orange-800 to-orange-500 text-white p-6 text-center border-b-4 border-gray-200">
          <div className="w-12 h-12 bg-white text-orange-700 rounded-full flex items-center justify-center mx-auto mb-2 font-black shadow-md border-2 border-gray-200">
            <CheckCircle2 className="w-8 h-8 text-orange-600" />
          </div>
          <span className="bg-gray-100 text-orange-900 font-black text-[10px] px-2.5 py-0.5 rounded uppercase tracking-wider">
            COMPROBANTE OFICIAL DE VOTACIÓN
          </span>
          <h2 className="text-xl md:text-2xl font-black tracking-wide uppercase mt-1">
            VOTO REGISTRADO CON ÉXITO
          </h2>
          <p className="text-xs text-orange-100 font-medium">
            {receipt.institutionName || "Institución Prueba"}
          </p>
        </div>

        {/* Certificate Body */}
        <div className="p-6 md:p-8 space-y-6">
          <div className="bg-orange-50/80 p-4 rounded-2xl border border-orange-200 text-center">
            <p className="text-xs font-semibold text-orange-900">
              Se ha ejercido satisfactoriamente el derecho al voto democrático para la elección de Gobierno Escolar {receipt.year || 2026}.
            </p>
          </div>

          <div className="space-y-4 text-xs md:text-sm">
            <div className="flex items-center justify-between border-b border-gray-200 pb-2.5">
              <span className="text-gray-500 font-medium flex items-center gap-1.5">
                <UserCheck className="w-4 h-4 text-orange-600" /> Estudiante Votante:
              </span>
              <span className="font-extrabold text-gray-900 uppercase">{receipt.fullName}</span>
            </div>

            <div className="flex items-center justify-between border-b border-gray-200 pb-2.5">
              <span className="text-gray-500 font-medium flex items-center gap-1.5">
                <Hash className="w-4 h-4 text-orange-600" /> Documento / Tarjeta:
              </span>
              <span className="font-mono font-bold text-gray-900">{receipt.documentId}</span>
            </div>

            <div className="flex items-center justify-between border-b border-gray-200 pb-2.5">
              <span className="text-gray-500 font-medium flex items-center gap-1.5">
                <Award className="w-4 h-4 text-orange-600" /> Grado / Curso:
              </span>
              <span className="font-bold text-gray-900">Grado {receipt.grade} ({receipt.groupName})</span>
            </div>

            <div className="flex items-center justify-between border-b border-gray-200 pb-2.5">
              <span className="text-gray-500 font-medium flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-orange-600" /> Fecha y Hora:
              </span>
              <span className="font-medium text-gray-900 text-[11px] sm:text-xs text-right capitalize">
                {formattedDate}
              </span>
            </div>
          </div>

          {/* Unique Code & QR Simulation */}
          <div className="flex items-center justify-between bg-gray-900 text-white p-4 rounded-2xl shadow-inner">
            <div>
              <span className="text-[10px] text-orange-300 font-bold uppercase tracking-wider block">
                CÓDIGO DE VERIFICACIÓN ELECTORAL:
              </span>
              <span className="text-base sm:text-lg font-mono font-black text-white tracking-widest block">
                {receipt.verificationCode}
              </span>
              <span className="text-[9px] text-gray-400 mt-0.5 block">
                Garantía de Voto Secreto, Seguro y Único
              </span>
            </div>

            {/* Simulated Digital Stamp / QR */}
            <div className="w-16 h-16 bg-white rounded-lg p-1.5 flex flex-col items-center justify-center shrink-0 border-2 border-orange-400">
              <div className="w-full h-full bg-gray-900 p-1 flex flex-wrap gap-0.5 rounded justify-center items-center">
                <div className="w-3 h-3 bg-orange-500 rounded-sm"></div>
                <div className="w-3 h-3 bg-white rounded-sm"></div>
                <div className="w-3 h-3 bg-white rounded-sm"></div>
                <div className="w-3 h-3 bg-orange-500 rounded-sm"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Controls (Hidden in Print) */}
        <div className="bg-gray-100 p-4 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-3 print:hidden">
          <button
            onClick={handlePrint}
            className="w-full sm:w-auto px-4 py-2.5 bg-gray-800 hover:bg-black text-white font-bold text-xs rounded-xl shadow transition cursor-pointer flex items-center justify-center gap-1.5"
          >
            <Printer className="w-4 h-4" />
            Imprimir Comprobante
          </button>

          <button
            onClick={onDone}
            className="w-full sm:w-auto px-6 py-2.5 bg-orange-600 hover:bg-orange-700 text-white font-black text-xs uppercase tracking-wider rounded-xl shadow-lg border border-orange-800 transition cursor-pointer flex items-center justify-center gap-1.5"
          >
            {countdown !== null ? (
              <span>Siguiente Votante ({countdown}s)</span>
            ) : (
              <span>Finalizar / Salir</span>
            )}
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
