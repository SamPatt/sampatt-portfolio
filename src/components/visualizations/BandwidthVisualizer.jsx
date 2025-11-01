import { useEffect, useRef, useState } from 'react';
import '../ComponentStyles.css';

const MIN_CENTER_FREQUENCY = 1;
const MAX_CENTER_FREQUENCY = 100;
const MIN_BANDWIDTH = 1;
const MAX_BANDWIDTH = 10;
const CANVAS_HEIGHT = 280;
const TOTAL_GRID_COLUMNS = 25;
const TOTAL_GRID_ROWS = 40;

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

const BandwidthVisualizer = () => {
  const [centerFrequency, setCenterFrequency] = useState(1);
  const [bandwidth, setBandwidth] = useState(1);
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const animationRef = useRef(null);
  const centerFrequencyRef = useRef(centerFrequency);
  const bandwidthRef = useRef(bandwidth);

  useEffect(() => {
    centerFrequencyRef.current = centerFrequency;
    bandwidthRef.current = bandwidth;
  }, [centerFrequency, bandwidth]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const resize = () => {
      const availableWidth = container.clientWidth || 640;
      const dpr = window.devicePixelRatio || 1;

      canvas.width = availableWidth * dpr;
      canvas.height = CANVAS_HEIGHT * dpr;
      canvas.style.width = `${availableWidth}px`;
      canvas.style.height = `${CANVAS_HEIGHT}px`;

      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      }
    };

    resize();
    window.addEventListener('resize', resize);

    return () => {
      window.removeEventListener('resize', resize);
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const drawRoundedRect = (context, x, y, width, height, radius) => {
      const r = Math.min(radius, width / 2, height / 2);
      context.beginPath();
      context.moveTo(x + r, y);
      context.lineTo(x + width - r, y);
      context.quadraticCurveTo(x + width, y, x + width, y + r);
      context.lineTo(x + width, y + height - r);
      context.quadraticCurveTo(x + width, y + height, x + width - r, y + height);
      context.lineTo(x + r, y + height);
      context.quadraticCurveTo(x, y + height, x, y + height - r);
      context.lineTo(x, y + r);
      context.quadraticCurveTo(x, y, x + r, y);
      context.closePath();
    };

    const renderFrame = (timestamp) => {
      const dpr = window.devicePixelRatio || 1;
      const width = canvas.width / dpr;
      const height = canvas.height / dpr;

      ctx.clearRect(0, 0, width, height);

      const top = 40;
      const bottom = height - 40;
      const centerY = (top + bottom) / 2;
      const amplitude = Math.min(48, (bottom - top) / 2 - 12);
      const edgePadding = Math.min(100, width * 0.12);
      const leftX = edgePadding;
      const rightX = width - edgePadding;
      const waveStartX = leftX + 40;
      const waveEndX = rightX - 40;
      const waveDistance = waveEndX - waveStartX;

      // Ambient backdrop
      ctx.save();
      const gradient = ctx.createLinearGradient(0, 0, 0, height);
      gradient.addColorStop(0, 'rgba(9, 14, 26, 0.2)');
      gradient.addColorStop(0.5, 'rgba(9, 14, 26, 0.55)');
      gradient.addColorStop(1, 'rgba(9, 14, 26, 0.2)');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);
      ctx.restore();

      // Grid aligned with center line
      ctx.save();
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
      ctx.lineWidth = 1;
      const gridSpacing = 48;
      for (let x = leftX; x <= rightX; x += gridSpacing) {
        ctx.beginPath();
        ctx.moveTo(x, top);
        ctx.lineTo(x, bottom);
        ctx.stroke();
      }
      let gridY = centerY;
      while (gridY >= top) {
        ctx.beginPath();
        ctx.moveTo(leftX, gridY);
        ctx.lineTo(rightX, gridY);
        ctx.stroke();
        gridY -= gridSpacing;
      }
      gridY = centerY + gridSpacing;
      while (gridY <= bottom) {
        ctx.beginPath();
        ctx.moveTo(leftX, gridY);
        ctx.lineTo(rightX, gridY);
        ctx.stroke();
        gridY += gridSpacing;
      }
      ctx.restore();

      const baseHeight = 18;
      const antennaBottom = bottom - baseHeight;

      // Antennas
      ctx.strokeStyle = 'rgba(130, 170, 255, 0.85)';
      ctx.lineWidth = 4;
      ctx.lineCap = 'round';

      ctx.beginPath();
      ctx.moveTo(leftX, top);
      ctx.lineTo(leftX, antennaBottom);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(rightX, top);
      ctx.lineTo(rightX, antennaBottom);
      ctx.stroke();

      ctx.fillStyle = 'rgba(77, 124, 255, 0.25)';
      drawRoundedRect(ctx, leftX - 26, bottom, 52, baseHeight, 8);
      ctx.fill();
      drawRoundedRect(ctx, rightX - 26, bottom, 52, baseHeight, 8);
      ctx.fill();

      // Show occupied bandwidth as vertical window
      const bandRatio = clamp(bandwidthRef.current / MAX_BANDWIDTH, 0.05, 1);
      const bandPixelHalf = Math.max(26, ((bottom - top) / 2) * bandRatio);
      const bandTopY = clamp(centerY - bandPixelHalf, top, bottom);
      const bandBottomY = clamp(centerY + bandPixelHalf, top, bottom);
      const bandHeight = Math.max(12, bandBottomY - bandTopY);

      const bandGradient = ctx.createLinearGradient(leftX, bandTopY, leftX, bandBottomY);
      bandGradient.addColorStop(0, 'rgba(77, 124, 255, 0.12)');
      bandGradient.addColorStop(0.5, 'rgba(77, 124, 255, 0.3)');
      bandGradient.addColorStop(1, 'rgba(77, 124, 255, 0.12)');
      ctx.fillStyle = bandGradient;
      ctx.fillRect(leftX, bandTopY, rightX - leftX, bandBottomY - bandTopY);

      ctx.strokeStyle = 'rgba(145, 190, 255, 0.35)';
      ctx.lineWidth = 2;
      ctx.setLineDash([6, 8]);
      ctx.beginPath();
      ctx.moveTo(leftX, bandTopY);
      ctx.lineTo(rightX, bandTopY);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(leftX, bandBottomY);
      ctx.lineTo(rightX, bandBottomY);
      ctx.stroke();
      ctx.setLineDash([]);

      // Draw multiple sine waves stacked vertically inside the band
      const elapsedSeconds = timestamp / 1000;
      const centerFreq = centerFrequencyRef.current;
      const laneCount = clamp(Math.max(1, Math.round(bandwidthRef.current)), 1, 32);

      for (let lane = 0; lane < laneCount; lane++) {
        const normalized = laneCount === 1 ? 0.5 : lane / (laneCount - 1);
        const freqOffset = (normalized - 0.5) * bandwidthRef.current;
        const laneFrequency = clamp(centerFreq + freqOffset, 0.5, MAX_CENTER_FREQUENCY + MAX_BANDWIDTH);
        const opacity = 0.35 + 0.4 * (1 - Math.abs(normalized - 0.5));
        const hueShift = (normalized - 0.5) * 40;
        const color = `hsla(${210 + hueShift}, 95%, 70%, ${opacity})`;

        ctx.beginPath();
        ctx.strokeStyle = color;
        ctx.lineWidth = normalized === 0.5 ? 3.2 : 2;

        const phaseOffset = normalized * Math.PI;
        const samples = 220;
        const laneMidline = bandTopY + ((lane + 0.5) / laneCount) * bandHeight;
        const laneAmplitude = Math.max(6, (bandHeight / laneCount) * 0.45);
        for (let i = 0; i <= samples; i++) {
          const progress = i / samples;
          const x = waveStartX + progress * waveDistance;
          const phase = elapsedSeconds + phaseOffset - ((x - waveStartX) / waveDistance) * 0.5;
          const y = laneMidline - Math.sin(2 * Math.PI * laneFrequency * phase) * laneAmplitude;

          if (i === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }

        ctx.stroke();
      }

      // Direction arrow for band propagation
      ctx.save();
      ctx.strokeStyle = 'rgba(90, 180, 255, 0.45)';
      ctx.fillStyle = 'rgba(90, 180, 255, 0.45)';
      ctx.lineWidth = 2;
      const arrowX = rightX - 18;
      const arrowTop = bandTopY;
      const arrowBottom = bandBottomY;
      ctx.beginPath();
      ctx.moveTo(arrowX, arrowBottom);
      ctx.lineTo(arrowX, arrowTop);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(arrowX, arrowTop);
      ctx.lineTo(arrowX - 6, arrowTop + 14);
      ctx.lineTo(arrowX + 6, arrowTop + 14);
      ctx.closePath();
      ctx.fill();
      ctx.restore();

      animationRef.current = requestAnimationFrame(renderFrame);
    };

    animationRef.current = requestAnimationFrame(renderFrame);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  const totalCells = TOTAL_GRID_COLUMNS * TOTAL_GRID_ROWS;
  const estimatedThroughput = Math.round(centerFrequency * bandwidth);
  const activeCells = Math.min(totalCells, estimatedThroughput);

  return (
    <div className="bandwidth-viz">
      <div className="bandwidth-viz-header">
        <div className="bandwidth-viz-title">Bandwidth unlocks parallel modulation lanes</div>
        <div className="bandwidth-viz-metadata">
          <span><strong>{centerFrequency.toFixed(0)} Hz</strong> center frequency</span>
          <span><strong>{bandwidth.toFixed(0)} Hz</strong> bandwidth window</span>
          <span><strong>{estimatedThroughput.toLocaleString()}</strong> chances per second</span>
        </div>
      </div>

      <div className="bandwidth-viz-stage">
        <div ref={containerRef} className="bandwidth-viz-canvas">
          <canvas ref={canvasRef} />
          <div className="bandwidth-viz-legend">
            <span className="bandwidth-viz-legend-left">Sender</span>
            <span className="bandwidth-viz-legend-right">Receiver</span>
          </div>
          <div className="bandwidth-viz-band-label">
            <span>Bandwidth window: {bandwidth.toFixed(0)} Hz</span>
          </div>
        </div>

        <div className="bandwidth-viz-grid-panel">
          <div className="bandwidth-viz-grid-title">Chances to send information</div>
          <div
            className="bandwidth-viz-grid"
            style={{
              gridTemplateColumns: `repeat(${TOTAL_GRID_COLUMNS}, var(--bandwidth-grid-cell))`
            }}
          >
            {Array.from({ length: totalCells }, (_, index) => {
              const isActive = index < activeCells;
              return (
                <span
                  // eslint-disable-next-line react/no-array-index-key
                  key={index}
                  className={`bandwidth-viz-cell${isActive ? ' active' : ''}`}
                />
              );
            })}
          </div>
          <div className="bandwidth-viz-grid-summary">
            {estimatedThroughput.toLocaleString()} chances per second
          </div>
        </div>
      </div>

      <div className="bandwidth-viz-controls">
        <div className="bandwidth-viz-sliders">
          <label htmlFor="bandwidth-center-slider">
            Center frequency: <strong>{centerFrequency.toFixed(0)} Hz</strong>
          </label>
          <input
            id="bandwidth-center-slider"
            className="bandwidth-viz-slider"
            type="range"
            min={MIN_CENTER_FREQUENCY}
            max={MAX_CENTER_FREQUENCY}
            step={1}
            value={centerFrequency}
            onChange={(event) => setCenterFrequency(Number(event.target.value))}
          />
        </div>

        <div className="bandwidth-viz-sliders">
          <label htmlFor="bandwidth-slider">
            Bandwidth: <strong>{bandwidth.toFixed(0)} Hz</strong>
          </label>
          <input
            id="bandwidth-slider"
            className="bandwidth-viz-slider"
            type="range"
            min={MIN_BANDWIDTH}
            max={MAX_BANDWIDTH}
            step={1}
            value={bandwidth}
            onChange={(event) => setBandwidth(Number(event.target.value))}
          />
        </div>
      </div>

      <div className="bandwidth-viz-footnote">
        Wider bandwidth means more parallel carriers inside the channel, so every additional hertz multiplies the modulation moments available each second.
      </div>
    </div>
  );
};

export default BandwidthVisualizer;
