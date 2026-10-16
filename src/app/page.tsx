"use client";

import React, { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { StudentLogin } from "@/components/StudentLogin";
import { VotingBallot, PositionBallot } from "@/components/VotingBallot";
import { VotingReceipt } from "@/components/VotingReceipt";
import { AdminDashboard } from "@/components/AdminDashboard";
import { AdminLoginModal } from "@/components/AdminLoginModal";

export default function HomePage() {
  const [viewMode, setViewMode] = useState<"login" | "ballot" | "receipt" | "admin">("login");
  const [kioskMode, setKioskMode] = useState(false);

  // Active student state
  const [currentStudent, setCurrentStudent] = useState<{
    id: number;
    documentId: string;
    fullName: string;
    grade: string;
    groupName: string;
    hasVoted?: boolean;
    verificationCode?: string | null;
    votedAt?: string | Date | null;
  } | null>(null);

  // Active ballot state
  const [ballotPositions, setBallotPositions] = useState<PositionBallot[]>([]);
  const [electionInfo, setElectionInfo] = useState<any>(null);

  // Receipt state
  const [activeReceipt, setActiveReceipt] = useState<any>(null);

  // UI state
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [showAdminLoginModal, setShowAdminLoginModal] = useState(false);

  // Auto-init database & fetch ballot structure on startup
  useEffect(() => {
    initApp();
  }, []);

  const initApp = async () => {
    try {
      await fetch("/api/init");
      await fetchBallotData();
    } catch (e) {
      console.error("Error initializing app:", e);
    }
  };

  const fetchBallotData = async () => {
    try {
      const res = await fetch("/api/ballot");
      const data: any = await res.json();
      if (data.success) {
        setElectionInfo(data.election);
        setBallotPositions(data.positions);
      }
    } catch (e) {
      console.error("Error fetching ballot:", e);
    }
  };

  // Student auth handler
  const handleStudentAuth = async (documentId: string) => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const res = await fetch("/api/auth/student", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ documentId }),
      });

      const data: any = await res.json();

      if (!data.success) {
        setErrorMessage(data.error || "No fue posible ingresar con este número de identificación.");
        setIsLoading(false);
        return;
      }

      const { student, election } = data;
      setElectionInfo(election);
      setCurrentStudent(student);

      if (student.hasVoted) {
        // Already voted -> show receipt
        setActiveReceipt({
          documentId: student.documentId,
          fullName: student.fullName,
          grade: student.grade,
          groupName: student.groupName,
          votedAt: student.votedAt || new Date(),
          verificationCode: student.verificationCode || "VOTO-2026-PREV",
          institutionName: election?.institutionName,
          year: election?.year,
        });
        setViewMode("receipt");
      } else {
        // Proceed to voting ballot
        await fetchBallotData();
        setViewMode("ballot");
      }
    } catch (err: any) {
      setErrorMessage("Error de conexión al servidor.");
    } finally {
      setIsLoading(false);
    }
  };

  // Submit votes handler
  const handleSubmitVotes = async (selectedMap: Record<number, number>) => {
    if (!currentStudent) return;
    setIsLoading(true);

    try {
      const res = await fetch("/api/vote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          studentId: currentStudent.id,
          documentId: currentStudent.documentId,
          votesMap: selectedMap,
        }),
      });

      const data: any = await res.json();

      if (data.success) {
        setActiveReceipt({
          documentId: currentStudent.documentId,
          fullName: currentStudent.fullName,
          grade: currentStudent.grade,
          groupName: currentStudent.groupName,
          votedAt: data.votedAt,
          verificationCode: data.verificationCode,
          institutionName: electionInfo?.institutionName,
          year: electionInfo?.year,
        });
        setViewMode("receipt");
      } else {
        alert(data.error || "No se pudo registrar el voto.");
      }
    } catch (e) {
      alert("Error al comunicar con el servidor.");
    } finally {
      setIsLoading(false);
    }
  };

  // Lookup Certificate handler
  const handleVerifyReceipt = async (query: string) => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/student/certificate?query=${encodeURIComponent(query)}`);
      const data: any = await res.json();

      if (data.success) {
        setActiveReceipt(data.certificate);
        setViewMode("receipt");
      } else {
        setErrorMessage(data.error || "No se encontró ningún comprobante con ese dato.");
      }
    } catch (e) {
      setErrorMessage("Error al realizar la consulta.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetToLogin = () => {
    setCurrentStudent(null);
    setActiveReceipt(null);
    setErrorMessage(null);
    setViewMode("login");
  };

  const handleLogout = () => {
    setIsAdminLoggedIn(false);
    setCurrentStudent(null);
    setActiveReceipt(null);
    setViewMode("login");
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-100 text-gray-900 font-sans selection:bg-orange-200">
      
      {/* Institutional Top Header */}
      <Header
        institutionName={electionInfo?.institutionName}
        year={electionInfo?.year}
        currentStudent={viewMode === "ballot" ? currentStudent : null}
        isAdmin={isAdminLoggedIn}
        onOpenAdminLogin={() => setShowAdminLoginModal(true)}
        onLogout={handleLogout}
        electionStatus={electionInfo?.status}
        kioskMode={kioskMode}
        onToggleKiosk={() => setKioskMode(!kioskMode)}
      />

      {/* Main Page Area */}
      <main className="flex-1 flex flex-col items-center justify-center p-2 sm:p-4">
        
        {viewMode === "login" && (
          <StudentLogin
            onSubmitDoc={handleStudentAuth}
            isLoading={isLoading}
            errorMessage={errorMessage}
            onOpenAdminModal={() => setShowAdminLoginModal(true)}
            onVerifyReceipt={handleVerifyReceipt}
          />
        )}

        {viewMode === "ballot" && currentStudent && (
          <VotingBallot
            positions={ballotPositions}
            onSubmitVotes={handleSubmitVotes}
            isSubmitting={isLoading}
            year={electionInfo?.year}
          />
        )}

        {viewMode === "receipt" && activeReceipt && (
          <VotingReceipt
            receipt={activeReceipt}
            onDone={handleResetToLogin}
            autoResetSeconds={kioskMode ? 6 : null}
          />
        )}

        {viewMode === "admin" && isAdminLoggedIn && (
          <AdminDashboard
            onLogout={handleLogout}
            onRefreshBallot={fetchBallotData}
          />
        )}
      </main>

      {/* Admin Login Modal */}
      <AdminLoginModal
        isOpen={showAdminLoginModal}
        onClose={() => setShowAdminLoginModal(false)}
        onLoginSuccess={(adminUser) => {
          setIsAdminLoggedIn(true);
          setViewMode("admin");
        }}
      />

      {/* Institutional Footer */}
      <Footer />
    </div>
  );
}
