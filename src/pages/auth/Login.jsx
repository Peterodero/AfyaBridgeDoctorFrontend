// src/pages/auth/Login.jsx
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";

// Validation schema using Zod
const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address")
    .max(255, "Email is too long"),
  password: z
    .string()
    .min(1, "Password is required")
    .min(8, "Password must be at least 8 characters")
    .max(100, "Password is too long"),
  rememberMe: z.boolean().optional().default(false),
});

export default function Login() {
  const { login } = useAuth();
  const location = useLocation();
  const sessionExpired = location.state?.reason === "expired";

  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, touchedFields, isValid },
    watch,
    setError,
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
    mode: "onChange",
  });

  const watchEmail = watch("email");
  const watchPassword = watch("password");

  const onSubmit = async (data) => {
    setServerError("");
    setIsSubmitting(true);

    try {
      await login({
        email: data.email,
        password: data.password,
      });
    } catch (err) {
      setServerError(
        err?.message ?? "Invalid email or password. Please try again."
      );
      // setError("password", {
      //   type: "manual",
      //   message: "Invalid credentials",
      // });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getInputBorderClass = (fieldName) => {
    if (errors[fieldName])
      return "border-red-500 focus:border-red-500 focus:ring-red-500/10";
    if (touchedFields[fieldName] && watch(fieldName))
      return "border-green-500 focus:border-green-500 focus:ring-green-500/10";
    return "border-slate-200 focus:border-blue-500 focus:ring-blue-500/10";
  };

  return (
    <div className="min-h-screen bg-page flex">
      {/* Left panel - Hero section */}
      <div
        className="hidden lg:flex w-130 shrink-0 flex-col justify-between p-12 relative overflow-hidden"
        style={{
          background:
            "linear-gradient(135deg, #0E6CC4 0%, #137FEC 55%, #13B6EC 100%)",
        }}
      >
        <div className="absolute -top-16 -right-16 w-56 h-56 rounded-full bg-white/6" />
        <div className="absolute -bottom-12 -left-12 w-48 h-48 rounded-full bg-white/6" />
        <div className="absolute top-1/3 right-12 w-24 h-24 rounded-full bg-white/4" />

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

        <div className="relative z-10">
          <h2 className="text-[40px] font-black text-white leading-[1.1] m-0 mb-4">
            Quality care
            <br />
            starts here.
          </h2>
          <p className="text-base text-white/65 leading-relaxed m-0 mb-10">
            Manage appointments, consult patients via telemedicine, and send
            digital prescriptions — all in one place.
          </p>
         
        </div>

        <p className="text-sm text-white/40 relative z-10 m-0 italic">
          "Connecting doctors and patients across Kenya."
        </p>
      </div>

      {/* Right panel - Login form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 bg-page">
        <div className="w-full max-w-110">
          {/* Mobile logo */}
          <div className="flex items-center gap-3 mb-8 lg:hidden">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center shadow-blue-sm"
              style={{ background: "linear-gradient(135deg,#137FEC,#13B6EC)" }}
            >
              <svg width="19" height="19" viewBox="0 0 20 20" fill="none">
                <path
                  d="M10 2C8.5 2 7.5 3 7.5 4.5V7H5C3.5 7 2.5 8 2.5 9.5C2.5 11 3.5 12 5 12H7.5V14.5C7.5 16 8.5 17 10 17C11.5 17 12.5 16 12.5 14.5V12H15C16.5 12 17.5 11 17.5 9.5C17.5 8 16.5 7 15 7H12.5V4.5C12.5 3 11.5 2 10 2Z"
                  fill="white"
                />
              </svg>
            </div>
            <p className="text-lg font-black text-slate-900 m-0">AfyaBridge</p>
          </div>

          <div
            className="bg-white rounded-2xl p-8"
            style={{ boxShadow: "0 8px 40px rgba(0,0,0,0.08)" }}
          >
            <div className="mb-7">
              <h1 className="text-[26px] font-black text-slate-900 tracking-tight m-0">
                Welcome back
              </h1>
              <p className="text-sm text-slate-400 m-0 mt-1.5">
                Sign in to your doctor portal
              </p>
            </div>

            {/* Session expired alert */}
            {sessionExpired && !serverError && (
              <div className="flex items-center gap-3 px-4 py-3 bg-amber-50 rounded-xl mb-5 border-l-4 border-amber-500">
                <AlertCircle size={15} className="text-amber-600 shrink-0" />
                <p className="text-sm font-medium text-amber-700 m-0">
                  Your session expired. Please sign in again.
                </p>
              </div>
            )}

            {/* Server error alert */}
            {serverError && (
              <div className="flex items-center gap-3 px-4 py-3 bg-red-50 rounded-xl mb-5 border-l-4 border-red-500">
                <AlertCircle size={15} className="text-red-600 shrink-0" />
                <p className="text-sm font-medium text-red-700 m-0">
                  {serverError}
                </p>
              </div>
            )}

            <form
              onSubmit={handleSubmit(onSubmit)}
              className="flex flex-col gap-5"
            >
              {/* Email field */}
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-[12px] font-bold text-slate-400 uppercase tracking-[0.8px]">
                    Email Address
                  </label>
                  {errors.email && (
                    <span className="text-[11px] font-medium text-red-500">
                      {errors.email.message}
                    </span>
                  )}
                </div>
                <div className="relative">
                  <Mail
                    size={14}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none"
                  />
                  <input
                    type="email"
                    {...register("email")}
                    placeholder="doctor@afyabridge.com"
                    className={`w-full h-11 pl-10 pr-4 bg-slate-50 border rounded-xl text-sm text-slate-700 placeholder:text-slate-300 outline-none font-sans transition-all focus:bg-white ${getInputBorderClass("email")}`}
                    autoComplete="email"
                    aria-invalid={!!errors.email}
                  />
                  {touchedFields.email && watchEmail && !errors.email && (
                    <CheckCircle
                      size={14}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-green-500"
                    />
                  )}
                </div>
                {!errors.email && touchedFields.email && watchEmail && (
                  <p className="text-xs text-green-600 mt-0.5">
                    ✓ Valid email format
                  </p>
                )}
              </div>

              {/* Password field */}
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-[12px] font-bold text-slate-400 uppercase tracking-[0.8px]">
                    Password
                  </label>
                  {errors.password && (
                    <span className="text-[11px] font-medium text-red-500">
                      {errors.password.message}
                    </span>
                  )}
                </div>
                <div className="relative">
                  <Lock
                    size={14}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none"
                  />
                  <input
                    type={showPassword ? "text" : "password"}
                    {...register("password")}
                    placeholder="Enter your password"
                    className={`w-full h-11 pl-10 pr-11 bg-slate-50 border rounded-xl text-sm text-slate-700 placeholder:text-slate-300 outline-none font-sans transition-all focus:bg-white ${getInputBorderClass("password")}`}
                    autoComplete="current-password"
                    aria-invalid={!!errors.password}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 bg-transparent border-none cursor-pointer flex hover:opacity-70 transition-opacity"
                  >
                    {showPassword ? (
                      <EyeOff size={15} className="text-slate-400" />
                    ) : (
                      <Eye size={15} className="text-slate-400" />
                    )}
                  </button>
                </div>
                {touchedFields.password &&
                  watchPassword &&
                  !errors.password &&
                  watchPassword.length >= 8 && (
                    <p className="text-xs text-green-600 mt-0.5">
                      ✓ Password strength: {watchPassword.length}/8+ characters
                    </p>
                  )}
              </div>

              {/* Remember me & Forgot password */}
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-3 cursor-pointer select-none group">
                  <div
                    onClick={() => {
                      const currentValue = watch("rememberMe");
                      register("rememberMe").onChange({
                        target: { value: !currentValue, name: "rememberMe" },
                      });
                    }}
                    className={`w-4.5 h-4.5 rounded-md flex items-center justify-center shrink-0 border-2 transition-all cursor-pointer
                      ${
                        watch("rememberMe")
                          ? "border-transparent shadow-blue-sm"
                          : "bg-white border-slate-200 group-hover:border-blue-500"
                      }`}
                    style={
                      watch("rememberMe")
                        ? {
                            background:
                              "linear-gradient(135deg,#137FEC,#13B6EC)",
                          }
                        : {}
                    }
                  >
                    {watch("rememberMe") && (
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
                  <span className="text-sm text-slate-600 group-hover:text-slate-800 transition-colors">
                    Keep me signed in
                  </span>
                </label>
                <Link
                  to="/forgot-password"
                  className="text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors no-underline hover:underline"
                >
                  Forgot Password?
                </Link>
              </div>

              {/* Submit button with blue gradient matching left panel */}
              <button
                type="submit"
                disabled={isSubmitting || !isValid}
                className={`w-full h-11 rounded-xl text-white text-sm font-semibold cursor-pointer transition-all mt-2
                  bg-linear-to-r from-[#0E6CC4] via-[#137FEC] to-[#13B6EC]
                  shadow-lg shadow-blue-500/25
                  hover:shadow-xl hover:shadow-blue-500/30 hover:-translate-y-px
                  active:translate-y-0 active:shadow-md
                  disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0`}
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Signing in...
                  </span>
                ) : (
                  "Sign In"
                )}
              </button>

              {/* Validation summary */}
              {!isValid && Object.keys(errors).length > 0 && (
                <div className="mt-2 p-3 bg-amber-50 rounded-lg border-l-4 border-amber-500">
                  <p className="text-xs font-medium text-amber-700 m-0 flex items-center gap-2">
                    <AlertCircle size={12} />
                    Please fix the errors above before signing in
                  </p>
                </div>
              )}
            </form>

            {/* Register link */}
            <p className="text-sm text-slate-400 text-center mt-6 m-0">
              Don't have an account?{" "}
              <Link
                to="/register"
                className="font-bold text-blue-600 hover:text-blue-700 transition-colors no-underline hover:underline"
              >
                Create account
              </Link>
            </p>
          </div>

          {/* Security note */}
          <p className="text-center text-xs text-slate-400 mt-6">
            Secure login • Your data is encrypted
          </p>
        </div>
      </div>
    </div>
  );
}