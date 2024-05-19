import './App.css';
import React, {useState, useEffect } from 'react'
import { NavLink } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.min.js'


function Login (){
  const [fetched_data, set_fetched_data] = useState()
  const [user_name, set_user_name] = useState()
  const [password, set_password] = useState()
  const [prompt_phase, set_prompt_phase] = useState(1)
  const [forgot_prompt, set_forgot_prompt] = useState(true)
  const retrieved_user = "testing@gmail.com"
  useEffect(() => {
    const getData = async () => {
      const res = await fetch("/users")
      const data = await res.json()
      set_fetched_data(data.users)
    }
    getData()
  }, [])
  const handleChangeUser = (e) => {
    set_user_name(e.target.value)
  }
  const handleChangePassword = (e) => {
    set_password(e.target.value)
    console.log(password)
  }
  const backSubmit = (e) => {
    set_prompt_phase(1)
  }

const infoSubmit = async (e) => {
  e.preventDefault()

  // TODO CONDITION PHASE
  const info = null

  const option = {
    method: "POST",
    headers: {
      "Content-Type" : "application/json"
    },
    body: JSON.stringify(info)
  }


  // TODO CONDITION
  const postURL = null
  const response = await fetch(postURL, option)
  if (!(response.status === 201 || response.status === 200)){
    const backend_fetch = await response.json()
    alert(backend_fetch.message)
  }

  // TODO CONDITION 
   const nextPhase = null

   set_prompt_phase(nextPhase)
}


  const nextSubmit = async (e) => {
    e.preventDefault()
    const ex = {user_name}
    const option  = {
      method: "POST",
      headers: {
        "Content-Type":"application/json"
      },
      body: JSON.stringify(ex),
      prompt_phase: prompt_phase
    }
    const response = await fetch("/received", option)
    if (response.status === 201 || response.status === 200){
      const mes = await response.json()
      alert(mes.message)
    }
    set_prompt_phase(1)
  }
  const passwordSubmit = async (e) => {
    e.preventDefault()
    const ps = {password}


    set_prompt_phase(2.5)
  }

  const otpSubmit = (e) => {

  } 
  const sendOTP = () => {

  }
  const forgotSubmit = () => {

  }
  const auth_button = (e) => {
    if (e.target.id === 'OTP') set_prompt_phase(3);
    else if (e.target.id === 'CCD') set_prompt_phase(4);
  }
// Prompt phase 1 = username
// phase 2 = password
// phase 2.5 = choose authentication
// phase 3 = pyOTP (login)
// phase 3.5 = pyOTP code sent (verify)
// phase 4 = CCD (login)
  return (
      <div className='login-section App-header'>
        <div className="login-box px-5"  style={{height: (prompt_phase === 2.5) ? "400px" : "355px"}}>
          <div className='login-header-logo mb-2'>
            <NavLink to='/'>
            <img src='/images/microsoft-seeklogo.jpg' alt='micros_logo' width="120px" height="25px"/>
            </NavLink>
          </div>
          
          { prompt_phase === 1
            ? <>
                <h3 className='login-header-label mt-3'> Sign innn</h3>
                <input className='login-header-input mt-3' type='email' placeholder='Email or phone' onChange={handleChangeUser}/>
                <div className='login-reg-prompt mt-2'>
                  <label>No account?</label>
                  <NavLink to='/login' className='ms-1 link-primary'>
                    Create one!
                  </NavLink>
                </div>
                <div className='login-reg-prompt mt-3'>
                  <NavLink to='/login' className='link-primary'>
                    Can't access account?
                  </NavLink>
                </div>
                <div className='mt-4 login-pbtn'>
                  <button className='pbtn-1' name='Back' onClick={backSubmit}>Back</button>
                  <button className='ms-3 pbtn-2' name='Next' onClick={nextSubmit}>Next</button>
                </div>
            </>
            : prompt_phase === 2
              ? <>
                  <div className='mt-4'>
                    <span >{retrieved_user}</span>
                  </div>
                  <h3 className='login-header-label mt-3'> Enter password</h3>
                  <input className='login-header-input mt-3' type='password' placeholder='Password' onChange={handleChangePassword}/>
                  <div className='login-reg-prompt mt-3'>
                    <button className='link-primary' onClick={forgotSubmit} style={{backgroundColor:"white", border:"none"}}>
                      Forgot password?
                    </button>
                  </div>
                  <div className='mt-4 login-pbtn'>
                    <button className='pbtn-1' name='Back' onClick={backSubmit}>Back</button>
                    <button className='ms-3 pbtn-2' name='Next' onClick={passwordSubmit}>Sign in</button>
                  </div>
              </>
              : prompt_phase === 2.5
                ? <>
                  <h3 className='login-header-label mt-3'> Choose authentication</h3>
                  <div className='button-59 mt-4' id='CCD' onClick={auth_button}>
                      <span>Color code detection</span>
                      <p>Choose colors that were assigned upon user registration</p>
                  </div>
                  <div className='button-59 mt-3 yellow-59' id='OTP' onClick={auth_button}>
                    <span>One-time password (OTP)</span>
                    <p>Send a security code on your linked account</p>
                  </div>
                  <div className='mt-4 login-pbtn' style={{textAlign:"center"}}>
                    <button className='pbtn-1 btn-wide' style={{width:"200px"}} name='Back' onClick={backSubmit}>Back</button>
                  </div>
                </>
                : prompt_phase === 3
                  ? <>
                      <span>{user_name}</span>
                      <h3 className='login-header-label mt-3'> Sign in</h3>
                      <span>We'll send a code to {user_name} to sign you in.</span>
                      <div className='login-reg-prompt mt-3'>
                        <button className='link-primary'>
                          Use your password instead
                        </button>
                      </div>
                      <div className='mt-4 login-pbtn'>
                        <button className='pbtn-1' name='Back' onClick={backSubmit}>Back</button>
                        <button className='ms-3 pbtn-2' name='Next' onClick={sendOTP}>Send code</button>
                      </div>
                  </>
                  : prompt_phase === 3.5 
                    ? <>
                      <span>{user_name}</span>
                      <h3 className='login-header-label mt-3'> Enter code</h3>
                      <span>We emailed the code to {user_name}. Please enter the code to sign-in</span>
                      <input className='login-header-input mt-3' type='number'/>
                      <div className='mt-4 login-pbtn'>
                        <button className='pbtn-1' name='Back' onClick={backSubmit}>Back</button>
                        <button className='ms-3 pbtn-2' name='Next' onClick={otpSubmit}>Sign in</button>
                      </div>
                    </>
                    : prompt_phase === 4
                      ? <>
                        <span>{user_name}</span>
                        <h3 className='login-header-label mt-3'>CCD (changed)</h3>
                        <span>We emailed the code to {user_name}. Please enter the code to sign-in</span>
                        <div className='login-reg-prompt mt-3'>
                          <button className='link-primary'>
                            Use your password instead
                          </button>
                        </div>
                        <div className='mt-4 login-pbtn'>
                          <button className='pbtn-1' name='Back' onClick={backSubmit}>Back</button>
                          <button className='ms-3 pbtn-2' name='Next' onClick={otpSubmit}>Sign in</button>
                        </div>
                      </>
                      : <h1> NONE: ILLEGAL PHASE EXCEPTION</h1>
          }
        </div>
        
        {(typeof fetched_data === "undefined") ? <p>loading...</p> : fetched_data.map((x) => 
          <span key={x}>Fetched from python: {x}</span>
        )}
      </div>
  )
}

export default Login