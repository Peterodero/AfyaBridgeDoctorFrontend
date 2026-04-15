// src/components/common/Badge.jsx
const STATUS = {
  'Completed':        'bg-success-50 text-success-700',
  'completed':        'bg-success-50 text-success-700',
  'confirmed':        'bg-success-50 text-success-700',
  'In Progress':      'bg-blue-100 text-blue-700',
  'Pending':          'bg-warning-50 text-warning-700',
  'pending':          'bg-warning-50 text-warning-700',
  'Needs Attention':  'bg-danger-100 text-danger-700',
  'Stable':           'bg-success-50 text-success-700',
  'Monitor':          'bg-warning-50 text-warning-700',
  'Critical':         'bg-danger-100 text-danger-700',
  'critical':         'bg-danger-100 text-danger-700',
  'cancelled':        'bg-slate-100 text-slate-500',
  'no_show':          'bg-slate-100 text-slate-500',
  'Active':           'bg-primary-100 text-primary',
  'Disabled':         'bg-danger-50 text-danger',
}

export default function Badge({ status, className = '', children }) {
  const cls = STATUS[status] ?? 'bg-slate-100 text-slate-500'
  return (
    <span className={`badge ${cls} ${className}`}>
      {children ?? status}
    </span>
  )
}
