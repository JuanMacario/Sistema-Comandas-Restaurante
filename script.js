const estados = {
    'Ocupada': 'Ocupada',
    'Libre': 'Libre',
    'Pendiente': 'Pendiente de Pago'
}

class Producto {
    #id;
    #nombre;
    #precio;

    constructor(nombre, precio) {
        this.#nombre = nombre
        this.#precio = precio
        this.#id = Date.now() + Math.ceil(Math.random() * 1000)
    }

    get nombre() {
        return this.#nombre
    }

    get precio() {
        return this.#precio
    }

    get id() {
        return this.#id
    }

    notificarAEstacion() {
        console.log("Enviar a Cocina")
    }
}

class BebidaCaliente extends Producto {
    #tipo;
    constructor() {
        this.#tipo = 'Bebida Caliente'
    }
}

class BebidaFria extends Producto {
    #tipo;
    constructor() {
        this.#tipo = 'Bebida Fria'
    }

    notificarAEstacion() {
        console.log("Enviar al Bar")
    }
}

class Mesa {
    #nombre;
    #estado;
    #comandas;
    #total;
    #personas;
    #id;
    #mesasUnidas;

    constructor(nombre, personas) {
        this.#nombre = nombre
        this.#estado = 'Libre'
        this.#personas = personas
        this.#total = 0
        this.#comandas = []
        this.#mesasUnidas = []
        this.#id = Math.ceil(Math.random() * 1000) + Date.now()
    }

    get nombre() {
        return this.#nombre;
    }

    get estado() {
        return this.#estado;
    }

    get id() {
        return this.#id;
    }

    get personas() {
        return this.#personas
    }

    get mesasUnidas() {
        return this.#mesasUnidas
    }

    get comandas() {
        return this.#comandas
    }

    cobrarMesa() {
        this.#cambiarEstado(estados.Libre)
    }

    #cambiarEstado(estado) {
        if (estados[estado] != undefined) {
            this.#estado = estado
        } else {
            throw new Error('Estado no Autorizado')
        }

    }

    ingresarComanda(comanda) {
        this.#comandas = [...this.#comandas, comanda]
    }

    eliminarComanda() {
        this.#comandas.pop()
    }

    aperturarMesa() {
        this.#cambiarEstado(estados.Ocupada)
    }

    muestrame() {
        tituloMesa.innerHTML = `<i class="fa-solid fa-ticket" aria-hidden="true"></i> Comanda ${this.nombre}`

        mesaDetalleInfo.innerHTML = `  <p><strong>Mesa:</strong> ${this.nombre.split(' ')[1]} </p>
            <p><strong>Capacidad:</strong> ${this.personas}   comensales</p>`
        estadoMesa.innerHTML = this.estado
        estadoMesa.className = `mesa-estado ${this.estado.toLowerCase()}`

        panelComanda.classList.remove('d-none')

        botonUnirMesa.setAttribute('data-id', this.id)
        mesaDetalle.classList.remove('d-none')
        tablaWrap.classList.add('d-none')
        mesaDetalleInfo.classList.remove('d-none')
    }

    MostrarCuenta() {
        tituloMesa.innerHTML = `<i class="fa-solid fa-ticket" aria-hidden="true"></i> Comanda ${this.nombre}`
        mesaDetalle = document.querySelector('.mesa-detalle')
        tablaWrap = document.querySelector('.container')
        mesaDetalle.classList.add('d-none')
        tablaWrap.classList.remove('d-none')
        mesaDetalleInfo.classList.add('d-none')
    }

    unirme(ids) {

        this.#mesasUnidas = [...this.#mesasUnidas, ids]
        let mesaAUnir = restaurante.mesas.find(mesa => mesa.id == ids)
        if (!mesaAUnir.mesasUnidas.includes(this.id)) {
            mesaAUnir.unirme(this.id)
        }
    }
}


