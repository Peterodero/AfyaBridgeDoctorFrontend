// src/pages/Analytics.jsx — mock UI
import { ArrowUpRight, ArrowDownRight, TrendingUp, TrendingDown } from 'lucide-react'

const KPI = [
  { label:'Total Consultations', value:'1,284', change:'+12%', up:true,  pct:75  },
  { label:'Patient Retention',   value:'94%',   change:'+5%',  up:true,  pct:94  },
  { label:'Avg. Session Time',   value:'28 min', change:'+3%', up:true,  pct:56  },
  { label:'Cancellation Rate',   value:'8%',    change:'-2%',  up:false, pct:8   },
]

const CONSULT   = [42, 58, 35, 70, 52, 68, 80]
const COMPLETED = [35, 48, 28, 60, 44, 55, 68]
const MONTHS    = ['Jan','Feb','Mar','Apr','May','Jun','Jul']
const MAX_B     = Math.max(...CONSULT, ...COMPLETED)

const PIE = [
  { label:'Hypertension',  pct:32, color:'#137FEC' },
  { label:'Diabetes',      pct:24, color:'#10B981' },
  { label:'Heart Disease', pct:19, color:'#F59E0B' },
  { label:'Other',         pct:25, color:'#8B5CF6' },
]

const TABLE = [
  { period:'February 2026', n:284, rev:'KES 142,000', up:true,  pct:'+12%' },
  { period:'January 2026',  n:253, rev:'KES 126,500', up:true,  pct:'+8%'  },
  { period:'December 2025', n:234, rev:'KES 117,000', up:true,  pct:'+3%'  },
  { period:'November 2025', n:227, rev:'KES 113,500', up:false, pct:'-5%'  },
]

