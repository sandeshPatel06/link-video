export default function LegalPage({ title, children }) {
  return (
    <div className="legal-page">
      <div className="legal-container">
        <h1 className="legal-title">{title}</h1>
        <div className="legal-body">{children}</div>
      </div>
    </div>
  );
}
