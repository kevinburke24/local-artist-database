export default function SkeletonCard() {
  return (
    <div style={{
      border: "1px solid #ddd",
      padding: "20px",
      borderRadius: "8px",
      maxWidth: "400px",
      margin: "20px auto"
    }}>
      <div style={{
        height: "24px",
        width: "70%",
        background: "#eee",
        borderRadius: "4px",
        marginBottom: "16px"
      }} />

      <div style={{
        height: "16px",
        width: "50%",
        background: "#eee",
        borderRadius: "4px",
        marginBottom: "12px"
      }} />

      <div style={{
        height: "16px",
        width: "40%",
        background: "#eee",
        borderRadius: "4px",
        marginBottom: "12px"
      }} />

      <div style={{
        height: "16px",
        width: "60%",
        background: "#eee",
        borderRadius: "4px",
        marginBottom: "12px"
      }} />

      <div style={{
        height: "16px",
        width: "30%",
        background: "#eee",
        borderRadius: "4px"
      }} />
    </div>
  );
}
