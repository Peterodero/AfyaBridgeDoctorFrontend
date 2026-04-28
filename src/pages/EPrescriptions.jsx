// src/pages/EPrescriptions.jsx
import { useState, useRef, useEffect } from "react";
import { useLocation } from "react-router-dom";
import {
  Search,
  Trash2,
  Send,
  Plus,
  Printer,
  CheckCircle,
  AlertCircle,
  Info,
  ChevronDown,
  X,
  Truck,
  MapPin,
  Building2,
  RefreshCw,
  AlertTriangle,
} from "lucide-react";
import { usePatients } from "../hooks/usePatients";
import { useCreatePrescription } from "../hooks/usePrescriptions";
import { useCreateOrder } from "../hooks/useOrders";
import { usePharmacies } from "../hooks/usePharmacies";
import { useUI } from "../context/UIContext";

const inp =
  "w-full h-10 px-3.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-700 placeholder:text-slate-300 outline-none font-sans focus:border-teal focus:ring-2 focus:ring-teal/10 transition-all";

// Confirmation Modal Component
function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Clear All",
  cancelText = "Cancel",
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center gap-3 px-6 py-4 border-b border-amber-100 bg-amber-50">
          <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center">
            <AlertTriangle size={20} className="text-amber-600" />
          </div>
          <h3 className="text-lg font-bold text-amber-900 m-0">{title}</h3>
        </div>

        <div className="p-6">
          <p className="text-sm text-slate-600 leading-relaxed">{message}</p>

          <div className="flex gap-3 mt-6">
            <button
              onClick={onClose}
              className="flex-1 h-10 rounded-xl border border-slate-200 text-slate-600 text-sm font-semibold cursor-pointer hover:bg-slate-50 transition-colors"
            >
              {cancelText}
            </button>
            <button
              onClick={onConfirm}
              className="flex-1 h-10 rounded-xl bg-red-600 text-white text-sm font-semibold cursor-pointer hover:bg-red-700 transition-all hover:-translate-y-px"
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Patient selector dropdown
function PatientSelector({
  patients,
  loading,
  selected,
  onSelect,
  disabled = false,
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const getInitials = (name = "") =>
    name
      .split(" ")
      .filter(Boolean)
      .map((n) => n[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();

  const filtered = patients.filter((p) => {
    const name = p.full_name ?? p.name ?? "";
    const phone = p.phone_number ?? p.phone ?? "";
    return (
      !query ||
      name.toLowerCase().includes(query.toLowerCase()) ||
      phone.includes(query)
    );
  });

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => !disabled && setOpen(!open)}
        disabled={disabled}
        className={`w-full h-10 px-3.5 bg-white border rounded-lg text-sm flex items-center justify-between transition-all
          ${disabled ? "cursor-not-allowed bg-slate-50" : "cursor-pointer"}
          ${open ? "border-teal ring-2 ring-teal/10" : "border-slate-200 hover:border-slate-300"}`}
      >
        {selected ? (
          <div className="flex items-center gap-2.5">
            <div
              className="w-6 h-6 rounded-md flex items-center justify-center text-[10px] font-bold text-white shrink-0"
              style={{
                background: "linear-gradient(135deg, #137FEC, #13B6EC)",
              }}
            >
              {getInitials(selected.full_name ?? selected.name)}
            </div>
            <div className="text-left">
              <span className="font-semibold text-slate-900">
                {selected.full_name ?? selected.name}
              </span>
            </div>
          </div>
        ) : (
          <span className="text-slate-300">
            {loading ? "Loading patients…" : "Select a patient"}
          </span>
        )}
        {!disabled && (
          <div className="flex items-center gap-1.5">
            {selected && (
              <span
                onClick={(e) => {
                  e.stopPropagation();
                  onSelect(null);
                }}
                className="p-0.5 text-slate-300 hover:text-danger transition-colors"
              >
                <X size={13} />
              </span>
            )}
            <ChevronDown
              size={14}
              className={`text-slate-300 transition-transform ${open ? "rotate-180" : ""}`}
            />
          </div>
        )}
      </button>

      {open && !disabled && (
        <div
          className="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-150 rounded-xl overflow-hidden z-50"
          style={{ boxShadow: "0 8px 24px rgba(0,0,0,0.10)" }}
        >
          <div className="p-2 border-b border-slate-50">
            <div className="relative">
              <Search
                size={13}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none"
              />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by name or phone…"
                className="w-full h-8 pl-8 pr-3 bg-slate-50 border border-slate-100 rounded-lg text-xs text-slate-700 placeholder:text-slate-300 outline-none font-sans focus:border-teal transition-all"
                autoFocus
              />
            </div>
          </div>

          <div className="overflow-y-auto" style={{ maxHeight: 220 }}>
            {loading ? (
              <div className="py-6 text-center">
                <div className="w-4 h-4 border-2 border-slate-200 border-t-teal rounded-full animate-spin mx-auto" />
              </div>
            ) : filtered.length === 0 ? (
              <div className="py-6 text-center">
                <p className="text-xs text-slate-300 m-0">
                  {query
                    ? "No patients match your search"
                    : "No patients found"}
                </p>
              </div>
            ) : (
              filtered.map((p) => {
                const name = p.full_name ?? p.name ?? "Unknown";
                const phone = p.phone_number ?? p.phone ?? "";
                const age = p.age ? `Age ${p.age}` : "";
                const initials = getInitials(name);
                const isSelected = selected?.id === p.id;

                return (
                  <div
                    key={p.id}
                    onClick={() => {
                      onSelect(p);
                      setOpen(false);
                      setQuery("");
                    }}
                    className={`flex items-center gap-3 px-4 py-2.5 cursor-pointer transition-colors border-b border-slate-50 last:border-0
                      ${isSelected ? "bg-teal-50" : "hover:bg-slate-50"}`}
                  >
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-[11px] font-bold text-white shrink-0"
                      style={{
                        background: isSelected
                          ? "linear-gradient(135deg,#0D9488,#0F766E)"
                          : "linear-gradient(135deg,#137FEC,#13B6EC)",
                      }}
                    >
                      {initials}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-slate-900 m-0 truncate">
                        {name}
                      </p>
                      <p className="text-xs text-slate-400 m-0">
                        {[phone, age].filter(Boolean).join(" · ")}
                      </p>
                    </div>
                    {isSelected && (
                      <CheckCircle size={14} className="text-teal shrink-0" />
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// Pharmacy selector dropdown
function PharmacySelector({ pharmacies, loading, selected, onSelect }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const getInitials = (name = "") =>
    name
      .split(" ")
      .filter(Boolean)
      .map((n) => n[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();

  const filtered = pharmacies.filter((p) => {
    const name = p.name ?? "";
    return !query || name.toLowerCase().includes(query.toLowerCase());
  });

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className={`w-full h-10 px-3.5 bg-white border rounded-lg text-sm flex items-center justify-between cursor-pointer transition-all
          ${open ? "border-teal ring-2 ring-teal/10" : "border-slate-200 hover:border-slate-300"}`}
      >
        {selected ? (
          <div className="flex items-center gap-2.5">
            <div
              className="w-6 h-6 rounded-md flex items-center justify-center text-[10px] font-bold text-white shrink-0"
              style={{
                background: "linear-gradient(135deg, #137FEC, #13B6EC)",
              }}
            >
              {getInitials(selected.name)}
            </div>
            <div className="text-left">
              <span className="font-semibold text-slate-900">
                {selected.name}
              </span>
              <p className="text-[10px] text-slate-400 m-0">
                {selected.county} · {selected.phone}
              </p>
            </div>
          </div>
        ) : (
          <span className="text-slate-300">
            {loading ? "Loading pharmacies…" : "Select a pharmacy"}
          </span>
        )}
        <div className="flex items-center gap-1.5">
          {selected && (
            <span
              onClick={(e) => {
                e.stopPropagation();
                onSelect(null);
              }}
              className="p-0.5 text-slate-300 hover:text-danger transition-colors"
            >
              <X size={13} />
            </span>
          )}
          <ChevronDown
            size={14}
            className={`text-slate-300 transition-transform ${open ? "rotate-180" : ""}`}
          />
        </div>
      </button>

      {open && (
        <div
          className="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-150 rounded-xl overflow-hidden z-50"
          style={{ boxShadow: "0 8px 24px rgba(0,0,0,0.10)" }}
        >
          <div className="p-2 border-b border-slate-50">
            <div className="relative">
              <Search
                size={13}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none"
              />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by pharmacy name…"
                className="w-full h-8 pl-8 pr-3 bg-slate-50 border border-slate-100 rounded-lg text-xs text-slate-700 placeholder:text-slate-300 outline-none font-sans focus:border-teal transition-all"
                autoFocus
              />
            </div>
          </div>

          <div className="overflow-y-auto" style={{ maxHeight: 220 }}>
            {loading ? (
              <div className="py-6 text-center">
                <div className="w-4 h-4 border-2 border-slate-200 border-t-teal rounded-full animate-spin mx-auto" />
              </div>
            ) : filtered.length === 0 ? (
              <div className="py-6 text-center">
                <p className="text-xs text-slate-300 m-0">
                  {query
                    ? "No pharmacies match your search"
                    : "No pharmacies found"}
                </p>
              </div>
            ) : (
              filtered.map((ph) => {
                const initials = getInitials(ph.name);
                const isSelected = selected?.id === ph.id;

                return (
                  <div
                    key={ph.id}
                    onClick={() => {
                      onSelect(ph);
                      setOpen(false);
                      setQuery("");
                    }}
                    className={`flex items-center gap-3 px-4 py-2.5 cursor-pointer transition-colors border-b border-slate-50 last:border-0
                      ${isSelected ? "bg-teal-50" : "hover:bg-slate-50"}`}
                  >
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-[11px] font-bold text-white shrink-0"
                      style={{
                        background: isSelected
                          ? "linear-gradient(135deg,#0D9488,#0F766E)"
                          : "linear-gradient(135deg,#137FEC,#13B6EC)",
                      }}
                    >
                      {initials}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-slate-900 m-0 truncate">
                        {ph.name}
                      </p>
                      <p className="text-xs text-slate-400 m-0">
                        {ph.county} · {ph.phone}
                      </p>
                    </div>
                    {isSelected && (
                      <CheckCircle size={14} className="text-teal shrink-0" />
                    )}
                  </div>
                );
              })
            )}
          </div>

          <div className="px-4 py-2 border-t border-slate-50 bg-slate-50/50">
            <p className="text-[10px] text-slate-300 m-0">
              {filtered.length} pharmacist{filtered.length !== 1 ? "ies" : "y"}{" "}
              available
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

// Delivery type selector
function DeliveryTypeSelector({ selected, onSelect }) {
  const options = [
    {
      value: "home_delivery",
      label: "Home Delivery",
      icon: Truck,
      desc: "Delivered to patient's address",
    },
    {
      value: "pickup",
      label: "Pickup from Pharmacy",
      icon: Building2,
      desc: "Patient picks up from pharmacy",
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-3">
      {options.map(({ value, label, icon: Icon, desc }) => (
        <button
          key={value}
          type="button"
          onClick={() => onSelect(value)}
          className={`p-3 rounded-xl border-2 transition-all text-left ${
            selected === value
              ? "border-teal bg-teal-50"
              : "border-slate-200 hover:border-slate-300"
          }`}
        >
          <div className="flex items-center gap-2 mb-1">
            <Icon
              size={14}
              className={selected === value ? "text-teal" : "text-slate-400"}
            />
            <span
              className={`text-sm font-semibold ${selected === value ? "text-teal" : "text-slate-700"}`}
            >
              {label}
            </span>
          </div>
          <p className="text-[10px] text-slate-400 m-0">{desc}</p>
        </button>
      ))}
    </div>
  );
}

//  Main page
export default function EPrescriptions() {
  const location = useLocation();
  const { showToast } = useUI();
  const { mutate: createPrescription, isPending: isPrescribing } =
    useCreatePrescription();
  const { mutate: createOrder, isPending: isOrdering } = useCreateOrder();
  const { data: pharmaciesData, isLoading: pharmaciesLoading } =
    usePharmacies();

  const appointmentId = location.state?.appointmentId;
  const preselectedPatientId = location.state?.patientId;

  const { data: patRes, isLoading: patientsLoading } = usePatients();

  const patients =
    patRes?.data?.patients ?? (Array.isArray(patRes?.data) ? patRes.data : []);

  const pharmacies = pharmaciesData?.data ?? pharmaciesData ?? [];

  const [selectedPatient, setSelectedPatient] = useState(null);
  const [selectedPharmacy, setSelectedPharmacy] = useState(null);
  const [deliveryType, setDeliveryType] = useState("home_delivery");
  const [items, setItems] = useState([]);
  const [createdPrescriptionId, setCreatedPrescriptionId] = useState(null);
  const [drug, setDrug] = useState("");
  const [dosage, setDosage] = useState("");
  const [quantity, setQuantity] = useState(""); // ✅ quantity state
  const [freq, setFreq] = useState("Twice daily");
  const [dur, setDur] = useState("30");
  const [durUnit, setDurUnit] = useState("Days");
  const [route, setRoute] = useState("Oral");
  const [notes, setNotes] = useState("");
  const [interaction, setInteraction] = useState(null);
  const [sent, setSent] = useState(false);
  const [showOrderSection, setShowOrderSection] = useState(false);
  const [showClearModal, setShowClearModal] = useState(false);

  // Auto-select patient when coming from Telemedicine
  useEffect(() => {
    if (preselectedPatientId && patients.length > 0) {
      const found = patients.find((p) => p.id === preselectedPatientId);
      if (found) {
        setSelectedPatient(found);
        showToast(`Patient ${found.full_name ?? found.name} selected`, "info");
      }
    }
  }, [preselectedPatientId, patients, showToast]);

  const hasDataToClear = () => {
    return (
      items.length > 0 ||
      drug.trim() ||
      dosage.trim() ||
      quantity.trim() ||
      notes.trim() ||
      selectedPatient ||
      selectedPharmacy ||
      showOrderSection ||
      createdPrescriptionId
    );
  };

  const handleClearAll = () => {
    if (!preselectedPatientId) {
      setSelectedPatient(null);
    }
    setSelectedPharmacy(null);
    setDeliveryType("home_delivery");
    setItems([]);
    setCreatedPrescriptionId(null);
    setShowOrderSection(false);
    setDrug("");
    setDosage("");
    setQuantity(""); // ✅ reset quantity
    setFreq("Twice daily");
    setDur("30");
    setDurUnit("Days");
    setRoute("Oral");
    setNotes("");
    setInteraction(null);
    setSent(false);
    showToast("All data cleared", "info");
    setShowClearModal(false);
  };

  const handleAdd = () => {
    if (!drug.trim() || !dosage.trim()) {
      showToast("Please enter medication name and dosage", "error");
      return;
    }
    if (!quantity.trim()) {
      showToast("Please enter quantity", "error");
      return;
    }
    setItems((prev) => [
      ...prev,
      {
        id: Date.now(),
        drug,
        dosage,
        quantity, // ✅ included in item
        freq,
        duration: `${dur} ${durUnit}`,
        route,
        notes,
      },
    ]);
    setInteraction(
      drug.toLowerCase().includes("warfarin") ? "warning" : "safe",
    );
    setDrug("");
    setDosage("");
    setQuantity(""); // ✅ reset after add
    setNotes("");
  };

  const handleSendPrescription = () => {
    if (!selectedPatient) {
      showToast("Please select a patient first", "error");
      return;
    }
    if (!items.length) {
      showToast("Add at least one medication", "error");
      return;
    }

    // Map items to match API expectations
    const itemsPayload = items.map((item) => ({
      name: item.drug, // API expects 'name'
      dosage: item.dosage,
      quantity: item.quantity, // Now included
      frequency: item.freq,
      duration: item.duration, // Already formatted as "30 Days"
      route: item.route,
      notes: item.notes,
    }));

    console.log("Creating prescription with payload:", {
      patientId: selectedPatient.id,
      appointmentId,
      items: itemsPayload,
      diagnosis: "",
      notes: notes,
      priority: "normal",
    });

    createPrescription(
      {
        patientId: selectedPatient.id,
        appointmentId,
        items: itemsPayload,
        diagnosis: "",
        notes: notes,
        priority: "normal",
      },
      {
        onSuccess: (response) => {
          const prescriptionId = response?.data?.id || response?.id;
          setCreatedPrescriptionId(prescriptionId);
          showToast("Prescription created successfully", "success");
          setShowOrderSection(true);
          setSent(true);
          setTimeout(() => setSent(false), 4000);
        },
        onError: (err) => {
          console.error("Prescription creation error:", err);
          showToast(err.message ?? "Failed to create prescription", "error");
        },
      },
    );
  };

  const handleCreateOrder = () => {
    if (!createdPrescriptionId) {
      showToast("Please create prescription first", "error");
      return;
    }
    if (!selectedPharmacy) {
      showToast("Please select a pharmacy", "error");
      return;
    }

    createOrder(
      {
        prescription_id: createdPrescriptionId,
        pharmacy_id: selectedPharmacy.id,
        delivery_type: deliveryType,
      },
      {
        onSuccess: () => {
          showToast(
            "Order created successfully! Pharmacy will process your order.",
            "success",
          );
          setTimeout(() => {
            if (!preselectedPatientId) {
              setSelectedPatient(null);
            }
            setSelectedPharmacy(null);
            setItems([]);
            setCreatedPrescriptionId(null);
            setShowOrderSection(false);
            setDrug("");
            setDosage("");
            setQuantity("");
            setNotes("");
          }, 2000);
        },
        onError: (err) =>
          showToast(err.message ?? "Failed to create order", "error"),
      },
    );
  };

  const doctorName = (() => {
    try {
      return (
        JSON.parse(localStorage.getItem("afya_doctor") ?? "{}").full_name ??
        "Dr. Mwangi"
      );
    } catch {
      return "Dr. Mwangi";
    }
  })();

  const isFromTelemedicine = !!appointmentId && !!preselectedPatientId;
  const isCreatingOrder = isOrdering;

  return (
    <div className="p-6 flex flex-col gap-5">
      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={showClearModal}
        onClose={() => setShowClearModal(false)}
        onConfirm={handleClearAll}
        title="Clear All Data"
        message="Are you sure you want to clear all data? This action cannot be undone. All medications, patient selection, and form data will be lost."
        confirmText="Yes, Clear All"
        cancelText="Cancel"
      />

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-black text-slate-900 tracking-tight m-0">
            E-Prescriptions
          </h1>
          <p className="text-sm text-slate-400 m-0 mt-0.5">
            Create and send digital prescriptions to pharmacies
          </p>
          {isFromTelemedicine && (
            <div className="mt-2 inline-flex items-center gap-2 px-3 py-1.5 bg-teal-50 rounded-lg text-xs text-teal-700">
              <CheckCircle size={12} />
              Prescription for active consultation
            </div>
          )}
        </div>

        <button
          onClick={() => setShowClearModal(true)}
          disabled={!hasDataToClear()}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-50 text-red-600 text-sm font-semibold border-none cursor-pointer hover:bg-red-100 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <RefreshCw size={14} />
          Clear All
        </button>
      </div>

      <div className="flex gap-5 items-start">
        {/* ── Left: Form ──────────────────────────────── */}
        <div className="flex-1 flex flex-col gap-4">
          {/* Patient selection banner */}
          <div className="bg-white rounded-xl border border-slate-100 px-5 py-4">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <p className="text-xs font-semibold text-slate-400 m-0 uppercase tracking-[0.6px] mb-2">
                  {isFromTelemedicine
                    ? "Consultation Patient"
                    : "New E-Prescription"}
                </p>
                <div className="flex items-center gap-3">
                  <p className="text-sm font-semibold text-slate-700 m-0 shrink-0">
                    Patient:
                  </p>
                  <div className="flex-1 max-w-[320px]">
                    <PatientSelector
                      patients={patients}
                      loading={patientsLoading}
                      selected={selectedPatient}
                      onSelect={setSelectedPatient}
                      disabled={isFromTelemedicine}
                    />
                  </div>
                </div>
                {selectedPatient && (
                  <div className="flex items-center gap-4 mt-3 pt-3 border-t border-slate-50">
                    {[
                      ["Age", selectedPatient.age ?? "—"],
                      ["Blood Type", selectedPatient.blood_type ?? "—"],
                      ["Gender", selectedPatient.gender ?? "—"],
                      [
                        "Allergies",
                        Array.isArray(selectedPatient.allergies) &&
                        selectedPatient.allergies.length > 0
                          ? selectedPatient.allergies
                              .map((a) => a.allergen)
                              .join(", ")
                          : "None known",
                      ],
                    ].map(([label, value]) => (
                      <div key={label}>
                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.6px] m-0">
                          {label}
                        </p>
                        <p className="text-xs font-semibold text-slate-700 m-0 mt-0.5">
                          {value}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div className="flex gap-2 shrink-0">
                <button className="h-8 px-3 rounded-lg bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-600 cursor-pointer hover:bg-slate-100 transition-colors">
                  Allergies ({selectedPatient?.allergies?.length || "0"})
                </button>
              </div>
            </div>
          </div>

          {/* Medication Details card */}
          <div className="bg-white rounded-xl border border-slate-100 p-5">
            <div className="flex items-center gap-2 mb-4">
              <div
                className="w-4 h-4 rounded flex items-center justify-center shrink-0"
                style={{
                  background: "linear-gradient(135deg, #137FEC, #13B6EC)",
                }}
              >
                <svg width="9" height="9" viewBox="0 0 20 20" fill="white">
                  <path d="M10 2C8.5 2 7.5 3 7.5 4.5V7H5C3.5 7 2.5 8 2.5 9.5C2.5 11 3.5 12 5 12H7.5V14.5C7.5 16 8.5 17 10 17C11.5 17 12.5 16 12.5 14.5V12H15C16.5 12 17.5 11 17.5 9.5C17.5 8 16.5 7 15 7H12.5V4.5C12.5 3 11.5 2 10 2Z" />
                </svg>
              </div>
              <h3 className="text-sm font-bold text-slate-900 m-0">
                Medication Details
              </h3>
            </div>

            {/* Medication search */}
            <div className="mb-4">
              <label className="text-xs font-semibold text-slate-500 block mb-1.5">
                Medication Name
              </label>
              <div className="relative">
                <Search
                  size={14}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none"
                />
                <input
                  value={drug}
                  onChange={(e) => setDrug(e.target.value)}
                  placeholder="e.g., Metformin"
                  className={`${inp} pl-9`}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleAdd();
                  }}
                />
              </div>
            </div>

            {/* Dosage + Quantity */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="text-xs font-semibold text-slate-500 block mb-1.5">
                  Dosage
                </label>
                <input
                  value={dosage}
                  onChange={(e) => setDosage(e.target.value)}
                  placeholder="e.g., 500mg"
                  className={inp}
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-500 block mb-1.5">
                  Quantity <span className="text-red-400">*</span>
                </label>
                <input
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  placeholder="e.g., 60 tablets"
                  className={inp}
                />
              </div>
            </div>

            {/* Frequency + Route */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="text-xs font-semibold text-slate-500 block mb-1.5">
                  Frequency
                </label>
                <select
                  value={freq}
                  onChange={(e) => setFreq(e.target.value)}
                  className={`${inp} cursor-pointer`}
                >
                  {[
                    "Once daily",
                    "Twice daily",
                    "Three times daily",
                    "Four times daily",
                    "Every 8 hours",
                    "As needed",
                  ].map((o) => (
                    <option key={o}>{o}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-500 block mb-1.5">
                  Route
                </label>
                <select
                  value={route}
                  onChange={(e) => setRoute(e.target.value)}
                  className={`${inp} cursor-pointer`}
                >
                  {["Oral", "IV", "IM", "Topical", "Inhaled", "Sublingual"].map(
                    (o) => (
                      <option key={o}>{o}</option>
                    ),
                  )}
                </select>
              </div>
            </div>

            {/* Duration */}
            <div className="mb-4">
              <label className="text-xs font-semibold text-slate-500 block mb-1.5">
                Duration
              </label>
              <div className="flex gap-2">
                <input
                  value={dur}
                  onChange={(e) => setDur(e.target.value)}
                  placeholder="30"
                  className="w-16 h-10 px-3 bg-white border border-slate-200 rounded-lg text-sm text-slate-700 outline-none font-sans focus:border-teal focus:ring-2 focus:ring-teal/10 transition-all text-center"
                />
                <select
                  value={durUnit}
                  onChange={(e) => setDurUnit(e.target.value)}
                  className={`${inp} cursor-pointer flex-1`}
                >
                  {["Days", "Weeks", "Months"].map((o) => (
                    <option key={o}>{o}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Notes */}
            <div className="mb-5">
              <label className="text-xs font-semibold text-slate-500 block mb-1.5">
                Notes for Pharmacist / Patient
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Additional instructions..."
                className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-700 placeholder:text-slate-300 outline-none resize-none h-18 leading-relaxed font-sans focus:border-teal focus:ring-2 focus:ring-teal/10 transition-all"
              />
            </div>

            {/* Add button */}
            <button
              onClick={handleAdd}
              disabled={isPrescribing || showOrderSection}
              className="w-full h-10 rounded-lg flex items-center justify-center gap-2 text-white text-sm font-semibold border-none cursor-pointer transition-all hover:opacity-90 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                background: "linear-gradient(135deg, #137FEC, #0EA5E9)",
              }}
            >
              <Plus size={15} strokeWidth={2.5} />
              Add to Prescription
            </button>
          </div>

          {/* Drug Interaction Check */}
          {interaction && !showOrderSection && (
            <div
              className={`flex items-start gap-3 px-4 py-3 rounded-xl border ${
                interaction === "safe"
                  ? "bg-emerald-50 border-emerald-100"
                  : "bg-amber-50 border-amber-100"
              }`}
            >
              {interaction === "safe" ? (
                <Info size={15} className="text-teal shrink-0 mt-0.5" />
              ) : (
                <AlertCircle
                  size={15}
                  className="text-amber-600 shrink-0 mt-0.5"
                />
              )}
              <div>
                <p
                  className={`text-xs font-bold m-0 ${interaction === "safe" ? "text-teal" : "text-amber-700"}`}
                >
                  Drug Interaction Check
                </p>
                <p
                  className={`text-xs m-0 mt-0.5 ${interaction === "safe" ? "text-emerald-700" : "text-amber-600"}`}
                >
                  {interaction === "safe"
                    ? `No significant interactions found for ${drug || "this medication"} with existing patient profile.`
                    : "Potential interaction detected. Please review before sending."}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* ── Right: Prescription Summary & Order ── */}
        <div className="w-70 shrink-0 flex flex-col gap-3">
          <div className="bg-white rounded-xl border border-slate-100 overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-50">
              <h3 className="text-sm font-bold text-slate-900 m-0">
                Prescription Summary
              </h3>
              {selectedPatient && (
                <p className="text-xs text-slate-400 m-0 mt-0.5">
                  {selectedPatient.full_name ?? selectedPatient.name}
                </p>
              )}
            </div>

            {/* Items */}
            <div style={{ minHeight: 80 }}>
              {items.length === 0 ? (
                <div className="px-5 py-8 text-center">
                  <div
                    className="w-10 h-10 rounded-xl mx-auto mb-2 flex items-center justify-center"
                    style={{ background: "#F0FDF9" }}
                  >
                    <span className="text-sm font-black text-teal/30">Rx</span>
                  </div>
                  <p className="text-xs text-slate-300 m-0">
                    No medications added yet
                  </p>
                </div>
              ) : (
                items.map((item, i) => (
                  <div
                    key={item.id}
                    className={`flex items-start gap-3 px-4 py-3 ${i < items.length - 1 ? "border-b border-slate-50" : ""}`}
                  >
                    <CheckCircle
                      size={14}
                      className="text-teal shrink-0 mt-0.5"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-slate-900 m-0">
                        {item.drug}
                      </p>
                      <p className="text-xs text-slate-400 m-0 mt-0.5">
                        {item.dosage} · {item.freq} · {item.duration}
                      </p>
                      {/* ✅ Show quantity in summary */}
                      {item.quantity && (
                        <p className="text-xs text-teal font-semibold m-0 mt-0.5">
                          Qty: {item.quantity}
                        </p>
                      )}
                    </div>
                    {!showOrderSection && (
                      <button
                        onClick={() =>
                          setItems((prev) =>
                            prev.filter((x) => x.id !== item.id),
                          )
                        }
                        className="bg-transparent border-none cursor-pointer p-0.5 text-slate-200 hover:text-danger transition-colors shrink-0"
                      >
                        <Trash2 size={13} />
                      </button>
                    )}
                  </div>
                ))
              )}
            </div>

            {/* Create Prescription Button */}
            {!showOrderSection && (
              <div className="px-4 py-4 border-t border-slate-50">
                {!selectedPatient && (
                  <p className="text-[11px] text-warning-700 bg-warning-50 px-3 py-2 rounded-lg m-0 text-center mb-2">
                    Select a patient above to send
                  </p>
                )}
                <button
                  onClick={handleSendPrescription}
                  disabled={isPrescribing || !items.length || !selectedPatient}
                  className="w-full h-10 rounded-lg flex items-center justify-center gap-2 text-white text-sm font-semibold border-none cursor-pointer disabled:opacity-50 transition-all hover:opacity-90"
                  style={{
                    background: "linear-gradient(135deg, #0D9488, #0F766E)",
                    boxShadow: "0 4px 12px rgba(13,148,136,0.25)",
                  }}
                >
                  {isPrescribing ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Creating Prescription...
                    </>
                  ) : (
                    <>
                      <Send size={14} /> Create Prescription
                    </>
                  )}
                </button>
              </div>
            )}

            {/* Order Section */}
            {showOrderSection && (
              <>
                <div className="px-4 py-3 border-t border-slate-50 bg-teal-50/30">
                  <p className="text-xs font-semibold text-teal-700 m-0 flex items-center gap-2">
                    <CheckCircle size={12} />
                    Prescription created! Now create order
                  </p>
                </div>

                <div className="px-4 py-3 border-b border-slate-50">
                  <label className="text-xs font-semibold text-slate-500 block mb-2">
                    Select Pharmacy
                  </label>
                  <PharmacySelector
                    pharmacies={pharmacies}
                    loading={pharmaciesLoading}
                    selected={selectedPharmacy}
                    onSelect={setSelectedPharmacy}
                  />
                </div>

                <div className="px-4 py-3 border-b border-slate-50">
                  <label className="text-xs font-semibold text-slate-500 block mb-2">
                    Delivery Method
                  </label>
                  <DeliveryTypeSelector
                    selected={deliveryType}
                    onSelect={setDeliveryType}
                  />
                </div>

                <div className="px-4 py-4">
                  <button
                    onClick={handleCreateOrder}
                    disabled={isCreatingOrder || !selectedPharmacy}
                    className="w-full h-10 rounded-lg flex items-center justify-center gap-2 text-white text-sm font-semibold border-none cursor-pointer disabled:opacity-50 transition-all hover:opacity-90"
                    style={{
                      background: "linear-gradient(135deg, #137FEC, #13B6EC)",
                      boxShadow: "0 4px 12px rgba(19,127,236,0.25)",
                    }}
                  >
                    {isCreatingOrder ? (
                      <>
                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Creating Order...
                      </>
                    ) : (
                      <>
                        <Truck size={14} /> Create Order
                      </>
                    )}
                  </button>
                </div>
              </>
            )}
          </div>

          {/* Success banner */}
          {sent && (
            <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-emerald-50 border border-emerald-100">
              <CheckCircle size={15} className="text-success shrink-0" />
              <p className="text-xs font-semibold text-success-700 m-0">
                {showOrderSection
                  ? "Prescription created! Proceed to order."
                  : "Prescription sent successfully!"}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
