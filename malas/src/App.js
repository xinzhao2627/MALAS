import React from 'react';
import './App.css';

class Login extends React.Component{
  render (){

    return (
      <div className='login-section '>
        <header className="App-header">
          Microsoft Alternative Login Authentication System
        </header>
      </div>
    )
  }
}

function App() {
  return (
    <div className="App">
      <Login/>
    </div>
  );
}

export default App;
