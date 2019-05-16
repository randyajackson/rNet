import React from 'react';

function App(){
  
  const sayHello = () => {
    alert("hello");
  };

  return(
    <div> 
      <h1>Hello React</h1>
      <button onClick={sayHello}>Hello</button>
    </div>
  );
}

export default App;