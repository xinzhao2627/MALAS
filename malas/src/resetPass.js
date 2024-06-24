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

function ResetPass (){
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
  const [f_OTP, s_f_OTP] = useState('')
  const retrieved_user = "testing@gmail.com"
  const pics = ['/images/captchaP/mooP.jpg', '/images/captchaP/iniP.jpg', '/images/captchaP/picP.jpg']
  const getPic = () => {return pics[Math.floor(Math.random() * pics.length)]}
  const [otpRetry, setOtpRetry] = useMomentaryBool(true, 30000)
  const [reSec,setReSec] = useState(0)
  const regex = /[!#$%^&*()\-+={}[\]:;"'<>,?\/|\\]/;
  const format = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/;

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
    const transac_type = 2
    const ex = {user_name, elapsedTime, stat, transac_type}
    const option  = {
      method: "POST",
      headers: {
        "Content-Type":"application/json"
      },
      body: JSON.stringify(ex)
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
  
// prompt phase 1 = bot recognition 
// Prompt phase 2 = username
// phase 3 = otp (auto send in user)
// phase 4 = ccd (retrieved in otp)
// phase 5 = reset pass (also upload  in transaction)
const ccdRetriever = async () => {
  // retrieve the ccd from backend to here
  const ex = {user_name}
  const option  = {
    method: "POST",
    headers: {
      "Content-Type":"application/json"
    },
    body: JSON.stringify(ex)
  }
  const response = await fetch("/retrieveccd", option)
  const mes = await response.json()
  alert(mes.message)

  if (mes.proceed === true && (response.status === 200 || response.status === 201)) {
    setColorData(mes.colorData)
    set_prompt_phase(4)
  }
}
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
                        ccdRetriever()
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
  
  const handleStartTimer_reSend = () => {
    const timerEndTime = new Date(Date.now() + 31 * 1000); // set end time to 30 seconds from now
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
  

  
  const accSubmit = async (e) => {
    if (prompt_phase === 1) {setIsPlaying(true)}
    if (user_name.includes("@gmail.com")){
      e.preventDefault()

      if (prompt_phase === 3){
        handleStartTimer_reSend()
        setOtpRetry(e)
      }

      const ex = {user_name}
      const option  = {
        method: "POST",
        headers: {
          "Content-Type":"application/json"
        },
        body: JSON.stringify(ex)
      }
      try{
        const response = await fetch("/resetAccEmail", option)
        const mes = await response.json()
        
        alert(mes.message)
        
        if (mes.proceed === true && (response.status === 200 || response.status === 201)) {
          // TODO
          s_retrieved_OTP(mes.code)
          console.log(mes.code)
          if (prompt_phase !== 2) set_prompt_phase(2)
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
      <div className='mt-4 login-pbtn'>
        <button className='pbtn-1' name='Back' onClick={backSubmit}>Back</button>
        <button className='ms-3 pbtn-2' name='Next' onClick={accSubmit}>Next</button>
      </div>
    </>
  )


  const handleOTPChange = (e) => {
    s_f_OTP(e.target.value)
  }
  const otpSubmit = (e) => {
    if (f_OTP === retrieved_OTP){
      set_prompt_phase(3)
    } else {
      alert('incorrect OTP')
    }
    
  }

  //3
  const enter_otp = (
    <>
      <span>{user_name}</span>
      <h3 className='login-header-label mt-3'> Enter code</h3>
      <span>We emailed the code to {user_name}. Please enter the code to sign-in</span>
      <input className='login-header-input mt-3' type='text' value={f_OTP} onChange={handleOTPChange}/>
      <div className='mt-4'>
          <span>Didn't received it? please wait for a few minutes and </span>
          <span className='link-primary' style={{cursor:(otpRetry) ? 'pointer' : 'not-allowed'}} onClick={accSubmit}>
            {otpRetry ? 'try again' : `try again in ${reSec} seconds`}
          </span>
      </div>
      <div className='mt-4 login-pbtn'>
        <button className='pbtn-1' name='Back' onClick={backSubmit}>Back</button>
        <button className='ms-3 pbtn-2' name='Next' onClick={otpSubmit}>Sign in</button>
      </div>
    </>
  )
  const ccdSubmit = (e) => {
    if (ccdProceed){
      alert('ccd successful')
      set_prompt_phase(5)
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
  // prompt phase 1 = bot recognition 
  // Prompt phase 2 = username
  // phase 3 = otp (auto send in user)
  // phase 4 = ccd (retrieved in otp)
  // phase 5 = reset pass (also upload  in transaction)
  const passwordSubmit = async (e) => {
    if (password !== "" || user_name !== ""){
      e.preventDefault()
      const ex = {password, user_name}
      const option  = {
        method: "POST",
        headers: {
          "Content-Type":"application/json"
        },
        body: JSON.stringify(ex)
      }
      const response = await fetch("/resetNewPass", option)
      const mes = await response.json()
      alert(mes.message)

      if (mes.proceed === true && (response.status === 200 || response.status === 201)) {
        alert('password successfully changed')
        upload_transaction(true, e)
      }
    }
    else alert("Invalid entry on password section")
  }
  const verifyNewPassword = async (e) => {
    let passPoints = 0
    
    if (!(/^[A-Z]*$/.test(password))) passPoints += 1;
    if (!(/^[a-z]*$/.test(password))) passPoints += 1;
    if (format.test(password)) passPoints += 1;
    
    if (password.includes(user_name) || user_name.length < 8 || passPoints < 2){
      alert('Wrong!')
    } else {
      passwordSubmit(e)
    }
  }
  const enter_password = (
    <>
      <div className='mt-4'>
        <span >{user_name}</span>
      </div>
      <h3 className='login-header-label mt-3'> Enter new password</h3>
      <input className='login-header-input mt-3' type='password' placeholder='Password' value={password}  onChange={handleChangePassword}/>
      <div className='mt-4 login-pbtn'>
        <button className='pbtn-1' name='Back' onClick={backSubmit}>Back</button>
        <button className='ms-3 pbtn-2' name='Next' onClick={verifyNewPassword}>Reset</button>
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
              ? enter_otp
            : prompt_phase === 3
              ? bot_recognition 
            : prompt_phase === 4
              ? enter_ccd 
            : prompt_phase === 5
              ? enter_password
              : null
          }
        </div>
      </div>
  )
}

export default ResetPass