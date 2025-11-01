import { useEffect, useMemo, useRef, useState } from 'react';
import '../ComponentStyles.css';

const BLOCK_SIZE_BYTES = 2_545_182;
const BITS_PER_BYTE = 8;
const BLOCK_BITS = BLOCK_SIZE_BYTES * BITS_PER_BYTE; // 20,361,456 bits
const GRID_SIZE = 100; // 10x10
const GRID_DIMENSION = 10;

const CHANNELS = [
  {
    id: 'fiber',
    label: 'Fiber Internet',
    rateBitsPerSecond: 1_000_000_000,
    color: 'var(--transfer-fiber-color, #8bc1ff)'
  },
  {
    id: 'cell',
    label: 'Cell / Starlink',
    rateBitsPerSecond: 100_000_000,
    color: 'var(--transfer-cell-color, #91f0c3)'
  },
  {
    id: 'hf',
    label: 'HF Radio',
    rateBitsPerSecond: 50_000,
    color: 'var(--transfer-hf-color, #ffb27f)'
  }
];

const PLAYBACK_SPEEDS = [
  { label: '1×', value: 1 },
  { label: '10×', value: 10 },
  { label: '100×', value: 100 }
];

const formatTime = (seconds) => {
  if (seconds >= 60) {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}m ${secs.toFixed(secs >= 10 ? 0 : 1)}s`;
  }
  if (seconds >= 10) {
    return `${seconds.toFixed(1)}s`;
  }
  if (seconds >= 1) {
    return `${seconds.toFixed(3)}s`;
  }
  return `${Math.round(seconds * 1000)} milliseconds`;
};

const BlockTransferVisualizer = () => {
  const [playbackRate, setPlaybackRate] = useState(1);
  const [isRunning, setIsRunning] = useState(false);
  const [simElapsed, setSimElapsed] = useState(0);
  const [runId, setRunId] = useState(0);
  const animationRef = useRef(null);

  const channelsWithDuration = useMemo(() => CHANNELS.map((channel) => ({
    ...channel,
    duration: BLOCK_BITS / channel.rateBitsPerSecond
  })), []);

  const maxDuration = useMemo(
    () => Math.max(...channelsWithDuration.map((channel) => channel.duration)),
    [channelsWithDuration]
  );

  useEffect(() => {
    if (!isRunning) {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }
      return undefined;
    }

    let lastTimestamp = performance.now();

    const tick = (now) => {
      const deltaSeconds = (now - lastTimestamp) / 1000;
      lastTimestamp = now;
      setSimElapsed((prev) => {
        const next = Math.min(prev + deltaSeconds * playbackRate, maxDuration);
        if (next >= maxDuration) {
          setIsRunning(false);
        }
        return next;
      });
      animationRef.current = requestAnimationFrame(tick);
    };

    animationRef.current = requestAnimationFrame(tick);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }
    };
  }, [isRunning, playbackRate, maxDuration]);

  const handleStart = () => {
    setRunId((prev) => prev + 1);
    setSimElapsed(0);
    setIsRunning(true);
  };

  const handleSpeedChange = (value) => {
    setPlaybackRate(value);
  };

  return (
    <div className="transfer-viz">
      <div className="transfer-viz-header">
        <div className="transfer-viz-title">
          How long to send one Bitcoin block?
        </div>
        <div className="transfer-viz-controls">
          <div className="transfer-viz-speed">
            <span>Playback speed:</span>
            {PLAYBACK_SPEEDS.map((speed) => (
              <button
                key={speed.value}
                type="button"
                className={`transfer-speed-btn${playbackRate === speed.value ? ' active' : ''}`}
                onClick={() => handleSpeedChange(speed.value)}
              >
                {speed.label}
              </button>
            ))}
          </div>
          <button
            type="button"
            className="transfer-start-btn"
            onClick={handleStart}
            disabled={isRunning}
          >
            Start transfer
          </button>
        </div>
      </div>

      <div className="transfer-viz-lanes">
        {channelsWithDuration.map((channel) => {
          const progress = Math.min(1, channel.duration === 0 ? 1 : simElapsed / channel.duration);
          const destCellsFilled = Math.min(GRID_SIZE, Math.round(progress * GRID_SIZE));
          const srcCellsRemaining = GRID_SIZE - destCellsFilled;
          const elapsedForLane = Math.min(simElapsed, channel.duration);
          const isComplete = progress >= 1;
          return (
            <div key={channel.id} className="transfer-lane">
              <div className="transfer-lane-header">
                <span className="transfer-lane-label">{channel.label}</span>
                <span className="transfer-lane-rate">
                  {(channel.rateBitsPerSecond / 1_000_000).toLocaleString()} Mb/s
                </span>
              </div>
              <div className="transfer-lane-body">
                <div className="transfer-lane-grid source">
                  {Array.from({ length: GRID_SIZE }, (_, idx) => (
                    <span
                      // eslint-disable-next-line react/no-array-index-key
                      key={`src-${channel.id}-${idx}-${runId}`}
                      className={`transfer-cell${idx < srcCellsRemaining ? ' filled' : ''}`}
                    />
                  ))}
                </div>
                <div className="transfer-lane-stream">
                  <div
                    className="transfer-stream-progress"
                    style={{
                      width: `${Math.max(progress * 100, 0)}%`,
                      background: channel.color
                    }}
                  />
                  {isComplete && (
                    <div className="transfer-complete-overlay">
                      Completed in {formatTime(channel.duration)}
                    </div>
                  )}
                </div>
                <div className="transfer-lane-grid destination">
                  {Array.from({ length: GRID_SIZE }, (_, idx) => (
                    <span
                      // eslint-disable-next-line react/no-array-index-key
                      key={`dst-${channel.id}-${idx}-${runId}`}
                      className={`transfer-cell${idx < destCellsFilled ? ' filled' : ''}`}
                    />
                  ))}
                </div>
              </div>
              <div className="transfer-lane-footer">
                <div className="transfer-progress-bar">
                  <div
                    className="transfer-progress-fill"
                    style={{ width: `${progress * 100}%`, background: channel.color }}
                  />
                </div>
                <div className="transfer-progress-labels">
                  <span>{formatTime(elapsedForLane)}</span>
                  <span>/</span>
                  <span>{formatTime(channel.duration)}</span>
                  {isComplete && <span className="transfer-complete-tag">Block received</span>}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="transfer-viz-footnote">
        Based on block #920,315 ({BLOCK_SIZE_BYTES.toLocaleString()} bytes). Each lane shows the
        time to transmit 20,361,456 bits at the stated bitrate.
      </div>
    </div>
  );
};

export default BlockTransferVisualizer;
