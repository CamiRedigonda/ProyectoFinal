  
// If we need to use custom DOM library, let's save it to $$ variable:
var $$ = Dom7;

var app = new Framework7({
    navbar: {
        mdCenterTitle: true,
    },
    // App root element
    root: '#app',
    // App Name
    name: 'My App',
    // App id
    id: 'com.myapp.test',
    // Enable swipe panel
    panel: {
      swipe: 'left',
    },
    // Add default routes
    routes: [
      {
        path: '/principal/',
        url: 'principal.html',
      },
      {
        path: '/registro/',
        url: 'registro.html',
      },
      {
        path: '/index/',
        url: 'index.html',
      },
      {
        path: '/mensajes/',
        url: 'mensajes.html',
      },
      {
        path: '/tarjeta/',
        url: 'tarjeta.html',
      },
    ]
    // ... other parameters
  });
var mainView = app.views.create('.view-main');
var nombre, apellido , paginaweb , telefono , fnac , email;
var mostrarErrores=1;
/* BASE DE DATOS */
var db, refUsuarios, refTiposUsuarios;
// Handle Cordova Device Ready Event
$$(document).on('deviceready', function() {
  /* seteo variables de BD */
  
  var iniciarDatos = 0;
  if ( iniciarDatos == 1 ) {
      fnIniciarDatos();
  }
    fnMostrarError("Device is ready!");
});

// Option 1. Using one 'page:init' handler for all pages
$$(document).on('page:init', function (e) {
    // Do something here when page loaded and initialized
    fnMostrarError(e);

    db = firebase.firestore();
    refUsuarios = db.collection("USUARIOS");

})
// Option 2. Using live 'page:init' event handlers for each page
$$(document).on('page:init', '.page[data-name="principal"]', function (e) {
    // Do something here when page with data-name="about" attribute loaded and initialized
    console.log(e);
})
$$(document).on('page:init', '.page[data-name="registro"]', function (e) {
    // Do something here when page with data-name="about" attribute loaded and initialized
    $$('#registro').on('click', fnRegistro);
    console.log(e);
})

$$(document).on('page:init', '.page[data-name="index"]', function (e) {
    // Do something here when page with data-name="about" attribute loaded and initialized
    // Inicio Panel
    $$('#login').on('click', fnLogin);
    fnMostrarError(e);
})
$$(document).on('page:init', '.page[data-name="tarjeta"]', function (e) {
    // Do something here when page with data-name="about" attribute loaded and initialized
    // Inicio Panel
    $$('#guardarTarjeta').on('click', crearTarjeta);
    fnMostrarError(e);
})
/** FUNCIONES PROPIAS **/

/* MIS FUNCIONES */
function crearTarjeta(){
    var pregunta = $$('#preguntaTarjeta').val();
    var respuesta = $$('#respuestaTarjeta').val();
    contenido = {
      pregunta: pregunta,
      respuesta: respuesta
    }
    // Add a new document in collection "cities"
    db.collection("Tarjetas").doc().set(contenido)
    .then(function() {
        console.log("Document successfully written!");
        alert('Tarjeta guardada')
    })
    .catch(function(error) {
        console.error("Error writing document: ", error);
    });
}
function fnRegistro() {
    var elMail = $$('#emailRegistro').val();
    var laClave = $$('#claveRegistro').val(); 
    var nombre = $$('#nombreRegistro').val();
    email = elMail;
    var huboError = 0;
    firebase.auth().createUserWithEmailAndPassword(email, laClave)          
      .catch(function(error) {       
        // Handle Errors here.
        huboError = 1;
        var errorCode = error.code;
        var errorMessage = error.message; 
        fnMostrarError(errorCode);
        fnMostrarError(errorMessage);
      })
      .then(function(){
          if(huboError == 0){
            alert('registro en auth ok');

            datos = {
              nombre: nombre
            }

            refUsuarios.doc(email).set(datos).then( function() {
                alert("registro ok en bd.");
                mainView.router.navigate("/principal/");
            })
          }
      });
}
function fnLogin() {
    email = $$('#emailLogin').val();
    var clave = $$('#claveLogin').val();
//Se declara la variable huboError (bandera)
    var huboError = 0;
    firebase.auth().signInWithEmailAndPassword(email, clave)
        .catch(function(error){
//Si hubo algun error, ponemos un valor referenciable en la variable huboError
            huboError = 1;
            var errorCode = error.code;
            var errorMessage = error.message;
            fnMostrarError(errorMessage);
            fnMostrarError(errorCode);
        })
        .then(function(){   
//En caso de que esté correcto el inicio de sesión y no haya errores, se dirige a la siguiente página
            if(huboError == 0){
                // recuperar el tipo de usuario segun el email logueado....
                // REF: https://firebase.google.com/docs/firestore/query-data/get-data
                // TITULO: Obtén un documento
                refUsuarios.doc(email).get().then(function(doc) {
                    if (doc.exists) {
                          //console.log("Document data:", doc.data());
                          //console.log("Tipo de Usuario: " + doc.data().tipo );
                          mainView.router.navigate("/principal/");
                    } else {
                          // doc.data() will be undefined in this case
                          //console.log("No such document!");
                    }
                }).catch(function(error) {
                    console.log("Error getting document:", error);
                });
            }
        }); 
}
// function fnGuardarDP() {
//   nombre = $$('#nombre').val();
//   apellido = $$('#apellido').val();
//   paginaweb = $$('#paginaweb').val();
//   telefono = $$('#telefono').val();
//   fnac = $$('#fnac').val();
//   // clave: variable de datos
//   var data = {
//     nombre: nombre,
//     apellido: apellido,
//     web: paginaweb,
//     telefono: telefono,
//     fnac: fnac,
//     tipo: "VIS"
//   }
//   refUsuarios.doc(email).set(data);
// }

function fnMostrarError(txt) {
  if (mostrarErrores == 1) {
      console.log("ERROR: " + txt);
  }
}




