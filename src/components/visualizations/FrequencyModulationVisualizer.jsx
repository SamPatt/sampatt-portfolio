import { useEffect, useRef, useState } from 'react';
import '../ComponentStyles.css';

const MIN_FREQUENCY = 1;
const MAX_FREQUENCY = 100;
const BITS_PER_CYCLE = 1;
const PROPAGATION_SPEED = 140; // pixels per second inside the canvas
const CANVAS_HEIGHT = 260;
const TOTAL_OPPORTUNITIES = 100;
const OPPORTUNITY_MULTIPLIER = TOTAL_OPPORTUNITIES / MAX_FREQUENCY; // 1 slot per Hz

const FrequencyModulationVisualizer = () => {
  const [frequency, setFrequency] = useState(MIN_FREQUENCY);
  const [opportunityFill, setOpportunityFill] = useState(
    Math.min(TOTAL_OPPORTUNITIES, Math.round(MIN_FREQUENCY * OPPORTUNITY_MULTIPLIER))
  );
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const animationRef = useRef(null);
  const frequencyRef = useRef(frequency);
  const lastReceiveValueRef = useRef(0);
  const flashStrengthRef = useRef(0);
  const lastTimestampRef = useRef(null);

  useEffect(() => {
    frequencyRef.current = frequency;
  }, [frequency]);

  useEffect(() => {
    const targetFill = Math.min(
      TOTAL_OPPORTUNITIES,
      Math.max(0, Math.round(frequency * OPPORTUNITY_MULTIPLIER))
    );
    setOpportunityFill(targetFill);
    lastReceiveValueRef.current = 0;
    flashStrengthRef.current = 0;
    lastTimestampRef.current = null;
  }, [frequency]);

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

      const previousTimestamp = lastTimestampRef.current;
      const deltaSeconds = previousTimestamp !== null ? (timestamp - previousTimestamp) / 1000 : 0;
      lastTimestampRef.current = timestamp;
      if (deltaSeconds > 0) {
        flashStrengthRef.current = Math.max(0, flashStrengthRef.current - deltaSeconds * 3.5);
      }

      ctx.clearRect(0, 0, width, height);

      const top = 36;
      const bottom = height - 36;
      const centerY = (top + bottom) / 2;
      const amplitude = Math.min(48, (bottom - top) / 2 - 12);
      const edgePadding = Math.min(90, width * 0.12);
      const leftX = edgePadding;
      const rightX = width - edgePadding;
      const waveStartX = leftX + 40;
      const waveEndX = rightX - 40;
      const waveDistance = waveEndX - waveStartX;
      const travelTime = waveDistance / PROPAGATION_SPEED;

      // Ambient backdrop
      ctx.save();
      const gradient = ctx.createLinearGradient(0, 0, 0, height);
      gradient.addColorStop(0, 'rgba(9, 14, 26, 0.2)');
      gradient.addColorStop(0.5, 'rgba(9, 14, 26, 0.5)');
      gradient.addColorStop(1, 'rgba(9, 14, 26, 0.2)');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);
      ctx.restore();

      // Subtle grid for context
      ctx.save();
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
      ctx.lineWidth = 1;
      const gridSpacing = 50;
      for (let x = edgePadding; x <= width - edgePadding; x += gridSpacing) {
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

      const elapsedSeconds = timestamp / 1000;
      const freq = frequencyRef.current;

      // Antennas
      ctx.strokeStyle = 'rgba(130, 170, 255, 0.85)';
      ctx.lineWidth = 4;
      ctx.lineCap = 'round';

      ctx.beginPath();
      ctx.moveTo(leftX, top);
      ctx.lineTo(leftX, bottom);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(rightX, top);
      ctx.lineTo(rightX, bottom);
      ctx.stroke();

      const baseHeight = 18;
      ctx.fillStyle = 'rgba(77, 124, 255, 0.25)';
      drawRoundedRect(ctx, leftX - 24, bottom, 48, baseHeight, 8);
      ctx.fill();

      drawRoundedRect(ctx, rightX - 24, bottom, 48, baseHeight, 8);
      ctx.fill();

      // EM wave
      ctx.lineWidth = 3;
      ctx.strokeStyle = 'rgba(90, 180, 255, 0.8)';
      ctx.beginPath();

      const samples = 220;
      for (let i = 0; i <= samples; i++) {
        const progress = i / samples;
        const x = waveStartX + progress * waveDistance;
        const propagationDelay = (x - waveStartX) / PROPAGATION_SPEED;
        const phase = elapsedSeconds - propagationDelay;
        const y = centerY - Math.sin(2 * Math.PI * freq * phase) * amplitude;

        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }
      ctx.stroke();

      // Direction arrows
      ctx.save();
      ctx.strokeStyle = 'rgba(90, 180, 255, 0.4)';
      ctx.fillStyle = 'rgba(90, 180, 255, 0.4)';
      ctx.lineWidth = 2;
      const arrowY = centerY - amplitude - 28;
      ctx.beginPath();
      ctx.moveTo(waveStartX, arrowY);
      ctx.lineTo(waveEndX, arrowY);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(waveEndX, arrowY);
      ctx.lineTo(waveEndX - 14, arrowY - 6);
      ctx.lineTo(waveEndX - 14, arrowY + 6);
      ctx.closePath();
      ctx.fill();
      ctx.restore();

      // Animate charge movement on transmitting antenna
      const sendSample = Math.sin(2 * Math.PI * freq * elapsedSeconds);
      const leftChargeY = centerY - sendSample * amplitude;

      ctx.save();
      ctx.fillStyle = 'rgba(255, 205, 112, 0.92)';
      ctx.shadowColor = 'rgba(255, 205, 112, 0.45)';
      ctx.shadowBlur = 16;
      ctx.beginPath();
      ctx.arc(leftX, leftChargeY, 9, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;
      ctx.restore();

      // Detect completed cycles at the receiving antenna (zero crossings)
      const delayedPhase = elapsedSeconds - travelTime;
      const receiveSample = delayedPhase > 0
        ? Math.sin(2 * Math.PI * freq * delayedPhase)
        : 0;

      const rightChargeY = centerY - receiveSample * amplitude;
      ctx.save();
      ctx.fillStyle = 'rgba(144, 210, 255, 0.92)';
      ctx.shadowColor = 'rgba(144, 210, 255, 0.4)';
      ctx.shadowBlur = 14;
      ctx.beginPath();
      ctx.arc(rightX, rightChargeY, 8.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;
      ctx.restore();

      const previousSample = lastReceiveValueRef.current;
      if (
        delayedPhase > 0 &&
        previousSample <= 0 &&
        receiveSample > 0 &&
        Math.abs(receiveSample - previousSample) > 0.05
      ) {
        flashStrengthRef.current = 1;
      }
      lastReceiveValueRef.current = receiveSample;

      const flashStrength = flashStrengthRef.current;

      if (flashStrength > 0) {
        ctx.save();
        const glowRadius = 32 + flashStrength * 24;
        const flashGradient = ctx.createRadialGradient(rightX, centerY, 0, rightX, centerY, glowRadius);
        flashGradient.addColorStop(0, `rgba(255, 210, 110, ${0.55 * flashStrength})`);
        flashGradient.addColorStop(1, 'rgba(255, 210, 110, 0)');
        ctx.fillStyle = flashGradient;
        ctx.beginPath();
        ctx.arc(rightX, centerY, glowRadius, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = `rgba(255, 210, 110, ${0.4 * flashStrength})`;
        ctx.lineWidth = 2 + flashStrength * 2;
        ctx.beginPath();
        ctx.arc(rightX, centerY, glowRadius, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
      }

      animationRef.current = requestAnimationFrame(renderFrame);
    };

    animationRef.current = requestAnimationFrame(renderFrame);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  const bitsPerSecond = frequency * BITS_PER_CYCLE;
  const bitsPerSecondLabel = Number.isInteger(bitsPerSecond)
    ? bitsPerSecond.toLocaleString()
    : bitsPerSecond.toFixed(1);
  const opportunitiesPerSecond = Math.round(opportunityFill);

  return (
    <div className="frequency-viz">
      <div className="frequency-viz-header">
        <div className="frequency-viz-title">Frequency controls modulation opportunities</div>
        <div className="frequency-viz-metadata">
          <span>
            <strong>{Number.isInteger(frequency) ? frequency.toFixed(0) : frequency.toFixed(1)} Hz</strong> carrier frequency
          </span>
          <span><strong>{bitsPerSecondLabel}</strong> bits per second (1 bit/cycle)</span>
        </div>
      </div>

      <div className="frequency-viz-stage">
        <div ref={containerRef} className="frequency-viz-canvas">
          <canvas ref={canvasRef} />
          <div className="frequency-viz-legend">
            <span className="frequency-viz-legend-left">Sending antenna</span>
            <span className="frequency-viz-legend-right">Receiving antenna</span>
          </div>
        </div>
        <div className="frequency-viz-opportunities">
          <div className="frequency-viz-opportunities-label">Chances to send information</div>
          <div className="frequency-viz-opportunities-grid" role="presentation">
            {Array.from({ length: TOTAL_OPPORTUNITIES }, (_, index) => (
              <span
                key={index}
                className={`frequency-viz-opportunity${index < opportunityFill ? ' active' : ''}`}
              />
            ))}
          </div>
          <div className="frequency-viz-opportunities-summary">
            {opportunitiesPerSecond} chances per second
          </div>
        </div>
      </div>

      <div className="frequency-viz-controls">
        <label htmlFor="frequency-slider">
          Increase the number of oscillations per second to unlock more modulation moments.
        </label>
        <input
          id="frequency-slider"
          className="frequency-viz-slider"
          type="range"
          min={MIN_FREQUENCY}
          max={MAX_FREQUENCY}
          step={1}
          value={frequency}
          onChange={(event) => setFrequency(Number(event.target.value))}
        />
        <div className="frequency-viz-scale">
          <span>{MIN_FREQUENCY} Hz</span>
          <span>{MAX_FREQUENCY} Hz</span>
        </div>
        <div className="frequency-viz-footnote">
          Visualizing a simple binary keying scheme (one bit encoded per cycle).
        </div>
      </div>
    </div>
  );
};

export default FrequencyModulationVisualizer;
