import './App.css';
import React, { Component } from 'react'
import Button from 'react-bootstrap/Button'
import { NavLink } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.min.js'
class Login extends React.Component{
    render (){


      return (
        <div className='login-section App-header'>
          <div className="login-box px-5">
            <div className='login-header-logo'>
              <NavLink to='/'>
              <img src='/images/microsoft-seeklogo.jpg'  width="120px" height="25px"/>
              </NavLink>
            </div>
            <h3 className='login-header-label mt-3'>Sign in</h3>
            <input className='login-header-input mt-3' type='email' placeholder='Email or phone'/>
            <div className='login-reg-prompt mt-2'>
              <label htmlFor=''>No account?</label>
              <NavLink to='/login'>
                <a className='ms-1 link-primary' >Create one!</a>
              </NavLink>
            </div>
            <div className='login-reg-prompt mt-3'>
              <NavLink to='/login'>
                <a className='link-primary' >Can't access account?</a>
              </NavLink>
            </div>
            <div className='mt-4 login-pbtn'>
              <button className='pbtn-1'>Back</button>
              <button className='ms-3 pbtn-2'>Next</button>
            </div>
          </div>
        </div>
      )
    }
}

export default Login