import React, { Component } from 'react'
import * as firebase from 'firebase/app'
import * as FirebaseService from '../../lib/firebase'
import EditForm from '../edit-form'
import "firebase/database"
import { _namespaceWithOptions } from 'firebase-functions/lib/providers/firestore'
var $ = require( "jquery" );

// import './style.css'

const TAG = "[results-table]"
const rowStyle = {
    cursor: 'pointer'
}

class tableResult extends Component {
    constructor(props) {
        super(props)
        this.state = {
            data: new Array(),
            orderData: new Array(),
            actual_point: null,
            isEditPointVisible: false,       
        }
        this.onDataClick = this.onDataClick.bind(this)
        this.onClick = this.onClick.bind(this)       
    }

    componentDidMount() {
        FirebaseService.initFirebase().then(successMessage => {
            return console.log(TAG, successMessage)
        })
            .then(success => {
                FirebaseService.getPoints().then(data => {
                    this.formatResults(data)
                })
            })
            .catch(error => {
                // console.log(TAG, error)
            })
    }

    formatResults(_data) {
        let data = Object.keys(_data)
        let points = new Array()
        // console.log("formatting", data)
        data.forEach((element, i) => {
            // console.log("element: ", element)
            // console.log(_data[element])
            let point = {
                // id: ´element´,
                id_complete: element,
                id: `${element.substr(0, 6)}...`,
                lat: _data[element].lat,
                lng: _data[element].long,
                coments: _data[element].coments,
                ICA: _data[element].ICA,
                IWTotal: _data[element].IWTotal,
                generalTotalWeight: _data[element].pesoGeneralTotal,
                answerByVariableArray: _data[element]._answersByVariableArray,
                temp: _data[element].tempC,
                userToma: _data[element].userToma,
                zonaHoraria:_data[element].zonaHoraria,
                userEditor:_data[element].userEditor,
                margenError: _data[element].margenError,
                puntoscardenales: _data[element].puntoscardenales,
                pesoTotalIndicados: _data[element].pesoTotalIndicados,
                indicadoresConsideradosTotal: _data[element].indicadoresConsideradosTotal,
                criterio:_data[element].criterio,
                observaciones:_data[element].observaciones,
                desPunto:_data[element].desPunto,
                ObservaLabo: _data[element].ObservaLabo
            }
            // console.log(point)
            points.push(point)
        })

        this.setState({
            data: points
        })   
    }
  
    displayData = () => {     
        return this.state.data.map((point, index) => {
            return <tr key={index}
            id={index}
            style={rowStyle}
            className="mask flex-center rgba-red-strong"
            // description={point.desc}
            ica={point.ICA}
            >
            <td style={{display:'none'}}>{point.id}</td>
            <td>{point.zonaHoraria}</td> 
            <td style={{textAlign:'left'}}>{point.coments}</td>
            <td style={{display:'none'}}>{point.puntoscardenales}</td>
            <td>{this.roundNumbers(point.ICA)}</td>
            <td>{point.criterio}</td>
            {/* onBlur={{function(){if(point.criterio == "Aceptable"){$('td').css('background-color','blue');}}}} */}
            <td style={{display:'none'}}>{this.roundNumbers(point.IWTotal)}</td>
            <td style={{display:'none'}}>{this.roundNumbers(point.generalTotalWeight)}</td>
            <td>{this.roundNumbers(point.indicadoresConsideradosTotal)}</td>
            <td style={{display:'none'}}>{point.lat}</td>
            <td style={{display:'none'}}>{point.lng}</td>
            <td style={{textAlign:'center'}}>{this.roundNumbers(point.margenError)}</td>
            <td style={{textAlign:'center'}}>{point.userToma}</td>
            <td>{point.userEditor}</td>
            <td style={{display:'none'}}>{point.desPunto}</td>
            <td>{point.ObservaLabo}</td>
            <td><button type="button" className="btn btn-primary" data-toggle="modal" data-target=".bd-edit-modal-lg" onClick={this.onDataClick.bind(this, point)}>Editar Registro</button></td>
            <td><button type="button" className="btn btn-success" data-toggle="modal" data-target=".bd-crite-modal-lg" onClick={this.ObservaLabo.bind(this, point)}>Agregar Observación</button></td>
            </tr>
        })
    }

