import { useMemo, useState } from 'react';
import '../ComponentStyles.css';

const BITCOIN_NODE_COUNT = 23000;
const HF_RECEIVER_COUNT = 23000;
const DISPLAY_NODE_COUNT = 16;
const DISPLAY_RECEIVER_COUNT = 16;

const generateMeshNodes = (count, width, height, margin = 18) => {
  const nodes = [];
  const attemptsLimit = 400;
  const minSpacing = Math.min(width, height) / (Math.sqrt(count) * 1.4);

  for (let i = 0; i < count; i++) {
    let placed = false;
    let attempts = 0;

    while (!placed && attempts < attemptsLimit) {
      attempts += 1;
      const candidate = {
        id: `mesh-${i}`,
        x: margin + Math.random() * (width - margin * 2),
        y: margin + Math.random() * (height - margin * 2)
      };

      const tooClose = nodes.some((node) => {
        const dx = node.x - candidate.x;
        const dy = node.y - candidate.y;
        return Math.hypot(dx, dy) < minSpacing;
      });

      if (!tooClose) {
        nodes.push(candidate);
        placed = true;
      }
    }

    if (!placed) {
      nodes.push({
        id: `mesh-${i}`,
        x: margin + Math.random() * (width - margin * 2),
        y: margin + Math.random() * (height - margin * 2)
      });
    }
  }

  return nodes;
};

const generateMeshLinks = (nodes, minLinks = 2, maxLinks = 3) => {
  const links = [];
  nodes.forEach((node, idx) => {
    const shuffledIndices = [...nodes.keys()]
      .filter((i) => i !== idx)
      .sort(() => Math.random() - 0.5);
    const linkCount = Math.floor(Math.random() * (maxLinks - minLinks + 1)) + minLinks;

    shuffledIndices.slice(0, linkCount).forEach((targetIdx) => {
      if (!links.some((link) =>
        (link.source === idx && link.target === targetIdx) ||
        (link.source === targetIdx && link.target === idx)
      )) {
        links.push({
          source: idx,
          target: targetIdx
        });
      }
    });
  });
  return links;
};

const generateRingReceivers = (count, radius, centerX, centerY) => {
  const receivers = [];
  for (let i = 0; i < count; i++) {
    const angle = (i / count) * Math.PI * 2;
    receivers.push({
      id: `rx-${i}`,
      x: centerX + Math.cos(angle) * radius,
      y: centerY + Math.sin(angle) * radius
    });
  }
  return receivers;
};

