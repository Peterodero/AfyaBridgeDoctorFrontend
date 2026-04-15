// src/pages/HelpCenter.jsx
import { useState, useMemo } from "react";
import {
  Search,
  ChevronDown,
  ChevronUp,
  BookOpen,
  Wrench,
  CreditCard,
  AlertCircle,
  ArrowRight,
  MessageSquare,
  Zap,
  Lock,
  Wallet,
  Mail,
  Phone,
  Send,
  X,
} from "lucide-react";
import ArticlesPage from "./Article";
import ContactModal from "./Contact";

const CATEGORIES = [
  {
    id: "getting-started",
    icon: BookOpen,
    label: "Getting Started",
    color: "primary",
    description: "Setup guides and initial setup",
  },
  {
    id: "telemedicine",
    icon: Zap,
    label: "Telemedicine",
    color: "emerald",
    description: "Video consultations and patient calls",
  },
  {
    id: "prescriptions",
    icon: Wrench,
    label: "E-Prescriptions",
    color: "blue",
    description: "Digital prescriptions & pharmacy orders",
  },
  {
    id: "billing",
    icon: CreditCard,
    label: "Billing & Payments",
    color: "amber",
    description: "Wallet, payouts, and transactions",
  },
  {
    id: "security",
    icon: Lock,
    label: "Security & Privacy",
    color: "violet",
    description: "Account safety and data protection",
  },
  {
    id: "support",
    icon: AlertCircle,
    label: "Report an Issue",
    color: "red",
    description: "Technical issues and bug reports",
  },
];

const FAQS = [
  {
    category: "getting-started",
    q: "How do I complete my profile setup?",
    a: "After registration, go to Settings to upload your profile photo, update your bio, and configure consultation settings. Your KMPDC license is verified within 24 hours.",
  },
  {
    category: "getting-started",
    q: "What are the system requirements?",
    a: "AfyaBridge works on modern browsers (Chrome, Firefox, Safari, Edge). For video consultations, ensure you have a stable internet connection and a working webcam/microphone.",
  },
  {
    category: "telemedicine",
    q: "How do I start a telemedicine consultation?",
    a: "Go to Telemedicine in the sidebar. You'll see your active queue — click Start Consultation on a patient to generate a Jitsi video link. Both you and the patient open the same link to join the call.",
  },
  {
    category: "telemedicine",
    q: "Can I record consultations?",
    a: "Yes, you can enable recording during a call. The recording is saved securely and can be accessed from your consultation history. Always inform patients before recording.",
  },
  {
    category: "telemedicine",
    q: "What if the video call drops?",
    a: "If connection is lost, try rejoining using the same Jitsi link. The call history is maintained, and you can follow up via the patient's message board.",
  },
  {
    category: "prescriptions",
    q: "How do I send an e-prescription to a pharmacy?",
    a: "Navigate to E-Prescriptions. Add medications using the form, select a pharmacy, then click Send to Pharmacy. The prescription is sent digitally with your digital signature.",
  },
  {
    category: "prescriptions",
    q: "Can patients track their prescriptions?",
    a: "Yes! Patients receive a notification when you send a prescription and can track fulfillment status through their account.",
  },
  {
    category: "billing",
    q: "How do I withdraw money from my wallet?",
    a: "Go to Wallet → Request Withdrawal. Enter the amount and select your payout method (M-Pesa or Bank Transfer). Withdrawals are processed within 1-2 business days.",
  },
  {
    category: "billing",
    q: "What are the payout fees?",
    a: "Payout fees vary by method: M-Pesa has a small transaction fee, bank transfers are free for orders over KES 5,000. Check your wallet for current rates.",
  },
  {
    category: "billing",
    q: "Can I change my consultation fee?",
    a: "Yes. Go to Settings → Consultation Settings and update your fee. The new fee applies to future bookings; existing appointments retain their original rate.",
  },
  {
    category: "security",
    q: "How is my patient data protected?",
    a: "All patient data is encrypted using industry-standard protocols. We comply with GDPR, HIPAA, and Kenyan data protection regulations. Your data is never shared with third parties.",
  },
  {
    category: "security",
    q: "How do I enable two-factor authentication?",
    a: "Go to Settings → Security. Click Enable 2FA and follow the prompts to set up authentication via your phone. This adds an extra layer of security to your account.",
  },
  {
    category: "support",
    q: "How do I report a bug?",
    a: "Click the Help icon in the sidebar and select 'Report Issue'. Describe the problem, attach screenshots if needed, and our team will investigate within 24 hours.",
  },
];