    comentsPunto = () => { 
        $('#tablaEditar').hide(); 
        var newArray = this.state.data.map(function(point){
            return point.coments
        })

        var unique = newArray.filter(function(ele, i, array){
            return array.indexOf(ele)===i
        })

        const listItems = unique.map((number, index) =>
            <tr key={index}
            onClick={this.onClick.bind(this,number)}  
            style={{textAlign:'left'}}  
            >
              <td>{number}</td>
            </tr>
        );

        return(
           <tbody id="tbody">
               {listItems}
           </tbody>
        )

        // return this.state.data.map((point, index) => {   
        //     return<tr key={index}
        //         onClick = {this.onClick.bind(this,point)}
        //     >
        //        <th style={{textAlign:'left'}}>{unique}</th>
        //    </tr>          
        // })
    }
        
    onClick(number, e) {
        $('#tbody').slideUp();
        $("#tablaEditar").hide();
        // let db = {}
        var registro = new Array();
        const cometario = number;
        console.log(cometario)

        // var count = 0;
        let database = firebase.database()
        let ref = database.ref('monitoreo1')
        ref.orderByChild("coments").equalTo(cometario).on("child_added", function(snapshot) {         
            // count++; 
            var registros = snapshot.val();
            // db = registros;
            const fecha = registros.zonaHoraria 
            const ICA = registros.ICA 
            const pesoGeneralTotal = registros.pesoGeneralTotal 
            const indicadoresConsideradosTotal = registros.indicadoresConsideradosTotal 
            const userToma = registros.userToma 
            const userEditor = registros.userEditor 
            const margenError = registros.margenError
            const criterio = registros.criterio
            const ObservaLabo = registros.ObservaLabo       
            registro.push(new Array(fecha, ICA, criterio, pesoGeneralTotal, indicadoresConsideradosTotal, userToma, userEditor, margenError, ObservaLabo));            
        }); 

        function getCells(data, type) {
            return data.map(cell => `<${type}>${cell}</${type}>`).join('');
        }
          
        function createBody(data) {
            return data.map(row => `<tr>${getCells(row, 'td')}</tr>`).join('');
        }
          
        function createTable(data) {
            let cabeceras = ['Fecha', 'ICA', 'CriterioGeneral','Peso General Total', 'Peso Total Indicadores' , 'Responsable Toma', 'Responsable Editor','Margen de error (%)', 'Observación de laboratorio'];
            return `
            <div id ="tablaCreada"> 
                <h5 style='width: 100%; align: center;'> Historial de Punto </h5>
                <table class="table table-bordered table-responsive" style= 'table-layout: fixed; border-collapse: collapse; align: center;'>
                <thead style=' border: 1px solid black;'> ${getCells(cabeceras, 'th')}</thead>
                <tr style='color:purple;'><th>Historial: </th><td colspan=8 align="left">${cometario}</td></tr> 
                <tbody>${createBody(data)}</tbody>
                </table>
            </div>
            `;
        }
        
        var divTable = document.getElementById('tableRes');
        divTable.insertAdjacentHTML('afterbegin', createTable(registro));
        //Colorear campo "CRITERIO"
        $('#tablaCreada tr').each(function () {
            var criterio = $(this).find("td").eq(2).html();

            if(criterio == "Altamente contaminado"){
                var criterio = $(this).find("td").eq(2).css({'background-color': "#101111" ,'color': "#EDF5F0"})
            }
            if(criterio == "Contaminado"){
                var criterio = $(this).find("td").eq(2).css({'background-color': "#E83D06"})
            }
            if(criterio == "Poco Contaminado"){
                var criterio = $(this).find("td").eq(2).css({'background-color': "#EEF51C"})
            }
            if(criterio == "Aceptable"){
                var criterio = $(this).find("td").eq(2).css({'background-color': "#65D78E"})
            }
            if(criterio == "No contaminado"){
                var criterio = $(this).find("td").eq(2).css({'background-color': "#698EF1"})
            }
            if(criterio == "Valor de ICA no corresponde al rango"){
                var criterio = $(this).find("td").eq(2).css({'background-color': "#B6BDB9"})
            }
        })
    }   

