export default function PageLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      maxWidth: "900px",
      margin: "0 auto",
      padding: "20px",
      fontFamily: "Arial, sans-serif"
    }}>
      {children}
    </div>
  );
}
