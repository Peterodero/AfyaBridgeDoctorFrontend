// src/components/layout/Sidebar.jsx
import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Calendar,
  Users,
  Video,
  FileText,
  BarChart2,
  Settings,
  HelpCircle,
  Bell,
  LogOut,
  Wallet,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const NAV = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/appointments", label: "Appointments", icon: Calendar },
  { to: "/patients", label: "Patients", icon: Users },
  { to: "/telemedicine", label: "Telemedicine", icon: Video },
  { to: "/prescriptions", label: "E-Prescriptions", icon: FileText },
  // { to: "/analytics", label: "Analytics", icon: BarChart2 },
  { to: "/notifications", label: "Notifications", icon: Bell },
  { to: "/wallet", label: "Wallet", icon: Wallet }, 
];

const SUPPORT = [
  { to: "/settings", label: "Settings", icon: Settings },
  { to: "/help", label: "Help Center", icon: HelpCircle },
];

function NavItem({ to, label, icon: Icon }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        [
          "flex items-center shrink-0 gap-3 px-3 h-10 rounded-xl no-underline font-medium text-sm transition-all duration-150 relative group",
          isActive ? "text-blue-600" : "text-slate-500 hover:text-slate-900",
        ].join(" ")
      }
    >
      {({ isActive }) => (
        <>
          {/* Hover background for inactive items */}
          {!isActive && (
            <span className="absolute inset-0 rounded-xl bg-slate-50 opacity-0 group-hover:opacity-100 transition-opacity duration-150" />
          )}

          {/* Icon */}
          <span
            className={`relative z-10 shrink-0 transition-all duration-150 ${
              isActive
                ? "text-blue-600"
                : "text-slate-400 group-hover:text-primary"
            }`}
          >
            <Icon size={17} strokeWidth={isActive ? 2.5 : 2} />
          </span>

          {/* Label */}
          <span
            className={`relative z-10 transition-all duration-150 ${
              isActive
                ? "text-blue-600 font-semibold"
                : "text-slate-500 group-hover:text-slate-900 font-medium"
            }`}
          >
            {label}
          </span>
        </>
      )}
    </NavLink>
  );
}

export default function Sidebar() {
  const { logout } = useAuth();
  const handleLogout = () => {
    logout();
  };
  return (
    <aside
      className="w-60 min-h-screen h-screen sticky top-0 bg-white flex flex-col shrink-0"
      style={{ boxShadow: "1px 0 0 #E8EDF3, 4px 0 24px rgba(0,0,0,0.03)" }}
    >
      {/* ── Logo ─────────────────────────────────────── */}
      <div
        className="flex items-center gap-3 px-5 shrink-0"
        style={{ height: 70 }}
      >
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
          style={{
            background: "linear-gradient(135deg, #137FEC, #13B6EC)",
            boxShadow: "0 4px 12px rgba(19,127,236,0.3)",
          }}
        >
          <svg width="19" height="19" viewBox="0 0 20 20" fill="none">
            <path
              d="M10 2C8.5 2 7.5 3 7.5 4.5V7H5C3.5 7 2.5 8 2.5 9.5C2.5 11 3.5 12 5 12H7.5V14.5C7.5 16 8.5 17 10 17C11.5 17 12.5 16 12.5 14.5V12H15C16.5 12 17.5 11 17.5 9.5C17.5 8 16.5 7 15 7H12.5V4.5C12.5 3 11.5 2 10 2Z"
              fill="white"
            />
          </svg>
        </div>
        <div>
          <p className="text-[17px] font-black text-slate-900 tracking-tight leading-none m-0">
            AfyaBridge
          </p>
          <p className="text-[10px] font-semibold text-primary uppercase tracking-[0.8px] m-0 mt-0.5">
            Doctor Portal
          </p>
        </div>
      </div>

      {/* ── Main nav ─────────────────────────────────── */}
      <nav className="flex-1 px-3 py-2 flex flex-col gap-0.5 overflow-y-auto">
        {NAV.map((item) => (
          <NavItem key={item.to} {...item} />
        ))}

        {/* Divider + support label */}
        <div className="h-px bg-slate-100 mx-1 my-3" />
        <p className="text-[10px] font-black text-slate-300 uppercase tracking-[1.2px] px-3 mb-1.5">
          Support
        </p>

        {SUPPORT.map((item) => (
          <NavItem key={item.to} {...item} />
        ))}
      </nav>

      {/* ── CTA button ───────────────────────────────── */}
      <div className="p-4 shrink-0">
        <button
          onClick={handleLogout}
          className="w-full h-10 rounded-xl bg-linear-to-r from-gray-200 to-gray-100 hover:from-gray-200 hover:to-gray-300 flex items-center justify-center gap-2 text-red-500 text-sm font-semibold
           border-none cursor-pointer transition-all duration-200 shadow-md shadow-gray-500/30 hover:shadow-lg hover:shadow-gray-500/40 active:scale-[0.98]"
        >
          <LogOut size={15} strokeWidth={2.5} />
          Logout
        </button>
      </div>
    </aside>
  );
}
