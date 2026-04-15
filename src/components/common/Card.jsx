// src/components/common/Card.jsx
export default function Card({ children, className = '', onClick, padding = 'p-6' }) {
  return (
    <div
      onClick={onClick}
      className={`card ${padding} ${onClick ? 'cursor-pointer' : ''} ${className}`}
    >
      {children}
    </div>
  )
}
