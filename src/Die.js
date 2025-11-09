export default function Die({ value, isHeld, hold, disabled = false }) {
  const dieClass = `die-face ${isHeld ? "held" : ""} ${disabled ? "disabled" : ""}`;

  // Dot positions for each die value
  const dotPositions = {
    1: ["center"],
    2: ["top-left", "bottom-right"],
    3: ["top-left", "center", "bottom-right"],
    4: ["top-left", "top-right", "bottom-left", "bottom-right"],
    5: ["top-left", "top-right", "center", "bottom-left", "bottom-right"],
    6: ["top-left", "top-right", "middle-left", "middle-right", "bottom-left", "bottom-right"],
  };

  function renderDots(value) {
    const positions = dotPositions[value] || [];
    return positions.map((pos, i) => (
      <span key={i} className={`dot ${pos}`}></span>
    ));
  }

  return (
    <button 
      className={dieClass}
      onClick={disabled ? undefined : hold}
      disabled={disabled}
      aria-pressed={isHeld}
      aria-label={`Die showing ${value}, ${isHeld ? "held" : "not held"}${disabled ? ", disabled" : ""}`}
      tabIndex={disabled ? -1 : 0}
    >
      {renderDots(value)}
    </button>
  );
}