import React, { Component } from 'react'
import Button from 'react-bootstrap/Button'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.min.js'

export default class MainHome extends Component {
  render() {
    if (true){
        document.body.style.backgroundImage = "radial-gradient(farthest-side at top left, #e9d7d0, transparent),"+
        "radial-gradient(farthest-side at top right, #d4e1d2, transparent),"+
        "radial-gradient(farthest-side at bottom left, #dde5eb, transparent)," +
        "radial-gradient(farthest-side at bottom right, #ebe8d7, transparent)"
    }

    return (
      <div className = 'main-content'>
        <nav className="navbar navbar-expand-lg bg-light">
          <div className="ms-3  container-fluid" style={{fontWeight:"600"}}>
            <a className="navbar-brand logo mb-1" href=""> <img src='/images/microsoft-seeklogo.jpg'  width="120px" height="25px"/> </a>
            <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
              <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
              <ul className='navbar-nav me-auto mb-2 mb-lg-0'>
                <li>
                  <a className="nav-link" href="" >Home</a>
                </li>
                <li>
                  <a className="nav-link" href="">Algorithm</a>
                </li>
                <li>
                  <a className="nav-link" href="">About</a>
                </li>
                <li>
                  <a className="nav-link" href="">Instruction</a>
                </li>
              </ul>
              <a className='nav-link' href=''>Admin</a>

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
                    <Button className='rounded-1 px-3 py-1 mt-5' style={{backgroundColor: "#006fc9", fontFamily: "Segoe UI", fontWeight: "600"}}>Sign in</Button>
                </div>
            </div>
        </div>
        <div className='content-2 mt-5'>
            <img className='img-c2' src='/images/microsoft_stock_medium.jpg' alt='cont2_img'/>
        </div>
        <div className='ms-02 mt-5'>
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
