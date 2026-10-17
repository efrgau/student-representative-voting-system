"use client";

import React, { useState, useEffect } from "react";
import {
  BarChart3,
  Users,
  UserCheck,
  UserPlus,
  Play,
  Pause,
  Square,
  RefreshCcw,
  FileText,
  Search,
  Plus,
  Trash2,
  Edit,
  RotateCcw,
  Shield,
  CheckCircle2,
  Clock,
  Award,
  Settings,
  AlertTriangle,
  ChevronRight,
  Filter,
} from "lucide-react";
import { PrintableActa } from "./PrintableActa";

interface AdminDashboardProps {
  onLogout: () => void;
  onRefreshBallot?: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onLogout, onRefreshBallot }) => {
  const [activeTab, setActiveTab] = useState<"results" | "students" | "candidates" | "audit">("results");
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Student filter & list states
  const [studentList, setStudentList] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [groupFilter, setGroupFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [showAddStudentModal, setShowAddStudentModal] = useState(false);
  const [newStudent, setNewStudent] = useState({ documentId: "", fullName: "", grade: "11", groupName: "11-1" });

  // Candidate edit state
  const [candidateList, setCandidateList] = useState<any[]>([]);
  const [showAddCandidateModal, setShowAddCandidateModal] = useState(false);
  const [editingCandidateId, setEditingCandidateId] = useState<number | null>(null);
  const [newCandidate, setNewCandidate] = useState({
    positionId: 1,
    number: "",
    name: "",
    photoUrl: "",
    slogan: "",
    proposals: "",
    isBlank: false,
  });

  // Print Acta Modal State
  const [showActaModal, setShowActaModal] = useState(false);

  // Auto-refresh interval for live results
  useEffect(() => {
    fetchDashboardData();
    const interval = setInterval(fetchDashboardData, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (activeTab === "students") {
      fetchStudents();
    } else if (activeTab === "candidates") {
      fetchCandidates();
    }
  }, [activeTab, searchQuery, groupFilter, statusFilter]);

  const fetchDashboardData = async () => {
    try {
      const res = await fetch("/api/admin/dashboard");
      const data: any = await res.json();
      if (data.success) {
        setDashboardData(data);
      }
    } catch (e) {
      // quiet fail for auto-polling
    } finally {
      setIsLoading(false);
    }
  };

  const fetchStudents = async () => {
    try {
      const params = new URLSearchParams();
      if (searchQuery) params.set("search", searchQuery);
      if (groupFilter) params.set("group", groupFilter);
      if (statusFilter) params.set("status", statusFilter);

      const res = await fetch(`/api/admin/students?${params.toString()}`);
      const data: any = await res.json();
      if (data.success) {
        setStudentList(data.students);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const fetchCandidates = async () => {
    try {
      const res = await fetch("/api/admin/candidates");
      const data: any = await res.json();
      if (data.success) {
        setCandidateList(data.candidates);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleOpenCreateCandidate = () => {
    setEditingCandidateId(null);
    setNewCandidate({
      positionId: dashboardData?.positionResults?.[0]?.id || 1,
      number: "",
      name: "",
      photoUrl: "",
      slogan: "",
      proposals: "",
      isBlank: false,
    });
    setShowAddCandidateModal(true);
  };

  const handleOpenEditCandidate = (cand: any) => {
    let proposalsText = "";
    try {
      const parsed = typeof cand.proposals === "string" ? JSON.parse(cand.proposals) : cand.proposals;
      if (Array.isArray(parsed)) proposalsText = parsed.join("\n");
    } catch {
      proposalsText = "";
    }
    setEditingCandidateId(cand.id);
    setNewCandidate({
      positionId: cand.positionId,
      number: cand.number || "",
      name: cand.name || "",
      photoUrl: cand.photoUrl || "",
      slogan: cand.slogan || "",
      proposals: proposalsText,
      isBlank: !!cand.isBlank,
    });
    setShowAddCandidateModal(true);
  };

  const handleSubmitCandidate = async (e: React.FormEvent) => {
    e.preventDefault();
    const isEdit = editingCandidateId !== null;
    try {
      const res = await fetch(
        isEdit ? `/api/admin/candidates/${editingCandidateId}` : "/api/admin/candidates",
        {
          method: isEdit ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newCandidate),
        }
      );
      const data: any = await res.json();
      if (data.success) {
        setShowAddCandidateModal(false);
        setEditingCandidateId(null);
        fetchCandidates();
        fetchDashboardData();
        if (onRefreshBallot) onRefreshBallot();
      } else {
        alert(data.error || "No se pudo guardar el candidato.");
      }
    } catch (e) {
      alert("Error de conexión al guardar el candidato.");
    }
  };

  const handleDeleteCandidate = async (cand: any) => {
    if (!confirm(`¿Eliminar el candidato "${cand.name}" del tarjetón?`)) return;
    try {
      const res = await fetch(`/api/admin/candidates/${cand.id}`, { method: "DELETE" });
      const data: any = await res.json();
      if (data.success) {
        fetchCandidates();
        fetchDashboardData();
        if (onRefreshBallot) onRefreshBallot();
      } else {
        alert(data.error || "No se pudo eliminar el candidato.");
      }
    } catch (e) {
      alert("Error de conexión al eliminar el candidato.");
    }
  };

  const handleStatusChange = async (newStatus: "active" | "paused" | "closed") => {
    try {
      const res = await fetch("/api/admin/election-status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      const data: any = await res.json();
      if (data.success) {
        fetchDashboardData();
        if (onRefreshBallot) onRefreshBallot();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleResetStudentVote = async (studentId: number, name: string) => {
    if (!confirm(`¿Estás seguro de habilitar nuevamente el voto para el estudiante ${name}?`)) return;

    try {
      const res = await fetch(`/api/admin/students/${studentId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "reset_vote" }),
      });
      const data: any = await res.json();
      if (data.success) {
        fetchStudents();
        fetchDashboardData();
        alert(`Voto de ${name} rehabilitado correctamente.`);
      }
    } catch (e) {
      alert("Error al resetear voto.");
    }
  };

  const handleResetAllVotes = async () => {
    if (!confirm("⚠️ ATENCIÓN: ¿Deseas reiniciar TODOS los votos de la elección para pruebas? Esta acción no se puede deshacer.")) return;

    try {
      const res = await fetch("/api/init", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "reset_votes" }),
      });
      const data: any = await res.json();
      if (data.success) {
        fetchDashboardData();
        if (activeTab === "students") fetchStudents();
        alert("Todos los votos fueron reiniciados correctamente.");
      }
    } catch (e) {
      alert("Error al reiniciar votos.");
    }
  };

  const handleCreateStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/admin/students", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newStudent),
      });
      const data: any = await res.json();
      if (data.success) {
        setShowAddStudentModal(false);
        setNewStudent({ documentId: "", fullName: "", grade: "11", groupName: "11-1" });
        fetchStudents();
        fetchDashboardData();
      } else {
        alert(data.error || "Error al agregar estudiante.");
      }
    } catch (e) {
      alert("Error de conexión");
    }
  };

  const handleDeleteStudent = async (studentId: number) => {
    if (!confirm("¿Eliminar este estudiante del censo electoral?")) return;

    try {
      const res = await fetch(`/api/admin/students/${studentId}`, { method: "DELETE" });
      const data: any = await res.json();
      if (data.success) {
        fetchStudents();
        fetchDashboardData();
      }
    } catch (e) {
      alert("Error al eliminar.");
    }
  };

  if (isLoading && !dashboardData) {
    return (
      <div className="w-full min-h-[400px] flex items-center justify-center">
        <div className="flex flex-col items-center space-y-3">
          <div className="w-10 h-10 border-4 border-brand-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm font-bold text-gray-700">Cargando Panel Administrativo...</p>
        </div>
      </div>
    );
  }

  const { election, stats, groupStats, positionResults, recentLogs } = dashboardData || {};
  const positionOptions: { id: number; name: string }[] = (positionResults || []).map((p: any) => ({
    id: p.id,
    name: p.name,
  }));

  return (
    <div className="w-full max-w-7xl mx-auto py-6 px-4 space-y-6">
      
      {/* Admin Control Bar & Status Switcher */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-4 md:p-6">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
          
          <div>
            <div className="flex items-center space-x-2">
              <span className="bg-brand-700 text-gray-100 font-black text-xs px-2.5 py-0.5 rounded uppercase">
                PANEL DE JURADO ELECTORAL
              </span>
              <span className={`text-xs px-2.5 py-0.5 rounded font-bold uppercase ${
                election?.status === "active"
                  ? "bg-green-100 text-green-800 border border-green-300"
                  : election?.status === "paused"
                  ? "bg-amber-100 text-amber-800 border border-amber-300"
                  : "bg-red-100 text-red-800 border border-red-300"
              }`}>
                ESTADO: {election?.status === "active" ? "VOTACIÓN EN CURSO" : election?.status === "paused" ? "PAUSADA" : "FINALIZADA"}
              </span>
            </div>
            <h2 className="text-xl md:text-2xl font-black text-gray-900 mt-1 uppercase">
              {election?.title || "SISTEMA DE VOTACIONES 2026"}
            </h2>
          </div>

          {/* Status Controls */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => handleStatusChange("active")}
              disabled={election?.status === "active"}
              className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition cursor-pointer border ${
                election?.status === "active"
                  ? "bg-brand-600 text-white border-brand-700 shadow"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200 border-gray-300"
              }`}
            >
              <Play className="w-3.5 h-3.5" />
              Activar Votación
            </button>

            <button
              onClick={() => handleStatusChange("paused")}
              disabled={election?.status === "paused"}
              className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition cursor-pointer border ${
                election?.status === "paused"
                  ? "bg-amber-600 text-white border-amber-700 shadow"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200 border-gray-300"
              }`}
            >
              <Pause className="w-3.5 h-3.5" />
              Pausar Votación
            </button>

            <button
              onClick={() => handleStatusChange("closed")}
              disabled={election?.status === "closed"}
              className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition cursor-pointer border ${
                election?.status === "closed"
                  ? "bg-red-700 text-white border-red-800 shadow"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200 border-gray-300"
              }`}
            >
              <Square className="w-3.5 h-3.5" />
              Cerrar Votación
            </button>

            <button
              onClick={() => setShowActaModal(true)}
              className="px-3.5 py-2 bg-brand-600 hover:bg-brand-700 text-white font-black text-xs rounded-xl shadow border border-brand-700 flex items-center gap-1.5 cursor-pointer"
            >
              <FileText className="w-4 h-4 text-white" />
              Ver / Imprimir Acta
            </button>

            <button
              onClick={handleResetAllVotes}
              className="px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs rounded-xl border border-gray-300 flex items-center gap-1 cursor-pointer"
              title="Resetear todos los votos para pruebas"
            >
              <RefreshCcw className="w-3.5 h-3.5 text-gray-600" />
              Reset Votos
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-200 flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-gray-200 text-brand-700 flex items-center justify-center font-bold">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-gray-500 uppercase">Total Censo Electoral</p>
            <p className="text-2xl font-black text-gray-900">{stats?.totalStudents || 0}</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-200 flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-brand-100 text-brand-600 flex items-center justify-center font-bold">
            <UserCheck className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-gray-500 uppercase">Votos Emitidos</p>
            <p className="text-2xl font-black text-brand-600">{stats?.votedStudents || 0}</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-200 flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-brand-100 text-brand-700 flex items-center justify-center font-bold">
            <BarChart3 className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-gray-500 uppercase">Participación</p>
            <p className="text-2xl font-black text-brand-700">{stats?.participationPercentage || 0}%</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-200 flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-gray-500 uppercase">Pendientes por Votar</p>
            <p className="text-2xl font-black text-amber-700">{stats?.pendingStudents || 0}</p>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="bg-white rounded-2xl shadow-md border border-gray-200 overflow-hidden">
        <div className="flex border-b border-gray-200 overflow-x-auto bg-gray-50">
          <button
            onClick={() => setActiveTab("results")}
            className={`px-5 py-3.5 text-xs font-black uppercase tracking-wider transition flex items-center gap-2 shrink-0 cursor-pointer border-b-2 ${
              activeTab === "results"
                ? "bg-white text-brand-700 border-brand-600 shadow-sm"
                : "text-gray-600 hover:text-gray-900 border-transparent"
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            Resultados en Vivo & Gráficos
          </button>

          <button
            onClick={() => setActiveTab("students")}
            className={`px-5 py-3.5 text-xs font-black uppercase tracking-wider transition flex items-center gap-2 shrink-0 cursor-pointer border-b-2 ${
              activeTab === "students"
                ? "bg-white text-brand-700 border-brand-600 shadow-sm"
                : "text-gray-600 hover:text-gray-900 border-transparent"
            }`}
          >
            <Users className="w-4 h-4" />
            Censo Estudiantil ({stats?.totalStudents || 0})
          </button>

          <button
            onClick={() => setActiveTab("candidates")}
            className={`px-5 py-3.5 text-xs font-black uppercase tracking-wider transition flex items-center gap-2 shrink-0 cursor-pointer border-b-2 ${
              activeTab === "candidates"
                ? "bg-white text-brand-700 border-brand-600 shadow-sm"
                : "text-gray-600 hover:text-gray-900 border-transparent"
            }`}
          >
            <Award className="w-4 h-4" />
            Gestión de Candidatos
          </button>

          <button
            onClick={() => setActiveTab("audit")}
            className={`px-5 py-3.5 text-xs font-black uppercase tracking-wider transition flex items-center gap-2 shrink-0 cursor-pointer border-b-2 ${
              activeTab === "audit"
                ? "bg-white text-brand-700 border-brand-600 shadow-sm"
                : "text-gray-600 hover:text-gray-900 border-transparent"
            }`}
          >
            <Shield className="w-4 h-4" />
            Registro Auditoría
          </button>
        </div>

        {/* Tab 1: Live Results */}
        {activeTab === "results" && (
          <div className="p-6 space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {positionResults?.map((pos: any) => (
                <div key={pos.id} className="bg-gray-50/80 rounded-2xl p-5 border border-gray-200 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between border-b border-gray-300 pb-3 mb-4">
                      <h3 className="font-black text-sm md:text-base text-gray-900 uppercase">
                        {pos.name}
                      </h3>
                      <span className="bg-brand-700 text-white font-mono text-xs px-2.5 py-1 rounded font-bold">
                        Votos: {pos.totalVotes}
                      </span>
                    </div>

                    <div className="space-y-4">
                      {pos.candidates.map((cand: any, idx: number) => {
                        const isLeading = idx === 0 && pos.totalVotes > 0 && !cand.isBlank;
                        return (
                          <div key={cand.id} className="bg-white p-3.5 rounded-xl border border-gray-200 space-y-2">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-2">
                                <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded-full ${
                                  cand.isBlank ? "bg-slate-200 text-slate-700" : "bg-brand-500 text-white"
                                }`}>
                                  N° {cand.number}
                                </span>
                                <span className="text-xs font-bold text-gray-900 uppercase">
                                  {cand.name}
                                </span>
                                {isLeading && (
                                  <span className="bg-brand-600 text-white text-[10px] font-black px-2 py-0.5 rounded flex items-center gap-0.5">
                                    ★ LÍDER
                                  </span>
                                )}
                              </div>
                              <div className="text-right font-mono">
                                <span className="text-sm font-black text-gray-900">{cand.votesCount} votos</span>
                                <span className="text-xs text-gray-500 ml-1">({cand.percentage}%)</span>
                              </div>
                            </div>

                            {/* Progress bar visual chart */}
                            <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden border border-gray-200">
                              <div
                                className={`h-full transition-all duration-500 ${
                                  cand.isBlank
                                    ? "bg-gray-400"
                                    : isLeading
                                    ? "bg-brand-600"
                                    : "bg-gray-500"
                                }`}
                                style={{ width: `${Math.max(cand.percentage, 2)}%` }}
                              ></div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Participation by Group Table */}
            <div className="mt-8 border-t border-gray-200 pt-6">
              <h4 className="font-extrabold text-sm text-gray-900 uppercase mb-4">
                Participación por Curso / Grupo:
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {groupStats?.map((g: any) => (
                  <div key={g.group} className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm space-y-2">
                    <div className="flex items-center justify-between text-xs font-bold">
                      <span className="text-gray-900">Grado {g.group}</span>
                      <span className="text-brand-600 font-mono">{g.percentage}%</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                      <div className="bg-brand-600 h-full rounded-full" style={{ width: `${g.percentage}%` }}></div>
                    </div>
                    <div className="text-[11px] text-gray-500 flex justify-between">
                      <span>Votaron: {g.voted}</span>
                      <span>Total: {g.total}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Students Census */}
        {activeTab === "students" && (
          <div className="p-6 space-y-4">
            
            {/* Filter and Add bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-gray-50 p-4 rounded-xl border border-gray-200">
              <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
                <div className="relative flex-1 sm:w-64">
                  <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    placeholder="Buscar por nombre o ID..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-3 py-1.5 text-xs border rounded-lg focus:ring-2 focus:ring-brand-500"
                  />
                </div>

                <select
                  value={groupFilter}
                  onChange={(e) => setGroupFilter(e.target.value)}
                  className="py-1.5 px-3 text-xs border rounded-lg bg-white"
                >
                  <option value="">Todos los Grupos</option>
                  <option value="11-1">Grado 11-1</option>
                  <option value="11-2">Grado 11-2</option>
                  <option value="11-3">Grado 11-3</option>
                  <option value="10-1">Grado 10-1</option>
                </select>

                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="py-1.5 px-3 text-xs border rounded-lg bg-white"
                >
                  <option value="">Todos los Estados</option>
                  <option value="voted">Ya Votaron</option>
                  <option value="pending">Pendientes</option>
                </select>
              </div>

              <button
                onClick={() => setShowAddStudentModal(true)}
                className="w-full sm:w-auto px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs rounded-lg shadow flex items-center justify-center gap-1.5 cursor-pointer shrink-0"
              >
                <Plus className="w-4 h-4" />
                Agregar Estudiante
              </button>
            </div>

            {/* Students Table */}
            <div className="overflow-x-auto border border-gray-200 rounded-xl">
              <table className="w-full text-xs text-left">
                <thead className="bg-gray-100 text-gray-700 uppercase font-bold border-b border-gray-200">
                  <tr>
                    <th className="p-3">Documento / ID</th>
                    <th className="p-3">Nombre Completo</th>
                    <th className="p-3">Grado / Grupo</th>
                    <th className="p-3">Estado Voto</th>
                    <th className="p-3">Fecha y Hora Voto</th>
                    <th className="p-3">Código Verificación</th>
                    <th className="p-3 text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {studentList.map((s) => (
                    <tr key={s.id} className="hover:bg-gray-50">
                      <td className="p-3 font-mono font-bold text-gray-900">{s.documentId}</td>
                      <td className="p-3 font-semibold uppercase text-gray-800">{s.fullName}</td>
                      <td className="p-3">Grado {s.grade} ({s.groupName})</td>
                      <td className="p-3">
                        {s.hasVoted ? (
                          <span className="bg-green-100 text-green-800 font-bold px-2 py-0.5 rounded-full inline-flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3 text-green-600" /> VOTÓ
                          </span>
                        ) : (
                          <span className="bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded-full inline-flex items-center gap-1">
                            <Clock className="w-3 h-3 text-amber-600" /> PENDIENTE
                          </span>
                        )}
                      </td>
                      <td className="p-3 text-gray-500 font-mono">
                        {s.votedAt ? new Date(s.votedAt).toLocaleTimeString() : "-"}
                      </td>
                      <td className="p-3 font-mono text-[11px] text-gray-600">
                        {s.verificationCode || "-"}
                      </td>
                      <td className="p-3 text-right space-x-1">
                        {s.hasVoted && (
                          <button
                            onClick={() => handleResetStudentVote(s.id, s.fullName)}
                            className="bg-amber-50 hover:bg-amber-100 text-amber-700 font-bold px-2 py-1 rounded text-[11px] border border-amber-300 inline-flex items-center gap-1 cursor-pointer"
                            title="Resetear voto de este estudiante"
                          >
                            <RotateCcw className="w-3 h-3" />
                            Rehabilitar Voto
                          </button>
                        )}
                        <button
                          onClick={() => handleDeleteStudent(s.id)}
                          className="text-red-600 hover:text-red-800 p-1 rounded cursor-pointer"
                          title="Eliminar del censo"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {studentList.length === 0 && (
                    <tr>
                      <td colSpan={7} className="p-6 text-center text-gray-500 italic">
                        No se encontraron estudiantes con los filtros seleccionados.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 3: Candidates Management */}
        {activeTab === "candidates" && (
          <div className="p-6 space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-gray-200 pb-4">
              <div>
                <h3 className="font-extrabold text-base text-gray-900 uppercase">Candidatos Registrados</h3>
                <p className="text-xs text-gray-500">Listado de propuestas e imágenes asignadas por tarjetón</p>
              </div>
              <button
                onClick={handleOpenCreateCandidate}
                className="w-full sm:w-auto px-4 py-2 bg-brand-500 hover:bg-brand-600 text-white font-bold text-xs rounded-lg shadow flex items-center justify-center gap-1.5 cursor-pointer shrink-0"
              >
                <Plus className="w-4 h-4" />
                Agregar Candidato
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {candidateList.map((cand) => (
                <div key={cand.id} className="bg-white rounded-2xl border-2 border-brand-100 p-4 shadow-sm space-y-3 flex flex-col">
                  <div className="flex items-center space-x-3">
                    {cand.photoUrl ? (
                      <img src={cand.photoUrl} alt={cand.name} className="w-14 h-18 object-cover rounded border border-gray-300" />
                    ) : (
                      <div className="w-14 h-18 bg-gray-100 rounded border border-gray-300 flex items-center justify-center text-gray-400 font-bold text-xs">
                        {cand.isBlank ? "BLANCO" : "SIN FOTO"}
                      </div>
                    )}
                    <div className="min-w-0">
                      <span className="bg-brand-500 text-white text-xs font-mono font-bold px-2.5 py-0.5 rounded-full">
                        N° {cand.number}
                      </span>
                      <h4 className="font-black text-sm text-gray-900 uppercase mt-1">{cand.name}</h4>
                      {cand.slogan && <p className="text-xs italic text-brand-700 font-medium">{cand.slogan}</p>}
                      <p className="text-[11px] text-gray-500 mt-0.5">
                        {positionOptions.find((p) => p.id === cand.positionId)?.name || "Cargo sin asignar"}
                      </p>
                    </div>
                  </div>

                  <div className="pt-2 mt-auto border-t border-gray-100 flex items-center justify-end gap-2">
                    <button
                      onClick={() => handleOpenEditCandidate(cand)}
                      className="px-3 py-1.5 text-[11px] font-bold text-brand-700 bg-brand-50 hover:bg-brand-100 border border-brand-200 rounded-lg flex items-center gap-1 cursor-pointer"
                    >
                      <Edit className="w-3.5 h-3.5" />
                      Editar
                    </button>
                    <button
                      onClick={() => handleDeleteCandidate(cand)}
                      className="px-3 py-1.5 text-[11px] font-bold text-coral-700 bg-coral-50 hover:bg-coral-100 border border-coral-200 rounded-lg flex items-center gap-1 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      Eliminar
                    </button>
                  </div>
                </div>
              ))}

              {candidateList.length === 0 && (
                <div className="col-span-full p-8 text-center text-sm text-gray-500 italic bg-gray-50 rounded-2xl border border-dashed border-gray-300">
                  No hay candidatos registrados. Usa &ldquo;Agregar Candidato&rdquo; para crear el primero.
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tab 4: Audit Logs */}
        {activeTab === "audit" && (
          <div className="p-6 space-y-4">
            <h3 className="font-extrabold text-base text-gray-900 uppercase mb-2">Bitácora de Eventos y Auditoría</h3>
            <div className="space-y-2">
              {recentLogs?.map((log: any) => (
                <div key={log.id} className="bg-gray-50 p-3 rounded-lg border border-gray-200 flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-3">
                    <span className="bg-brand-700 text-white font-mono font-bold text-[10px] px-2 py-0.5 rounded uppercase">
                      {log.action}
                    </span>
                    <span className="text-gray-800 font-medium">{log.details}</span>
                  </div>
                  <span className="text-gray-400 font-mono text-[11px]">
                    {new Date(log.createdAt).toLocaleTimeString()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Printable Acta Modal */}
      <PrintableActa
        isOpen={showActaModal}
        onClose={() => setShowActaModal(false)}
        dashboardData={dashboardData}
      />

      {/* Add Student Modal */}
      {showAddStudentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <h3 className="text-base font-black uppercase text-gray-900">Agregar Nuevo Estudiante</h3>
            <form onSubmit={handleCreateStudent} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase">Documento / ID:</label>
                <input
                  type="text"
                  required
                  value={newStudent.documentId}
                  onChange={(e) => setNewStudent({ ...newStudent, documentId: e.target.value })}
                  placeholder="1085990011"
                  className="w-full px-3 py-2 text-xs border rounded-lg focus:ring-2 focus:ring-brand-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase">Nombre Completo:</label>
                <input
                  type="text"
                  required
                  value={newStudent.fullName}
                  onChange={(e) => setNewStudent({ ...newStudent, fullName: e.target.value })}
                  placeholder="CARLOS EDUARDO MORALES"
                  className="w-full px-3 py-2 text-xs border rounded-lg focus:ring-2 focus:ring-brand-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase">Grado:</label>
                  <select
                    value={newStudent.grade}
                    onChange={(e) => setNewStudent({ ...newStudent, grade: e.target.value })}
                    className="w-full px-3 py-2 text-xs border rounded-lg bg-white focus:ring-2 focus:ring-brand-500"
                  >
                    {["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11"].map((g) => (
                      <option key={g} value={g}>
                        {g}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase">Grupo:</label>
                  <input
                    type="text"
                    value={newStudent.groupName}
                    onChange={(e) => setNewStudent({ ...newStudent, groupName: e.target.value })}
                    className="w-full px-3 py-2 text-xs border rounded-lg"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowAddStudentModal(false)}
                  className="px-4 py-2 text-xs font-bold text-gray-600 hover:bg-gray-100 rounded-lg cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-brand-600 text-white font-bold text-xs uppercase rounded-lg shadow cursor-pointer"
                >
                  Guardar Estudiante
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add / Edit Candidate Modal */}
      {showAddCandidateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl p-6 max-w-lg w-full shadow-2xl space-y-4 my-8">
            <h3 className="text-base font-black uppercase text-gray-900">
              {editingCandidateId !== null ? "Editar Candidato" : "Agregar Nuevo Candidato"}
            </h3>
            <form onSubmit={handleSubmitCandidate} className="space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase">Cargo / Posición:</label>
                  <select
                    value={newCandidate.positionId}
                    onChange={(e) => setNewCandidate({ ...newCandidate, positionId: parseInt(e.target.value, 10) })}
                    className="w-full px-3 py-2 text-xs border rounded-lg bg-white focus:ring-2 focus:ring-brand-500"
                  >
                    {positionOptions.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase">N° Tarjetón:</label>
                  <input
                    type="text"
                    required
                    value={newCandidate.number}
                    onChange={(e) => setNewCandidate({ ...newCandidate, number: e.target.value })}
                    placeholder="01"
                    className="w-full px-3 py-2 text-xs border rounded-lg focus:ring-2 focus:ring-brand-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase">Nombre Completo:</label>
                <input
                  type="text"
                  required
                  value={newCandidate.name}
                  onChange={(e) => setNewCandidate({ ...newCandidate, name: e.target.value })}
                  placeholder="ANA MARÍA TORRES"
                  className="w-full px-3 py-2 text-xs border rounded-lg focus:ring-2 focus:ring-brand-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase">URL de la Foto (opcional):</label>
                <input
                  type="text"
                  value={newCandidate.photoUrl}
                  onChange={(e) => setNewCandidate({ ...newCandidate, photoUrl: e.target.value })}
                  placeholder="https://..."
                  className="w-full px-3 py-2 text-xs border rounded-lg focus:ring-2 focus:ring-brand-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase">Eslogan (opcional):</label>
                <input
                  type="text"
                  value={newCandidate.slogan}
                  onChange={(e) => setNewCandidate({ ...newCandidate, slogan: e.target.value })}
                  placeholder="Con voz joven, hacemos la diferencia"
                  className="w-full px-3 py-2 text-xs border rounded-lg focus:ring-2 focus:ring-brand-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase">Propuestas (una por línea):</label>
                <textarea
                  rows={4}
                  value={newCandidate.proposals}
                  onChange={(e) => setNewCandidate({ ...newCandidate, proposals: e.target.value })}
                  placeholder={"Biblioteca más grande\nMás deportes"}
                  className="w-full px-3 py-2 text-xs border rounded-lg focus:ring-2 focus:ring-brand-500 resize-none"
                />
              </div>

              <label className="flex items-center gap-2 text-xs font-bold text-gray-700 uppercase cursor-pointer">
                <input
                  type="checkbox"
                  checked={newCandidate.isBlank}
                  onChange={(e) => setNewCandidate({ ...newCandidate, isBlank: e.target.checked })}
                  className="w-4 h-4 accent-brand-600"
                />
                Es voto en blanco
              </label>

              <div className="pt-2 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddCandidateModal(false);
                    setEditingCandidateId(null);
                  }}
                  className="px-4 py-2 text-xs font-bold text-gray-600 hover:bg-gray-100 rounded-lg cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-brand-500 hover:bg-brand-600 text-white font-bold text-xs uppercase rounded-lg shadow cursor-pointer"
                >
                  {editingCandidateId !== null ? "Guardar Cambios" : "Crear Candidato"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
