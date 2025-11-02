import { useEffect, useRef, useState } from 'react';
import '../ComponentStyles.css';

const CANVAS_HEIGHT = 340; // Increased to accommodate larger voltage display
const FREQUENCY = 2; // Hz - frequency of AC signal
const PROPAGATION_SPEED = 200; // pixels per second
const STATIC_FIELD_RADIUS = 80; // Radius of static field around DC antenna

const DcAcEmWaveVisualizer = () => {
  const [voltageType, setVoltageType] = useState('dc'); // 'dc' or 'ac'
  const [isRunning, setIsRunning] = useState(false);
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const animationRef = useRef(null);
  const startTimeRef = useRef(null);

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
    if (voltageType === 'ac' && isRunning) {
      startTimeRef.current = performance.now();
    } else {
      startTimeRef.current = null;
    }
  }, [voltageType, isRunning]);

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
      // Always render, but only animate when AC is running

      const dpr = window.devicePixelRatio || 1;
      const width = canvas.width / dpr;
      const height = canvas.height / dpr;

      ctx.clearRect(0, 0, width, height);

      const top = 40;
      const bottom = height - 80; // Grid area - keep this the same
      const centerY = (top + bottom) / 2;
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

      // Subtle grid
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

      const baseHeight = 18;
      // Shorten antennas to where charge balls move (centerY ± 40)
      const antennaTop = centerY - 50; // Start higher up
      const antennaBottom = bottom - 40;

      // Antennas
      ctx.strokeStyle = 'rgba(130, 170, 255, 0.85)';
      ctx.lineWidth = 4;
      ctx.lineCap = 'round';

      // Sending antenna (left) - shortened
      ctx.beginPath();
      ctx.moveTo(leftX, antennaTop);
      ctx.lineTo(leftX, antennaBottom);
      ctx.stroke();

      // Receiving antenna (right) - shortened
      ctx.beginPath();
      ctx.moveTo(rightX, antennaTop);
      ctx.lineTo(rightX, antennaBottom);
      ctx.stroke();

      // Antenna bases
      ctx.fillStyle = 'rgba(77, 124, 255, 0.25)';
      drawRoundedRect(ctx, leftX - 26, antennaBottom, 52, baseHeight, 8);
      ctx.fill();
      drawRoundedRect(ctx, rightX - 26, antennaBottom, 52, baseHeight, 8);
      ctx.fill();

      // Power source underneath sending antenna
      const powerSourceY = antennaBottom + baseHeight + 12;
      const powerSourceWidth = 60;
      const powerSourceHeight = 28;
      const powerSourceX = leftX - powerSourceWidth / 2;

      // Power source background
      ctx.fillStyle = voltageType === 'dc' 
        ? 'rgba(255, 205, 112, 0.15)' 
        : 'rgba(90, 180, 255, 0.15)';
      ctx.strokeStyle = voltageType === 'dc'
        ? 'rgba(255, 205, 112, 0.5)'
        : 'rgba(90, 180, 255, 0.5)';
      ctx.lineWidth = 2;
      drawRoundedRect(ctx, powerSourceX, powerSourceY, powerSourceWidth, powerSourceHeight, 6);
      ctx.fill();
      ctx.stroke();

      // Power source label/symbol
      ctx.save();
      if (voltageType === 'dc') {
        // DC: Show text on left, symbol on right
        ctx.fillStyle = 'rgba(255, 205, 112, 0.9)';
        ctx.font = 'bold 0.75rem monospace';
        ctx.textAlign = 'left';
        ctx.textBaseline = 'middle';
        ctx.fillText('DC', leftX - 20, powerSourceY + powerSourceHeight / 2);
        
        // Draw DC symbol: straight line with plus/minus (on right side)
        ctx.strokeStyle = 'rgba(255, 205, 112, 0.9)';
        ctx.lineWidth = 2;
        
        // Plus sign (left side)
        ctx.beginPath();
        ctx.moveTo(leftX + 8, powerSourceY + powerSourceHeight / 2 - 4);
        ctx.lineTo(leftX + 8, powerSourceY + powerSourceHeight / 2 + 4);
        ctx.moveTo(leftX + 6, powerSourceY + powerSourceHeight / 2);
        ctx.lineTo(leftX + 10, powerSourceY + powerSourceHeight / 2);
        ctx.stroke();
        
        // Minus sign (right side, with clear gap)
        ctx.beginPath();
        ctx.moveTo(leftX + 22, powerSourceY + powerSourceHeight / 2);
        ctx.lineTo(leftX + 26, powerSourceY + powerSourceHeight / 2);
        ctx.stroke();
      } else {
        // AC: Show text on left, wave symbol on right
        ctx.fillStyle = 'rgba(90, 180, 255, 0.9)';
        ctx.font = 'bold 0.75rem monospace';
        ctx.textAlign = 'left';
        ctx.textBaseline = 'middle';
        ctx.fillText('AC', leftX - 20, powerSourceY + powerSourceHeight / 2);
        
        // Draw AC symbol: sine wave (on right side, smaller)
        ctx.strokeStyle = 'rgba(90, 180, 255, 0.9)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        const waveStart = leftX + 8;
        const waveEnd = leftX + 20;
        const waveCenterY = powerSourceY + powerSourceHeight / 2;
        const waveAmp = 4;
        const samples = 15;
        for (let i = 0; i <= samples; i++) {
          const t = i / samples;
          const x = waveStart + t * (waveEnd - waveStart);
          const y = waveCenterY - Math.sin(t * Math.PI * 2) * waveAmp;
          if (i === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }
        ctx.stroke();
      }
      ctx.restore();

      const elapsedSeconds = timestamp / 1000;

      if (voltageType === 'dc') {
        // DC mode: magnetic loops around sending antenna - vertically oriented
        const currentTime = startTimeRef.current ? (timestamp - startTimeRef.current) / 1000 : elapsedSeconds;
        
        // Animated gradient that pulses
        const pulsePhase = Math.sin(currentTime * 1.5) * 0.15 + 0.85; // Pulse between 0.7 and 1.0
        ctx.save();
        const staticGradient = ctx.createRadialGradient(
          leftX,
          centerY,
          0,
          leftX,
          centerY,
          STATIC_FIELD_RADIUS
        );
        staticGradient.addColorStop(0, `rgba(255, 205, 112, ${0.25 * pulsePhase})`);
        staticGradient.addColorStop(0.6, `rgba(255, 205, 112, ${0.12 * pulsePhase})`);
        staticGradient.addColorStop(1, 'rgba(255, 205, 112, 0)');
        ctx.fillStyle = staticGradient;
        ctx.beginPath();
        ctx.arc(leftX, centerY, STATIC_FIELD_RADIUS, 0, Math.PI * 2);
        ctx.fill();

        // Draw magnetic field loops - vertically oriented ellipses along the antenna
        // Motionless but with subtle pulsing opacity
        const fieldOpacity = 0.55 + Math.sin(currentTime * 2) * 0.15; // Pulse opacity
        ctx.strokeStyle = `rgba(255, 205, 112, ${fieldOpacity})`;
        ctx.lineWidth = 2;
        ctx.setLineDash([3, 5]);
        
        // Create loops at different distances from the antenna
        const numLoops = 8;
        for (let loopIdx = 0; loopIdx < numLoops; loopIdx++) {
          const loopRadius = 12 + (loopIdx * (STATIC_FIELD_RADIUS - 12) / numLoops);
          
          // Draw vertically oriented elliptical loops that align with the antenna
          // Stretch vertically instead of horizontally
          const horizontalRadius = loopRadius * 0.5; // Narrow horizontally
          const verticalRadius = loopRadius; // Tall vertically
          
          ctx.beginPath();
          // Draw vertically oriented ellipse around the antenna (motionless)
          ctx.ellipse(
            leftX,
            centerY,
            horizontalRadius,
            verticalRadius,
            0,
            0,
            Math.PI * 2
          );
          ctx.stroke();
        }
        ctx.setLineDash([]);
        ctx.restore();

        // No charge indicator for DC mode (static field, no moving charge)

        // Voltage display in DC mode - show inactive/static state
        const waveDisplayTop = height - 100;
        const waveDisplayBottom = height - 40;
        const waveDisplayHeight = waveDisplayBottom - waveDisplayTop;
        const waveDisplayCenter = (waveDisplayTop + waveDisplayBottom) / 2;
        const waveDisplayWidth = Math.min(200, width * 0.35);
        const waveDisplayStartX = rightX - waveDisplayWidth / 2;

        // Draw background (dimmer for inactive state)
        ctx.save();
        ctx.fillStyle = 'rgba(10, 16, 28, 0.3)';
        ctx.strokeStyle = 'rgba(144, 210, 255, 0.1)';
        ctx.lineWidth = 1;
        drawRoundedRect(
          ctx,
          waveDisplayStartX - 10,
          waveDisplayTop - 5,
          waveDisplayWidth + 20,
          waveDisplayHeight + 10,
          6
        );
        ctx.fill();
        ctx.stroke();
        ctx.restore();

        // Draw flat line (no signal)
        ctx.save();
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
        ctx.lineWidth = 2;
        ctx.setLineDash([4, 4]);
        ctx.beginPath();
        ctx.moveTo(waveDisplayStartX - 10, waveDisplayCenter);
        ctx.lineTo(waveDisplayStartX + waveDisplayWidth + 10, waveDisplayCenter);
        ctx.stroke();
        ctx.setLineDash([]);
        ctx.restore();

        // Voltage label (dimmed)
        ctx.save();
        ctx.fillStyle = 'rgba(144, 210, 255, 0.4)';
        ctx.font = '0.85rem monospace';
        ctx.textAlign = 'center';
        ctx.fillText('Voltage', rightX, height - 25);
        ctx.restore();
      } else {
        // AC mode: animated wave propagation
        const currentTime = startTimeRef.current ? (timestamp - startTimeRef.current) / 1000 : 0;

        // Animate charge movement on transmitting antenna
        const sendSample = Math.sin(2 * Math.PI * FREQUENCY * currentTime);
        const leftChargeY = centerY - sendSample * 40;

        ctx.save();
        ctx.fillStyle = 'rgba(255, 205, 112, 0.92)';
        ctx.shadowColor = 'rgba(255, 205, 112, 0.45)';
        ctx.shadowBlur = 16;
        ctx.beginPath();
        ctx.arc(leftX, leftChargeY, 9, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
        ctx.restore();

        // Draw propagating EM wave as ripples (concentric circles expanding outward)
        // Keep ripples propagating continuously - no distance limit
        ctx.save();
        const rippleSpeed = PROPAGATION_SPEED;
        const rippleSpacing = (rippleSpeed / FREQUENCY) * 0.6; // Distance between ripples
        
        // Calculate maximum visible distance (diagonal of canvas for fade calculation)
        const maxVisibleDistance = Math.sqrt(Math.pow(width, 2) + Math.pow(height, 2));
        
        // Draw ripple rings - calculate how many we need based on current time
        // Keep drawing new ripples as long as animation is running
        const furthestRippleDistance = currentTime * rippleSpeed;
        const numRipples = Math.ceil(furthestRippleDistance / rippleSpacing) + 10; // Extra buffer
        
        for (let i = 0; i < numRipples; i++) {
          const rippleDistance = (currentTime * rippleSpeed) - (i * rippleSpacing);
          
          // Only draw ripples that have propagated (no negative distances)
          if (rippleDistance > 0) {
            // Calculate opacity based on distance (fade out gradually)
            // Start fading after 60% of visible distance
            const fadeStartDistance = maxVisibleDistance * 0.6;
            let opacity = 0.8;
            
            if (rippleDistance > fadeStartDistance) {
              // Fade from 0.8 to 0.05 over the remaining distance
              const fadeRange = maxVisibleDistance * 0.4;
              const fadeProgress = (rippleDistance - fadeStartDistance) / fadeRange;
              opacity = 0.8 - fadeProgress * 0.75;
              opacity = Math.max(0.05, opacity); // Don't go below minimum visibility
            }
            
            // Only draw if visible
            if (opacity > 0.05) {
              ctx.strokeStyle = `rgba(90, 180, 255, ${opacity})`;
              ctx.lineWidth = 2;
              ctx.beginPath();
              ctx.arc(leftX, centerY, rippleDistance, 0, Math.PI * 2);
              ctx.stroke();
            }
          }
        }
        ctx.restore();

        // Calculate when wave reaches receiver
        const travelTime = waveDistance / PROPAGATION_SPEED;
        const smallDelay = 0.3; // Delay to ensure wave actually reaches before displaying
        const delayedPhase = currentTime - travelTime - smallDelay;

        // Draw voltage signal at receiving antenna (only after wave actually reaches it)
        if (delayedPhase > 0) {
          const receiveSample = Math.sin(2 * Math.PI * FREQUENCY * delayedPhase);
          const rightChargeY = centerY - receiveSample * 40;

          ctx.save();
          ctx.fillStyle = 'rgba(144, 210, 255, 0.92)';
          ctx.shadowColor = 'rgba(144, 210, 255, 0.4)';
          ctx.shadowBlur = 14;
          ctx.beginPath();
          ctx.arc(rightX, rightChargeY, 8.5, 0, Math.PI * 2);
          ctx.fill();
          ctx.shadowBlur = 0;
          ctx.restore();

          // Draw sine wave underneath receiving antenna (larger display, positioned lower)
          const waveDisplayTop = height - 100;
          const waveDisplayBottom = height - 40;
          const waveDisplayHeight = waveDisplayBottom - waveDisplayTop;
          const waveDisplayCenter = (waveDisplayTop + waveDisplayBottom) / 2;
          const waveDisplayAmplitude = waveDisplayHeight / 2 - 8;
          const waveDisplayWidth = Math.min(200, width * 0.35);
          const waveDisplayStartX = rightX - waveDisplayWidth / 2;

          // Draw background for voltage display
          ctx.save();
          ctx.fillStyle = 'rgba(10, 16, 28, 0.6)';
          ctx.strokeStyle = 'rgba(144, 210, 255, 0.3)';
          ctx.lineWidth = 1;
          drawRoundedRect(
            ctx,
            waveDisplayStartX - 10,
            waveDisplayTop - 5,
            waveDisplayWidth + 20,
            waveDisplayHeight + 10,
            6
          );
          ctx.fill();
          ctx.stroke();
          ctx.restore();

          // Draw center line
          ctx.save();
          ctx.strokeStyle = 'rgba(144, 210, 255, 0.2)';
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(waveDisplayStartX - 10, waveDisplayCenter);
          ctx.lineTo(waveDisplayStartX + waveDisplayWidth + 10, waveDisplayCenter);
          ctx.stroke();
          ctx.restore();

          // Draw voltage waveform
          ctx.save();
          ctx.strokeStyle = 'rgba(144, 210, 255, 0.9)';
          ctx.lineWidth = 3;
          ctx.beginPath();

          const waveDisplaySamples = 150;
          const cyclesToShow = 4; // Show 4 cycles of the wave
          for (let i = 0; i <= waveDisplaySamples; i++) {
            const t = i / waveDisplaySamples;
            const x = waveDisplayStartX + t * waveDisplayWidth;
            // Draw wave synchronized with received signal
            const wavePhase = 2 * Math.PI * FREQUENCY * delayedPhase + (t * cyclesToShow * 2 * Math.PI);
            const y = waveDisplayCenter - Math.sin(wavePhase) * waveDisplayAmplitude;
            if (i === 0) {
              ctx.moveTo(x, y);
            } else {
              ctx.lineTo(x, y);
            }
          }
          ctx.stroke();
          ctx.restore();

          // Voltage label
          ctx.save();
          ctx.fillStyle = 'rgba(144, 210, 255, 0.85)';
          ctx.font = '0.85rem monospace';
          ctx.textAlign = 'center';
          ctx.fontWeight = '600';
          ctx.fillText('Voltage', rightX, height - 25);
          ctx.restore();
        } else {
          // No signal yet - show flat line in larger display area (positioned lower)
          const waveDisplayTop = height - 100;
          const waveDisplayBottom = height - 40;
          const waveDisplayHeight = waveDisplayBottom - waveDisplayTop;
          const waveDisplayCenter = (waveDisplayTop + waveDisplayBottom) / 2;
          const waveDisplayWidth = Math.min(200, width * 0.35);
          const waveDisplayStartX = rightX - waveDisplayWidth / 2;

          // Draw background
          ctx.save();
          ctx.fillStyle = 'rgba(10, 16, 28, 0.4)';
          ctx.strokeStyle = 'rgba(144, 210, 255, 0.15)';
          ctx.lineWidth = 1;
          drawRoundedRect(
            ctx,
            waveDisplayStartX - 10,
            waveDisplayTop - 5,
            waveDisplayWidth + 20,
            waveDisplayHeight + 10,
            6
          );
          ctx.fill();
          ctx.stroke();
          ctx.restore();

          // Draw flat line
          ctx.save();
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
          ctx.lineWidth = 2;
          ctx.setLineDash([4, 4]);
          ctx.beginPath();
          ctx.moveTo(waveDisplayStartX - 10, waveDisplayCenter);
          ctx.lineTo(waveDisplayStartX + waveDisplayWidth + 10, waveDisplayCenter);
          ctx.stroke();
          ctx.setLineDash([]);
          ctx.restore();

          // Voltage label
          ctx.save();
          ctx.fillStyle = 'rgba(144, 210, 255, 0.5)';
          ctx.font = '0.85rem monospace';
          ctx.textAlign = 'center';
          ctx.fillText('Voltage', rightX, height - 25);
          ctx.restore();
        }
      }

      // Continue animation if AC is running, or always render for DC (static)
      animationRef.current = requestAnimationFrame(renderFrame);
    };

    // Start rendering loop
    animationRef.current = requestAnimationFrame(renderFrame);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }
    };
  }, [voltageType, isRunning]);

  return (
    <div className="em-wave-viz">
      <div className="em-wave-viz-header">
        <div className="em-wave-viz-title">DC vs AC: Static Fields vs Radiating Waves</div>
        <div className="em-wave-viz-controls-top">
          {voltageType === 'dc' ? (
            <button
              type="button"
              className="em-wave-viz-start-btn"
              onClick={() => {
                setVoltageType('ac');
                setIsRunning(true);
              }}
            >
              Switch to AC
            </button>
          ) : (
            <button
              type="button"
              className="em-wave-stop-btn"
              onClick={() => {
                setVoltageType('dc');
                setIsRunning(false);
              }}
            >
              Reset
            </button>
          )}
        </div>
      </div>

      <div className="em-wave-viz-stage">
        <div ref={containerRef} className="em-wave-viz-canvas">
          <canvas ref={canvasRef} />
          <div className="em-wave-viz-legend">
            <span className="em-wave-viz-legend-left">Sending antenna</span>
            <span className="em-wave-viz-legend-right">Receiving antenna</span>
          </div>
        </div>
      </div>

      {!isRunning && (
        <div className="em-wave-viz-overlay">
          <div className="em-wave-viz-overlay-content">
            <div className="em-wave-viz-overlay-title">DC vs AC: Static Fields vs Radiating Waves</div>
            <button
              type="button"
              className="em-wave-viz-start-btn"
              onClick={() => {
                setIsRunning(true);
              }}
            >
              Start
            </button>
          </div>
        </div>
      )}

      {voltageType === 'dc' && (
        <div className="em-wave-viz-footnote">
          DC creates a static electric field that doesn't radiate.
        </div>
      )}

      {voltageType === 'ac' && (
        <div className="em-wave-viz-footnote">
          AC makes electrons accelerate, creating detached electromagnetic waves that propagate at the speed of light.
        </div>
      )}
    </div>
  );
};

export default DcAcEmWaveVisualizer;