class Restaurante {
    #nombre;
    #mesasNo;
    #mesas;

    constructor(nombre, mesas) {
        this.#mesasNo = mesas;
        this.#nombre = nombre;
        this.#mesas = this.crearMesas()
    }

    crearMesas() {
        let mesas = []
        for (let i = 1; i <= this.#mesasNo; i++) {
            mesas.push(new Mesa(`Mesa ${i}`, 4))
        }

        return mesas
    }

    get mesasNo() {
        return this.#mesasNo;
    }

    get mesas() {
        return this.#mesas;
    }

    normalizeMesasHTML() {
        let html = ''

        for (let item of this.#mesas) {
            html += `<article data-id=${item.id} class="mesa-card ${item.estado.toLowerCase()}">
                        <h3 data-id=${item.id}>${item.nombre}</h3>
                        <p data-id=${item.id}><span class="dot"></span> ${item.estado}</p>
                     </article>`
        }
        return html;
    }
}

class Pedido {
    #cantidad;
    #subtotal;
    #nombre;
    #precio

    constructor(cantidad, nombre, precio) {
        this.#cantidad = cantidad
        this.#nombre = nombre
        this.#precio = precio
    }

    set cantidad(value) {
        this.#cantidad = value
    }

    get subtotal() {
        return this.#subtotal = this.#cantidad * this.#precio
    }

    get cantidad() {
        return this.#cantidad
    }
    get nombre() {
        return this.#nombre
    }

    get precio() {
        return this.#precio
    }
}

class Comanda {
    #pedidos;
    #mesa;
    #impuestos = 0.05
    #estado;

    constructor(mesa) {
        this.#pedidos = []
        this.#mesa = mesa
        this.#estado = 'pendiente'
    }

    get subtotal() {
        return this.#pedidos.reduce((acumulador, actual) => acumulador + parseFloat(actual.subtotal), 0)
    }



    agregarPedido(pedido) {
        let pedidoEncontrar = this.#pedidos.find(item => item.nombre == pedido.nombre)
        if (pedidoEncontrar == undefined) {
            this.#pedidos = [...this.#pedidos, pedido]
        } else {
            pedidoEncontrar.cantidad++
        }

    }

    agregarMesa(mesa) {
        this.#mesa = [...this.#mesa, mesa]
    }

    renderizar() {
        let html = ''
        let impuesto = this.subtotal * this.#impuestos
        for (let pedido of this.#pedidos) {
            html += `  <tr>

                <td>${pedido.cantidad}</td>

                <td>${pedido.nombre}</td>

                <td>Q${pedido.precio}</td>

                <td>Q${pedido.subtotal}</td>

              </tr>`
        }

        tablaPedido.innerHTML = html
        subtotal.textContent = `Q${this.subtotal.toFixed(2)}`
        impuestos.textContent = `Q${impuesto.toFixed(2)}`
        total.textContent = `Q${(this.subtotal + impuesto).toFixed(2)}`
    }

    cobrar() {
        this.#estado = 'Preparando'
        tablaPedido.innerHTML = ''
        subtotal.textContent = 'Q0.00'
        impuestos.textContent = 'Q0.00'
        total.textContent = 'Q0.00'
        alert("comanda enviada a la cocina")
    }
    get pedidos() {
        return this.#pedidos
    }
}

//objetos

const productos = [
    new Producto('Pizza Margarita', 65),
    new Producto('Pizza Pepperoni', 60)
]

const restaurante = new Restaurante('El gordo', 24)

