"use client";

import React from "react";
import { Printer, Shield, CheckCircle, FileText, X } from "lucide-react";

interface PrintableActaProps {
  isOpen: boolean;
  onClose: () => void;
  dashboardData: any;
}

export const PrintableActa: React.FC<PrintableActaProps> = ({
  isOpen,
  onClose,
  dashboardData,
}) => {
  if (!isOpen || !dashboardData) return null;

  const { election, stats, positionResults } = dashboardData;
  const currentDate = new Date().toLocaleDateString("es-CO", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 overflow-y-auto animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full my-8 overflow-hidden border border-gray-300 print:shadow-none print:m-0 print:w-full print:max-w-none">
        
        {/* Modal Controls (Hidden in Print) */}
        <div className="bg-gray-900 text-white p-4 flex items-center justify-between print:hidden">
          <div className="flex items-center space-x-2">
            <FileText className="w-5 h-5 text-orange-400" />
            <h3 className="font-bold text-sm uppercase">Vista Previa - Acta Oficial de Escrutinio</h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => window.print()}
              className="bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold px-4 py-2 rounded-lg flex items-center gap-1.5 shadow cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              Imprimir / Guardar PDF
            </button>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white p-1 rounded-full cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Formal Printable Document Content */}
        <div className="p-8 md:p-12 space-y-8 bg-white text-gray-900 font-serif print:p-6">
          
          {/* Institution Header */}
          <div className="text-center border-b-2 border-orange-700 pb-6">
            <div className="w-16 h-16 bg-orange-700 text-white rounded-full flex items-center justify-center mx-auto mb-3 font-bold text-2xl border-2 border-gray-200">
              🎓
            </div>
            <h1 className="text-xl md:text-2xl font-black uppercase text-orange-950 font-sans tracking-wide">
              {election?.institutionName || "COLEGIO NUESTRA SEÑORA DE LAS LAJAS - PASTO"}
            </h1>
            <h2 className="text-base font-bold uppercase text-gray-700 mt-1 font-sans">
              ACTA OFICIAL DE ESCRUTINIO FINAL Y DECLARACIÓN DE GANADORES
            </h2>
            <p className="text-xs italic text-gray-600 mt-1">
              Elecciones de Personería y Contraloría Estudiantil - Año Lectivo {election?.year || 2026}
            </p>
          </div>

          {/* Context & Date */}
          <div className="text-xs md:text-sm leading-relaxed space-y-2 font-sans">
            <p>
              En la ciudad de Pasto, el día <strong className="capitalize">{currentDate}</strong>, siendo las horas de cierre de la jornada electoral digital, se procedió a realizar la consolidación del escrutinio final para los cargos de representación estudiantil de la institución educativa.
            </p>
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 grid grid-cols-2 md:grid-cols-4 gap-4 text-center my-4 font-mono text-xs">
              <div>
                <span className="text-gray-500 block">Total Censo:</span>
                <span className="font-bold text-base text-gray-900">{stats?.totalStudents || 0}</span>
              </div>
              <div>
                <span className="text-gray-500 block">Total Votos Emitidos:</span>
                <span className="font-bold text-base text-orange-700">{stats?.votedStudents || 0}</span>
              </div>
              <div>
                <span className="text-gray-500 block">Abstención / Pendientes:</span>
                <span className="font-bold text-base text-amber-700">{stats?.pendingStudents || 0}</span>
              </div>
              <div>
                <span className="text-gray-500 block">Participación:</span>
                <span className="font-bold text-base text-orange-700">{stats?.participationPercentage || 0}%</span>
              </div>
            </div>
          </div>

          {/* Candidate Results Tables */}
          {positionResults?.map((posResult: any) => (
            <div key={posResult.id} className="space-y-3 font-sans">
              <div className="bg-orange-700 text-white px-4 py-2 rounded-t-lg flex justify-between items-center">
                <h3 className="font-black text-sm uppercase">{posResult.name}</h3>
                <span className="text-xs bg-gray-100 text-orange-900 px-2 py-0.5 rounded font-bold">
                  Total Votos: {posResult.totalVotes}
                </span>
              </div>

              <table className="w-full text-xs text-left border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-gray-100 text-gray-700 uppercase">
                    <th className="p-2.5 border border-gray-300">N° Tarjetón</th>
                    <th className="p-2.5 border border-gray-300">Candidato / Opción</th>
                    <th className="p-2.5 border border-gray-300 text-right">Votos Obtenidos</th>
                    <th className="p-2.5 border border-gray-300 text-right">Porcentaje (%)</th>
                    <th className="p-2.5 border border-gray-300 text-center">Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {posResult.candidates.map((cand: any, idx: number) => {
                    const isWinner = idx === 0 && posResult.totalVotes > 0 && !cand.isBlank;
                    return (
                      <tr key={cand.id} className={isWinner ? "bg-orange-50 font-bold" : "hover:bg-gray-50"}>
                        <td className="p-2.5 border border-gray-300 font-mono">N° {cand.number}</td>
                        <td className="p-2.5 border border-gray-300 uppercase">
                          {cand.name}
                          {cand.isBlank && <span className="text-gray-500 text-[10px] lowercase ml-1">(voto en blanco)</span>}
                        </td>
                        <td className="p-2.5 border border-gray-300 text-right font-mono text-sm">{cand.votesCount}</td>
                        <td className="p-2.5 border border-gray-300 text-right font-mono">{cand.percentage}%</td>
                        <td className="p-2.5 border border-gray-300 text-center">
                          {isWinner ? (
                            <span className="bg-orange-600 text-white text-[10px] font-black px-2 py-0.5 rounded uppercase">
                              ★ ELECTO(A)
                            </span>
                          ) : cand.isBlank ? (
                            <span className="text-gray-500 text-[10px]">Blanco</span>
                          ) : (
                            <span className="text-gray-400 text-[10px]">-</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>

              {posResult.winner && !posResult.winner.isBlank && posResult.totalVotes > 0 && (
                <div className="bg-orange-50 border border-orange-300 p-3 rounded-b-lg text-xs font-semibold text-orange-950 flex items-center justify-between">
                  <span>CANDIDATO(A) ELECTO(A) PARA {posResult.name.toUpperCase()}:</span>
                  <span className="font-extrabold text-sm text-orange-900 uppercase">
                    {posResult.winner.name} (N° {posResult.winner.number}) con {posResult.winner.votesCount} votos ({posResult.winner.percentage}%)
                  </span>
                </div>
              )}
            </div>
          ))}

          {/* Verification Signature Block */}
          <div className="pt-12 font-sans text-xs space-y-12 border-t border-gray-300">
            <p className="text-gray-600 italic text-center">
              En constancia de lo anterior, firman los miembros integrantes del Comité Electoral e Institucional:
            </p>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-8 pt-8 text-center">
              <div className="border-t border-black pt-2">
                <p className="font-bold uppercase">Rectora / Director</p>
                <p className="text-[10px] text-gray-500">Representante Legal Institucional</p>
              </div>

              <div className="border-t border-black pt-2">
                <p className="font-bold uppercase">Jurado Docente Principal</p>
                <p className="text-[10px] text-gray-500">Coordinador de Democracia Escolar</p>
              </div>

              <div className="border-t border-black pt-2">
                <p className="font-bold uppercase">Jurado Estudiantil</p>
                <p className="text-[10px] text-gray-500">Delegado de Grado 11</p>
              </div>
            </div>
          </div>

          {/* Footer stamp */}
          <div className="text-center text-[10px] text-gray-400 font-mono pt-4 border-t border-gray-200">
            Sistema Digital de Votaciones Estudiantiles • Documento generado automáticamente • HASH-VERIFY-{Date.now().toString(36).toUpperCase()}
          </div>
        </div>
      </div>
    </div>
  );
};