    roundNumbers(number, decimals = 1000) {
        return Math.round(number * decimals) / decimals
    }

    onDataClick(point, e) { // El evento siempre se pasa al final
        // console.log("Row clicked ", point)
        // var userEdit = document.getElementById("userEditor").innerHTML;
        // console.log(userEdit)
        // console.log("event: ", e)
        // console.log("event: ", e.target)
        // console.log("point: ", point)
        this.setState({
            actual_point: point
        })
        // alert("ICA: " + point.ICA)
    }

    ObservaLabo(point){
        const idElement = point.id_complete
        const ICA = point.ICA;
        const id = point.id
        const criterio = point.criterio
        const ObservaLabo = point.ObservaLabo
        function createFormulario () {
            return `
            <form id="modalCriterio">
                <input style='display:none;' id="id" value=${idElement}></input>
                <input style='display:none;' id="id" value=${id}></input>
                <br>
                <label>QWater - Indice Calidad Agua - ICA: </label>
                <br>
                <label style='color:black;'>${ICA}</label>
                <br>
                <label>Criterio General </label>
                <br>
                <label style='color:black;'>${criterio}</label>
                <br>
                <label>Observación de laboratorio:</label>
                <textarea name="ObservaLabo" class="input-field col s12" id="ObservaLabo" required>${ObservaLabo}</textarea>       
            </form>
            `;
        }

        var divForm = document.getElementById('modalBody');
        divForm.insertAdjacentHTML('afterbegin', createFormulario());
    }

    guardarCambio = ()=>{
        let id = document.getElementById('id').value;
        let ObservaLabo = document.getElementById('ObservaLabo').value;
        let database = firebase.database()
        let ref = database.ref("monitoreo1/" );
        var moniRef = ref.child(id);
        moniRef.update({
            ObservaLabo:ObservaLabo
        })
        alert("Guardado")
        window.location.reload();
    }

