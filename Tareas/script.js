// Referencias a elementos del DOM
const entradaTarea = document.getElementById("tarea");           // Campo de entrada de texto para nuevas tareas
const botonTarea = document.getElementById("agregarTarea");       // Botón para agregar nueva tarea
const listaTareas = document.getElementById("listaTareas");       // Lista donde se muestran las tareas
const contador = document.getElementById("contador");             // Elemento que muestra el número de tareas pendientes

// Función que actualiza el contador de tareas pendientes
function actualizarContador() {
    // Selecciona las tareas que no tienen la clase "completada"
    const tareasNoCompletadas = document.querySelectorAll("#listaTareas li:not(.completada)").length;
    // Actualiza el texto del contador dependiendo del número de tareas
    contador.textContent = `${tareasNoCompletadas} ${tareasNoCompletadas === 1 ? 'tarea pendiente' : 'tareas pendientes'}`;
}

// Función que agrega una nueva tarea a la lista
function agregarElemento() {
    // Obtiene el texto ingresado y elimina espacios al inicio y final
    const textoTarea = entradaTarea.value.trim();

    // Verifica que el campo no esté vacío
    if (textoTarea !== "") {
        // Crea un nuevo elemento <li> para la tarea
        const nuevaTarea = document.createElement("li");
        
        // Inserta HTML dentro del <li>: el texto y un botón para eliminar
        nuevaTarea.innerHTML = `
            <span class="task-text">${textoTarea}</span>
            <button class="delete-btn">Eliminar</button>
        `;
        
        // Referencia al texto de la tarea
        const taskText = nuevaTarea.querySelector(".task-text");

        // Al hacer clic sobre el texto, marca o desmarca la tarea como completada
        taskText.addEventListener("click", function() {
            nuevaTarea.classList.toggle("completada");
            actualizarContador();
        });
        
        // Referencia al botón de eliminar
        const deleteBtn = nuevaTarea.querySelector(".delete-btn");

        // Al hacer clic en el botón eliminar, remueve la tarea con animación
        deleteBtn.addEventListener("click", function(e) {
            e.stopPropagation(); // Evita que también se dispare el evento de marcar como completada
            nuevaTarea.classList.add("fade-out"); // Aplica animación de salida
            setTimeout(() => {
                listaTareas.removeChild(nuevaTarea); // Elimina el elemento
                actualizarContador(); // Actualiza el contador
            }, 300); // Espera 300ms para completar la animación
        });
        
        // Aplica animación de entrada al agregar la tarea
        nuevaTarea.style.opacity = "0";
        listaTareas.appendChild(nuevaTarea);
        setTimeout(() => {
            nuevaTarea.style.opacity = "1";
        }, 10);
        
        // Limpia el campo de entrada y actualiza el contador
        entradaTarea.value = "";
        actualizarContador();
    }
}

// Evento: al hacer clic en el botón "Añadir", se agrega la tarea
botonTarea.addEventListener("click", agregarElemento);

// Evento: al presionar Enter dentro del input, también se agrega la tarea
entradaTarea.addEventListener("keypress", function(e) {
    if (e.key === "Enter") {
        agregarElemento();
    }
});

// Llama a la función para mostrar el contador al cargar la página
actualizarContador();

// Botón para cargar una tarea aleatoria desde una API externa usando AJAX
const botonCargarTarea = document.getElementById("cargarTarea");

botonCargarTarea.addEventListener("click", function () {
    fetch("https://jsonplaceholder.typicode.com/todos/")
        .then(response => response.json())
        .then(data => {
            // Selecciona una tarea aleatoria
            const tareaRandom = data[Math.floor(Math.random() * data.length)];
            entradaTarea.value = tareaRandom.title; // Inserta la tarea en el input
        })
        .catch(error => {
            console.error("Error al cargar la tarea:", error);
            alert("No se pudo cargar la tarea.");
        });
});
