export default function PageLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: "32px 20px" }}>
      {children}
    </div>
  );
}
