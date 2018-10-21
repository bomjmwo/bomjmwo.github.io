// Inicializar Firebase
var config = {
    apiKey: "AIzaSyC4MX_M8zrjYlAdFypAauptO3WevFW8gx0",
    authDomain: "lasertag-92ddd.firebaseapp.com",
    databaseURL: "https://lasertag-92ddd.firebaseio.com",
    projectId: "lasertag-92ddd",
    storageBucket: "lasertag-92ddd.appspot.com",
    messagingSenderId: "736433399300"
};
firebase.initializeApp(config);

db=firebase.database()

var comp= Vue.component('clientes',{
  template: '#tabla_template',
  props: ["clientes", "Eliminar"], //Se le pasa al componente el objeto clientes y la función Eliminar
  methods:{
    edad: function(fecha){
      return moment(fecha, "DD-MM-YYYY").fromNow(true); 
    },

    Editar: function(event){
      var id=event.target.id //la id del boton guarda la key de cada cliente
      db.ref("Clientes").once("value", function(cliente){
        var nombre = "value='"+cliente.val()[id].Nombre+"'";
        var apellidos = "value='"+cliente.val()[id].Apellidos+"'";
        var empresa = "value='"+cliente.val()[id].Empresa+"'";


        swal({
          title: 'Редактировать Игрока',
          confirmButtonText: "Редактировать!",
          html: //se genera un formulario emergente con los valores del cliente por defecto
          '<b>Nombre</b><input id="swal-input1" '+nombre+' class="swal2-input">' +
          ' <select v-model="empresa" id="swal-input3"" class="form-control'+empresa+' class="swal2-input form-control">+ <option>Красные</option> <option>Синие</option><option>Желтые</option><option>Зеленые</option>',  
          preConfirm: function () {    
            return new Promise(function (resolve) {
              resolve([ //al darle a editar se actualizarán los valores diferentes al original
                db.ref("Clientes/"+id).update({Nombre:document.getElementById('swal-input1').value,Empresa: document.getElementById('swal-input3').value})   
              ])
            })
          }
        }).catch(swal.noop)
      })
    }
  }
});


var vm= new Vue({
  el:"#app",
  data:{
    nombre:"",
    apellidos:"",
    fnacimiento:"",
    empresa:"",
    telefono:"",
    fcreacion:"",
    cambio:"",
    fechaActual: moment().format('DD-MM-YYYY / H:mm:ss'),
    clientes: {},
    suma:0
  },
  firebase:{
    refClientes: db.ref("Clientes")
  },
  methods:{
    Guardar: function(){
if(this.nombre==""){ //si el nombre está vacío....
        document.getElementById('nombreObligatorio').setAttribute("class", "") //se le quita la clase .esconder 
      swal('Упс!', "Введите имя игрока", 'error')
      }else{
        db.ref("Clientes").push({Nombre:this.nombre, Apellidos: this.apellidos, Empresa: this.empresa, Fnacimiento:this.fnacimiento, Telefono:this.telefono,  Fcreacion: this.fcreacion})
        document.getElementById('nombreObligatorio').setAttribute("class", "esconder") // se esconde
      }
    },
    Eliminar: function(event){
      var id=event.target.id //el id es el nombre de la key del nodo
      id = id.split("#")[1]; //la # es para que no tenga exactamente la misma id que el botón de editar, asi que se le quita
      swal({
        title: "Действаительно удалить игрока?",
        text: "Это действие необратимо",
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#DD6B55",
        confirmButtonText: "Ок",
        cancelButtonText: 'Отмена',
      }).then (function(){
        db.ref("Clientes/"+id).remove()
      }).catch(swal.noop)
    },
    DaE: function(){ //dólares a euros...
      this.cambio=parseFloat(this.cambio/1.04).toFixed(3)
    },
    EaD: function(){ //euros a dólares...
      this.cambio=parseFloat(this.cambio*1.04).toFixed(3)
    }
  },
  computed:{
    todosClientes: function(){
      this.clientes=this.refClientes //se le pasa la referencia objeto a la variable clientes para luego pasarsela al componente, si le paso la refClientes directamente no funciona
      return Object.keys(this.refClientes).length //número de registros diferentes en clientes
    },

    CambioWarning: function(){ //esto es para que no salga el mensaje de error del cambio sin haber escribido
      return this.cambio=="" ? "esconder" : "alert alert-danger"
    }
  },
  watch:{
    cambio: function(nuevoCambio){ //si el nuevo valor de la variable cambio cumple los requisitos, se guardará en la base de datos
      if(nuevoCambio.length == 5 && nuevoCambio == parseFloat(nuevoCambio).toFixed(3)){   
        db.ref("Cambio").set({cambio: nuevoCambio})
      }
    },
  }
})

/*
Ejercicio 10
{

  "rules": {
    ".read": true,
      ".write" : true,
        "Clientes" :{
          "$codigo" :{
            "Fcreacion": {
              ".validate": "!data.exists()"
            }
          }
        }
  }
}
*/

setInterval(function(){vm.fechaActual=moment().format('DD-MM-YYYY / H:mm:ss'); }, 1000); //para que la fecha se actualice cada segundo y se vea en directo como corre el tiempo

new Vue({
  el: '...',
  data: {
    selected: ''
  }
})