export default function SkeletonTable() {
    return (
        <div style={{ marginTop: "20px" }}>
            {[...Array(5)].map((_, i) => (
        <div 
          key={i}
          style={{
            height: "20px",
            background: "#eee",
            marginBottom: "10px",
            borderRadius: "4px"
          }}
        />
      ))}
        </div>
    )
}