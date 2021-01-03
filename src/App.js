import React from 'react';
import * as FirebaseService from '../src/lib/firebase'
import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router } from "react-router-dom";
import AppRoutes from './components/routes/routes'
import SideBar from './components/side-bar'
import firebase from 'firebase/app';
import $ from 'jquery';

const TAG = "[app]"

function App() {
  btSignOut = btSignOut.bind(this);

  function btSignOut(e){
    FirebaseService.initFirebase().then(successMessage => {
      return console.log(TAG, successMessage)
    })
      firebase.auth().signOut();
     $('.modal-backdrop').remove();
     window.location.href="/result-table";
  }

  return (
    <Router>

      <div className="App" style={{ height: '100%'}, {margin: '5px'}}> 
        <nav className="navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-0 shadow"
        >
          <a className="navbar-brand col-sm-3 col-md-2 mr-0" href="#">Q-Water</a>      
          <div className="userLogeged">
            <button type="button" className="btn btn-primary" data-toggle="modal" data-target="#modal-account"  >
              <span className="material-icons md-106">person</span>
            </button>
          </div>
        </nav>
        {/* className="container-fluid" */}
        <div> 
        {/* className="row"*/}
          <div>
            <SideBar />
            <main role="main" className="main">
              <AppRoutes />
            </main>
          </div>
        </div>

        <div id="modal-account" className="modal" role="dialog">
          <div className="modal-dialog" role="document">
          <div className="modal-content">
              <div className="modal-header center">
               <h4 className="modal-title"> Información del usuario</h4>
              </div>
              <div className="account-body" id="usuario">

              <label className="label">Nombre:</label>
                <p className="nombre" style={{display:'inline-block'}}></p> 

              <br></br>
              <label className="label">Identificación:</label>
                <p className="numeroIdentificacion" style={{display:'inline-block'}}></p>  
                <br></br>

              <label className="label">Rol:</label>
                <p className="rol" style={{display:'inline-block'}}></p>  
              <br></br>
              <label className="label">Email:</label>
                <p className="pUser" style={{display:'inline-block'}}></p>            
              </div>
              <div className="modal-footer">
                <button type="button" className="btnclose" data-dismiss="modal">Close</button>
                <button type="button" className="btnsalir" onClick={btSignOut} data-target="#cerrarModal">Sign out </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Router>
  );
}

export default App;
