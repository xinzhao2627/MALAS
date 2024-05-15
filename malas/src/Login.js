import './App.css';
import React, {useState, useEffect } from 'react'
import { NavLink } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.min.js'
function Login (){
      const [fetched_data, set_fetched_data] = useState()
      const [user_name, set_user_name] = useState()
      const [password, set_password] = useState()
      const [prompt_username, set_prompt_username] = useState(true)
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
      const nextSubmit = async (e) => {
        e.preventDefault()
        const ex = {user_name}
        const option  = {
          method: "POST",
          headers: {
            "Content-Type":"application/json"
          },
          body: JSON.stringify(ex)
        }
        const response = await fetch("/received", option)
        if (response.status === 201 || response.status === 200){
          const mes = await response.json()
          alert(mes.message)
        }
      } 

      return (
          <div className='login-section App-header'>
            <div className="login-box px-5">
              <div className='login-header-logo'>
                <NavLink to='/'>
                <img src='/images/microsoft-seeklogo.jpg' alt='micros_logo' width="120px" height="25px"/>
                </NavLink>
              </div>
              
              {(prompt_username) 
                ? <h3 className='login-header-label mt-3'> Sign in</h3>
                : user_name
              }

              {(prompt_username)
                ? <input className='login-header-input mt-3' type='email' placeholder='Email or phone' onChange={handleChangeUser}/>
                : <input className='login-header-input mt-3' type='password' placeholder='Password' onChange={handleChangePassword}/>
              }

              {(prompt_username)
                ? <>
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
                  </>
                : <>
                
                  </>
              }

              <div className='mt-4 login-pbtn'>
                  <button className='pbtn-1' name='Back'>Back</button>
                  <button className='ms-3 pbtn-2' name='Next' onClick={nextSubmit}>Next</button>
              </div>
            </div>
            
            {(typeof fetched_data === "undefined") ? <p>loading...</p> : fetched_data.map((x) => 
              <span key={x}>Fetched from python: {x}</span>
            )}
          </div>
      )
}

export default Login