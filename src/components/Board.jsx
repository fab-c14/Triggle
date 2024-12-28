import React, { useState } from "react";

const Board = () => {
  const rows = 7; // Number of rows
  const cols = 7; // Number of columns

  // State to track selected pegs
  const [selectedPegs, setSelectedPegs] = useState([]);

  // Function to handle peg clicks
  const handlePegClick = (row, col) => {
    const pegKey = `${row}-${col}`;
    setSelectedPegs((prev) =>
      prev.includes(pegKey)
        ? prev.filter((key) => key !== pegKey) // Remove peg if already selected
        : [...prev, pegKey] // Add peg if not selected
    );
  };

  return (
    <div className="flex flex-col items-center gap-4 p-6 bg-gray-100 rounded-lg shadow-lg">
      {/* Board grid */}
      {Array.from({ length: rows }).map((_, row) => (
        <div key={row} className="flex gap-4">
          {Array.from({ length: cols }).map((_, col) => (
            <div
              key={`${row}-${col}`}
              className={`w-8 h-8 rounded-full border-2 ${
                selectedPegs.includes(`${row}-${col}`)
                  ? "bg-blue-500 border-blue-700"
                  : "bg-gray-300 border-gray-400"
              } hover:bg-blue-300 transition duration-300 cursor-pointer`}
              onClick={() => handlePegClick(row, col)}
            />
          ))}
        </div>
      ))}
    </div>
  );
};

export default Board;
