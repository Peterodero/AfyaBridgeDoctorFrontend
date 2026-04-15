export default function ArticlesPage({onBack, FAQS,CATEGORIES, ColorSchemes}) {
  return (
    <div className="p-8 flex flex-col gap-8 max-w-1200 mx-auto">
      <div className="flex items-center gap-3 mb-4">
        <button
          onClick={onBack}
          className="text-primary hover:text-primary/80 text-sm font-semibold bg-transparent border-none cursor-pointer"
        >
          ← Back to Help
        </button>
      </div>

      <div>
        <h1 className="text-3xl font-black text-slate-900 m-0">All Articles</h1>
        <p className="text-slate-500 m-0 mt-2">
          Browse our complete knowledge base with {FAQS.length} articles
        </p>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {CATEGORIES.map(({ id, icon: Icon, label, color, description }) => {
          const scheme = ColorSchemes[color];
          const articleCount = FAQS.filter((f) => f.category === id).length;

          return (
            <div
              key={id}
              className={`bg-linear-to-br ${scheme.bg} border border-slate-150 rounded-2xl p-6 cursor-pointer hover:shadow-md hover:-translate-y-1 transition-all`}
            >
              <div className={`w-12 h-12 ${scheme.iconBg} rounded-xl flex items-center justify-center mb-4`}>
                <Icon size={22} className={scheme.iconColor} />
              </div>
              <h3 className="text-base font-bold text-slate-900 m-0">{label}</h3>
              <p className="text-sm text-slate-500 m-0 mt-1">{description}</p>
              <p className="text-xs font-semibold text-slate-400 m-0 mt-4">
                {articleCount} article{articleCount !== 1 ? "s" : ""}
              </p>
            </div>
          );
        })}
      </div>

      {/* All FAQs */}
      <div className="mt-8">
        <h2 className="text-xl font-bold text-slate-900 m-0 mb-6">
          Complete Article List
        </h2>
        <div className="card overflow-hidden p-0">
          {FAQS.map((faq, i) => (
            <div
              key={i}
              className={`px-6 py-4 border-b border-slate-50 hover:bg-slate-50/50 transition-colors cursor-pointer ${
                i === FAQS.length - 1 ? "border-0" : ""
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <p className="text-sm font-semibold text-slate-900 m-0">
                    {faq.q}
                  </p>
                  <p className="text-xs text-slate-400 m-0 mt-1">{faq.a}</p>
                </div>
                <span
                  className={`text-xs font-semibold px-2.5 py-1 rounded-lg whitespace-nowrap ${
                    ColorSchemes[
                      CATEGORIES.find((c) => c.id === faq.category)?.color
                    ]?.badge
                  }`}
                >
                  {CATEGORIES.find((c) => c.id === faq.category)?.label}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}