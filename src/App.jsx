import React from "react";
import Board from "./components/Board";
import './index.css';
const App = () => {
  return (
    <div className="App text-center p-6">
      <h1 className="font-lobster text-4xl text-blue-600">
        Welcome to Triggle
      </h1>
      <p className="font-openSans text-lg text-gray-600 my-4">
        Create triangles and outsmart your opponent!
      </p>
     
<button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
  Button
</button>
    
      <Board />
    </div>
  );
};

export default App;
