export default function Toast({ msg, icon = '✓' }) {
  return (
    <div className="toast show">
      <span>{icon}</span> {msg}
    </div>
  )
}