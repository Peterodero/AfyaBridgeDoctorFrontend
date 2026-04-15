// src/pages/Dashboard.jsx
import { useNavigate } from "react-router-dom";
import {
  Users,
  Calendar,
  Video,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  ChevronRight,
  Activity,
  Stethoscope,
  AlertCircle,
  ChevronLeft,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useAppointments } from "../hooks/useAppointments";
import { usePatients } from "../hooks/usePatients";
import Badge from "../components/common/Badge";
import { useEffect, useState } from "react";

const ACTIVITY = [28, 45, 32, 60, 48, 55, 72, 58, 65, 80, 62, 70];
const MAX_A = Math.max(...ACTIVITY);

function SkeletonRow({ cols, gridCols }) {
  return Array.from({ length: 3 }).map((_, i) => (
    <div
      key={i}
      className="grid px-6 border-b border-gray-100 items-center gap-4"
      style={{ gridTemplateColumns: gridCols, height: 62 }}
    >
      {Array.from({ length: cols }).map((_, j) => (
        <div key={j} className="h-3 bg-gray-100 rounded-full animate-pulse" />
      ))}
    </div>
  ));
}

export default function Dashboard() {
  const navigate = useNavigate();
  const { doctor } = useAuth();
  const [greeting, setGreeting] = useState("");

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good morning");
    else if (hour < 17) setGreeting("Good afternoon");
    else setGreeting("Good evening");
  }, []);

  const { data: apptRes, isLoading: apptLoading } = useAppointments();
  const { data: patRes, isLoading: patLoading } = usePatients();

  const profileFromStorage = localStorage.getItem("afya_doctor");
  const doctorDetails = profileFromStorage
    ? JSON.parse(profileFromStorage)
    : null;
  const doctorName = doctorDetails?.user?.full_name ?? doctorDetails?.full_name ?? "Doctor";

  const appointments = apptRes?.data?.appointments ?? [];
  const summary = apptRes?.data?.summary ?? {};

  const patients = patRes?.data?.patients ?? (Array.isArray(patRes?.data) ? patRes.data : []);
  const patientMap = patients.reduce((map, p) => {
    if (p.id) map[p.id] = p.full_name ?? p.name ?? "Patient";
    return map;
  }, {});

  const critical = patients.filter(
    (p) => (p.status ?? "").toLowerCase() === "critical"
  );

  const stats = [
    {
      label: "Total Patients",
      value: patLoading ? "—" : String(patients.length || "0"),
      up: true,
      icon: Users,
      color: "blue",
      bgGradient: "linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)",
    },
    {
      label: "Today's Appointments",
      value: apptLoading ? "—" : String(appointments.filter(a => a.date === new Date().toISOString().split('T')[0]).length || "0"),
      up: true,
      icon: Calendar,
      color: "emerald",
      bgGradient: "linear-gradient(135deg, #10B981 0%, #059669 100%)",
    },
    {
      label: "Pending Consultations",
      value: apptLoading ? "—" : String(summary.pending ?? 0),
      change: "Live",
      up: true,
      icon: Video,
      color: "violet",
      bgGradient: "linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)",
    },
    {
      label: "Emergency Alerts",
      value: apptLoading ? "—" : String(summary.confirmed ?? 0),
      up: false,
      icon: AlertCircle,
      color: "amber",
      bgGradient: "linear-gradient(135deg, #F59E0B 0%, #D97706 100%)",
    },
  ];

  const getInitials = (name = "") =>
    name
      .split(" ")
      .filter(Boolean)
      .map((n) => n[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();

  const formatTime = (t = "") => {
    if (!t) return "—";
    if (/^\d{2}:\d{2}:\d{2}$/.test(t)) return t.slice(0, 5);
    return t;
  };

  const formatDate = (date) => {
    if (!date) return "—";
    return new Date(date).toLocaleDateString("en-KE", {
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 via-white to-gray-50">
      <div className="p-8 max-w-400 mx-auto">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h1 className="text-3xl font-bold bg-linear-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                Dashboard
              </h1>
              <p className="text-gray-500 mt-1">
                {greeting}, {doctorName}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-xl shadow-sm border border-gray-100">
                <Activity size={16} className="text-primary" />
                <span className="text-sm text-gray-600">
                  {new Date().toLocaleDateString("en-KE", {
                    weekday: "long",
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map(({ label, value, change, up, icon: Icon, color, bgGradient }) => (
            <div
              key={label}
              className="group relative bg-white rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-gray-200"
            >
              <div className="absolute inset-0 bg-linear-to-r from-transparent via-transparent to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="relative">
                <div className="flex items-center justify-between mb-4">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center shadow-lg"
                    style={{ background: bgGradient }}
                  >
                    <Icon size={20} className="text-white" strokeWidth={1.5} />
                  </div>
                  {/* <span
                    className={`flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full ${
                      up
                        ? "bg-emerald-50 text-emerald-600"
                        : "bg-red-50 text-red-600"
                    }`}
                  >
                    {up ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                    {change}
                  </span> */}
                </div>
                <p className="text-3xl font-bold text-gray-900 mb-1">{value}</p>
                <p className="text-sm text-gray-500 font-medium">{label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Appointments Table - Takes 2/3 of the space */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    <Calendar size={18} className="text-primary" />
                    Upcoming Appointments
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">
                    {apptLoading ? "Loading..." : `${appointments.length} appointments scheduled`}
                  </p>
                </div>
                <button
                  onClick={() => navigate("/appointments")}
                  className="flex items-center gap-2 text-sm font-medium text-primary hover:text-primary-dark transition-colors"
                >
                  View all
                  <ChevronRight size={16} />
                </button>
              </div>

              {/* Table Header */}
              <div className="grid px-6 py-3 bg-gray-50/50 border-b border-gray-100 text-xs font-semibold text-gray-500 uppercase tracking-wider"
                style={{ gridTemplateColumns: "2fr 1fr 0.8fr 0.8fr 1fr 1fr" }}
              >
                {["Patient", "Type", "Date", "Time", "Charges", "Status"].map((h) => (
                  <span key={h}>{h}</span>
                ))}
              </div>

              {/* Table Body */}
              <div className="divide-y divide-gray-50">
                {apptLoading ? (
                  <SkeletonRow cols={6} gridCols="2fr 1fr 0.8fr 0.8fr 1fr 1fr" />
                ) : appointments.length === 0 ? (
                  <div className="py-16 text-center">
                    <Calendar size={48} className="text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-400 text-sm">No appointments found</p>
                  </div>
                ) : (
                  appointments.slice(0, 5).map((appt, i) => {
                    const patientName = patientMap[appt.patient_id] ?? "Patient";
                    return (
                      <div
                        key={appt.id}
                        onClick={() => navigate(`/appointments/${appt.id}`)}
                        className="grid px-6 py-4 items-center hover:bg-gray-50/50 cursor-pointer transition-colors duration-150"
                        style={{ gridTemplateColumns: "2fr 1fr 0.8fr 0.8fr 1fr 1fr" }}
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xs font-bold text-white shadow-sm"
                            style={{
                              background: `linear-gradient(135deg, #3B82F6, #1E40AF)`,
                            }}
                          >
                            {getInitials(patientName)}
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-gray-900">
                              {patientName}
                            </p>
                            {appt.reason && (
                              <p className="text-xs text-gray-400 truncate max-w-37.5">
                                {appt.reason}
                              </p>
                            )}
                          </div>
                        </div>
                        <span className="text-sm text-gray-600 capitalize">
                          {appt.type?.replace("_", " ") ?? "—"}
                        </span>
                        <span className="text-sm text-gray-600">
                          {formatDate(appt.date)}
                        </span>
                        <div className="flex items-center gap-1.5">
                          <Clock size={12} className="text-gray-400" />
                          <span className="text-sm font-medium text-gray-700">
                            {formatTime(appt.time)}
                          </span>
                        </div>
                        <span className="text-sm font-semibold text-gray-700">
                          {appt.charges ? `KES ${appt.charges.toLocaleString()}` : "—"}
                        </span>
                        <Badge status={appt.status} />
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            {/* Activity Chart */}
            {/* <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                    <Activity size={16} className="text-primary" />
                    Monthly Activity
                  </h3>
                  <p className="text-xs text-gray-500 mt-1">Consultations trend</p>
                </div>
                <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-1 rounded-full">
                  2026
                </span>
              </div>
              <div className="flex items-end gap-1 h-32">
                {ACTIVITY.map((val, i) => (
                  <div
                    key={i}
                    className="flex-1 rounded-t-lg transition-all duration-300 hover:opacity-80"
                    style={{
                      height: `${(val / MAX_A) * 100}%`,
                      background:
                        i === 11
                          ? "linear-gradient(180deg, #3B82F6, #1E40AF)"
                          : i >= 9
                          ? "#93C5FD"
                          : "#E5E7EB",
                    }}
                  />
                ))}
              </div>
              <div className="flex justify-between mt-3">
                {["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"].map((m, i) => (
                  <span
                    key={i}
                    className={`text-[10px] font-medium ${
                      i === 11 ? "text-primary" : "text-gray-400"
                    }`}
                  >
                    {m}
                  </span>
                ))}
              </div>
            </div> */}

            {/* Critical Patients */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                    <h3 className="text-sm font-semibold text-gray-900">
                      Critical Patients
                    </h3>
                  </div>
                  <span className="text-xs font-semibold text-red-600 bg-red-50 px-2.5 py-1 rounded-full">
                    {critical.length || 0}
                  </span>
                </div>
              </div>

              <div className="divide-y divide-gray-50">
                {patLoading ? (
                  <div className="py-8 text-center">
                    <div className="animate-pulse text-gray-400 text-sm">Loading...</div>
                  </div>
                ) : critical.length === 0 ? (
                  <div className="py-12 text-center">
                    <Stethoscope size={32} className="text-gray-300 mx-auto mb-2" />
                    <p className="text-sm text-gray-400">No critical patients</p>
                  </div>
                ) : (
                  critical.slice(0, 4).map((p) => {
                    const name = p.full_name ?? p.name ?? "Patient";
                    return (
                      <div
                        key={p.id}
                        onClick={() => navigate(`/patients/${p.id}`)}
                        className="px-6 py-4 hover:bg-red-50/30 cursor-pointer transition-colors duration-150"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xs font-bold text-white shadow-sm"
                            style={{
                              background: "linear-gradient(135deg, #EF4444, #DC2626)",
                            }}
                          >
                            {getInitials(name)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-gray-900">
                              {name}
                            </p>
                            <p className="text-xs text-red-500 truncate">
                              {p.conditions ?? p.condition ?? p.diagnosis ?? "Critical condition"}
                            </p>
                          </div>
                          <AlertCircle size={14} className="text-red-400 shrink-0" />
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {critical.length > 4 && (
                <div className="px-6 py-3 bg-gray-50 border-t border-gray-100">
                  <button
                    onClick={() => navigate("/patients")}
                    className="w-full text-center text-xs font-medium text-primary hover:text-primary-dark transition-colors"
                  >
                    View all {critical.length} critical patients
                  </button>
                </div>
              )}
            </div>

            {/* Quick Stats */}
            <div className="bg-linear-to-br from-primary/5 to-primary/10 rounded-2xl p-6 border border-primary/20">
              <h3 className="text-sm font-semibold text-gray-900 mb-3">
                Today's Summary
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Completed</span>
                  <span className="text-lg font-bold text-emerald-600">
                    {summary.completed ?? 0}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Cancelled</span>
                  <span className="text-lg font-bold text-red-600">
                    {summary.cancelled ?? 0}
                  </span>
                </div>
                {/* <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">No Show</span>
                  <span className="text-lg font-bold text-gray-600">
                    {summary.no_show ?? 0}
                  </span>
                </div> */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}