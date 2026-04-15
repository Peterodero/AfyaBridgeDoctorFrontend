// src/components/common/Toggle.jsx
export default function Toggle({ on, onToggle, disabled = false }) {
  return (
    <button onClick={disabled ? undefined : onToggle}
      className={`toggle-track ${on ? 'bg-primary' : 'bg-slate-200'} ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}>
      <span className={`toggle-thumb ${on ? 'left-[23px]' : 'left-[3px]'}`} />
    </button>
  )
}
