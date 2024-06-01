import './App.css';
import React, {useState, useMemo, useRef } from 'react'
import Select from 'react-select'
import DatePicker from 'react-datepicker'
import { NavLink } from 'react-router-dom';
import SliderCaptcha from 'rc-slider-captcha'
import createPuzzle from 'create-puzzle'
import 'bootstrap/dist/css/bootstrap.min.css'
import "react-datepicker/dist/react-datepicker.css";
import 'bootstrap/dist/js/bootstrap.min.js'
import countryList from 'react-select-country-list'

function Register () {
    const [f_email, s_f_email] = useState('')
    const [f_ps, s_f_ps] = useState('')
    const [f_ln, s_f_ln]= useState('')
    const [f_fn, s_f_fn]= useState('')
    const [reg_phase, s_reg_phase] = useState(1)
    const [passwordVisibility, setPasswordVisibility] = useState(false)
    const [f_country, s_f_country] = useState('')
    const [f_bd, s_f_bd] = useState(new Date())
    const [f_otp, s_f_otp] = useState(0)
    const [captchaAttempt, s_captchaAttempt] = useState(0)
    
    const countries_options = useMemo(() => countryList().getData(), [])
    const regex = /[!#$%^&*()\-+={}[\]:;"'<>,?\/|\\]/;
    const format = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/;

    const pics = ['/images/captchaP/mooP.jpg', '/images/captchaP/iniP.jpg', '/images/captchaP/picP.jpg']
    const getPic = () => {return pics[Math.floor(Math.random() * pics.length)]}
    const backSubmit = (e) => {window.location.reload()}


    const handleChangePassword = (ps) => {s_f_ps(ps.target.value)}
    const handleChangeEmail = (em) => {s_f_email(em.target.value)}
    const handleOtpChange = (e) => {s_f_otp(e.target.value)}
    const handleChangeFN = (f) => {s_f_fn(f.target.value)}
    const handleChangeLN = (l) => {s_f_ln(l.target.value)}
    const showPassword = () => {setPasswordVisibility(!passwordVisibility)}

    const verifyNewEmail = async (e) => {
        // TODO: upload transaction

        if (regex.test(f_email)){
            alert("Email has special")

        } else {
            // e.preventDefault()
            // const ex = {f_email}
            // const option  = {
            //   method: "POST",
            //   headers: {
            //     "Content-Type":"application/json"
            //   },
            //   body: JSON.stringify(ex),
            //   reg_phase: reg_phase
            // }
            // const response = await fetch("/regVerifyEmail", option)
            // if (response.status === 201 || response.status === 200){
            //   const data = await response.json()
            //   alert(data.message)
            //   s_reg_phase(2)

            
            // } else {
            //   alert('This email cannot be used')
            // }
            s_reg_phase(2)
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

    const verifyNewPassword = async (e) => {
        let passPoints = 0
        
        if (!(/^[A-Z]*$/.test(f_ps))) passPoints += 1;
        if (!(/^[a-z]*$/.test(f_ps))) passPoints += 1;
        if (format.test(f_ps)) passPoints += 1;

        if (f_ps.includes(f_email) || f_ps.length < 8 || passPoints < 2){
            alert('Wrong!')
        } else {
            // e.preventDefault()
            // const ex = {f_ps}
            // const option  = {
            //   method: "POST",
            //   headers: {
            //     "Content-Type":"application/json"
            //   },
            //   body: JSON.stringify(ex),
            //   reg_phase: reg_phase
            // }
            // const response = await fetch("/regVerifyPassword", option)
            // if (response.status === 201 || response.status === 200){
            //   const data = await response.json()
            //   alert(data.message)
            //   s_reg_phase(3)

            
            // } else {
            //   alert('error on sending otp!, otp not sent to user email')
            //   backSubmit()
            // }
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

    const verifyNewName = () =>{
        const name_length = f_fn.length + f_ln.length
        if (name_length >= 255 || format.test(f_fn) || format.test(f_ln) || name_length === 0)   {
            alert("name exceeded the limit")
        } else {
            s_reg_phase(5)
        }
    }
    const create_name = (
        <>  
            <div className='mt-3'>
                <span>{f_email}</span>
            </div>
            <h3 className='login-header-label mt-2'> What's your name? </h3>
            <div className='mt-3' style={{fontSize:"15px"}}>
                <span>
                    We just need a little more info to set up your account.
                </span>
                <input className='login-header-input mt-3 py-2' type='text' placeholder='First name' onChange={handleChangeFN} value={f_fn}/>
                <input className='login-header-input mt-3 py-2' type='text' placeholder='Last name' onChange={handleChangeLN} value={f_ln}/>
            </div>
            <div className='mt-4 login-pbtn'>
                <button className='pbtn-1' name='Back' onClick={backSubmit}>Back</button>
                <button className='ms-3 pbtn-2' name='Next' onClick={verifyNewName}>Next</button>
            </div>
        </>
    )
    const handleCountryChange = v => {s_f_country(v)}
    const verifyBirthDate = () => {s_reg_phase(6)}
    const create_birthday = (
        <>  
            <div className='mt-3'>
                <span>{f_email}</span>
            </div>
            <h3 className='login-header-label mt-2'> What's your birthdate? </h3>
            <div className='mt-3' style={{fontSize:"15px"}}>
                <span>
                    We just need a little more info to set up your account.
                </span>
                <div className='mt-3'>
                    <strong>Country/region</strong>
                    <Select options={countries_options} value={f_country} onChange={handleCountryChange}/>
                </div>
                <div className='mt-3' style={{display:'inline-flex', flexDirection:'column'}}>
                    <strong>Birthdate</strong>
                    <DatePicker selected={f_bd} onChange={(date) => s_f_bd(date)} className='mt-2'/>
                </div>
            </div>
            <div className='mt-4 login-pbtn'>
                <button className='pbtn-1' name='Back' onClick={backSubmit}>Back</button>
                <button className='ms-3 pbtn-2' name='Next' onClick={verifyBirthDate}>Next</button>
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
                                // TODO: upload transaction iff true
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
    const after_info = (
        <>
            <div className='mt-3'>
                <span>{f_email}</span>
            </div>
            <h3 className='login-header-label mt-2'> A quick note about your Microsoft account</h3>
            <div className='img-center'>
                <img src='/images/regLGO.png' alt='regLOGO' width={200} height={200}/>
            </div>
            <div>
                <div className='reg-info'>
                    <strong>
                            Your important things are right here
                    </strong>
                    <small>
                        When you sign in, things like your contacts, passwords, favorites,
                        browsing history, and photos and files are available accross Microsoft products.
                    </small>
                </div>
                <div className='reg-info'>
                    <strong>
                        Your privacy is our priority
                    </strong>
                    <small>
                        To help protect your data, we use encryption and other security best practices.
                    </small>
                </div>
                <div className='reg-info'>
                    <strong>
                            You're in control
                    </strong>
                    <small>
                        We give you choices about how your data is used and what you sync.
                    </small>
                </div>
                <div className='reg-info'>
                    <strong>
                            University project
                    </strong>
                    <small>
                        This is a university project for Advanced database, solely used for academic and simulation purpose.
                    </small>
                </div>
                
            </div>
            <small className='link-primary mt-3 d-block'>Learn more</small>
            <div className='mt-4 login-pbtn'>
                <button className='ms-3 pbtn-2' name='Next' >OK</button>
            </div>
        </>
    )
    
    const otpVerify = () => {
        // verify OTP
        let otpVal = true

        if (otpVal){
            s_reg_phase(2.1)
        }
        
    }
    const otp_page = (
        <>
            <span>{f_email}</span>
            <h3 className='login-header-label mt-3'> Enter code</h3>
            <span>We just sent a code to {f_email}</span>
            <input className='login-header-input mt-3' type='number' onChange={handleOtpChange} value={f_otp}/>
            <div className='mt-4'>
                <span>Didn't received it? please wait for a few minutes and </span>
                <span className='link-primary' style={{cursor:'pointer'}}>try again</span>
            </div>
            <div className='mt-4 login-pbtn'>
                <button className='pbtn-1' name='Back' onClick={backSubmit}>Back</button>
                <button className='ms-3 pbtn-2' name='Next' onClick={otpVerify}>Verify</button>
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
                            ? create_name
                        : reg_phase === 5
                            ? create_birthday
                        : reg_phase === 6
                            ? after_info
                            : null
                    )}
                </div>
            </div>
        </div>

    )
}

export default Register