///DOM
let contenedorMesas = document.querySelector('.mesas-grid')
let contenedorNoMesas = document.querySelector('.badge')
let tituloMesa = document.querySelector('#tituloMesa')
let mesaDetalleInfo = document.querySelector('.mesa-detalle-info')
let estadoMesa = document.querySelector('.mesa-estado')
let panelComanda = document.querySelector('.panel-comanda')
let detalleMesaAcciones = document.querySelector('.mesa-detalle-acciones')
let botonUnirMesa = document.querySelector('.unir-mesa')
let mesaDetalle = document.querySelector('.mesa-detalle')
let tablaWrap = document.querySelector('.container')
let menuGrid = document.querySelector('.menu-grid')
let tablaPedido = document.querySelector('#tabla-pedido')
let subtotal = document.querySelector('#subtotal')
let total = document.querySelector('#total')
let impuestos = document.querySelector('#impuestos')
let btnCobrar = document.querySelector('.cobrar')
let btnFinalizar = document.querySelector('.finalizar')
let btnAbrir = document.querySelector('.abrir-cuenta')
let badgeProductos = document.querySelector('#badge-productos')
contenedorMesas.innerHTML = restaurante.normalizeMesasHTML()
contenedorNoMesas.textContent = `${restaurante.mesasNo} Mesas`
badgeProductos.textContent = `${productos.length} Productos`

let mesaActualSeleccionada;
let mesaSeleccionada;
let modosSeleccion = false;
let btnEvento = (event) => {

    mesaSeleccionada = restaurante.mesas.find(item => item.id == event.target.dataset.id)

    if (event.target.dataset.id != undefined) {
        if (mesaActualSeleccionada != undefined) {
            mesaActualSeleccionada.style = ''
        }

        event.target.style = 'background: green'
        if (mesaSeleccionada.estado == estados.Libre) {
            mesaSeleccionada.muestrame()
            btnCobrar.disabled = true
            btnCobrar.classList.remove('cobrar')
        } else {
            if (mesaSeleccionada.comandas[mesaSeleccionada.comandas.length - 1].pedidos.length > 0) {
                btnCobrar.disabled = false
            } else {
                btnCobrar.disabled = true
            }
            mesaSeleccionada.MostrarCuenta()
            mesaSeleccionada.comandas[mesaSeleccionada.comandas.length - 1].renderizar()
        }
        mesaActualSeleccionada = event.target
        if (panelComanda.classList.contains('d-none')) {
            panelComanda.classList.remove('d-none')
        }

    }
}

let btnEventoRojo = (event) => {
    let mesaSeleccionadaActual = restaurante.mesas.find(item => item.id == event.target.dataset.id)
    if (mesaSeleccionadaActual.estado != estados.Ocupada && modosSeleccion) {
        if (event.target.dataset.id != undefined) {
            event.target.style = 'background-color: red'
            mesaSeleccionada.unirme(event.target.dataset.id)
        }
    } else {
        alert('Selecciones una mesa libre')
    }
}

contenedorMesas.addEventListener('click', btnEvento)

let click = false;

botonUnirMesa.addEventListener('click', (event) => {
    contenedorMesas.removeEventListener('click', btnEvento)
    contenedorMesas.addEventListener('click', btnEventoRojo)
    if (click) {
        modosSeleccion = false
        let comandaObjeto = new Comanda([mesaSeleccionada.id])
        for (let i = 0; i < mesaSeleccionada.mesasUnidas.length; i++) {
            let mesaAUnir = restaurante.mesas.find(item => item.id == mesaSeleccionada.mesasUnidas[i])
            mesaAUnir.aperturarMesa();
            comandaObjeto.agregarMesa(mesaAUnir.id)
            mesaAUnir.ingresarComanda(comandaObjeto)
        }
        mesaSeleccionada.aperturarMesa();
        mesaSeleccionada.ingresarComanda(comandaObjeto)
        contenedorMesas.innerHTML = restaurante.normalizeMesasHTML()
        botonUnirMesa.textContent = 'Seleccionar Mesas'
        click = false
        contenedorMesas.removeEventListener('click', btnEventoRojo)
        contenedorMesas.addEventListener('click', btnEvento)
        mesaSeleccionada.MostrarCuenta()
        comandaObjeto.renderizar();
    } else {
        botonUnirMesa.textContent = "Unir Mesas"
        botonUnirMesa.style = 'background-color: skyblue'
        mesaSeleccionada = restaurante.mesas.find(item => item.id == event.target.dataset.id)
        click = true
        modosSeleccion = true
    }

})

