import './App.css';
import React, {useState, useRef } from 'react'
import { NavLink, useNavigate } from 'react-router-dom';
import SliderCaptcha from 'rc-slider-captcha'
import createPuzzle from 'create-puzzle'
import 'bootstrap/dist/css/bootstrap.min.css'
import "react-datepicker/dist/react-datepicker.css";
import 'bootstrap/dist/js/bootstrap.min.js'
import RegCCD from './ccdreg'
import {useMomentaryBool} from "react-use-precision-timer";

function Register () {
    const [otpRetry, setOtpRetry] = useMomentaryBool(true, 30000)
    const [ccdProceed, setCcdProceed] = useState(false)
    const [colorData, setColorData] = useState() 
    const navigate = useNavigate();
    const [f_email, s_f_email] = useState("")
    const [f_ps, s_f_ps] = useState("")
    const [reg_phase, s_reg_phase] = useState(1)
    const [passwordVisibility, setPasswordVisibility] = useState(false)
    const [f_OTP, s_f_OTP] = useState(0)
    const [captchaAttempt, s_captchaAttempt] = useState(0)
    const [retrieved_OTP, s_retrieved_OTP] = useState(0)
    const [reSec,setReSec] = useState(0)
    const regex = /[!#$%^&*()\-+={}[\]:;"'<>,?\/|\\]/;
    const format = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/;

    const pics = ['/images/captchaP/mooP.jpg', '/images/captchaP/iniP.jpg', '/images/captchaP/picP.jpg']
    const getPic = () => {return pics[Math.floor(Math.random() * pics.length)]}
    const backSubmit = (e) => {
        
        window.location.reload()
    }


    const handleChangePassword = (ps) => {s_f_ps(ps.target.value)}
    const handleChangeEmail = (em) => {s_f_email(em.target.value)}
    const handleOtpChange = (e) => {s_f_OTP(e.target.value)}
    const showPassword = () => {setPasswordVisibility(!passwordVisibility)}
    const verifyNewEmail = async (e) => {
        if (regex.test(f_email) || f_email.length === 0){
            alert("Email has special or is null")
        } else {
            e.preventDefault()
            const ex = {f_email}
            const option  = {
              method: "POST",
              headers: {
                "Content-Type":"application/json"
              },
              body: JSON.stringify(ex),
              reg_phase: reg_phase
            }
            const response = await fetch("/regVerifyEmail", option)
            const mes = await response.json()
            alert(mes.message)
            if (mes.proceed === true && (response.status === 200 || response.status === 201)) {
                alert('The email is usable, otp sent')
                s_retrieved_OTP(mes.code)
                console.log('code: ' + mes.code)
                if (reg_phase === 1) reg_phase(2)
            }
            else {
              alert('This email cannot be used')
            }
        }
        
    }

    const create_account = (
        <>
            <h3 className='login-header-label mt-3'> Create Account </h3>
            <div className='w-dd'>
                <input className='login-header-input mt-3' type='email' placeholder='someone@example.com' onChange={handleChangeEmail} value={f_email}/>
            </div>
            <div className='login-reg-prompt mt-3'>
                <label>Already have an account?</label>
                <NavLink to='/login' className='ms-1 link-primary'>
                    Login instead
                </NavLink>
            </div>
            <div className='mt-5 login-pbtn'>
                <NavLink to='/'>
                    <button className='pbtn-1' name='Back'>Cancel</button>
                </NavLink>
                <button className='ms-3 pbtn-2' name='Next' onClick={verifyNewEmail}>Next</button>
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
        console.log('clicked')
        handleStartTimer_reSend()
        setOtpRetry(e)
        verifyNewEmail(e)
    }

    const otpSubmit = () => {
        let otpVal = f_OTP === retrieved_OTP
        if (otpVal){
            alert(true)
            // s_reg_phase(2.1)
        } else {
            console.log(f_OTP+ ' and ' + retrieved_OTP)
            alert('incorrect OTP')
        }
        
    }
    const otp_page = (
        <>
            <span>{f_email}</span>
            <h3 className='login-header-label mt-3'> Enter code</h3>
            <span>We just sent a code to {f_email}</span>
            <input className='login-header-input mt-3' type='text' onChange={handleOtpChange} value={f_OTP}/>
            <div className='mt-4'>
                <span>Didn't received it? please wait for a few minutes and </span>
                <span className='link-primary' style={{cursor:(otpRetry) ? 'pointer' : 'not-allowed'}} onClick={sendOTP}>
                    {otpRetry ? 'try again' : `try again in ${reSec} seconds`}
                </span>
            </div>
            <div className='mt-4 login-pbtn'>
                <button className='pbtn-1' name='Back' onClick={backSubmit}>Back</button>
                <button className='ms-3 pbtn-2' name='Next' onClick={otpSubmit}>Verify</button>
            </div>
        </>
    )

    const verifyNewPassword = async (e) => {
        let passPoints = 0
        
        if (!(/^[A-Z]*$/.test(f_ps))) passPoints += 1;
        if (!(/^[a-z]*$/.test(f_ps))) passPoints += 1;
        if (format.test(f_ps)) passPoints += 1;

        if (f_ps.includes(f_email) || f_ps.length < 8 || passPoints < 2){
            alert('Wrong!')
        } else {
            s_reg_phase(3)
        }
    }
    const create_password = (
        <>  
            <div className='mt-3'>
            <span>{f_email}</span>
            </div>
            <h3 className='login-header-label mt-2'> Create a password </h3>
            <div className='' style={{fontSize:"15px"}}>
                <span>Enter the password you would like to use with your account.</span>
                <input className='login-header-input mt-3' type={(passwordVisibility ? 'text' : 'password')} placeholder='Create password' onChange={handleChangePassword} value={f_ps}/>
                <div className='mt-3'>
                    <input type='checkbox' className='p-3 me-2 checkbox' onClick={showPassword} />
                    <span>Show password</span>
                </div>
            </div>
            <div className='small-copyright mt-3'>
                {"Choosing "}
                <strong>Next</strong>
                {" means that you agree to the "}
                <span className='link-primary'> Microsoft Services Agreement</span>
                {" and "}
                <span className='link-primary'>privacy and cookies statement.</span>
            </div>
            <div className='mt-4 login-pbtn'>
                <button className='pbtn-1' name='Back' onClick={backSubmit}>Back</button>
                <button className='ms-3 pbtn-2' name='Next' onClick={verifyNewPassword}>Next</button>
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
                            s_reg_phase(4)
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


    const ccdSubmitAll = async (e) => {
        if (ccdProceed){
            e.preventDefault()
            const ex = {f_email, f_ps, colorData}
            const option  = {
              method: "POST",
              headers: {
                "Content-Type":"application/json"
              },
              body: JSON.stringify(ex),
              reg_phase: reg_phase
            }
            const response = await fetch("/regFinalize", option)
            const mes = await response.json()
            alert(mes.message)
        
            if (mes.proceed === true && (response.status === 200 || response.status === 201)) {
              alert('login successful')
            } else {
                alert('login unsuccessful')
            }
            navigate('/')
        } else {
            alert('error on ccd color/key selection')
        }
    }
    
    const enter_ccd = (
    <>
        <span>{f_email}</span>
        <h3 className='login-header-label mt-3'>CCD</h3>
        <RegCCD setCcdProceed={setCcdProceed} items={3} setColorData={setColorData}/>
        <div className='login-reg-prompt mt-3'>
        <button className='link-primary' style={{border:'none', cursor:'pointer', backgroundColor:'transparent'}}>
            Use your password instead
        </button>
        </div>
        <div className='mt-4 login-pbtn'>
        <button className='pbtn-1' name='Back' onClick={backSubmit}>Back</button>
        <button className='ms-3 pbtn-2' name='Next' onClick={ccdSubmitAll}>Sign in</button>
        </div>
    </>
    )
    return (
        <div className='login-section App-header'>
            <div className="login-box px-5 pb-2" style={(reg_phase===5) ? {width:'600px', height:'400px'} : null }>
                <div className='login-header-logo mb-2 '>
                    <NavLink to='/'>
                        <img src='/images/microsoft-seeklogo.jpg' alt='micros_logo' width="120px" height="25px"/>
                    </NavLink>
                    {(reg_phase === 1
                            ? create_account
                        : reg_phase === 2
                            ? otp_page
                        : reg_phase === 2.1
                            ? create_password 
                        : reg_phase === 3
                            ? bot_recognition
                        : reg_phase === 4
                            ? otp_page
                        : reg_phase === 5
                            ? enter_ccd
                            : null
                    )}
                </div>
            </div>
        </div>

    )
}

export default Register