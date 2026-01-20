const Candlestick = ({
  x,
  y,
  width,
  height,
  low,
  high,
  open,
  close,
}) => {
  const isUp = close >= open;
  const color = isUp ? "#22c55e" : "#ef4444";

  // Map price to Y coordinate
  const priceToY = (price) =>
    y + ((high - price) / (high - low)) * height;

  const openY = priceToY(open);
  const closeY = priceToY(close);
  const highY = priceToY(high);
  const lowY = priceToY(low);

  const bodyTop = Math.min(openY, closeY);
  const bodyHeight = Math.max(Math.abs(openY - closeY), 2); // doji min height
  const centerX = x + width / 2;

  return (
    <g>
      {/* Wick */}
      <line
        x1={centerX}
        x2={centerX}
        y1={highY}
        y2={lowY}
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
      />

      {/* Candle Body */}
      <rect
        x={x}
        y={bodyTop}
        width={width}
        height={bodyHeight}
        fill={color}
        rx={2}
        ry={2}
      />
    </g>
  );
};

export default Candlestick;
