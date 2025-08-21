import React, { useState } from 'react';

import './App.css';

const App: React.FC = () => {
  const [count, setCount] = useState<number>(0);

  return (
    <div className='app'>
      <header className='app-header'>
        <h1>Budtr App</h1>
        <p>React 19.1.1 + TypeScript + Webpack + Module Federation</p>
        <div className='counter'>
          <p>Count: {count}</p>
          <button onClick={() => setCount(count + 1)}>Increment</button>
          <button onClick={() => setCount(count - 1)}>Decrement</button>
          <button onClick={() => setCount(0)}>Reset</button>
        </div>
      </header>
    </div>
  );
};

export default App;
