import React, { Component } from 'react'
import Button from 'react-bootstrap/Button'
import { NavLink } from 'react-router-dom';
import { LuUserCircle } from "react-icons/lu";
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.min.js'

export default class MainHome extends Component {
  constructor(props) {
    super(props)
    this.scrollAbout = React.createRef()
  }
  goAbout = () =>{
    this.scrollAbout.current.scrollIntoView({behavior:'smooth'})
  }

  render() {
    return (
      <div className = 'main-content'>
        <nav className="navbar navbar-expand-lg bg-light navbar-fixed-top border-bottom">
          <div className="ms-3  container-fluid" style={{fontWeight:"600"}}>
            <a className="navbar-brand logo mb-1" href=""> <img src='/images/microsoft-seeklogo.jpg'  width="120px" height="25px"/> </a>
            <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
              <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse me-2" id="navbarNavAltMarkup">
              <ul className='navbar-nav me-auto mb-2 mb-lg-0'>
                <li>
                  <a className="nav-link" href="" >Home</a>
                </li>
                <li>
                  <button className="nav-link"onClick={this.goAbout}>About</button>
                </li>
                <li>
                  <button className="nav-link">Algorithm</button>
                </li>
                <li>
                  <button className="nav-link">Instruction</button>
                </li>
              </ul>
              <button className='nav-link' href=''><LuUserCircle size={30}/></button>

            </div>
          </div>
        </nav>
        <div className='ms-01 justify-content-center d-flex'>
            <h1 className='ms-01t'>
                It's all here with Microsoft account
            </h1>
            <div className='ms-01s'>
                <span>Your Microsoft account connects all your Microsoft apps and services.</span>
                <span>Sign in to manage your account.</span>
                <div>
                  <NavLink to='/login'>
                    <Button className='rounded-1 px-3 py-1 mt-5 main-title-b1' style={{fontFamily:"Segoe UI", fontWeight:"600", backgroundColor:"#006fc9", transition:"all 0.3s ease-in-out"}} >
                      Sign in
                    </Button>
                  </NavLink>
                </div>
            </div>
        </div>
        <div className='content-2 mt-5'>
            <img className='img-c2' src='/images/microsoft_stock_medium.jpg' alt='cont2_img'/>
        </div>
        <div className='ms-02 mt-5' ref={this.scrollAbout}>
          <h2 className='ms-01t mb-5' style={{fontSize:"45px"}}>
            Microsoft Alternative Login Authentication System (MALAS)
          </h2>
          <span className='ms-01s my-5' style={{fontSize:"22px"}}>
            University project for Advanced Database (CTADVDB) of COM 221
          </span>
        </div>
      </div>
    )
  }
}
