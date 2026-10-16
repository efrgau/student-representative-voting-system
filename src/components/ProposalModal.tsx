"use client";

import React from "react";
import { X, CheckCircle2, User, Award, BookOpen } from "lucide-react";

interface ProposalModalProps {
  isOpen: boolean;
  onClose: () => void;
  candidate: {
    number: string;
    name: string;
    photoUrl?: string;
    slogan?: string;
    proposals: string[];
    isBlank?: boolean;
    positionName?: string;
  } | null;
  onSelectCandidate?: () => void;
  isSelected?: boolean;
}

export const ProposalModal: React.FC<ProposalModalProps> = ({
  isOpen,
  onClose,
  candidate,
  onSelectCandidate,
  isSelected,
}) => {
  if (!isOpen || !candidate) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-gray-200">
        
        {/* Header */}
        <div className="bg-orange-700 text-white p-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="bg-gray-100 text-orange-900 font-black text-sm px-2.5 py-0.5 rounded">
              N° {candidate.number}
            </span>
            <h3 className="font-bold text-base md:text-lg truncate max-w-[280px]">
              {candidate.isBlank ? "VOTO EN BLANCO" : candidate.name}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:bg-orange-600 p-1.5 rounded-full transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
          {/* Photo & Slogan */}
          <div className="flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left bg-orange-50 p-4 rounded-xl border border-orange-200">
            {candidate.photoUrl ? (
              <img
                src={candidate.photoUrl}
                alt={candidate.name}
                className="w-24 h-28 object-cover rounded-lg border-2 border-orange-600 shadow"
              />
            ) : (
              <div className="w-24 h-28 bg-orange-100 rounded-lg flex items-center justify-center text-orange-700 font-bold border-2 border-orange-600">
                <User className="w-12 h-12" />
              </div>
            )}

            <div>
              <h4 className="text-lg font-extrabold text-gray-900">{candidate.name}</h4>
              {candidate.slogan && (
                <p className="text-xs italic text-orange-800 font-medium mt-1">
                  &ldquo;{candidate.slogan}&rdquo;
                </p>
              )}
              {candidate.positionName && (
                <span className="inline-block mt-2 text-[11px] font-bold bg-orange-600 text-white px-2 py-0.5 rounded">
                  {candidate.positionName}
                </span>
              )}
            </div>
          </div>

          {/* Proposals List */}
          <div>
            <h5 className="text-sm font-black text-gray-800 uppercase tracking-wide mb-3 flex items-center gap-1.5">
              <BookOpen className="w-4 h-4 text-orange-600" /> Propuestas de Campaña:
            </h5>

            {candidate.proposals && candidate.proposals.length > 0 ? (
              <ul className="space-y-2.5">
                {candidate.proposals.map((prop, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-xs md:text-sm text-gray-700 bg-gray-50 p-3 rounded-lg border border-gray-200">
                    <CheckCircle2 className="w-4 h-4 text-orange-600 shrink-0 mt-0.5" />
                    <span>{prop}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-xs text-gray-500 italic">No hay propuestas adicionales registradas.</p>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-gray-100 border-t border-gray-200 flex items-center justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-bold text-gray-600 hover:bg-gray-200 rounded-lg transition cursor-pointer"
          >
            Cerrar
          </button>

          {onSelectCandidate && (
            <button
              onClick={() => {
                onSelectCandidate();
                onClose();
              }}
              className={`px-5 py-2 text-xs font-black rounded-lg shadow transition cursor-pointer flex items-center gap-1.5 ${
                isSelected
                  ? "bg-gray-800 hover:bg-gray-900 text-white"
                  : "bg-orange-600 hover:bg-orange-700 text-white"
              }`}
            >
              <Award className="w-4 h-4" />
              {isSelected ? "Seleccionado ✓" : "Seleccionar Candidato"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
