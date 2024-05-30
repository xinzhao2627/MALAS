import './App.css';
import React, {useState, useEffect, useRef } from 'react'
import { NavLink } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.min.js'
import SliderCaptcha from 'rc-slider-captcha'
import createPuzzle, { Result }  from 'create-puzzle'


function Login (){
  const [fetched_data, set_fetched_data] = useState()
  const [user_name, set_user_name] = useState()
  const [password, set_password] = useState()
  const [prompt_phase, set_prompt_phase] = useState(1)
  const [forgot_prompt, set_forgot_prompt] = useState(true)
  const [captchaAttempt, s_captchaAttempt] = useState(0)
  const retrieved_user = "testing@gmail.com"
  const pics = ['/images/captchaP/mooP.jpg', '/images/captchaP/iniP.jpg', '/images/captchaP/picP.jpg']
  const getPic = () => {return pics[Math.floor(Math.random() * pics.length)]}


  useEffect(() => {
    const getData = async () => {
      const res = await fetch("/users")
      const data = await res.json()
      set_fetched_data(data.users)
    }
    getData()
  }, [])

  // SUBMIT SECTION
  const handleChangeUser = (e) => {set_user_name(e.target.value)}
  const handleChangePassword = (e) => {set_password(e.target.value)}
  const backSubmit = (e) => {window.location.reload()}
  const forgotSubmit = () => {}
  const otpSubmit = () => {}
  const sendOTP = () => {set_prompt_phase(3.5)}
  const passwordSubmit = (e) => {set_prompt_phase(2.1)}
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
    set_prompt_phase(2)
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

  const enter_account = (
    <>
      <h3 className='login-header-label mt-3'> Sign in</h3>
      <input className='login-header-input mt-3' type='email' placeholder='Email or phone' onChange={handleChangeUser}/>
      <div className='login-reg-prompt mt-2'>
        <label>No account?</label>
        <NavLink to='/register' className='ms-1 link-primary'>
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
  )
  const enter_password = (
    <>
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
  )
  const enter_auth = (
    <>
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
  )
  const show_otp = (
    <>
      <span>{user_name}</span>
      <h3 className='login-header-label mt-3'> Sign in</h3>
      <span>We'll send a code to {user_name} to sign you in.</span>
      <div className='login-reg-prompt mt-3'>
        <span className='link-primary' style={{cursor:'pointer'}}>
          Use your password instead
        </span>
      </div>
      <div className='mt-4 login-pbtn'>
        <button className='pbtn-1' name='Back' onClick={backSubmit}>Back</button>
        <button className='ms-3 pbtn-2' name='Next' onClick={sendOTP}>Send code</button>
      </div>
    </>
  )
  const enter_otp = (
    <>
      <span>{user_name}</span>
      <h3 className='login-header-label mt-3'> Enter code</h3>
      <span>We emailed the code to {user_name}. Please enter the code to sign-in</span>
      <input className='login-header-input mt-3' type='number'/>
      <div className='mt-4 login-pbtn'>
        <button className='pbtn-1' name='Back' onClick={backSubmit}>Back</button>
        <button className='ms-3 pbtn-2' name='Next' onClick={otpSubmit}>Sign in</button>
      </div>
    </>
  )
  const enter_ccd = (
    <>
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
  )
  const offsetXRef = useRef(0);
  const bot_recognition = (
      <>  
          <div className='mt-3'>
              <span> Please solve the puzzle so we know you're not a robot </span>
              <div className='captcha-box p-2 mt-2'>
       
              <SliderCaptcha
                  request={() =>
                      
                      createPuzzle(getPic(), {
                      format: 'blob'
                      }).then((res) => {
                          offsetXRef.current = res.x;

                          return {
                              bgUrl: res.bgUrl,
                              puzzleUrl: res.puzzleUrl
                          };
                      })
                  }
                  onVerify={(data) => {
                      
                      console.log(data.x + ' x and currnet+5: ' + (offsetXRef.current+10) + 'and -5: ' + (offsetXRef.current-10));
                      if (data.x >= offsetXRef.current - 10 && data.x < offsetXRef.current + 10) {
                          set_prompt_phase(2.5)
                          return Promise.resolve();
                      }
                      s_captchaAttempt(prev => {
                          const attempt = prev + 1
                          if (attempt >= 3) {
                              window.location.reload()
                              return 0
                          }

                          return attempt
                      });
                      
                      return Promise.reject();
                  }}
                  bgSize={{
                      width: 360
                  }}
                  
              />
              </div>
          </div>
      </>
  )
  return (
      <div className='login-section App-header'>
        <div className="login-box px-5 pb-4"  >
          <div className='login-header-logo mb-2'>
            <NavLink to='/'>
            <img src='/images/microsoft-seeklogo.jpg' alt='micros_logo' width="120px" height="25px"/>
            </NavLink>
          </div>
          
          { prompt_phase === 1
              ? enter_account
            : prompt_phase === 2
              ? enter_password
            : prompt_phase === 2.1 
              ? bot_recognition
            : prompt_phase === 2.5
              ? enter_auth
            : prompt_phase === 3
              ? show_otp
            : prompt_phase === 3.5 
              ? enter_otp
            : prompt_phase === 4
              ? enter_ccd
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