const NetworkTopologyVisualizer = () => {
  const [isRunning, setIsRunning] = useState(false);
  const meshData = useMemo(() => {
    const width = 340;
    const height = 230;
    const nodes = generateMeshNodes(DISPLAY_NODE_COUNT, width, height);
    const links = generateMeshLinks(nodes);
    return { nodes, links, width, height };
  }, []);

  const ringData = useMemo(() => {
    const centerX = 160;
    const centerY = 120;
    const radius = 104;
    const receivers = generateRingReceivers(DISPLAY_RECEIVER_COUNT, radius, centerX, centerY);
    return { centerX, centerY, radius, receivers };
  }, []);

  return (
    <div className="topology-viz">
      <div className="topology-viz-header">
        <div>
          <div className="topology-viz-title">HF Broadcast vs. Bitcoin Network</div>
          <div className="topology-viz-subtitle">
            HF only enables passive participation; the internet allows full participation.
          </div>
        </div>
        {isRunning && (
          <button
            type="button"
            className="topology-viz-stop-btn"
            onClick={() => setIsRunning(false)}
          >
            Stop
          </button>
        )}
      </div>

      <div className="topology-viz-panels">
        <div className="topology-panel">
          <div className="topology-panel-header">
            <span className="topology-panel-title">HF broadcast</span>
          </div>
          <div 
            className={`topology-panel-body broadcast${isRunning ? ' running' : ''}`}
            style={{ animationPlayState: isRunning ? 'running' : 'paused' }}
          >
            <svg
              className="topology-broadcast"
              viewBox="0 0 320 240"
              role="presentation"
            >
              <defs>
                <radialGradient id="broadcast-center-gradient" r="70%">
                  <stop offset="0%" stopColor="rgba(130, 200, 255, 0.95)" />
                  <stop offset="100%" stopColor="rgba(130, 200, 255, 0)" />
                </radialGradient>
                <radialGradient id="broadcast-receiver-gradient" r="80%">
                  <stop offset="0%" stopColor="rgba(255, 120, 120, 0.85)" />
                  <stop offset="100%" stopColor="rgba(255, 120, 120, 0)" />
                </radialGradient>
              </defs>
              <g className="broadcast-center">
                <circle
                  cx={ringData.centerX}
                  cy={ringData.centerY}
                  r={14}
                  fill="rgba(120, 190, 255, 0.95)"
                />
                <circle
                  cx={ringData.centerX}
                  cy={ringData.centerY}
                  r={30}
                  fill="url(#broadcast-center-gradient)"
                />
                <g className="broadcast-beams">
                  {Array.from({ length: 5 }, (_, idx) => (
                    <circle
                      // eslint-disable-next-line react/no-array-index-key
                      key={`beam-${idx}`}
                      cx={ringData.centerX}
                      cy={ringData.centerY}
                      r={30 + idx * 20}
                      stroke="rgba(255, 180, 110, 0.12)"
                      strokeWidth="2"
                      fill="none"
                    />
                  ))}
                </g>
              </g>
              <g className="broadcast-receivers">
                {ringData.receivers.map((receiver) => (
                  <g key={receiver.id}>
                    <circle
                      cx={receiver.x}
                      cy={receiver.y}
                      r={6}
                      fill="rgba(255, 125, 125, 0.85)"
                    />
                    <circle
                      cx={receiver.x}
                      cy={receiver.y}
                      r={12}
                      fill="url(#broadcast-receiver-gradient)"
                    />
                    <line
                      x1={ringData.centerX}
                      y1={ringData.centerY}
                      x2={receiver.x}
                      y2={receiver.y}
                      className="broadcast-ray"
                    />
                  </g>
                ))}
              </g>
            </svg>
          </div>
          <div className="topology-panel-footer">
            <span>Beacon pushes blocks one-way; receivers are passive</span>
          </div>
        </div>

        <div className="topology-panel">
          <div className="topology-panel-header">
            <span className="topology-panel-title">Bitcoin network</span>
          </div>
          <div 
            className={`topology-panel-body mesh${isRunning ? ' running' : ''}`}
            style={{ animationPlayState: isRunning ? 'running' : 'paused' }}
          >
            <svg
              className="topology-mesh"
              viewBox={`0 0 ${meshData.width} ${meshData.height}`}
              role="presentation"
            >
              <defs>
                <radialGradient id="mesh-node-gradient" r="70%">
                  <stop offset="0%" stopColor="rgba(120, 190, 255, 0.95)" />
                  <stop offset="100%" stopColor="rgba(120, 190, 255, 0)" />
                </radialGradient>
                <linearGradient id="mesh-link-gradient" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="rgba(120, 190, 255, 0.15)" />
                  <stop offset="100%" stopColor="rgba(120, 190, 255, 0.05)" />
                </linearGradient>
              </defs>
              <g className="mesh-links">
                {meshData.links.map((link) => {
                  const source = meshData.nodes[link.source];
                  const target = meshData.nodes[link.target];
                  return (
                    <line
                      // eslint-disable-next-line react/no-array-index-key
                      key={`link-${link.source}-${link.target}`}
                      x1={source.x}
                      y1={source.y}
                      x2={target.x}
                      y2={target.y}
                      stroke="url(#mesh-link-gradient)"
                    />
                  );
                })}
              </g>
              <g className="mesh-zaps">
                {meshData.links.map((link, index) => {
                  if (index % 2 !== 0) return null;
                  const source = meshData.nodes[link.source];
                  const target = meshData.nodes[link.target];
                  return (
                    <g key={`zap-${link.source}-${link.target}`}>
                      <line
                        x1={source.x}
                        y1={source.y}
                        x2={target.x}
                        y2={target.y}
                        className="mesh-zap"
                        pathLength="1"
                        style={{
                          animationDelay: `${(index % 10) * 0.35}s`
                        }}
                      />
                      <line
                        x1={source.x}
                        y1={source.y}
                        x2={target.x}
                        y2={target.y}
                        className="mesh-zap reverse"
                        pathLength="1"
                        style={{
                          animationDelay: `${((index % 10) * 0.35) + 0.3}s`
                        }}
                      />
                    </g>
                  );
                })}
              </g>
              <g className="mesh-nodes">
                {meshData.nodes.map((node) => (
                  <g key={node.id}>
                    <circle
                      cx={node.x}
                      cy={node.y}
                      r={5}
                      fill="rgba(140, 210, 255, 0.9)"
                    />
                    <circle
                      cx={node.x}
                      cy={node.y}
                      r={12}
                      fill="url(#mesh-node-gradient)"
                    />
                  </g>
                ))}
              </g>
            </svg>
          </div>
          <div className="topology-panel-footer">
            <span>Peers exchange information</span>
          </div>
        </div>
      </div>

      {!isRunning && (
        <div className="topology-viz-overlay">
          <div className="topology-viz-overlay-content">
            <div className="topology-viz-overlay-title">HF Broadcast vs. Bitcoin Network</div>
            <button
              type="button"
              className="topology-viz-start-btn"
              onClick={() => setIsRunning(true)}
            >
              Start
            </button>
          </div>
        </div>
      )}

      <div className="topology-viz-legend">
        <div className="legend-item">
          <span className="legend-color active" />
          <span>Active participant</span>
        </div>
        <div className="legend-item">
          <span className="legend-color passive" />
          <span>Passive participant</span>
        </div>
      </div>
    </div>
  );
};

export default NetworkTopologyVisualizer;
