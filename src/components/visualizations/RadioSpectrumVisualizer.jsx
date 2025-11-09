import { useEffect, useRef, useState } from 'react';
import '../ComponentStyles.css';

const MIN_FREQUENCY = 3e6; // 3 MHz
const MAX_FREQUENCY = 30e9; // 30 GHz
const FIXED_DISPLAY_WIDTH = 30e6; // 30 MHz
const CANVAS_HEIGHT = 200;
const DISPLAY_HEIGHT = 120;

// Radio bands
const BANDS = [
  { name: 'HF', min: 3e6, max: 30e6, color: 'rgba(77, 124, 255, 0.3)' },
  { name: 'VHF', min: 30e6, max: 300e6, color: 'rgba(109, 173, 255, 0.3)' },
  { name: 'UHF', min: 300e6, max: 3e9, color: 'rgba(130, 200, 255, 0.3)' },
  { name: 'SHF', min: 3e9, max: 30e9, color: 'rgba(150, 220, 255, 0.3)' }
];

// Convert frequency to log scale position (0-1)
const freqToLogPos = (freq) => {
  const logMin = Math.log10(MIN_FREQUENCY);
  const logMax = Math.log10(MAX_FREQUENCY);
  const logFreq = Math.log10(freq);
  return (logFreq - logMin) / (logMax - logMin);
};

// Convert log position (0-1) to frequency
const logPosToFreq = (pos) => {
  const logMin = Math.log10(MIN_FREQUENCY);
  const logMax = Math.log10(MAX_FREQUENCY);
  const logFreq = logMin + pos * (logMax - logMin);
  return Math.pow(10, logFreq);
};

// Format frequency for display
const formatFrequency = (freq) => {
  if (freq >= 1e9) {
    return `${(freq / 1e9).toFixed(2)} GHz`;
  } else if (freq >= 1e6) {
    return `${(freq / 1e6).toFixed(2)} MHz`;
  } else if (freq >= 1e3) {
    return `${(freq / 1e3).toFixed(2)} kHz`;
  }
  return `${freq.toFixed(2)} Hz`;
};

// Format bandwidth for display
const formatBandwidth = (bw) => {
  if (bw >= 1e6) {
    return `${(bw / 1e6).toFixed(2)} MHz`;
  } else if (bw >= 1e3) {
    return `${(bw / 1e3).toFixed(2)} kHz`;
  }
  return `${bw.toFixed(2)} Hz`;
};

