// src/pages/auth/Register.jsx
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  User,
  Phone,
  Stethoscope,
  FileText,
  AlertCircle,
  CheckCircle,
  Hospital,
  Plus,
  Trash2,
  Clock,
  Upload,
  X,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { uploadFileToCloudinary } from "../../services/uploadService";

const SPECIALTIES = [
  "Cardiologist",
  "Dermatologist",
  "Endocrinologist",
  "Gastroenterologist",
  "General Practitioner",
  "Gynecologist",
  "Neurologist",
  "Oncologist",
  "Ophthalmologist",
  "Orthopedic Surgeon",
  "Pediatrician",
  "Psychiatrist",
  "Pulmonologist",
  "Radiologist",
  "Urologist",
];

const DAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

const STEPS = ["Personal Info", "Credentials & Schedule", "Documents", "Account Setup"];

// ── Validation schemas ────────────────────────────────────
const step1Schema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  phone: z
    .string()
    .min(10, "Phone number is required")
    .regex(/^[0-9]{10,15}$/, "Invalid phone number"),
  gender: z.enum(["male", "female", "other"], {
    errorMap: () => ({ message: "Please select a gender" }),
  }),
  hospital: z.string().optional(),
  consultationFee: z
    .string()
    .min(1, "Consultation fee is required")
    .regex(/^\d+$/, "Must be a number"),
});

const step2Schema = z.object({
  specialty: z.string().min(1, "Please select your specialty"),
  license: z.string().min(1, "License number is required"),
  allowVideo: z.boolean(),
  allowInPerson: z.boolean(),
  slotDuration: z.string(),
  workingHours: z
    .array(
      z.object({
        day: z.string(),
        open: z.string().min(1, "Required"),
        close: z.string().min(1, "Required"),
      }),
    )
    .min(1, "Add at least one working day"),
});

const step3DocSchema = z.object({
  documents: z
    .array(
      z.object({
        name: z.string().min(1, "Document name is required"),
        file: z.instanceof(File).optional(),
      })
    )
    .min(1, "Upload at least one document"),
});

