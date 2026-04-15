// src/components/common/Avatar.jsx
const SIZE = {
  xs:   { outer: 'w-7 h-7',    inner: 'w-6 h-6',    text: 'text-[9px]'  },
  sm:   { outer: 'w-9 h-9',    inner: 'w-8 h-8',    text: 'text-[11px]' },
  md:   { outer: 'w-11 h-11',  inner: 'w-10 h-10',  text: 'text-[13px]' },
  lg:   { outer: 'w-14 h-14',  inner: 'w-[52px] h-[52px]', text: 'text-lg' },
  xl:   { outer: 'w-20 h-20',  inner: 'w-[76px] h-[76px]', text: 'text-2xl' },
  '2xl':{ outer: 'w-24 h-24',  inner: 'w-[92px] h-[92px]', text: 'text-3xl' },
}

export default function Avatar({ initials, size = 'md', online, className = '' }) {
  const s = SIZE[size] ?? SIZE.md
  return (
    <div className={`relative flex-shrink-0 ${s.outer} ${className}`}>
      {/* Ring */}
      <div className={`${s.outer} rounded-full bg-primary-200 flex items-center justify-center`}>
        {/* Face */}
        <div className={`
          ${s.inner} rounded-full flex items-center justify-center
          font-bold text-primary bg-primary-100
          ${s.text}
        `}>
          {initials}
        </div>
      </div>

      {/* Online dot */}
      {online !== undefined && (
        <span className={`
          absolute bottom-0.5 right-0.5 w-[11px] h-[11px] rounded-full border-2 border-white
          ${online ? 'bg-success' : 'bg-slate-200'}
        `} />
      )}
    </div>
  )
}
