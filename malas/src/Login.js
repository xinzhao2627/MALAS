import './App.css';
import CCD from './ccd';
import React, {useState, useEffect, useRef, useCallback } from 'react'
import { NavLink, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.min.js'
import SliderCaptcha from 'rc-slider-captcha'
import createPuzzle from 'create-puzzle'
import {useMomentaryBool} from "react-use-precision-timer";
import {useElapsedTime} from "use-elapsed-time"

function Login (){
  const [transac_status, setTransac_status] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const {elapsedTime} = useElapsedTime({ isPlaying })
  const [ccdProceed, setCcdProceed] = useState(false)
  const navigate = useNavigate();
  const [user_name, set_user_name] = useState('')
  const [password, set_password] = useState('')
  const [prompt_phase, set_prompt_phase] = useState(1)
  const [captchaAttempt, s_captchaAttempt] = useState(0)
  const [retrieved_OTP, s_retrieved_OTP] = useState(0)
  const [keytp, set_keytp] = useState('')
  const [f_OTP, s_f_OTP] = useState(0)
  const retrieved_user = "testing@gmail.com"
  const pics = ['/images/captchaP/mooP.jpg', '/images/captchaP/iniP.jpg', '/images/captchaP/picP.jpg']
  const getPic = () => {return pics[Math.floor(Math.random() * pics.length)]}
  const [otpRetry, setOtpRetry] = useMomentaryBool(true, 30000)
  const [reSec,setReSec] = useState(0)
  
  const [colorData, setColorData] = useState({
    squirtle: { hex: "#A1D9EF" },
    charmander: { hex: "#EA8B24" },
    bulbasaur: { hex: "#7fcaac" },
    pikachu: { hex: "#f7df2c" },
    eevee: { hex: "#c48d50" }
  }) 

  // SUBMIT SECTION
  const handleChangeUser = (e) => {set_user_name(e.target.value)}
  const handleChangePassword = (e) => {set_password(e.target.value)}
  const upload_transaction = async (stat, e) => {
    setIsPlaying(false)
    setTransac_status(stat)
    e.preventDefault()
    const transac_type = 1
    const ex = {user_name, elapsedTime, transac_status, transac_type}
    const option  = {
      method: "POST",
      headers: {
        "Content-Type":"application/json"
      },
      body: JSON.stringify(ex),
      prompt_phase: prompt_phase
    }
    try{
      const response = await fetch("/uploadTransaction", option)
    
      const mes = await response.json()
      
      alert(mes.message)
      
      if (mes.proceed === true && (response.status === 200 || response.status === 201)) {
        window.location.reload()
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      alert('An error occurred while processing your request.');
    }
  }
  const backSubmit = async (e) => {
    upload_transaction(false, e)
  }
  
// Prompt phase 1 = username
// phase 2 = password
// phase 2.5 = choose authentication
// phase 3 = pyOTP (login)
// phase 3.5 = pyOTP code sent (verify)
// phase 4 = CCD (login)


  const accSubmit = async (e) => {
    setIsPlaying(true)
    if (user_name.includes("@gmail.com")){
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
      try{
        const response = await fetch("/received", option)
      
        const mes = await response.json()
        
        alert(mes.message)
        
        if (mes.proceed === true && (response.status === 200 || response.status === 201)) {

          set_prompt_phase(2)
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        alert('An error occurred while processing your request.');
      }
      
    }
    else alert("invalid email format")
  }

  const enter_account = (
    <>
      <h3 className='login-header-label mt-3'> Sign in</h3>
      <input className='login-header-input mt-3' type='email' placeholder='Email or phone' onChange={handleChangeUser} value={user_name}/>
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
        <button className='ms-3 pbtn-2' name='Next' onClick={accSubmit}>Next</button>
      </div>
    </>
  )


  const passwordSubmit = async (e) => {
    if (password !== null || user_name !== null){
      e.preventDefault()
      const ex = {password, user_name}
      const option  = {
        method: "POST",
        headers: {
          "Content-Type":"application/json"
        },
        body: JSON.stringify(ex),
        prompt_phase: prompt_phase
      }
      const response = await fetch("/lgpv", option)
      const mes = await response.json()
      alert(mes.message)
      if (mes.proceed === true && (response.status === 200 || response.status === 201)) set_prompt_phase(2.1)
    }
    else alert("Invalid entry on password section")
  }
  const forgotSubmit = () => {
    navigate('/resetPass')
  }
  const enter_password = (
    <>
      <div className='mt-4'>
        <span >{retrieved_user}</span>
      </div>
      <h3 className='login-header-label mt-3'> Enter password</h3>
      <input className='login-header-input mt-3' type='password' placeholder='Password' value={password}  onChange={handleChangePassword}/>
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

  const auth_button = async (e) => {
    if (e.target.id === 'OTP') set_prompt_phase(3);
    else if (e.target.id === 'CCD') {
      // retrieve the ccd from backend to here
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
      const response = await fetch("/retrieveccd", option)
      const mes = await response.json()
      alert(mes.message)

      if (mes.proceed === true && (response.status === 200 || response.status === 201)) {
        setColorData(mes.colorData)
        set_prompt_phase(4)
      }
    }
      
  }

  const enter_auth = (
    <>
      <h3 className='login-header-label mt-3'> Choose authentication</h3>
      <div className='button-59 mt-4' id='CCD' onClick={auth_button}>
          <span>Color code detection</span>
          <p>Choose colors that were assigned upon user registration</p>
      </div>
      <div className='button-59 mt-3 pb-2 yellow-59' id='OTP' onClick={auth_button}>
        <span>One-time password (OTP)</span>
        <p>Send a security code on your linked account</p>
        {/* <input type='text' className='text-center' value={keytp} onChange={handlekeytp} placeholder='Enter key for OTP'/> */}
      </div>
      <div className='mt-4 login-pbtn' style={{textAlign:"center"}}>
        <button className='pbtn-1 btn-wide' style={{width:"200px"}} name='Back' onClick={backSubmit}>Back</button>
      </div>
    </>
  )
  
  
  const handleStartTimer_reSend = () => {
    const timerEndTime = new Date(Date.now() + 30 * 1000); // set end time to 30 seconds from now
    const timerInterval = setInterval(() => {
      const now = new Date();
      const timeRemaining = Math.max(0, timerEndTime - now);
      const secondsRemaining = Math.floor(timeRemaining / 1000);
      setReSec(secondsRemaining);
      if (secondsRemaining <= 0) {
        clearInterval(timerInterval);
        setReSec(0); // reset reSec to 0
      }
    }, 1000);
  };
  

  const sendOTP = async (e) => {

    if (prompt_phase === 3.5){
      handleStartTimer_reSend()
      setOtpRetry(e)
    }
    
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
    const response = await fetch("/lsotp", option)
    const mes = await response.json()
    alert(mes.message)

    if (mes.proceed === true && (response.status === 200 || response.status === 201)) {
      s_retrieved_OTP(mes.code)
      console.log(retrieved_OTP)
      set_prompt_phase(3.5)
    }
  }

  const handleOTPChange = (e) => {
    s_f_OTP(e.target.value)
  }
  const otpSubmit = (e) => {
    if (f_OTP === retrieved_OTP){
      upload_transaction(e)
      alert('login complete, transaction uploaded')
      navigate('/')
    } else {
      alert('incorrect OTP')
    }
    
  }

  //3.5
  const enter_otp = (
    <>
      <span>{user_name}</span>
      <h3 className='login-header-label mt-3'> Enter code</h3>
      <span>We emailed the code to {user_name}. Please enter the code to sign-in</span>
      <input className='login-header-input mt-3' type='number' value={f_OTP} onChange={handleOTPChange}/>
      <div className='mt-4'>
          <span>Didn't received it? please wait for a few minutes and </span>
          <span className='link-primary' style={{cursor:(otpRetry) ? 'pointer' : 'not-allowed'}} onClick={sendOTP}>
            {otpRetry ? 'try again' : `try again in ${reSec} seconds`}
          </span>
      </div>
      <div className='mt-4 login-pbtn'>
        <button className='pbtn-1' name='Back' onClick={backSubmit}>Back</button>
        <button className='ms-3 pbtn-2' name='Next' onClick={otpSubmit}>Sign in</button>
      </div>
    </>
  )
    // 3
    const show_otp = (
      <>
        <span>{user_name}</span>
        <h3 className='login-header-label mt-3'> Sign in</h3>
        <span>We'll send a code to {user_name} to sign you in.</span>
        <div className='login-reg-prompt mt-3'>
          <span className='link-primary' style={{cursor:'pointer'}}>
            Code 
          </span>
        </div>
        <div className='mt-4 login-pbtn'>
          <button className='pbtn-1' name='Back' onClick={backSubmit}>Back</button>
          <button className='ms-3 pbtn-2' name='Next' onClick={sendOTP}>Send code</button>
        </div>
      </>
    )

  const ccdSubmit = (e) => {
    if (ccdProceed){
      alert('login successful')
      upload_transaction(true)
      navigate('/')
    }
  }

  const enter_ccd = (
    <>
      <span>{user_name}</span>
      <h3 className='login-header-label mt-3'>CCD</h3>
      <CCD colorData = {colorData} ccdProceed={ccdProceed} setCcdProceed={setCcdProceed} items={3} />
      <div className='login-reg-prompt mt-3'>
        <button className='link-primary' style={{border:'none', cursor:'pointer', backgroundColor:'transparent'}}>
          Use your password instead
        </button>
      </div>
      <div className='mt-4 login-pbtn'>
        <button className='pbtn-1' name='Back' onClick={backSubmit}>Back</button>
        <button className='ms-3 pbtn-2' name='Next' onClick={ccdSubmit}>Sign in</button>
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
                    if (data.x >= offsetXRef.current - 10 && data.x < offsetXRef.current + 10) {
                      setTimeout(() => {
                        set_prompt_phase(2.5);
                      }, 1000);
                      return Promise.resolve();
                    }

                    s_captchaAttempt(prev => {
                      const attempt = prev + 1
                      if (attempt >= 3) {
                          backSubmit()
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
      <div className='login-section App-header' >
        <div className="login-box px-5 pb-4"  style={(prompt_phase===4) ? {width:'800px', height:'700px'} : null }>
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
              : null
          }
        </div>
      </div>
  )
}

export default Login