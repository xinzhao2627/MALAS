import './App.css';
import React, {useState, useEffect, useRef } from 'react'
import { NavLink, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.min.js'
import SliderCaptcha from 'rc-slider-captcha'
import createPuzzle, { Result }  from 'create-puzzle'



function ResetPass() {
    const backSubmit = (e) => {window.location.reload()}
    const [forgot_phase, set_forgot_phase] = useState(1)
    const [email, set_email] = useState('')

    const accSubmit = async (e) => {
        e.preventDefault()
        const ex = {email}
        const option  = {
          method: "POST",
          headers: {
            "Content-Type":"application/json"
          },
          body: JSON.stringify(ex),
          prompt_phase: forgot_phase
        }
        const response = await fetch("/received", option)
        if (response.status === 201 || response.status === 200){
          const mes = await response.json()
          alert(mes.message)
        }
        forgot_phase(2)
    }
    const handleChangeEmail = (e) => {set_email(e.target.value)}
    const enter_account = (
        <>
            <h3 className='login-header-label mt-3'>Enter your account</h3>
            <span>Enter your email account where the OTP would be sent.</span>
            <input className='login-header-input mt-3' type='email' placeholder='Email or phone'  value={email} onChange={handleChangeEmail}/>
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

    /**
     * 1. ask for email to send otp
     * 2. otp was sent, just input the otp
     *  - cancel transaction if wrong, go back to phase 1
     * 3. pick in the CCD
     *  - cancel transactin if wrong, go back to phase 1
     */ 

}
export default ResetPass