    render() {      
        $(function(){        
            $('#modalCriterio').hide();
            $('#expandir').on('click', function(){
                $('#tbody').toggle();
                $('#tablaCreada').hide();
                $('#modalCriterio').hide();
                $('#tablaEditar').hide();
            })

            $('#editar').on('click', function(){
                $("#tablaEditar").show();
                $('#tablaCreada').hide();
                $('#tbody').hide();
                $('#modalCriterio').hide();
            })

            $('#close').on('click', function(){
                $('#modalCriterio').hide();
            })
        //Colorear campo "CRITERIO" tabla 'displayData'
            $('#idTable tr').each(function () {
                var criterio = $(this).find("td").eq(5).html();

                if(criterio == "Altamente contaminado"){
                    var criterio = $(this).find("td").eq(5).css({'background-color': "#101111" ,'color': "#EDF5F0"})
                }
                if(criterio == "Contaminado"){
                    var criterio = $(this).find("td").eq(5).css({'background-color': "#E83D06"})
                }
                if(criterio == "Poco Contaminado"){
                    var criterio = $(this).find("td").eq(5).css({'background-color': "#EEF51C"})
                }
                if(criterio == "Aceptable"){
                    var criterio = $(this).find("td").eq(5).css({'background-color': "#65D78E"})
                }
                if(criterio == "No contaminado"){
                    var criterio = $(this).find("td").eq(5).css({'background-color': "#698EF1"})
                }
                if(criterio == "Valor de ICA no corresponde al rango"){
                    var criterio = $(this).find("td").eq(5).css({'background-color': "#B6BDB9"})
                }
            })
        });
           
        // console.log("renderizando table results")
        return (
            <div style={{margin:'auto'},{marginTop:'100px'},{marginLeft:'80px'}}>
                <div>
                    <div>
                    <a id="admini" style={{display:'none'}}><span className="material-icons" >engineering</span>Administrador</a>
                    <a id="labo" style={{display:'none'}}><span className="material-icons" >biotech</span>Laboratorista</a>
                    <br></br>
                    <button id="editar" type="button" className="btn btn-info btn-lg " style={{width:'20%'}}>Editar Punto</button>
                    <button id="expandir" type="button" className="btn btn-success  btn-lg " style={{width:'20%'}}>Nombre de muestreo</button>          
                        <div style={{tableLayout:'fixed'},{borderCollapse:'collapse'},{border:'2px solid #EAEDED'}}>
                            <table className="table">
                                <thead className="thead-dark" style={{width:'30%'}}>
                                    <tr>
                                        <th style={{letterSpacing:'50px'}}></th>
                                    </tr>
                                </thead>
                                {this.comentsPunto()}
                                {/* <tbody id="tbody" style={{display:'none'}}>                                   
                                </tbody> */}
                            </table>                                
                        </div>
                    <div id="tableRes">
                    </div>
                    </div>
                    <div id="tablaEditar" style={{display:'none'}}>
                        <h3>Tabla de Resultados</h3>
                        <div style={{tableLayout:'fixed'},{borderCollapse:'collapse'},{border:'2px solid #EAEDED '}}>
                            <table className="table" id="idTable">
                                <thead className="thead-dark">
                                    <tr style={{margin:'auto'}}>
                                    {/* style={{visibility:'hidden'}} */}
                                        <th>Fecha Toma</th>
                                        <th>Nombre Punto</th>
                                        <th>ICA</th>
                                        <th>Criterio General</th>
                                        <th style={{display:'none'}}>IWTotal</th>
                                        <th style={{display:'none'}}>WGTotal </th>
                                        <th>Peso Indicadores Utilizados</th>
                                        <th style={{display:'none'}}>lat</th>
                                        <th style={{display:'none'}}>long</th>
                                        <th>Margen de Error(%)</th>
                                        <th>Responsable/Muestra</th>
                                        <th>Editor</th>
                                        <th>Observación de laboratorio</th>
                                        <th colSpan={2}>Ajustes</th>
                                    </tr>
                                </thead>
                                <tbody id="tableBody">
                                      {this.displayData()}                          
                                </tbody>             
                            </table>
                        </div>
                    </div>
                    <hr></hr>
                    {/* aria-labellesnapshoty="myLargeModalLabel" */}
                    <div className="modal fade bd-edit-modal-lg" tabIndex="-1" role="dialog" aria-hidden="true"> 
                        <div className="modal-dialog modal-lg">
                            <div className="modal-content">
                            <EditForm point={this.state.actual_point} /> 
                            </div>
                        </div>
                    </div>
                    <div id="modal" className="modal fade bd-crite-modal-lg" tabIndex="-1" role="dialog" aria-hidden="true" data-backdrop="static" data-keyboard="false"> 
            <div className="modal-dialog" role="document">
                <div className="modal-content">
                <div className="modal-header">
                    <h5 className="modal-title" id="exampleModalLongTitle">Agregar Observación</h5>
                </div>
                <div className="modal-body" id="modalBody">

                </div>
                <div className="modal-footer">
                    <button type="button" className="btn btn-primary" data-dismiss="modal" id="close">Close</button>
                    <button className="btn btn-secondary" onClick={this.guardarCambio.bind(this)}>Guardar</button>
                </div>
                </div>
            </div>
            </div>
                </div>
            </div>
        )
    }
}

export default tableResult