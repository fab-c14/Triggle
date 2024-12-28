import React from "react";
import HexBoard from "./components/HexBoard";

const App = () => {
  return (
    <div className="App">
      <h1 className="font-lobster text-4xl text-blue-600 text-center my-4">
        Triggle Game
      </h1>
      <p className="font-openSans text-lg text-gray-600 text-center mb-4">
        Connect pins with rubber bands to create triangles!
      </p>
      <div className="shadow-3xl w-90">
      <HexBoard />
      </div>
    </div>
  );
};

export default App;
