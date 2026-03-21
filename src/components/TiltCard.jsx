export default function TiltCard({ children, className = '', onClick }) {
  return (
    <div
      className={`${className} transition-transform duration-200 hover:-translate-y-1`}
      onClick={onClick}
    >
      {children}
    </div>
  )
}
