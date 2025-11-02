import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import '../ComponentStyles.css';

const CANVAS_HEIGHT = 320;
const DISPLAYED_CYCLES = 4;

const modulationModes = {
  am: {
    label: 'AM',
    caption: 'Amplitude',
    helper: 'Amplitude modulation raises and lowers the carrier envelope.'
  },
  fm: {
    label: 'FM',
    caption: 'Frequency',
    helper: 'Frequency modulation squeezes and stretches the carrier spacing.'
  },
  pm: {
    label: 'PM',
    caption: 'Phase',
    helper: 'Phase modulation nudges the carrier forward and backward in time.'
  },
  qam: {
    label: 'QAM',
    caption: 'Amplitude + Phase',
    helper: 'Quadrature amplitude modulation blends amplitude and phase shifts.'
  }
};

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

const ModulationVisualizer = () => {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const [isReady, setIsReady] = useState(false);
  const [modulationType, setModulationType] = useState('am');
  const [modeStrengths, setModeStrengths] = useState(() => ({
    am: 40,
    fm: 40,
    pm: 40,
    qam: 40
  }));

  const modulationDescriptor = useMemo(() => modulationModes[modulationType], [modulationType]);
  const currentStrength = modeStrengths[modulationType];

  const handleStrengthChange = useCallback(
    (value) => {
      const clamped = clamp(value, 0, 100);
      setModeStrengths((prev) => ({
        ...prev,
        [modulationType]: clamped
      }));
    },
    [modulationType]
  );

  const resizeCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const dpr = window.devicePixelRatio || 1;
    const width = container.clientWidth || 640;

    canvas.width = width * dpr;
    canvas.height = CANVAS_HEIGHT * dpr;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${CANVAS_HEIGHT}px`;

    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
  }, []);

  useEffect(() => {
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    return () => window.removeEventListener('resize', resizeCanvas);
  }, [resizeCanvas]);

  const draw = useCallback(() => {
    const timeSeconds = 0;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const width = canvas.width / dpr;
    const height = canvas.height / dpr;

    ctx.clearRect(0, 0, width, height);

    const top = 60;
    const bottom = height - 60;
    const centerY = (top + bottom) / 2;
    const amplitude = Math.min(48, (bottom - top) / 2 - 16);
    const leftX = 60;
    const rightX = width - 60;
    const waveWidth = rightX - leftX;

    const gradient = ctx.createLinearGradient(0, 0, 0, height);
    gradient.addColorStop(0, 'rgba(9, 14, 26, 0.25)');
    gradient.addColorStop(0.5, 'rgba(9, 14, 26, 0.55)');
    gradient.addColorStop(1, 'rgba(9, 14, 26, 0.25)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

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
    for (let y = centerY; y >= top; y -= gridSpacing) {
      ctx.beginPath();
      ctx.moveTo(leftX, y);
      ctx.lineTo(rightX, y);
      ctx.stroke();
    }
    for (let y = centerY + gridSpacing; y <= bottom; y += gridSpacing) {
      ctx.beginPath();
      ctx.moveTo(leftX, y);
      ctx.lineTo(rightX, y);
      ctx.stroke();
    }
    ctx.restore();

    const strengthNorm = (currentStrength ?? 0) / 100;
    const carrierFrequency = 2;
    const modulationFrequency = 0.6;

    const displayedDuration = DISPLAYED_CYCLES / carrierFrequency;
    const samples = 540;

    const modSignal = (t) => Math.sin(2 * Math.PI * modulationFrequency * t);
    const carrierSignal = (t) => amplitude * Math.sin(2 * Math.PI * carrierFrequency * t);

    const fmDeviationHz = carrierFrequency * 0.65 * strengthNorm;
    const pmPhaseFactor = strengthNorm * Math.PI * 0.75;

    const modulatedSignal = (() => {
      let previousT = timeSeconds;
      let fmExtraPhase = 0;

      return (t, sampleIndex) => {
        const basePhase = 2 * Math.PI * carrierFrequency * t;
        const m = modSignal(t);
        let value;

        switch (modulationType) {
          case 'am': {
            const envelope = Math.max(0, 1 + strengthNorm * m);
            value = amplitude * envelope * Math.sin(basePhase);
            break;
          }
          case 'fm': {
            if (sampleIndex > 0) {
              const dt = t - previousT;
              const midpoint = t - dt / 2;
              const instantaneousDeviation = fmDeviationHz * modSignal(midpoint);
              fmExtraPhase += 2 * Math.PI * instantaneousDeviation * dt;
            }
            value = amplitude * Math.sin(basePhase + fmExtraPhase);
            break;
          }
          case 'pm': {
            const phaseShift = pmPhaseFactor;
            const phaseShiftSeconds = phaseShift / (2 * Math.PI * carrierFrequency);
            value = amplitude * Math.sin(2 * Math.PI * carrierFrequency * (t - phaseShiftSeconds));
            break;
          }
          case 'qam': {
            const envelope = Math.max(0, 1 + strengthNorm * m);
            const phaseShift = strengthNorm * Math.PI * 0.6 * m;
            value = amplitude * envelope * Math.sin(basePhase + phaseShift);
            break;
          }
          default:
            value = amplitude * Math.sin(basePhase);
        }

        previousT = t;
        return value;
      };
    })();

    const drawWave = (fn, options = {}) => {
      const { strokeStyle, lineWidth = 2, dash = [], alpha = 0.8, verticalOffset = 0, amplitudeScale = 1 } = options;
      ctx.save();
      ctx.strokeStyle = strokeStyle;
      ctx.lineWidth = lineWidth;
      ctx.globalAlpha = alpha;
      if (dash.length) ctx.setLineDash(dash);
      ctx.beginPath();
      for (let i = 0; i <= samples; i++) {
        const progress = i / samples;
        const t = timeSeconds + displayedDuration * progress;
        const value = clamp(fn(t, i), -amplitude * amplitudeScale, amplitude * amplitudeScale);
        const x = leftX + progress * waveWidth;
        const y = centerY + verticalOffset - value;
        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }
      ctx.stroke();
      ctx.restore();
    };

    drawWave(carrierSignal, {
      strokeStyle: 'rgba(140, 190, 255, 0.35)',
      lineWidth: 1.5,
      dash: [8, 8],
      alpha: 0.75
    });

    drawWave(modulatedSignal, {
      strokeStyle: 'rgba(109, 173, 255, 0.92)',
      lineWidth: 3,
      amplitudeScale: modulationType === 'am' || modulationType === 'qam' ? 1 + strengthNorm : 1
    });
  }, [modulationType, currentStrength]);

  useEffect(() => {
    if (isReady) {
      draw();
    }
  }, [isReady, draw]);

  const handleOverlayStart = () => {
    setIsReady(true);
    draw();
  };

  return (
    <div className="modulation-viz">
      <div className="modulation-viz-header">
        <div className="modulation-viz-title">Modulation Playground</div>
      </div>

      <div className="modulation-viz-stage">
        <div ref={containerRef} className="modulation-viz-canvas">
          <canvas ref={canvasRef} />
          {!isReady && (
            <div className="modulation-viz-overlay">
              <div className="modulation-viz-overlay-content">
                <div className="modulation-viz-overlay-title">
                  Modulate the carrier to encode data
                </div>
                <button type="button" className="modulation-viz-start-btn" onClick={handleOverlayStart}>
                  Start sandbox
                </button>
              </div>
            </div>
          )}
        </div>
        <div className="modulation-viz-legend">
          <div className="modulation-viz-legend-item">
            <span className="modulation-viz-legend-swatch modulation-viz-legend-swatch--modulated" />
            Modulated signal
          </div>
          <div className="modulation-viz-legend-item">
            <span className="modulation-viz-legend-swatch modulation-viz-legend-swatch--carrier" />
            Carrier reference
          </div>
        </div>
      </div>

      <div className="modulation-viz-controls">
        <div className="modulation-viz-type-selector">
          <span className="modulation-viz-section-label">Modulation mode</span>
          <div className="modulation-viz-mode-buttons" role="group" aria-label="Modulation modes">
            {Object.entries(modulationModes).map(([type, config]) => (
              <button
                key={type}
                type="button"
                className={`modulation-viz-mode-btn${modulationType === type ? ' active' : ''}`}
                onClick={() => setModulationType(type)}
                aria-pressed={modulationType === type}
              >
                <span className="modulation-viz-mode-btn-label">{config.label}</span>
                <span className="modulation-viz-mode-btn-caption">{config.caption}</span>
              </button>
            ))}
          </div>
          <p className="modulation-viz-helper">{modulationDescriptor.helper}</p>
        </div>

        <div className="modulation-viz-slider-group">
          <label htmlFor="modulation-strength">Modulation strength: {currentStrength}%</label>
          <input
            id="modulation-strength"
            className="modulation-viz-slider"
            type="range"
            min="0"
            max="100"
            step="1"
            value={currentStrength}
            onChange={(e) => handleStrengthChange(Number(e.target.value))}
          />
        </div>
      </div>
    </div>
  );
};

export default ModulationVisualizer;