let productoHTML = ''
for (let producto of productos) {
    productoHTML += `
          <article class="producto-card">

            <img

              src="https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?auto=format&fit=crop&w=800&q=80"

              alt="Pizza Margarita"

            />

            <div class="producto-info">

              <h3>${producto.nombre}</h3>

              <p class="categoria comida"><i class="fa-solid fa-utensils"></i> Comida</p>

              <p class="precio">Q${producto.precio.toFixed(2)}</p>

              <button data-id=${producto.id} type="button">Agregar</button>

            </div>

          </article>`
}

menuGrid.innerHTML = productoHTML


menuGrid.addEventListener('click', (event) => {
    if (event.target.type == 'button') {
        btnCobrar.disabled = false
        btnFinalizar, disabled = true
        let producto = productos.find(item => item.id == event.target.dataset.id)
        const pedido = new Pedido(1, producto.nombre, producto.precio)
        if (mesaSeleccionada && mesaSeleccionada.comandas.length > 0) {
            mesaSeleccionada.comandas[mesaSeleccionada.comandas.length - 1].agregarPedido(pedido)
            //dibujar
            mesaSeleccionada.comandas[mesaSeleccionada.comandas.length - 1].renderizar()
        } else {
            alert('Aperture una mesa antes')
        }

    }
})

btnCobrar.addEventListener('click', (event) => {
    let cambiandMesaPrincipal = mesaSeleccionada;
    if (mesaSeleccionada.mesasUnidas.length == 1) {
        cambiandMesaPrincipal = mesaSeleccionada = restaurante.mesas.find(item => item.id == mesaSeleccionada.mesasUnidas[0])
    }
    cambiandMesaPrincipal.comandas[cambiandMesaPrincipal.comandas.length - 1].cobrar()
    const nuevaComanda = new Comanda([mesaSeleccionada.id])
    for (let i = 0; i < cambiandMesaPrincipal.mesasUnidas.length - 1; i++) {
        let mesaAUnir = restaurante.mesas.find(item => item.id == cambiandMesaPrincipal.mesasUnidas[i])
        mesaAUnir.ingresarComanda(nuevaComanda)
    }
    cambiandMesaPrincipal.ingresarComanda(nuevaComanda)
    btnFinalizar.disabled = false
    btnCobrar.disabled = true
})


btnFinalizar.addEventListener('click', (event) => {
    let cambiarMesa = mesaSeleccionada;
    if (mesaSeleccionada.mesasUnidas.length == 1) {
        cambiarMesa = mesaSeleccionada = restaurante.mesas.find(item => item.id == mesaSeleccionada.mesasUnidas[0])
    }
    cambiarMesa.cobrarMesa()
    for (let i = 0; i < cambiarMesa.mesasUnidas.length; i++) {
        let mesaAUnir = restaurante.mesas.find(item => item.id == mesaSeleccionada.mesasUnidas[i])
        mesaAUnir.cobrarMesa()

    }
    cambiarMesa.eliminarComanda()
    contenedorMesas.innerHTML = restaurante.normalizeMesasHTML()
    panelComanda.classList.add('d-none')
})

btnAbrir.addEventListener('click', (event) => {
    mesaSeleccionada.aperturarMesa()
    let comandaObjeto = new Comanda([mesaSeleccionada.id])
    comandaObjeto.agregarMesa(mesaSeleccionada.id)
    mesaSeleccionada.ingresarComanda(comandaObjeto)
    contenedorMesas.innerHTML = restaurante.normalizeMesasHTML()
    mesaSeleccionada.MostrarCuenta()
    comandaObjeto.renderizar()

})
