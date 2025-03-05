import { useRef, useEffect } from 'react';
import { Protocol } from '@shared/schema';
import { motion } from 'framer-motion';

interface EcosystemMapProps {
  protocols: Protocol[];
  onSelectProtocol: (protocol: Protocol) => void;
}

const categoryColors = {
  DeFi: '#00F0FF',
  NFT: '#BD00FF',
  Infrastructure: '#00FFA3',
};

export default function EcosystemMap({ protocols, onSelectProtocol }: EcosystemMapProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const centerX = 400;
  const centerY = 300;
  const radius = 200;

  // Calculate node positions in a circle
  const nodes = protocols.map((protocol, i) => {
    const angle = (i * 2 * Math.PI) / protocols.length;
    return {
      protocol,
      x: centerX + radius * Math.cos(angle),
      y: centerY + radius * Math.sin(angle),
    };
  });

  useEffect(() => {
    // Add animation if needed
    const timer = setInterval(() => {
      if (svgRef.current) {
        const circles = svgRef.current.querySelectorAll('.protocol-node');
        circles.forEach((circle) => {
          const randomOffset = Math.random() * 5 - 2.5;
          const currentY = parseFloat(circle.getAttribute('cy') || '0');
          circle.setAttribute('cy', (currentY + randomOffset).toString());
        });
      }
    }, 2000);

    return () => clearInterval(timer);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="w-full h-[600px] rounded-lg overflow-hidden bg-[radial-gradient(circle_at_center,_#0A0A12_0%,_#000000_100%)]"
    >
      <svg
        ref={svgRef}
        viewBox="0 0 800 600"
        className="w-full h-full"
      >
        {/* Connection lines */}
        {nodes.map((node, i) => (
          <g key={`lines-${i}`}>
            {nodes.map((otherNode, j) => (
              i < j && (
                <line
                  key={`line-${i}-${j}`}
                  x1={node.x}
                  y1={node.y}
                  x2={otherNode.x}
                  y2={otherNode.y}
                  stroke="rgba(255,255,255,0.1)"
                  strokeWidth="1"
                />
              )
            ))}
          </g>
        ))}

        {/* Protocol nodes */}
        {nodes.map((node) => (
          <g
            key={node.protocol.id}
            onClick={() => onSelectProtocol(node.protocol)}
            className="cursor-pointer"
          >
            <circle
              cx={node.x}
              cy={node.y}
              r="20"
              className="protocol-node"
              fill={categoryColors[node.protocol.category as keyof typeof categoryColors]}
              fillOpacity="0.8"
            >
              <animate
                attributeName="r"
                values="20;22;20"
                dur="3s"
                repeatCount="indefinite"
              />
            </circle>
            <text
              x={node.x}
              y={node.y + 35}
              textAnchor="middle"
              fill="white"
              fontSize="14"
              className="pointer-events-none"
            >
              {node.protocol.name}
            </text>
          </g>
        ))}
      </svg>
    </motion.div>
  );
}