export default function Analytics() {
  return (
    <div className="p-8 flex flex-col gap-7">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight m-0">Analytics</h1>
          <p className="text-sm text-slate-400 m-0 mt-1">Track performance and patient outcomes</p>
        </div>
        <div className="flex gap-3">
          <select className="h-10 px-4 bg-white border border-slate-150 rounded-xl text-sm text-slate-600 outline-none font-sans cursor-pointer focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all shadow-xs">
            <option>Last 6 months</option>
            <option>Last 3 months</option>
            <option>This year</option>
          </select>
          <button className="btn-primary btn-md shadow-blue">Download Report</button>
        </div>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-4 gap-5">
        {KPI.map(({ label, value, change, up, pct }) => (
          <div key={label} className="card p-5">
            <div className="flex justify-between items-start mb-4">
              <p className="text-xs font-semibold text-slate-400 m-0 uppercase tracking-[0.8px]">{label}</p>
              <span className={`flex items-center gap-0.5 text-xs font-bold px-2 py-1 rounded-lg
                ${up ? 'bg-success-50 text-success-700' : 'bg-danger-50 text-danger-700'}`}>
                {up ? <ArrowUpRight size={11} /> : <ArrowDownRight size={11} />}
                {change}
              </span>
            </div>
            <p className="text-[28px] font-black text-slate-900 m-0 leading-none">{value}</p>
            <div className="mt-4 h-1.5 bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full rounded-full" style={{
                width: `${pct}%`,
                background: 'linear-gradient(90deg, #137FEC, #13B6EC)',
              }} />
            </div>
          </div>
        ))}
      </div>

      {/* Charts row */}
      <div className="grid gap-5" style={{ gridTemplateColumns: '1fr 320px' }}>

        {/* Bar chart */}
        <div className="card p-7">
          <div className="flex justify-between items-start mb-7">
            <div>
              <h3 className="text-base font-bold text-slate-900 m-0">Consultation Trends</h3>
              <p className="text-xs text-slate-400 m-0 mt-1">Consultations vs completed sessions</p>
            </div>
            <div className="flex gap-5">
              {[['#137FEC','Consultations'],['#10B981','Completed']].map(([c,l]) => (
                <div key={l} className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-sm" style={{ background: c }} />
                  <span className="text-xs font-semibold text-slate-500">{l}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="relative" style={{ height: 180 }}>
            {[0.25, 0.5, 0.75].map(p => (
              <div key={p} className="absolute left-0 right-0 border-t border-dashed border-slate-100"
                style={{ top: `${p * 100}%` }} />
            ))}
            <div className="flex justify-between items-end h-full">
              {MONTHS.map((m, i) => (
                <div key={m} className="flex flex-col items-center gap-2 flex-1">
                  <div className="flex gap-1 items-end">
                    <div className="w-5 rounded-t-md" style={{ height: (CONSULT[i]/MAX_B)*160, background:'linear-gradient(180deg, #137FEC, #0E6CC4)' }} />
                    <div className="w-5 rounded-t-md bg-emerald-400" style={{ height: (COMPLETED[i]/MAX_B)*160 }} />
                  </div>
                  <span className="text-[10px] font-bold text-slate-300">{m}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Donut */}
        <div className="card p-7">
          <h3 className="text-base font-bold text-slate-900 m-0 mb-6">Top Conditions</h3>
          <div className="flex flex-col items-center">
            <div className="relative w-36 h-36 mb-6">
              <svg viewBox="0 0 160 160" className="w-full h-full -rotate-90">
                {(() => {
                  const r = 58, sw = 32, circ = 2 * Math.PI * r
                  let off = 0
                  return PIE.map(({ color, pct }, i) => {
                    const dash = (pct / 100) * circ
                    const el = <circle key={i} cx="80" cy="80" r={r} fill="none"
                      stroke={color} strokeWidth={sw}
                      strokeDasharray={`${dash} ${circ - dash}`}
                      strokeDashoffset={-off} strokeLinecap="round" />
                    off += dash
                    return el
                  })
                })()}
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-black text-slate-900">248</span>
                <span className="text-[9px] font-bold text-slate-300 uppercase">cases</span>
              </div>
            </div>
            <div className="w-full flex flex-col gap-2.5">
              {PIE.map(({ label, pct, color }) => (
                <div key={label} className="flex items-center gap-3">
                  <span className="w-2.5 h-2.5 rounded-sm shrink-0" style={{ background: color }} />
                  <span className="text-xs text-slate-600 flex-1">{label}</span>
                  <div className="flex items-center gap-2">
                    <div className="w-16 h-1 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full rounded-full" style={{ width: `${pct}%`, background: color }} />
                    </div>
                    <span className="text-xs font-bold text-slate-900 w-7 text-right">{pct}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Summary table */}
      <div className="card overflow-hidden p-0">
        <div className="flex items-center justify-between px-6 py-5">
          <h3 className="text-base font-bold text-slate-900 m-0">Monthly Summary</h3>
          <button className="text-xs font-bold text-primary bg-primary-50 hover:bg-primary-100 px-3 py-1.5 rounded-lg border-none cursor-pointer transition-colors">
            Export CSV
          </button>
        </div>
        <div className="grid px-6 py-3 bg-slate-50/80"
          style={{ gridTemplateColumns: '2fr 1fr 1fr 1fr' }}>
          {['Period','Consultations','Revenue','Trend'].map(h => <span key={h} className="th">{h}</span>)}
        </div>
        {TABLE.map((row, i) => (
          <div key={i} className={`grid px-6 items-center hover:bg-blue-50/20 transition-colors ${i < TABLE.length-1 ? 'border-b border-slate-50' : ''}`}
            style={{ gridTemplateColumns: '2fr 1fr 1fr 1fr', height: '56px' }}>
            <span className="text-sm font-semibold text-slate-700">{row.period}</span>
            <span className="text-sm font-bold text-slate-900">{row.n}</span>
            <span className="text-sm text-slate-400">{row.rev}</span>
            <div className="flex items-center gap-2">
              {row.up
                ? <TrendingUp size={14} className="text-success-600" />
                : <TrendingDown size={14} className="text-danger-600" />}
              <span className={`text-xs font-bold ${row.up ? 'text-success-700' : 'text-danger-700'}`}>{row.pct}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