const ColorSchemes = {
  primary: {
    bg: "from-blue-50 to-primary-50",
    iconBg: "bg-primary-100",
    iconColor: "text-primary",
    badge: "bg-primary-100 text-primary",
  },
  emerald: {
    bg: "from-emerald-50 to-teal-50",
    iconBg: "bg-emerald-100",
    iconColor: "text-emerald-600",
    badge: "bg-emerald-100 text-emerald-700",
  },
  blue: {
    bg: "from-blue-50 to-cyan-50",
    iconBg: "bg-blue-100",
    iconColor: "text-blue-600",
    badge: "bg-blue-100 text-blue-700",
  },
  amber: {
    bg: "from-amber-50 to-yellow-50",
    iconBg: "bg-amber-100",
    iconColor: "text-amber-600",
    badge: "bg-amber-100 text-amber-700",
  },
  violet: {
    bg: "from-violet-50 to-purple-50",
    iconBg: "bg-violet-100",
    iconColor: "text-violet-600",
    badge: "bg-violet-100 text-violet-700",
  },
  red: {
    bg: "from-red-50 to-danger-50",
    iconBg: "bg-danger-100",
    iconColor: "text-danger",
    badge: "bg-danger-100 text-danger",
  },
};

// ── Main Help Center Component ────────────────────────────
export default function HelpCenter() {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [openFaq, setOpenFaq] = useState(null);
  const [showContactModal, setShowContactModal] = useState(false);
  const [showAllArticles, setShowAllArticles] = useState(false);

  const filteredFaqs = useMemo(() => {
    return FAQS.filter((faq) => {
      const matchesSearch =
        !search ||
        faq.q.toLowerCase().includes(search.toLowerCase()) ||
        faq.a.toLowerCase().includes(search.toLowerCase());

      const matchesCategory =
        !selectedCategory || faq.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [search, selectedCategory]);

  if (showAllArticles) {
    return (
      <>
        <ArticlesPage onBack={() => setShowAllArticles(false)} FAQS = {FAQS} CATEGORIES={CATEGORIES} ColorSchemes={ColorSchemes}/>
        <ContactModal
          isOpen={showContactModal}
          onClose={() => setShowContactModal(false)}
        />
      </>
    );
  }

  return (
    <div className="p-8 flex flex-col gap-8 max-w-1200 mx-auto">
      {/* ── Hero Section ────────────────────────────────────── */}
      <div className="relative rounded-2xl overflow-hidden p-12 text-center flex flex-col items-center gap-6 bg-linear-to-br from-[#0E6CC4] via-[#137FEC] to-[#13B6EC]">
        <div className="absolute -top-10 -left-10 w-40 h-40 rounded-full bg-white/5" />
        <div className="absolute -bottom-8 -right-8 w-32 h-32 rounded-full bg-white/5" />

        <div className="relative z-10">
          <h1 className="text-4xl font-black text-white m-0 tracking-tight">
            How can we help you?
          </h1>
          <p className="text-white/70 text-base m-0 mt-3">
            Search our knowledge base or browse categories below
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative w-full max-w-130 z-10">
          <Search
            size={17}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none"
          />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search for articles, guides, or topics..."
            className="w-full h-14 bg-white rounded-2xl pl-12 pr-5 text-base text-slate-600 placeholder:text-slate-300 outline-none font-sans focus:ring-4 focus:ring-white/30 transition-all"
            style={{ boxShadow: "0 8px 32px rgba(0,0,0,0.15)" }}
          />
        </div>

        <p className="text-white/40 text-xs relative z-10 m-0">
          Popular: telemedicine, prescriptions, wallet, security
        </p>
      </div>

      {/* ── Categories ──────────────────────────────────────── */}
      <div>
        <h2 className="text-lg font-black text-slate-900 m-0 mb-4">
          Browse by Category
        </h2>
        <div className="grid grid-cols-3 gap-4">
          {CATEGORIES.map(({ id, icon: Icon, label, color, description }) => {
            const scheme = ColorSchemes[color];
            const isSelected = selectedCategory === id;

            return (
              <button
                key={id}
                onClick={() => setSelectedCategory(isSelected ? null : id)}
                className={`bg-linear-to-br ${scheme.bg} border-2 rounded-2xl p-5 cursor-pointer text-left flex flex-col gap-3 transition-all duration-200 ${
                  isSelected
                    ? "border-primary shadow-lg -translate-y-1"
                    : "border-transparent shadow-xs hover:shadow-md hover:-translate-y-0.5"
                }`}
              >
                <div
                  className={`w-11 h-11 ${scheme.iconBg} rounded-xl flex items-center justify-center`}
                >
                  <Icon size={20} className={scheme.iconColor} />
                </div>
                <div>
                  <p className="text-[14px] font-bold text-slate-900 m-0">
                    {label}
                  </p>
                  <p className="text-xs text-slate-400 m-0 mt-1">
                    {description}
                  </p>
                </div>
                {isSelected && (
                  <div className="mt-1">
                    <span
                      className={`inline-block text-xs font-semibold px-2.5 py-1 rounded-lg ${scheme.badge}`}
                    >
                      {filteredFaqs.length} articles
                    </span>
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Search Results Summary ──────────────────────────── */}
      {(search || selectedCategory) && (
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-semibold text-slate-900 m-0">
              {filteredFaqs.length} result{filteredFaqs.length !== 1 ? "s" : ""}{" "}
              found
            </h3>
            <p className="text-sm text-slate-400 m-0 mt-1">
              {search && `Showing results for "${search}"`}
              {selectedCategory && search && " in "}
              {selectedCategory &&
                `${CATEGORIES.find((c) => c.id === selectedCategory)?.label}`}
            </p>
          </div>
          {(search || selectedCategory) && (
            <button
              onClick={() => {
                setSearch("");
                setSelectedCategory(null);
                setOpenFaq(null);
              }}
              className="text-sm font-semibold text-primary hover:text-primary/80 bg-primary/5 hover:bg-primary/10 px-4 py-2 rounded-lg border-none cursor-pointer transition-all"
            >
              Clear filters
            </button>
          )}
        </div>
      )}

      {/* ── FAQs ────────────────────────────────────────────── */}
      <div>
        <h2 className="text-lg font-black text-slate-900 m-0 mb-4">
          {selectedCategory
            ? `${CATEGORIES.find((c) => c.id === selectedCategory)?.label} FAQs`
            : "Frequently Asked Questions"}
        </h2>

        {filteredFaqs.length === 0 ? (
          <div className="card p-12 text-center">
            <MessageSquare size={40} className="text-slate-200 mx-auto mb-3" />
            <p className="text-slate-600 font-semibold m-0">No results found</p>
            <p className="text-sm text-slate-400 m-0 mt-1">
              Try adjusting your search or selecting a different category
            </p>
          </div>
        ) : (
          <div className="card overflow-hidden p-0">
            {filteredFaqs.map((faq, i) => {
              const isOpen = openFaq === faq.q;
              const category = CATEGORIES.find((c) => c.id === faq.category);
              const scheme = ColorSchemes[category?.color];

              return (
                <div
                  key={i}
                  className={
                    i < filteredFaqs.length - 1 ? "border-b border-slate-50" : ""
                  }
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : faq.q)}
                    className={`w-full px-6 py-5 border-none cursor-pointer flex justify-between items-start gap-4 text-left font-sans transition-colors
                      ${isOpen ? "" : "hover:bg-slate-50/50"}`}
                    style={
                      isOpen
                        ? {
                            background:
                              "linear-gradient(135deg, #EBF5FF, #D1E9FF)",
                          }
                        : { background: "transparent" }
                    }
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <span
                          className={`text-xs font-semibold px-2 py-1 rounded-lg ${scheme.badge}`}
                        >
                          {category?.label}
                        </span>
                      </div>
                      <span
                        className={`text-[15px] font-semibold ${
                          isOpen ? "text-primary" : "text-slate-900"
                        }`}
                      >
                        {faq.q}
                      </span>
                    </div>
                    <span
                      className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 transition-all ${
                        isOpen ? "text-white shadow-blue-sm" : "bg-slate-100 text-slate-400"
                      }`}
                      style={
                        isOpen
                          ? {
                              background:
                                "linear-gradient(135deg,#137FEC,#13B6EC)",
                            }
                          : {}
                      }
                    >
                      {isOpen ? (
                        <ChevronUp size={15} />
                      ) : (
                        <ChevronDown size={15} />
                      )}
                    </span>
                  </button>

                  {isOpen && (
                    <div className="px-6 pb-5 pt-2 bg-slate-50/30">
                      <p className="text-sm leading-relaxed text-slate-600 m-0">
                        {faq.a}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ── Contact CTA ─────────────────────────────────────── */}
      <div className="card p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <p className="text-lg font-bold text-slate-900 m-0">
            Still need help?
          </p>
          <p className="text-sm text-slate-500 m-0 mt-2">
            Our support team responds within 2 hours · Available 24/7
          </p>
        </div>
        <div className="flex gap-3 shrink-0">
          <button
            onClick={() => setShowAllArticles(true)}
            className="px-5 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-700 text-sm font-semibold hover:bg-slate-50 hover:border-slate-300 transition-all duration-200 cursor-pointer"
          >
            Browse All Articles
          </button>

          <button
            onClick={() => setShowContactModal(true)}
            className="px-5 py-2.5 rounded-xl text-white text-sm font-semibold border-none cursor-pointer transition-all duration-200 hover:opacity-90 active:scale-[0.98] flex items-center gap-2"
            style={{
              background: "linear-gradient(135deg, #137FEC, #13B6EC)",
              boxShadow: "0 4px 12px rgba(19,127,236,0.25)",
            }}
          >
            Contact Support <ArrowRight size={14} />
          </button>
        </div>
      </div>

      {/* Contact Modal */}
      <ContactModal
        isOpen={showContactModal}
        onClose={() => setShowContactModal(false)}
      />
    </div>
  );
}