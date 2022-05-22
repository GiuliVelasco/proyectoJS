class Usuario {
    constructor(nombreCompleto, email, edad){
        this.nombreCompleto = nombreCompleto;
        this.email = email;
        this.edad = edad;
    }
}

class Producto {
    constructor(id, nombre, color, talle, precio) {
        this.id = id;
        this.nombre = nombre.toLowerCase();
        this.color = color;
        this.talle = talle;
        this.precio = parseFloat(precio);
    }
}
const producto1 = new Producto(1, "Judogi", "Blanco", "S", 30);
const producto2 = new Producto(2, "Cinturon", "Amarillo", "Unico", 8);
const producto3 = new Producto(3, "Guantes", "Rojo", "12/14 oz", 35);
const producto4 = new Producto(4, "Tibiales", "Blanco", "Unico", 30);
const producto5 = new Producto(5, "Venda", "Rojo", "Unico", 7);
const producto6 = new Producto(6, "Remera", "Blanco", "M/L", 12);

const productos = [producto1, producto2, producto3, producto4, producto5, producto6];
let usuarios = [];

if(localStorage.getItem('Usuarios')){
    usuarios = JSON.parse(localStorage.getItem('Usuarios'));
} else{
    localStorage.setItem('Usuarios', JSON.stringify(usuarios));
}

let formulario = document.getElementById('idForm');
let divProductos = document.querySelector('#divProductos');
let botonDarkMode = document.getElementById('botonDarkMode');
let botonLightMode = document.getElementById('botonLightMode');
let fondoMain = document.getElementById('fondoMain');
let modo;
let enviarForm = document.getElementById('enviarForm');
let arrayCarrito = JSON.parse(localStorage.getItem('carrito')) ?? []
let botonVerCarrito = document.getElementById('botonVerCarrito');
//modo de visualizacion
function modoPantalla(){
    if(localStorage.getItem('modo')){
        modo = localStorage.getItem('modo');
    }else{
        localStorage.setItem('modo', 'light')
    }

    if(modo == 'dark'){
        fondoMain.classList.add('modoOscuro');
    }

    botonDarkMode.addEventListener("click", ()=>{
        fondoMain.classList.add('modoOscuro');
        localStorage.setItem('modo', 'dark');
    })

    botonLightMode.addEventListener("click", ()=>{
        fondoMain.classList.remove('modoOscuro');
        localStorage.setItem('modo', 'light');
    })
}
//formulario
formulario.addEventListener('submit',(event) =>{
    event.preventDefault()
    let nombreCompleto = document.getElementById('usernameId').value
    let email = document.getElementById('emailId').value
    let edad = document.getElementById('edadId').value
    let objetoUsuario = {nombreCompleto: nombreCompleto, email: email, edad: edad}
    usuarios.push(objetoUsuario)
    localStorage.setItem('Usuarios', JSON.stringify(usuarios))
    console.log(usuarios)
})

enviarForm.addEventListener("click",() => {
    Swal.fire({
        icon: 'success',
        title: 'Gracias por contactarnos!',
        text: 'En breve te enviaremos más info de nuestras promos.',
        //footer: '<a href="">Podes seguirnos en las redes</a>'
      });
})
//seccion productos
function mostrarCardsProd(){
    productos.forEach((element) => {
        const {nombre, color, talle, precio, id} = element;
        divProductos.innerHTML += `
            <div class="card">
                <div class="card-body">
                    <p class="card-title">${nombre.toUpperCase()}</p>
                    <p class="card-text">Color: ${color}.<br>Talle: ${talle}
                    <br><span class="precio">US$ ${precio}</span></p>
                    <a id="boton${id}" class="btn d-flex justify-content-between">Agregar al carrito
                        <img class="fondoCarrito" width="30px" height="30px" src="../img/iconCarrito.png" alt="agregar al carrito">
                    </a>
                </div>
            </div>
        `
    });
    agregarProducto();
}

function agregarProducto() {
    productos.forEach((articulo, index) => {
        document.querySelector(`#boton${index +1}`).addEventListener(`click`, () => {
            enviarAlCarrito(articulo);
            Toastify({
                text: "Producto agregado al carrito",
                duration: 2000,
                close: true,
                gravity: "top",
                position: "center",
                stopOnFocus: true, 
                style: {
                  background: "linear-gradient(to right, rgba(129,0,0,1), rgba(206,18,18,1))",
                },
              }).showToast();
        });
    });
}

function enviarAlCarrito(articulo) {
    if(arrayCarrito.some(producto => producto.id == articulo.id)){
        let indice = arrayCarrito.findIndex(producto => producto.id === articulo.id);
        arrayCarrito[indice].cantComprada++;
        console.log(arrayCarrito);
    }else{
        let productoArray = {
            ...articulo,
            cantComprada: 1
        }
        arrayCarrito.push(productoArray);
    }
    localStorage.setItem('carrito', JSON.stringify(arrayCarrito));
    pintarCarrito();
}

function pintarCarrito() {
    idCarrito.innerHTML = ""
    idCarrito.innerHTML += `<p>Productos seleccionados</p>`
    arrayCarrito.forEach(element => {
        idCarrito.innerHTML += `
        <div class="card">
            <div class="card-body">
                <p class="card-title">${element.nombre.toUpperCase()}</p>
                <p class="card-text">Color: ${element.color}.<br>Talle: ${element.talle}
                <br><span class="precio">Precio unitario US$ ${element.precio}</span> - Cantidad: ${element.cantComprada}</p>
                <p>Subtotal: U$D ${element.precio * element.cantComprada}</p>
                <button class="botonBorrar" id="${element.id}}">Eliminar</button>
            </div>
        </div>
        `
    });
    borrarProducto();
}

botonVerCarrito.addEventListener('click', (event)=>{
    event.preventDefault()
    pintarCarrito();
})

function borrarProducto() {
    let botonBorrarProd = document.querySelectorAll(".botonBorrar");
    botonBorrarProd.forEach((element) => {
        element.addEventListener("click", (e) => {
            let id = parseInt(e.target.id);
            console.log(id);
            arrayCarrito = arrayCarrito.filter((element) => {
                return element.id !== id; //le pido que retorne el carrito con lo elementos cuyo id sea diferente al seleccionado para eliminar
            });
            localStorage.setItem('carrito', JSON.stringify(arrayCarrito));
            pintarCarrito();
        });
    });
}

mostrarCardsProd();
modoPantalla();