const step4Schema = z
  .object({
    email: z
      .string()
      .min(1, "Email is required")
      .email("Invalid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirm: z.string().min(1, "Please confirm your password"),
    agreed: z.boolean().refine((v) => v === true, "You must accept the terms"),
  })
  .refine((d) => d.password === d.confirm, {
    message: "Passwords don't match",
    path: ["confirm"],
  });

// ── Helpers ───────────────────────────────────────────────
function pwStrength(pw) {
  let s = 0;
  if (pw.length >= 8) s++;
  if (/[A-Z]/.test(pw)) s++;
  if (/[0-9]/.test(pw)) s++;
  if (/[^A-Za-z0-9]/.test(pw)) s++;
  return s;
}
const S_LABEL = ["", "Weak", "Fair", "Good", "Strong"];
const S_BAR = ["", "bg-red-500", "bg-amber-500", "bg-blue-500", "bg-green-500"];
const S_TEXT = [
  "",
  "text-red-600",
  "text-amber-600",
  "text-blue-600",
  "text-green-600",
];

// ── Main Component ────────────────────────────────────────
export default function Register() {
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();

  const [step, setStep] = useState(0);
  const [showPass, setShowPass] = useState(false);
  const [showConf, setShowConf] = useState(false);
  const [serverError, setServerError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // ── Step 1 form ─────────────────────────────────────────
  const f1 = useForm({
    resolver: zodResolver(step1Schema),
    defaultValues: {
      firstName: "",
      lastName: "",
      phone: "",
      gender: "",
      hospital: "",
      consultationFee: "",
    },
    mode: "onChange",
  });

  // ── Step 2 form ─────────────────────────────────────────
  const f2 = useForm({
    resolver: zodResolver(step2Schema),
    defaultValues: {
      specialty: "",
      license: "",
      allowVideo: true,
      allowInPerson: true,
      slotDuration: "30",
      workingHours: [{ day: "Monday", open: "08:30", close: "17:30" }],
    },
    mode: "onChange",
  });
  const {
    fields: whFields,
    append: whAppend,
    remove: whRemove,
  } = useFieldArray({
    control: f2.control,
    name: "workingHours",
  });

  // ── Step 3 form (Documents) ─────────────────────────────
  const f3Doc = useForm({
    resolver: zodResolver(step3DocSchema),
    defaultValues: {
      documents: [
        { name: "KMPDC License Scan", file: null },
        { name: "National ID", file: null },
      ],
    },
    mode: "onChange",
  });
  const {
    fields: docFields,
    append: docAppend,
    remove: docRemove,
    update: docUpdate,
  } = useFieldArray({
    control: f3Doc.control,
    name: "documents",
  });

  // ── Step 4 form (Account Setup) ──────────────────────────
  const f4 = useForm({
    resolver: zodResolver(step4Schema),
    defaultValues: { email: "", password: "", confirm: "", agreed: false },
    mode: "onChange",
  });

  const pw = f4.watch("password") ?? "";
  const cf = f4.watch("confirm") ?? "";
  const strength = pwStrength(pw);

  // ── Navigation ───────────────────────────────────────────
  const handleNext = async () => {
    let valid = false;
    if (step === 0) valid = await f1.trigger();
    else if (step === 1) valid = await f2.trigger();
    else if (step === 2) valid = await f3Doc.trigger();
    
    if (valid) {
      setStep((s) => s + 1);
      setServerError("");
    }
  };
  const handleBack = () => {
    setStep((s) => s - 1);
    setServerError("");
  };

  // ── File upload handler ──────────────────────────────────
  const handleFileChange = (index, file) => {
    if (file && file.size > 5 * 1024 * 1024) {
      alert("File size must be less than 5MB");
      return;
    }
    docUpdate(index, { ...f3Doc.getValues().documents[index], file });
  };

  // ── Submit ───────────────────────────────────────────────
  const handleSubmit = async () => {
    const valid = await f4.trigger();
    if (!valid) return;
    setSubmitting(true);
    setServerError("");
    try {
      // STEP 1: Upload documents to Cloudinary
      const documents = f3Doc.getValues("documents");
      const uploadedDocs = [];

      for (let i = 0; i < documents.length; i++) {
        const doc = documents[i];
        
        if (doc.file) {
          setServerError(`Uploading document ${i + 1} of ${documents.length}...`);
          const docUrl = await uploadFileToCloudinary(doc.file);
          uploadedDocs.push({
            name: doc.name,
            url: docUrl,
          });
        }
      }

      if (uploadedDocs.length === 0) {
        setServerError("Please upload at least one document");
        setSubmitting(false);
        return;
      }

      setServerError(""); // Clear upload status

      // STEP 2: Register with document URLs
      await registerUser({
        full_name:
          `Dr. ${f1.getValues("firstName")} ${f1.getValues("lastName")}`.trim(),
        phone_number: `+${f1.getValues("phone")}`,
        gender: f1.getValues("gender"),
        hospital: f1.getValues("hospital") ?? "",
        consultation_fee: Number(f1.getValues("consultationFee")),
        specialty: f2.getValues("specialty"),
        license_number: f2.getValues("license"),
        allow_video_consultations: f2.getValues("allowVideo"),
        allow_in_person_consultations: f2.getValues("allowInPerson"),
        slot_duration: Number(f2.getValues("slotDuration")),
        working_hours: f2.getValues("workingHours"),
        email: f4.getValues("email"),
        password: f4.getValues("password"),
        documents: uploadedDocs,
      });
      // AuthContext navigates to /login after register
    } catch (err) {
      const message = err?.message?.toLowerCase() || "";

      // PHONE ERROR (Step 1)
      if (message.includes("phone") || message.includes("phone_number")) {
        setStep(0);
        f1.setError("phone", {
          type: "manual",
          message: "Phone number already registered",
        });
        return;
      }

      // EMAIL ERROR (Step 4)
      if (message.includes("email")) {
        setStep(3);
        f4.setError("email", {
          type: "manual",
          message: "This email is already registered",
        });
        return;
      }

      // GENERAL ERROR
      setServerError("Registration failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  // ── Input class helper ────────────────────────────────────
  const inp =
    "w-full h-11 px-4 bg-slate-50 border rounded-xl text-sm text-slate-700 placeholder:text-slate-300 outline-none font-sans transition-all focus:bg-white";
  const bc = (form, name) => {
    if (form.formState.errors[name])
      return "border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-500/10";
    const touched = form.formState.touchedFields[name];
    const val = form.watch(name);
    if (touched && val)
      return "border-green-400 focus:border-green-500 focus:ring-2 focus:ring-green-500/10";
    return "border-slate-200 focus:border-primary focus:ring-2 focus:ring-primary/10";
  };

  const FieldError = ({ form, name }) =>
    form.formState.errors[name] ? (
      <p className="text-xs text-red-500 mt-0.5">
        {form.formState.errors[name].message}
      </p>
    ) : null;

  const CheckMark = ({ form, name }) => {
    const touched = form.formState.touchedFields[name];
    const val = form.watch(name);
    const err = form.formState.errors[name];
    return touched && val && !err ? (
      <CheckCircle
        size={14}
        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-green-500"
      />
    ) : null;
  };

  return (
    <div className="min-h-screen bg-page flex">
      {/* ── Left panel ───────────────────────────────────── */}
      <div
        className="hidden lg:flex w-110 shrink-0 flex-col justify-between p-12 relative overflow-hidden"
        style={{
          background:
            "linear-gradient(135deg,#0E6CC4 0%,#137FEC 55%,#13B6EC 100%)",
        }}
      >
        <div className="absolute -top-16 -right-16 w-56 h-56 rounded-full bg-white/6" />
        <div className="absolute -bottom-12 -left-12 w-48 h-48 rounded-full bg-white/6" />

        {/* Logo */}
        <div className="flex items-center gap-3 relative z-10">
          <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
            <svg width="22" height="22" viewBox="0 0 20 20" fill="none">
              <path
                d="M10 2C8.5 2 7.5 3 7.5 4.5V7H5C3.5 7 2.5 8 2.5 9.5C2.5 11 3.5 12 5 12H7.5V14.5C7.5 16 8.5 17 10 17C11.5 17 12.5 16 12.5 14.5V12H15C16.5 12 17.5 11 17.5 9.5C17.5 8 16.5 7 15 7H12.5V4.5C12.5 3 11.5 2 10 2Z"
                fill="white"
              />
            </svg>
          </div>
          <div>
            <p className="text-xl font-black text-white tracking-tight m-0">
              AfyaBridge
            </p>
            <p className="text-[10px] font-semibold text-white/60 uppercase tracking-[0.8px] m-0">
              Doctor Portal
            </p>
          </div>
        </div>

        {/* Steps */}
        <div className="relative z-10">
          <p className="text-white/50 text-sm mb-6 m-0">
            Complete {STEPS.length} steps to get started
          </p>
          <div className="flex flex-col gap-4">
            {STEPS.map((label, i) => (
              <div key={label} className="flex items-center gap-4">
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 font-bold text-sm transition-all border-2
                  ${
                    i < step
                      ? "border-transparent text-primary bg-white"
                      : i === step
                        ? "border-white/40 text-white bg-white/15"
                        : "border-white/15 text-white/30 bg-transparent"
                  }`}
                >
                  {i < step ? (
                    <CheckCircle size={16} className="text-primary" />
                  ) : (
                    i + 1
                  )}
                </div>
                <div>
                  <p
                    className={`text-sm font-semibold m-0 ${i === step ? "text-white" : i < step ? "text-white/70" : "text-white/30"}`}
                  >
                    {label}
                  </p>
                  {i === step && (
                    <p className="text-[11px] text-white/45 m-0 mt-0.5">
                      {i === 0 && "Your name, contact and consultation details"}
                      {i === 1 && "Medical license, schedule and availability"}
                      {i === 2 && "Upload your professional documents"}
                      {i === 3 && "Email and secure password"}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <p className="text-sm text-white/90 relative z-10 m-0">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-white font-bold no-underline hover:opacity-80 transition-opacity"
          >
            Sign in here
          </Link>
        </p>
      </div>

      {/* ── Right panel ──────────────────────────────────── */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 bg-page overflow-y-auto">
        <div className="w-full max-w-125">
          {/* Progress bar */}
          <div className="flex gap-1.5 mb-6">
            {STEPS.map((_, i) => (
              <div
                key={i}
                className="flex-1 h-1 rounded-full transition-all duration-300"
                style={{
                  background:
                    i <= step
                      ? "linear-gradient(90deg,#137FEC,#13B6EC)"
                      : "#E8EDF3",
                }}
              />
            ))}
          </div>

          <div
            className="bg-white rounded-2xl p-8"
            style={{ boxShadow: "0 8px 40px rgba(0,0,0,0.08)" }}
          >
            {/* Heading */}
            <div className="mb-6">
              <p className="text-[11px] font-black text-primary uppercase tracking-[1.2px] m-0">
                Step {step + 1} of {STEPS.length}
              </p>
              <h1 className="text-[24px] font-black text-slate-900 tracking-tight m-0 mt-1">
                {step === 0 && "Personal Information"}
                {step === 1 && "Credentials & Schedule"}
                {step === 2 && "Upload Documents"}
                {step === 3 && "Account Setup"}
              </h1>
              <p className="text-sm text-slate-400 m-0 mt-1.5">
                {step === 0 &&
                  "Tell us about yourself and your consultation details."}
                {step === 1 &&
                  "We verify all healthcare professionals on AfyaBridge."}
                {step === 2 &&
                  "Upload your professional documents for verification."}
                {step === 3 &&
                  "Choose a secure email and password for your account."}
              </p>
            </div>

            {/* Server error */}
            {serverError && (
              <div className="flex items-center gap-3 px-4 py-3 bg-danger-50 rounded-xl mb-5 border-l-4 border-danger">
                <AlertCircle size={15} className="text-danger shrink-0" />
                <p className="text-sm font-medium text-danger-700 m-0">
                  {serverError}
                </p>
              </div>
            )}

            {/* ── Step 0 — Personal Info ───────────────────── */}
            {step === 0 && (
              <div className="flex flex-col gap-4">
                {/* First + Last name */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[12px] font-bold text-slate-400 uppercase tracking-[0.8px]">
                      First Name *
                    </label>
                    <div className="relative">
                      <User
                        size={14}
                        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none"
                      />
                      <input
                        {...f1.register("firstName")}
                        placeholder="David"
                        className={`${inp} pl-10 ${bc(f1, "firstName")}`}
                      />
                      <CheckMark form={f1} name="firstName" />
                    </div>
                    <FieldError form={f1} name="firstName" />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[12px] font-bold text-slate-400 uppercase tracking-[0.8px]">
                      Last Name *
                    </label>
                    <div className="relative">
                      <input
                        {...f1.register("lastName")}
                        placeholder="Mwangi"
                        className={`${inp} ${bc(f1, "lastName")}`}
                      />
                      <CheckMark form={f1} name="lastName" />
                    </div>
                    <FieldError form={f1} name="lastName" />
                  </div>
                </div>

                {/* Phone */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[12px] font-bold text-slate-400 uppercase tracking-[0.8px]">
                    Phone Number *
                  </label>
                  <div className="relative">
                    <Phone
                      size={14}
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none"
                    />
                    <PhoneInput
                      country={"ke"}
                      value={f1.watch("phone")}
                      onChange={(value) =>
                        f1.setValue("phone", value, { shouldValidate: true })
                      }
                      enableSearch={true}
                      inputClass={`${inp} !pl-14 ${
                        f1.formState.errors.phone ? "!border-red-400" : ""
                      }`}
                      containerClass="w-full"
                    />
                    <CheckMark form={f1} name="phone" />
                  </div>
                  <FieldError form={f1} name="phone" />
                </div>

                {/* Gender */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[12px] font-bold text-slate-400 uppercase tracking-[0.8px]">
                    Gender *
                  </label>
                  <select
                    {...f1.register("gender")}
                    className={`${inp} cursor-pointer ${bc(f1, "gender")}`}
                  >
                    <option value="">Select gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                  <FieldError form={f1} name="gender" />
                </div>

                {/* Hospital */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[12px] font-bold text-slate-400 uppercase tracking-[0.8px]">
                    Hospital / Clinic
                  </label>
                  <div className="relative">
                    <Hospital
                      size={14}
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none"
                    />
                    <input
                      {...f1.register("hospital")}
                      placeholder="e.g. Nairobi General Hospital"
                      className={`${inp} pl-10 border-slate-200 focus:border-primary focus:ring-2 focus:ring-primary/10`}
                    />
                  </div>
                </div>

                {/* Consultation fee */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[12px] font-bold text-slate-400 uppercase tracking-[0.8px]">
                    Consultation Fee (KES) *
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-semibold text-slate-400 pointer-events-none">
                      KES
                    </span>
                    <input
                      {...f1.register("consultationFee")}
                      type="number"
                      min="0"
                      placeholder="e.g. 2500"
                      className={`${inp} pl-12 ${bc(f1, "consultationFee")}`}
                    />
                    <CheckMark form={f1} name="consultationFee" />
                  </div>
                  <FieldError form={f1} name="consultationFee" />
                </div>
              </div>
            )}

            {/* ── Step 1 — Credentials & Schedule ─────────── */}
            {step === 1 && (
              <div className="flex flex-col gap-5">
                {/* Specialty */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[12px] font-bold text-slate-400 uppercase tracking-[0.8px]">
                    Specialty *
                  </label>
                  <div className="relative">
                    <Stethoscope
                      size={14}
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none"
                    />
                    <select
                      {...f2.register("specialty")}
                      className={`${inp} pl-10 cursor-pointer ${bc(f2, "specialty")}`}
                    >
                      <option value="">Select your specialty</option>
                      {SPECIALTIES.map((s) => (
                        <option key={s}>{s}</option>
                      ))}
                    </select>
                  </div>
                  <FieldError form={f2} name="specialty" />
                </div>

                {/* License */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[12px] font-bold text-slate-400 uppercase tracking-[0.8px]">
                    KMPDC License Number *
                  </label>
                  <div className="relative">
                    <FileText
                      size={14}
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none"
                    />
                    <input
                      {...f2.register("license")}
                      placeholder="e.g. KMPDC/2021/0042"
                      className={`${inp} pl-10 ${bc(f2, "license")}`}
                    />
                    <CheckMark form={f2} name="license" />
                  </div>
                  <FieldError form={f2} name="license" />
                </div>

                {/* Consultation types */}
                <div className="flex flex-col gap-2">
                  <label className="text-[12px] font-bold text-slate-400 uppercase tracking-[0.8px]">
                    Consultation Types
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { name: "allowVideo", label: "Video Consultations" },
                      {
                        name: "allowInPerson",
                        label: "In-Person Consultations",
                      },
                    ].map(({ name, label }) => {
                      const checked = f2.watch(name);
                      return (
                        <label
                          key={name}
                          className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all
                            ${checked ? "border-primary bg-primary-50" : "border-slate-200 bg-slate-50 hover:border-slate-300"}`}
                        >
                          <div
                            onClick={() => f2.setValue(name, !checked)}
                            className={`w-4.5 h-4.5 rounded-md flex items-center justify-center shrink-0 border-2 transition-all
                              ${checked ? "border-transparent" : "bg-white border-slate-200"}`}
                            style={
                              checked
                                ? {
                                    background:
                                      "linear-gradient(135deg,#137FEC,#13B6EC)",
                                  }
                                : {}
                            }
                          >
                            {checked && (
                              <svg
                                width="10"
                                height="8"
                                viewBox="0 0 10 8"
                                fill="none"
                              >
                                <path
                                  d="M1 4L3.5 6.5L9 1"
                                  stroke="white"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                              </svg>
                            )}
                          </div>
                          <span
                            className={`text-sm font-medium ${checked ? "text-primary" : "text-slate-600"}`}
                          >
                            {label}
                          </span>
                        </label>
                      );
                    })}
                  </div>
                </div>

                {/* Slot duration */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[12px] font-bold text-slate-400 uppercase tracking-[0.8px]">
                    Slot Duration (minutes)
                  </label>
                  <select
                    {...f2.register("slotDuration")}
                    className={`${inp} cursor-pointer border-slate-200 focus:border-primary focus:ring-2 focus:ring-primary/10`}
                  >
                    {["15", "20", "30", "45", "60"].map((d) => (
                      <option key={d} value={d}>
                        {d} minutes
                      </option>
                    ))}
                  </select>
                </div>

                {/* Working hours */}
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <label className="text-[12px] font-bold text-slate-400 uppercase tracking-[0.8px]">
                      Working Hours *
                    </label>
                    <button
                      type="button"
                      onClick={() =>
                        whAppend({
                          day: "Monday",
                          open: "08:30",
                          close: "17:30",
                        })
                      }
                      className="flex items-center gap-1 text-xs font-bold text-primary bg-primary-50 hover:bg-primary-100 px-2.5 py-1.5 rounded-lg border-none cursor-pointer transition-colors"
                    >
                      <Plus size={12} /> Add Day
                    </button>
                  </div>

                  {f2.formState.errors.workingHours?.root && (
                    <p className="text-xs text-red-500">
                      {f2.formState.errors.workingHours.root.message}
                    </p>
                  )}
                  {f2.formState.errors.workingHours?.message && (
                    <p className="text-xs text-red-500">
                      {f2.formState.errors.workingHours.message}
                    </p>
                  )}

                  <div className="flex flex-col gap-2">
                    {whFields.map((field, index) => (
                      <div
                        key={field.id}
                        className="flex items-center gap-2 p-3 bg-slate-50 rounded-xl border border-slate-150"
                      >
                        {/* Day selector */}
                        <select
                          {...f2.register(`workingHours.${index}.day`)}
                          className="h-9 px-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-700 outline-none font-sans focus:border-primary cursor-pointer flex-1"
                        >
                          {DAYS.map((d) => (
                            <option key={d} value={d}>
                              {d}
                            </option>
                          ))}
                        </select>

                        {/* Open time */}
                        <div className="flex items-center gap-1.5">
                          <Clock
                            size={12}
                            className="text-slate-300 shrink-0"
                          />
                          <input
                            {...f2.register(`workingHours.${index}.open`)}
                            type="time"
                            className="h-9 px-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-700 outline-none font-sans focus:border-primary w-25"
                          />
                        </div>

                        <span className="text-slate-300 text-xs font-bold shrink-0">
                          to
                        </span>

                        {/* Close time */}
                        <input
                          {...f2.register(`workingHours.${index}.close`)}
                          type="time"
                          className="h-9 px-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-700 outline-none font-sans focus:border-primary w-25"
                        />

                        {/* Remove */}
                        {whFields.length > 1 && (
                          <button
                            type="button"
                            onClick={() => whRemove(index)}
                            className="p-1.5 rounded-lg text-slate-300 hover:text-danger hover:bg-danger-50 bg-transparent border-none cursor-pointer transition-colors shrink-0"
                          >
                            <Trash2 size={13} />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Verification note */}
                <div
                  className="flex gap-3 px-4 py-3.5 rounded-xl"
                  style={{
                    background: "linear-gradient(135deg,#EBF5FF,#D1E9FF)",
                  }}
                >
                  <CheckCircle
                    size={15}
                    className="text-primary shrink-0 mt-0.5"
                  />
                  <p className="text-xs text-slate-500 m-0 leading-relaxed">
                    Your KMPDC license will be verified within 24 hours. You can
                    explore the portal while we review your credentials.
                  </p>
                </div>
              </div>
            )}

            {/* ── Step 2 — Documents ───────────────────────── */}
            {step === 2 && (
              <div className="flex flex-col gap-5">
                <p className="text-sm text-slate-600 m-0 mb-2">
                  Upload your professional documents for verification
                </p>

                {docFields.map((field, index) => (
                  <div key={field.id} className="flex flex-col gap-2">
                    <label className="text-[12px] font-bold text-slate-400 uppercase tracking-[0.8px]">
                      {field.name} *
                    </label>

                    <div
                      className="border-2 border-dashed border-slate-200 rounded-lg p-6 text-center cursor-pointer hover:border-primary hover:bg-primary/5 transition-all"
                      onClick={() => document.getElementById(`doc-${index}`).click()}
                    >
                      <Upload size={24} className="text-slate-300 mx-auto mb-2" />
                      <p className="text-sm font-semibold text-slate-700 m-0">
                        Click to upload or drag
                      </p>
                      <p className="text-xs text-slate-400 m-0 mt-1">
                        Max 5MB (PDF, JPG, PNG)
                      </p>
                      {f3Doc.getValues().documents[index]?.file && (
                        <p className="text-xs text-green-600 m-0 mt-2">
                          ✓ {f3Doc.getValues().documents[index].file.name}
                        </p>
                      )}
                    </div>

                    <input
                      id={`doc-${index}`}
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={(e) => handleFileChange(index, e.target.files?.[0])}
                      className="hidden"
                    />

                    {f3Doc.formState.errors.documents?.[index]?.file && (
                      <p className="text-xs text-red-500">
                        {f3Doc.formState.errors.documents[index].file.message}
                      </p>
                    )}
                  </div>
                ))}

                <button
                  type="button"
                  onClick={() => docAppend({ name: "", file: null })}
                  className="h-10 rounded-lg border border-slate-200 text-slate-700 font-semibold hover:bg-slate-50 transition-colors flex items-center justify-center gap-2"
                >
                  <Plus size={16} /> Add Another Document
                </button>
              </div>
            )}

            {/* ── Step 3 — Account Setup ───────────────────── */}
            {step === 3 && (
              <div className="flex flex-col gap-4">
                {/* Email */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[12px] font-bold text-slate-400 uppercase tracking-[0.8px]">
                    Email Address *
                  </label>
                  <div className="relative">
                    <Mail
                      size={14}
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none"
                    />
                    <input
                      {...f4.register("email")}
                      type="email"
                      placeholder="doctor@hospital.com"
                      className={`${inp} pl-10 ${bc(f4, "email")}`}
                      autoComplete="email"
                    />
                    <CheckMark form={f4} name="email" />
                  </div>
                  <FieldError form={f4} name="email" />
                </div>

                {/* Password */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[12px] font-bold text-slate-400 uppercase tracking-[0.8px]">
                    Password *
                  </label>
                  <div className="relative">
                    <Lock
                      size={14}
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none"
                    />
                    <input
                      {...f4.register("password")}
                      type={showPass ? "text" : "password"}
                      placeholder="Create a strong password"
                      className={`${inp} pl-10 pr-11 ${bc(f4, "password")}`}
                      autoComplete="new-password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPass(!showPass)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-1 bg-transparent border-none cursor-pointer flex hover:opacity-70"
                    >
                      {showPass ? (
                        <EyeOff size={15} className="text-slate-400" />
                      ) : (
                        <Eye size={15} className="text-slate-400" />
                      )}
                    </button>
                  </div>
                  <FieldError form={f4} name="password" />
                </div>

                {/* Password strength */}
                {pw.length > 0 && (
                  <div className="-mt-2">
                    <div className="flex gap-1 mb-1.5">
                      {[1, 2, 3, 4].map((i) => (
                        <div
                          key={i}
                          className={`flex-1 h-1 rounded-full transition-all ${i <= strength ? S_BAR[strength] : "bg-slate-200"}`}
                        />
                      ))}
                    </div>
                    <p
                      className={`text-xs font-semibold m-0 ${S_TEXT[strength]}`}
                    >
                      {S_LABEL[strength]} password
                    </p>
                    <p className="text-xs text-slate-300 m-0 mt-0.5">
                      Use 8+ chars with uppercase, numbers & symbols
                    </p>
                  </div>
                )}

                {/* Confirm password */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[12px] font-bold text-slate-400 uppercase tracking-[0.8px]">
                    Confirm Password *
                  </label>
                  <div className="relative">
                    <Lock
                      size={14}
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none"
                    />
                    <input
                      {...f4.register("confirm")}
                      type={showConf ? "text" : "password"}
                      placeholder="Re-enter your password"
                      className={`${inp} pl-10 pr-11 ${bc(f4, "confirm")}`}
                      autoComplete="new-password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConf(!showConf)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-1 bg-transparent border-none cursor-pointer flex hover:opacity-70"
                    >
                      {showConf ? (
                        <EyeOff size={15} className="text-slate-400" />
                      ) : (
                        <Eye size={15} className="text-slate-400" />
                      )}
                    </button>
                  </div>
                  <FieldError form={f4} name="confirm" />
                  {cf && pw && cf === pw && !f4.formState.errors.confirm && (
                    <p className="text-xs text-green-600 m-0">
                      ✓ Passwords match
                    </p>
                  )}
                </div>

                {/* Terms */}
                <label className="flex items-start gap-3 cursor-pointer select-none group">
                  <div
                    onClick={() =>
                      f4.setValue("agreed", !f4.watch("agreed"), {
                        shouldValidate: true,
                      })
                    }
                    className={`w-4.5 h-4.5 rounded-md flex items-center justify-center shrink-0 border-2 mt-0.5 transition-all cursor-pointer
                      ${f4.watch("agreed") ? "border-transparent" : "bg-white border-slate-200 group-hover:border-primary"}`}
                    style={
                      f4.watch("agreed")
                        ? {
                            background:
                              "linear-gradient(135deg,#137FEC,#13B6EC)",
                          }
                        : {}
                    }
                  >
                    {f4.watch("agreed") && (
                      <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                        <path
                          d="M1 4L3.5 6.5L9 1"
                          stroke="white"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    )}
                  </div>
                  <span className="text-sm text-slate-500 leading-relaxed">
                    I agree to the{" "}
                    <Link
                      to="/terms"
                      className="text-primary font-semibold no-underline hover:underline"
                    >
                      Terms of Service
                    </Link>{" "}
                    and{" "}
                    <Link
                      to="/privacy"
                      className="text-primary font-semibold no-underline hover:underline"
                    >
                      Privacy Policy
                    </Link>
                  </span>
                </label>
                <FieldError form={f4} name="agreed" />
              </div>
            )}

            {/* ── Navigation buttons ───────────────────────── */}
            <div className="flex gap-3 mt-6">
              {step > 0 && (
                <button
                  type="button"
                  onClick={handleBack}
                  className="flex-1 h-11 rounded-xl bg-white border border-slate-200 text-slate-600 text-sm font-semibold cursor-pointer hover:bg-slate-50 transition-colors"
                >
                  Back
                </button>
              )}
              {step < STEPS.length - 1 ? (
                <button
                  type="button"
                  onClick={handleNext}
                  className={`h-11 rounded-xl text-white text-sm font-semibold border-none cursor-pointer transition-all hover:-translate-y-px active:translate-y-0 ${step > 0 ? "flex-1" : "w-full"}`}
                  style={{
                    background: "linear-gradient(135deg,#137FEC,#13B6EC)",
                    boxShadow: "0 4px 14px rgba(19,127,236,0.35)",
                  }}
                >
                  Continue
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={submitting || !f4.formState.isValid}
                  className={`h-11 rounded-xl text-white text-sm font-semibold border-none cursor-pointer transition-all hover:-translate-y-px disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0 ${step > 0 ? "flex-1" : "w-full"}`}
                  style={{
                    background: "linear-gradient(135deg,#137FEC,#13B6EC)",
                    boxShadow: "0 4px 14px rgba(19,127,236,0.35)",
                  }}
                >
                  {submitting ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Creating account…
                    </span>
                  ) : (
                    "Create Account"
                  )}
                </button>
              )}
            </div>

            <p className="text-sm text-slate-400 text-center mt-5 m-0">
              Already have an account?{" "}
              <Link
                to="/login"
                className="font-bold text-blue-500 no-underline hover:underline"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}