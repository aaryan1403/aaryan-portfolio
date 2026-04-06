type GridBackgroundProps = {
  isDark: boolean;
};

export function GridBackground({ isDark }: GridBackgroundProps) {
  const lineColor = isDark
    ? "rgba(255,255,255,0.06)"
    : "rgba(15,23,42,0.07)";

  return (
    <div className="absolute inset-0 opacity-40">
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `linear-gradient(90deg, ${lineColor} 1px, transparent 1px)`,
          backgroundSize: "32px 32px",
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `linear-gradient(0deg, ${lineColor} 1px, transparent 1px)`,
          backgroundSize: "32px 32px",
        }}
      />
    </div>
  );
}
