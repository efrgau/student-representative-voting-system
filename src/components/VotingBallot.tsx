"use client";

import React, { useState } from "react";
import { Check, Info, Award, User, ShieldCheck, AlertCircle, FileText } from "lucide-react";
import { ProposalModal } from "./ProposalModal";

export interface CandidateItem {
  id: number;
  number: string;
  name: string;
  photoUrl?: string;
  slogan?: string;
  proposals: string[];
  isBlank: boolean;
}

export interface PositionBallot {
  id: number;
  name: string;
  description?: string;
  candidates: CandidateItem[];
}

interface VotingBallotProps {
  positions: PositionBallot[];
  onSubmitVotes: (selectedMap: Record<number, number>) => void;
  isSubmitting: boolean;
  year?: number;
}

export const VotingBallot: React.FC<VotingBallotProps> = ({
  positions,
  onSubmitVotes,
  isSubmitting,
  year = 2026,
}) => {
  // Map of positionId -> candidateId
  const [selectedCandidates, setSelectedCandidates] = useState<Record<number, number>>({});
  const [modalCandidate, setModalCandidate] = useState<CandidateItem & { positionName: string } | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const handleSelect = (positionId: number, candidateId: number) => {
    setSelectedCandidates((prev) => ({
      ...prev,
      [positionId]: candidateId,
    }));
  };

  const allSelected = positions.length > 0 && positions.every((p) => selectedCandidates[p.id] !== undefined);

  const handleConfirmSubmit = () => {
    onSubmitVotes(selectedCandidates);
    setShowConfirmModal(false);
  };

  return (
    <div className="w-full max-w-7xl mx-auto py-4 px-2 sm:px-6">
      
      {/* Top Ballot Header Banner matching Screenshot 2 */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 mb-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-orange-600" />
            <div>
              <h2 className="text-base sm:text-lg font-black text-gray-900 uppercase">
                Tarjetón Electoral de Votación Digital {year}
              </h2>
              <p className="text-xs text-gray-600">
                Haz clic sobre el candidato de tu preferencia en cada categoría para seleccionar tu voto.
              </p>
            </div>
          </div>

          <div className="bg-orange-50 border border-orange-300 text-orange-800 px-3 py-1.5 rounded-lg text-xs font-bold">
            Categorías: {Object.keys(selectedCandidates).length} / {positions.length} completadas
          </div>
        </div>
      </div>

      {/* Main Grid / Columns layout - Side by Side on Desktop matching Screenshot 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 relative items-stretch">
        
        {positions.map((pos, posIdx) => {
          const selectedId = selectedCandidates[pos.id];

          return (
            <div
              key={pos.id}
              className={`bg-white rounded-2xl shadow-md border border-gray-200 p-4 sm:p-6 flex flex-col justify-between relative ${
                posIdx < positions.length - 1 ? "lg:border-r lg:border-r-gray-300" : ""
              }`}
            >
              <div>
                {/* Category Header Banner */}
                <div className="border-b-2 border-gray-900 pb-3 mb-6">
                  <h3 className="text-xs sm:text-sm md:text-base font-black text-gray-900 uppercase tracking-tight font-sans">
                    SELECCIONA TU CANDIDATO PARA {pos.name}:
                  </h3>
                  {pos.description && (
                    <p className="text-[11px] text-gray-500 mt-0.5">{pos.description}</p>
                  )}
                </div>

                {/* Candidate Cards Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-6 justify-center">
                  {pos.candidates.map((cand) => {
                    const isSelected = selectedId === cand.id;

                    return (
                      <div
                        key={cand.id}
                        onClick={() => handleSelect(pos.id, cand.id)}
                        className={`group relative flex flex-col items-center bg-white rounded-lg p-2.5 sm:p-3 transition-all cursor-pointer select-none border-2 ${
                          isSelected
                            ? "border-orange-600 ring-4 ring-orange-400/50 shadow-2xl scale-[1.02] bg-orange-50/40"
                            : "border-black hover:border-orange-600 hover:shadow-lg hover:scale-[1.01]"
                        }`}
                      >
                        {/* Number Badge */}
                        <div className={`absolute -top-3 left-3 px-2 py-0.5 rounded text-xs font-black shadow z-10 ${
                          cand.isBlank ? "bg-gray-800 text-white" : "bg-black text-white"
                        }`}>
                          N° {cand.number}
                        </div>

                        {/* Selected Checkmark Badge */}
                        {isSelected && (
                          <div className="absolute -top-3 -right-2 bg-orange-600 text-white rounded-full p-1 shadow-lg z-10 animate-bounce">
                            <Check className="w-4 h-4 stroke-[3]" />
                          </div>
                        )}

                        {/* Candidate Image Container matching Screenshot Frame */}
                        <div className="w-full aspect-[3/4] max-h-48 sm:max-h-56 bg-gray-100 rounded border border-gray-400 overflow-hidden mb-3 relative flex items-center justify-center">
                          {cand.photoUrl ? (
                            <img
                              src={cand.photoUrl}
                              alt={cand.name}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          ) : cand.isBlank ? (
                            <div className="w-full h-full bg-gray-100 flex flex-col items-center justify-center text-gray-500 p-2 text-center">
                              <FileText className="w-12 h-12 stroke-1 text-gray-400 mb-1" />
                              <span className="text-xs font-black text-gray-700">VOTO EN BLANCO</span>
                            </div>
                          ) : (
                            <div className="w-full h-full bg-orange-50 flex items-center justify-center text-orange-600">
                              <User className="w-16 h-16 stroke-1" />
                            </div>
                          )}
                        </div>

                        {/* Candidate Full Name */}
                        <div className="text-center w-full min-h-[44px] flex flex-col items-center justify-start">
                          <p className={`text-xs sm:text-sm font-extrabold uppercase leading-tight ${
                            isSelected ? "text-orange-900" : "text-gray-900"
                          }`}>
                            {cand.name}
                          </p>
                          {cand.slogan && !cand.isBlank && (
                            <p className="text-[10px] text-gray-500 line-clamp-1 italic mt-1">
                              &ldquo;{cand.slogan}&rdquo;
                            </p>
                          )}
                        </div>

                        {/* Action buttons on card */}
                        <div className="w-full mt-3 pt-2 border-t border-gray-200 flex items-center justify-between gap-1">
                          {!cand.isBlank && (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setModalCandidate({ ...cand, positionName: pos.name });
                              }}
                              className="text-[10px] text-orange-700 hover:text-orange-900 font-bold hover:underline flex items-center gap-0.5"
                            >
                              <Info className="w-3 h-3 text-orange-600" />
                              Propuestas
                            </button>
                          )}

                          <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded ${
                            isSelected ? "bg-orange-600 text-white" : "bg-gray-100 text-gray-700"
                          }`}>
                            {isSelected ? "SELECCIONADO" : "ELEGIR"}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Status footer for this category */}
              <div className="mt-6 pt-3 border-t border-gray-200 text-center">
                {selectedId ? (
                  <span className="text-xs font-bold text-orange-700 bg-orange-50 px-3 py-1.5 rounded-full border border-orange-200 inline-flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-orange-600" />
                    Selección lista para {pos.name}
                  </span>
                ) : (
                  <span className="text-xs font-semibold text-amber-700 bg-amber-50 px-3 py-1.5 rounded-full border border-amber-200 inline-flex items-center gap-1.5">
                    <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                    Por favor haz clic sobre tu candidato de preferencia
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Floating / Bottom Submit Button Bar */}
      <div className="mt-8 sticky bottom-4 z-30 bg-gray-100/95 backdrop-blur-md p-4 rounded-2xl shadow-2xl border-2 border-orange-600 max-w-2xl mx-auto text-center">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-left">
            <h4 className="text-xs font-extrabold uppercase text-gray-600 tracking-wider">
              Estado de tu Selección:
            </h4>
            <p className="text-sm font-bold text-gray-900">
              {allSelected ? (
                <span className="text-orange-700 flex items-center gap-1">
                  <Check className="w-4 h-4 text-orange-600 stroke-[3]" />
                  Todas las categorías fueron seleccionadas
                </span>
              ) : (
                <span className="text-amber-700">
                  Falta elegir candidato en {positions.length - Object.keys(selectedCandidates).length} categoría(s)
                </span>
              )}
            </p>
          </div>

          <button
            type="button"
            disabled={!allSelected || isSubmitting}
            onClick={() => setShowConfirmModal(true)}
            className="w-full sm:w-auto px-8 py-3.5 bg-orange-600 hover:bg-orange-700 text-white font-black text-sm md:text-base uppercase tracking-wider rounded-xl shadow-lg border-2 border-orange-800 disabled:opacity-50 disabled:cursor-not-allowed transition transform active:scale-95 cursor-pointer flex items-center justify-center gap-2"
          >
            <Award className="w-5 h-5 text-gray-100" />
            REGISTRAR Y EMITIR VOTO
          </button>
        </div>
      </div>

      {/* Candidate Proposal Detail Modal */}
      <ProposalModal
        isOpen={!!modalCandidate}
        onClose={() => setModalCandidate(null)}
        candidate={modalCandidate}
        onSelectCandidate={() => {
          if (modalCandidate) {
            // Find position id for this candidate
            const targetPos = positions.find((p) => p.candidates.some((c) => c.id === modalCandidate.id));
            if (targetPos) {
              handleSelect(targetPos.id, modalCandidate.id);
            }
          }
        }}
        isSelected={modalCandidate ? selectedCandidates[positions.find((p) => p.candidates.some((c) => c.id === modalCandidate.id))?.id || 0] === modalCandidate.id : false}
      />

      {/* Vote Double Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6 border-2 border-orange-600">
            <div className="text-center">
              <div className="w-14 h-14 bg-orange-100 text-orange-700 rounded-full flex items-center justify-center mx-auto mb-3 border-2 border-orange-500">
                <ShieldCheck className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-black text-gray-900 uppercase">
                ¿Confirmar Emisión de Voto?
              </h3>
              <p className="text-xs text-gray-600 mt-1">
                Por favor verifica tus elecciones antes de confirmar. Tu voto quedará registrado de forma secreta e inmutable.
              </p>
            </div>

            {/* Selected candidates summary */}
            <div className="my-5 space-y-3 bg-orange-50/80 p-4 rounded-xl border border-orange-200">
              {positions.map((pos) => {
                const candId = selectedCandidates[pos.id];
                const cand = pos.candidates.find((c) => c.id === candId);
                return (
                  <div key={pos.id} className="flex items-center justify-between border-b border-orange-200/60 pb-2 last:border-0 last:pb-0">
                    <div>
                      <span className="text-[11px] font-bold text-orange-800 uppercase block">
                        {pos.name}:
                      </span>
                      <span className="text-sm font-black text-gray-900">
                        {cand?.name || "Sin Selección"}
                      </span>
                    </div>
                    <span className="bg-orange-600 text-white font-mono font-bold text-xs px-2.5 py-1 rounded">
                      N° {cand?.number}
                    </span>
                  </div>
                );
              })}
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowConfirmModal(false)}
                className="w-full sm:w-auto px-5 py-2.5 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold text-xs rounded-xl cursor-pointer"
              >
                Volver y Cambiar
              </button>
              <button
                type="button"
                disabled={isSubmitting}
                onClick={handleConfirmSubmit}
                className="w-full sm:w-auto px-6 py-2.5 bg-orange-600 hover:bg-orange-700 text-white font-black text-xs uppercase tracking-wider rounded-xl shadow-lg border-2 border-orange-800 cursor-pointer flex items-center justify-center gap-2"
              >
                {isSubmitting ? "Procesando..." : "Sí, Confirmar Mi Voto"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
