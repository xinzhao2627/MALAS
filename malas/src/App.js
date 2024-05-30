import React from 'react';
import './App.css';
import MainHome from './Main';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom'
import Login from './Login'
import Register from './Register'

function App() {
  return (
    <Router>
      <div>
        <Routes>
          <Route exact path='/' Component={MainHome}/>
          <Route exact path='/login' Component={Login}/>
          <Route exact path='/register' Component={Register}/>
        </Routes>
      </div>
    </Router>

  );
}

export default App;