const RadioSpectrumVisualizer = () => {
  const [isReady, setIsReady] = useState(false);
  const [selectedFrequency, setSelectedFrequency] = useState(null);
  const [bandwidth, setBandwidth] = useState(null);
  const canvasRef = useRef(null);
  const displayCanvasRef = useRef(null);
  const containerRef = useRef(null);
  const displayContainerRef = useRef(null);

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
    const displayCanvas = displayCanvasRef.current;
    const container = displayContainerRef.current;
    if (!displayCanvas || !container) return;

    const resize = () => {
      const availableWidth = container.clientWidth || 640;
      const dpr = window.devicePixelRatio || 1;

      displayCanvas.width = availableWidth * dpr;
      displayCanvas.height = DISPLAY_HEIGHT * dpr;
      displayCanvas.style.width = `${availableWidth}px`;
      displayCanvas.style.height = `${DISPLAY_HEIGHT}px`;

      const ctx = displayCanvas.getContext('2d');
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

    const dpr = window.devicePixelRatio || 1;
    const width = canvas.width / dpr;
    const height = canvas.height / dpr;
    const isMobile = width < 768;
    const isSmallMobile = width < 480;

    ctx.clearRect(0, 0, width, height);

    const padding = isSmallMobile ? 40 : isMobile ? 50 : 60;
    const spectrumTop = isSmallMobile ? 30 : isMobile ? 35 : 40;
    const spectrumBottom = height - (isSmallMobile ? 30 : isMobile ? 35 : 40);
    const spectrumHeight = spectrumBottom - spectrumTop;
    const spectrumLeft = padding;
    const spectrumRight = width - padding;
    const spectrumWidth = spectrumRight - spectrumLeft;

    // Background gradient
    const gradient = ctx.createLinearGradient(0, 0, 0, height);
    gradient.addColorStop(0, 'rgba(9, 14, 26, 0.2)');
    gradient.addColorStop(0.5, 'rgba(9, 14, 26, 0.55)');
    gradient.addColorStop(1, 'rgba(9, 14, 26, 0.2)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    // Grid
    ctx.save();
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
    ctx.lineWidth = 1;
    const gridSpacing = 40;
    for (let x = spectrumLeft; x <= spectrumRight; x += gridSpacing) {
      ctx.beginPath();
      ctx.moveTo(x, spectrumTop);
      ctx.lineTo(x, spectrumBottom);
      ctx.stroke();
    }
    for (let y = spectrumTop; y <= spectrumBottom; y += gridSpacing) {
      ctx.beginPath();
      ctx.moveTo(spectrumLeft, y);
      ctx.lineTo(spectrumRight, y);
      ctx.stroke();
    }
    ctx.restore();

    // Draw bands
    BANDS.forEach((band) => {
      const leftPos = freqToLogPos(band.min);
      const rightPos = freqToLogPos(band.max);
      const leftX = spectrumLeft + leftPos * spectrumWidth;
      const rightX = spectrumLeft + rightPos * spectrumWidth;
      const bandWidth = rightX - leftX;

      ctx.fillStyle = band.color;
      ctx.fillRect(leftX, spectrumTop, bandWidth, spectrumHeight);

      // Band label
      const labelX = leftX + bandWidth / 2;
      ctx.save();
      ctx.fillStyle = 'rgba(230, 238, 255, 0.7)';
      ctx.font = isSmallMobile ? 'bold 10px sans-serif' : isMobile ? 'bold 11px sans-serif' : 'bold 12px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(band.name, labelX, spectrumTop - (isSmallMobile ? 15 : isMobile ? 18 : 20));
      ctx.restore();
    });

    // Draw frequency markers
    const freqMarkers = [
      3e6, 10e6, 30e6, 100e6, 300e6, 1e9, 3e9, 10e9, 30e9
    ];

    ctx.save();
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
    ctx.lineWidth = 1;
    ctx.font = isSmallMobile ? '8px sans-serif' : isMobile ? '9px sans-serif' : '10px sans-serif';
    ctx.fillStyle = 'rgba(230, 238, 255, 0.6)';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';

    freqMarkers.forEach((freq) => {
      const pos = freqToLogPos(freq);
      const x = spectrumLeft + pos * spectrumWidth;
      ctx.beginPath();
      ctx.moveTo(x, spectrumTop);
      ctx.lineTo(x, spectrumBottom);
      ctx.stroke();
      ctx.fillText(formatFrequency(freq), x, spectrumBottom + (isSmallMobile ? 6 : isMobile ? 7 : 8));
    });
    ctx.restore();

    // Draw points of interest
    const pointsOfInterest = [
      { freq: 14e6, label: 'Shortwave' },
      { freq: 100e6, label: 'FM Radio' },
      { freq: 600e6, label: 'TV' },
      { freq: 3.5e9, label: '5G' },
      { freq: 2.4e9, label: 'Wi-Fi 2.4' },
      { freq: 5e9, label: 'Wi-Fi 5' },
      { freq: 12e9, label: 'Satellite (Ku)' }
    ];

    ctx.save();
    const numPoints = pointsOfInterest.length;
    const verticalRange = spectrumHeight * 0.5; // Use middle 50% of spectrum
    const startY = spectrumBottom - 20; // Start near bottom
    const spacing = verticalRange / (numPoints - 1); // Even spacing between points
    
    pointsOfInterest.forEach((point, index) => {
      const pos = freqToLogPos(point.freq);
      const x = spectrumLeft + pos * spectrumWidth;
      const markerY = startY - (index * spacing);
      const labelY = markerY + 14; // Label just below marker
      
      // Draw marker dot
      ctx.fillStyle = 'rgba(255, 200, 100, 0.9)';
      ctx.beginPath();
      ctx.arc(x, markerY, 3, 0, Math.PI * 2);
      ctx.fill();
      
      // Measure text width for background
      const labelFontSize = isSmallMobile ? '8px' : isMobile ? '8.5px' : '9px';
      ctx.font = `${labelFontSize} sans-serif`;
      const textMetrics = ctx.measureText(point.label);
      const textWidth = textMetrics.width;
      const labelPadding = isSmallMobile ? 6 : isMobile ? 7 : 8; // Horizontal padding on each side
      const bgWidth = textWidth + (labelPadding * 2);
      const bgHeight = isSmallMobile ? 10 : isMobile ? 11 : 12;
      const textCenterY = labelY - 4; // Text center position
      
      // Draw label with background for readability
      ctx.fillStyle = 'rgba(10, 16, 27, 0.85)';
      ctx.fillRect(x - bgWidth / 2, textCenterY - bgHeight / 2, bgWidth, bgHeight);
      
      ctx.fillStyle = 'rgba(255, 200, 100, 0.95)';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(point.label, x, textCenterY);
    });
    ctx.restore();

    // Draw selected frequency indicator
    if (selectedFrequency) {
      const pos = freqToLogPos(selectedFrequency);
      const x = spectrumLeft + pos * spectrumWidth;
      const bw = selectedFrequency * 0.001;
      const bwLeftPos = freqToLogPos(selectedFrequency - bw / 2);
      const bwRightPos = freqToLogPos(selectedFrequency + bw / 2);
      const bwLeftX = spectrumLeft + bwLeftPos * spectrumWidth;
      const bwRightX = spectrumLeft + bwRightPos * spectrumWidth;

      // Highlight bandwidth region
      ctx.fillStyle = 'rgba(255, 210, 110, 0.25)';
      ctx.fillRect(bwLeftX, spectrumTop, bwRightX - bwLeftX, spectrumHeight);

      // Center line
      ctx.strokeStyle = 'rgba(255, 210, 110, 0.9)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(x, spectrumTop);
      ctx.lineTo(x, spectrumBottom);
      ctx.stroke();

      // Bandwidth edges
      ctx.strokeStyle = 'rgba(255, 210, 110, 0.6)';
      ctx.lineWidth = 1.5;
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.moveTo(bwLeftX, spectrumTop);
      ctx.lineTo(bwLeftX, spectrumBottom);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(bwRightX, spectrumTop);
      ctx.lineTo(bwRightX, spectrumBottom);
      ctx.stroke();
      ctx.setLineDash([]);

      // Label
      ctx.save();
      ctx.fillStyle = 'rgba(255, 210, 110, 0.95)';
      ctx.font = isSmallMobile ? 'bold 9px sans-serif' : isMobile ? 'bold 10px sans-serif' : 'bold 11px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'bottom';
      ctx.fillText(`${formatFrequency(selectedFrequency)} (0.1% = ${formatBandwidth(bw)})`, x, spectrumTop - (isSmallMobile ? 3 : isMobile ? 4 : 5));
      ctx.restore();
    }
  }, [selectedFrequency]);

  useEffect(() => {
    const displayCanvas = displayCanvasRef.current;
    if (!displayCanvas) return;

    const ctx = displayCanvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const width = displayCanvas.width / dpr;
    const height = displayCanvas.height / dpr;
    const isMobile = width < 768;
    const isSmallMobile = width < 480;

    ctx.clearRect(0, 0, width, height);

    const padding = isSmallMobile ? 40 : isMobile ? 50 : 60;
    const displayTop = isSmallMobile ? 15 : isMobile ? 18 : 20;
    const displayBottom = height - (isSmallMobile ? 15 : isMobile ? 18 : 20);
    const displayHeight = displayBottom - displayTop;
    const displayLeft = padding;
    const displayRight = width - padding;
    const displayWidth = displayRight - displayLeft;

    // Background
    const gradient = ctx.createLinearGradient(0, 0, 0, height);
    gradient.addColorStop(0, 'rgba(9, 14, 26, 0.3)');
    gradient.addColorStop(0.5, 'rgba(9, 14, 26, 0.6)');
    gradient.addColorStop(1, 'rgba(9, 14, 26, 0.3)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    // Grid
    ctx.save();
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
    ctx.lineWidth = 1;
    const gridSpacing = 30;
    for (let x = displayLeft; x <= displayRight; x += gridSpacing) {
      ctx.beginPath();
      ctx.moveTo(x, displayTop);
      ctx.lineTo(x, displayBottom);
      ctx.stroke();
    }
    ctx.restore();

    // Fixed display width label
    ctx.save();
    ctx.fillStyle = 'rgba(230, 238, 255, 0.7)';
    ctx.font = isSmallMobile ? 'bold 9px sans-serif' : isMobile ? 'bold 10px sans-serif' : 'bold 11px sans-serif';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';
    ctx.fillText('Bandwidth', displayLeft, displayTop - (isSmallMobile ? 14 : isMobile ? 16 : 18));
    ctx.restore();

    // Draw the fixed 30 MHz range
    ctx.strokeStyle = 'rgba(130, 170, 255, 0.4)';
    ctx.lineWidth = 2;
    ctx.setLineDash([6, 6]);
    ctx.beginPath();
    ctx.moveTo(displayLeft, displayTop);
    ctx.lineTo(displayLeft, displayBottom);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(displayRight, displayTop);
    ctx.lineTo(displayRight, displayBottom);
    ctx.stroke();
    ctx.setLineDash([]);

    // Draw selected bandwidth if available
    if (bandwidth && bandwidth > 0) {
      // Scale bandwidth to fit in 30 MHz display
      const scale = Math.min(1, FIXED_DISPLAY_WIDTH / bandwidth);
      const scaledBw = bandwidth * scale;
      let bwWidth = (scaledBw / FIXED_DISPLAY_WIDTH) * displayWidth;
      // Ensure minimum width for visibility (at least 4 pixels)
      const minWidth = 4;
      if (bwWidth < minWidth) {
        bwWidth = minWidth;
      }
      const centerX = displayLeft + displayWidth / 2;
      const bwLeftX = centerX - bwWidth / 2;
      const bwRightX = centerX + bwWidth / 2;

      // Highlight bandwidth
      ctx.fillStyle = 'rgba(255, 210, 110, 0.35)';
      ctx.fillRect(bwLeftX, displayTop, bwWidth, displayHeight);

      // Center line
      ctx.strokeStyle = 'rgba(255, 210, 110, 0.9)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(centerX, displayTop);
      ctx.lineTo(centerX, displayBottom);
      ctx.stroke();

      // Edges
      ctx.strokeStyle = 'rgba(255, 210, 110, 0.7)';
      ctx.lineWidth = 1.5;
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.moveTo(bwLeftX, displayTop);
      ctx.lineTo(bwLeftX, displayBottom);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(bwRightX, displayTop);
      ctx.lineTo(bwRightX, displayBottom);
      ctx.stroke();
      ctx.setLineDash([]);

      // Label
      ctx.save();
      ctx.fillStyle = 'rgba(255, 210, 110, 0.95)';
      ctx.font = isSmallMobile ? 'bold 10px sans-serif' : isMobile ? 'bold 11px sans-serif' : 'bold 12px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      const labelY = displayTop + displayHeight / 2;
      ctx.fillText(formatBandwidth(bandwidth), centerX, labelY);
      ctx.restore();

      // Scale indicator if bandwidth exceeds display
      if (bandwidth > FIXED_DISPLAY_WIDTH) {
        ctx.save();
        ctx.fillStyle = 'rgba(255, 150, 70, 0.8)';
        ctx.font = isSmallMobile ? '8px sans-serif' : isMobile ? '9px sans-serif' : '10px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'bottom';
        ctx.fillText(`(scaled ${(scale * 100).toFixed(1)}%)`, centerX, displayBottom + (isSmallMobile ? 12 : isMobile ? 14 : 16));
        ctx.restore();
      }
    } else {
      // Show placeholder
      ctx.save();
      ctx.fillStyle = 'rgba(230, 238, 255, 0.4)';
      ctx.font = isSmallMobile ? '9px sans-serif' : isMobile ? '10px sans-serif' : '11px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      const placeholderText = isSmallMobile ? 'Click to select' : 'Click on spectrum above to select frequency';
      ctx.fillText(placeholderText, displayLeft + displayWidth / 2, displayTop + displayHeight / 2);
      ctx.restore();
    }
  }, [bandwidth]);

  const handleSpectrumClick = (e) => {
    if (!isReady) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    // Support both mouse and touch events
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const x = clientX - rect.left;
    const dpr = window.devicePixelRatio || 1;
    const width = canvas.width / dpr;
    const isMobile = width < 768;
    const isSmallMobile = width < 480;
    const padding = isSmallMobile ? 40 : isMobile ? 50 : 60;
    const spectrumLeft = padding;
    const spectrumRight = width - padding;
    const spectrumWidth = spectrumRight - spectrumLeft;

    if (x < spectrumLeft || x > spectrumRight) return;

    const pos = (x - spectrumLeft) / spectrumWidth;
    const freq = logPosToFreq(pos);
    const bw = freq * 0.001; // 0.1% of frequency

    setSelectedFrequency(freq);
    setBandwidth(bw);
  };

  return (
    <div className="radio-spectrum-viz">
      <div className="radio-spectrum-viz-header">
        <div className="radio-spectrum-viz-title">Radio Spectrum: Higher Frequencies = More Bandwidth</div>
        {selectedFrequency && (
          <div className="radio-spectrum-viz-metadata">
            <span>
              <strong>{formatFrequency(selectedFrequency)}</strong> selected
            </span>
            <span>
              <strong>{formatBandwidth(bandwidth)}</strong> bandwidth (0.1%)
            </span>
          </div>
        )}
      </div>

      <div className="radio-spectrum-viz-stage">
        <div ref={containerRef} className="radio-spectrum-viz-canvas">
          <canvas
            ref={canvasRef}
            onClick={handleSpectrumClick}
            onTouchStart={(e) => {
              e.preventDefault();
              handleSpectrumClick(e);
            }}
            style={{ cursor: isReady ? 'pointer' : 'default', touchAction: 'manipulation' }}
          />
          {!isReady && (
            <div className="radio-spectrum-viz-overlay">
              <div className="radio-spectrum-viz-overlay-content">
                <div className="radio-spectrum-viz-overlay-title">Radio Spectrum: Higher Frequencies = More Bandwidth</div>
                <button
                  type="button"
                  className="radio-spectrum-viz-start-btn"
                  onClick={() => setIsReady(true)}
                >
                  Start
                </button>
              </div>
            </div>
          )}
          {isReady && !selectedFrequency && (
            <div className="radio-spectrum-viz-instruction">
              Click anywhere on the spectrum to select a frequency
            </div>
          )}
        </div>

        <div ref={displayContainerRef} className="radio-spectrum-viz-display">
          <canvas ref={displayCanvasRef} />
        </div>
      </div>

      <div className="radio-spectrum-viz-footnote">
        At higher frequencies, using 0.1% of the frequency results in much more absolute bandwidth available for data transmission.
      </div>
    </div>
  );
};

export default RadioSpectrumVisualizer;

