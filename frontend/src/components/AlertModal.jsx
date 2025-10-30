import React from "react";
import "../styles/alertmodal.css";

export default function AlertModal({
  title = "Notice",
  message,
  onClose,
  actions, // optional: [{label: 'OK', onClick: fn, kind: 'primary'|'ghost'}]
  dismissOnOverlay = true,
}) {
  const handleOverlay = () => {
    if (dismissOnOverlay) onClose?.();
  };

  // Close on ESC
  React.useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose?.();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <>
      <div className="alert-overlay" onClick={handleOverlay} />
      <div className="alert-card" role="dialog" aria-modal="true" aria-labelledby="alert-title">
        <div className="alert-header">
          <h3 id="alert-title">{title}</h3>
          <button className="alert-close" onClick={onClose} aria-label="Close">✕</button>
        </div>

        <div className="alert-body">
          {typeof message === "string" ? <p>{message}</p> : message}
        </div>

        <div className="alert-actions">
          {(actions?.length ? actions : [{ label: "OK", kind: "primary", onClick: onClose }]).map((a, i) => (
            <button
              key={i}
              className={`alert-btn ${a.kind === "ghost" ? "ghost" : "primary"}`}
              onClick={a.onClick || onClose}
            >
              {a.label}
            </button>
          ))}
        </div>
      </div>
    </>
  );
}
