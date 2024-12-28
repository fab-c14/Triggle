import React, { useState, useEffect } from "react";

// Utility to generate hexagonal grid coordinates
const generateHexagonalGrid = (size) => {
  const hexagons = [];
  for (let q = -size; q <= size; q++) {
    for (let r = -size; r <= size; r++) {
      const s = -q - r;
      if (Math.abs(s) <= size) {
        hexagons.push({ q, r, s });
      }
    }
  }
  return hexagons;
};

const HexBoard = () => {
  const gridSize = 3;
  const hexagons = generateHexagonalGrid(gridSize);

  const [boardSize, setBoardSize] = useState({ width: 500, height: 500 });
  const [connections, setConnections] = useState([]);
  const [selectedPin, setSelectedPin] = useState(null);
  const [triangles, setTriangles] = useState([]);
  const [scores, setScores] = useState({ player: 0, computer: 0 });

  const calculatePosition = (q, r) => {
    const hexWidth = boardSize.width / (2 * gridSize + 1);
    const hexHeight = boardSize.height / (2 * gridSize + 1);
    const x = (q + r / 2) * hexWidth + boardSize.width / 2;
    const y = r * (hexHeight * 0.866) + boardSize.height / 2; // 0.866 = sqrt(3)/2
    return { x, y };
  };

  useEffect(() => {
    const handleResize = () => {
      const width = Math.min(window.innerWidth * 0.9, 600);
      const height = Math.min(window.innerHeight * 0.9, 600);
      setBoardSize({ width, height });
    };
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handlePinClick = (pin) => {
    if (selectedPin) {
      const newConnection = { from: selectedPin, to: pin, by: "player" };
      if (
        !connections.some(
          (conn) =>
            (conn.from.q === newConnection.from.q &&
              conn.from.r === newConnection.from.r &&
              conn.to.q === newConnection.to.q &&
              conn.to.r === newConnection.to.r) ||
            (conn.from.q === newConnection.to.q &&
              conn.from.r === newConnection.to.r &&
              conn.to.q === newConnection.from.q &&
              conn.to.r === newConnection.from.r)
        )
      ) {
        const updatedConnections = [...connections, newConnection];
        setConnections(updatedConnections);
        checkForTriangles(updatedConnections, "player");
        setSelectedPin(null);
        setTimeout(computerMove, 500); // Computer moves after player
      }
    } else {
      setSelectedPin(pin);
    }
  };

  const computerMove = () => {
    const unconnectedPairs = [];
    hexagons.forEach((hex1) => {
      hexagons.forEach((hex2) => {
        if (
          hex1 !== hex2 &&
          !connections.some(
            (conn) =>
              (conn.from.q === hex1.q &&
                conn.from.r === hex1.r &&
                conn.to.q === hex2.q &&
                conn.to.r === hex2.r) ||
              (conn.from.q === hex2.q &&
                conn.from.r === hex2.r &&
                conn.to.q === hex1.q &&
                conn.to.r === hex1.r)
          )
        ) {
          unconnectedPairs.push({ from: hex1, to: hex2 });
        }
      });
    });

    if (unconnectedPairs.length > 0) {
      const randomPair =
        unconnectedPairs[Math.floor(Math.random() * unconnectedPairs.length)];
      const updatedConnections = [
        ...connections,
        { ...randomPair, by: "computer" },
      ];
      setConnections(updatedConnections);
      checkForTriangles(updatedConnections, "computer");
    }
  };

  const checkForTriangles = (currentConnections, player) => {
    const newTriangles = [];
    currentConnections.forEach((conn1) => {
      currentConnections.forEach((conn2) => {
        currentConnections.forEach((conn3) => {
          if (
            conn1.from.q === conn2.from.q &&
            conn2.to.q === conn3.from.q &&
            conn3.to.q === conn1.to.q &&
            !triangles.some((triangle) =>
              triangle.every(
                (point) =>
                  point.q === conn1.from.q && point.r === conn1.from.r
              )
            )
          ) {
            newTriangles.push([conn1.from, conn1.to, conn2.to]);
          }
        });
      });
    });

    if (newTriangles.length > 0) {
      setTriangles([...triangles, ...newTriangles]);
      setScores((prev) => ({
        ...prev,
        [player]: prev[player] + newTriangles.length,
      }));
    }
  };

  return (
    <div className="flex flex-col items-center">
      {/* Scores */}
      <div className="flex justify-between w-1/2 my-4 text-lg">
        <div>
          <span className="text-green-600">Player: </span>
          {scores.player}
        </div>
        <div>
          <span className="text-blue-600">Computer: </span>
          {scores.computer}
        </div>
      </div>

      {/* Board */}
      <div
        className="relative bg-gray-100 border rounded-md"
        style={{ width: boardSize.width, height: boardSize.height }}
      >
        {/* Render Pins */}
        {hexagons.map((hex, index) => {
          const { x, y } = calculatePosition(hex.q, hex.r);
          return (
            <div
              key={index}
              className={`absolute w-6 h-6 rounded-full bg-blue-500 border-2 border-white cursor-pointer hover:bg-yellow-400 transition`}
              style={{
                left: `${x}px`,
                top: `${y}px`,
                transform: "translate(-50%, -50%)",
              }}
              onClick={() => handlePinClick(hex)}
            ></div>
          );
        })}

        {/* Render Connections */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          {connections.map((conn, index) => {
            const fromPos = calculatePosition(conn.from.q, conn.from.r);
            const toPos = calculatePosition(conn.to.q, conn.to.r);
            return (
              <line
                key={index}
                x1={fromPos.x}
                y1={fromPos.y}
                x2={toPos.x}
                y2={toPos.y}
                stroke={conn.by === "player" ? "green" : "red"}
                strokeWidth="2"
                strokeDasharray="5,5"
                className="animate-draw-line"
              />
            );
          })}
        </svg>

        {/* Highlight Triangles */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          {triangles.map((triangle, index) => (
            <polygon
              key={index}
              points={triangle
                .map((pin) => {
                  const pos = calculatePosition(pin.q, pin.r);
                  return `${pos.x},${pos.y}`;
                })
                .join(" ")}
              fill="rgba(222, 18, 181, 0.3)"
              stroke="green"
              strokeWidth="2"
            />
          ))}
        </svg>
      </div>
    </div>
  );
};

export default HexBoard;
