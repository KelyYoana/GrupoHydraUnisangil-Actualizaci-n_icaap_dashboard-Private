import React, { Component, useRef } from 'react';
import 'firebase/auth'
import firebase from 'firebase/app';
import Login from './Login'
import App from './App'
import * as FirebaseService from '../src/lib/firebase'
import { Redirect } from 'react-router-dom';
var $ = require( "jquery" );
const TAG = "[valiUser]"

// ReactDOM.render(<Login />, document.getElementById('root'));

class ValiUser extends Component{
  constructor(props) {
      super(props);
      this.state = {
        user: {},
      };
    }
 
     componentDidMount() {
      this.authListener();
    }

    authListener() {
        FirebaseService.initFirebase().then(successMessage => {
            return console.log(TAG, successMessage);
        })
         firebase.auth().onAuthStateChanged((user) => {
            // console.log(user);
            if (user) {
            //Si se quiere guardar un usuario de forma local, habilitar esta linea
            // localStorage.setItem('user', user.uid);
            const uid = user.uid;
            let database = firebase.database();
            let ref = database.ref('users/' + uid )
            
            return new Promise((resolve, reject) => {
                ref.on("value", data => {
                    // console.log(TAG, "[dashboard] data from firebase: ", data.val())                  
                    resolve(data.val())
                    var users = data.val();
                    console.log(users)
                    var rol = users.rol;

                    if(rol == 'Administrador'){
                        $(function(){
                            var correoElectronico = users.correoElectronico; 
                            var nombre = users.nombreCompleto
                            var numeroIdentificacion = users.numeroIdentificacion
                            $('.nombre').append(" ", nombre);
                            $('.rol').append(" ", rol);
                            $('.numeroIdentificacion').append(" ", numeroIdentificacion);                           
                            $('.pUser').append(" ", correoElectronico);
                            $(".userEdit").val(correoElectronico).val();
                            $('#config').show();
                            $("#admini").show();
                        })
                        this.setState({ user });

                    }else if(rol == 'Auxiliar de laboratorio'){
                        $(function(){
                            var correoElectronico = users.correoElectronico;
                            var nombre = users.nombreCompleto
                            var numeroIdentificacion = users.numeroIdentificacion
                            
                            $('.nombre').append(" ", nombre);
                            $('.rol').append(" ", rol);
                            $('.numeroIdentificacion').append(" ", numeroIdentificacion);
                            $('.account-body').append(" ", correoElectronico);
                            $(".userEdit").val(correoElectronico).val();                  
                            $("#labo").show();
                        })
                        
                        this.setState({ user });
                      
                    }else if(rol == "Auxiliar de campo" ){
                        alert("No posee permisos para ingresar a esta sesion")
                        this.setState({ user: null });
                        
                    } else if(rol == "Sin Permisos"){
                        alert("En proceso de solicitud")
                        this.setState({ user: null });
                    }
                    else{
                        console.log("Se encontró un error")
                        this.setState({ user: null });
                    }

                }, (err) => {
                    console.error(err)
                    //  alert(err);
                    // reject(err)
                    // reject(`error: ${err}`)
                    this.setState({ user: null });
                })
            })
        }else {
            this.setState({ user: null });
            // localStorage.removeItem('user');
        }
        });
    }

    render(){
        return(
        <div className="valiUser">
            {this.state.user ? (<App />) : (<Login />)} 
        </div>

        );
    }
}
export default ValiUser;




