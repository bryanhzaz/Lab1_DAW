function abrirRegalo(event){
    const image = event.currentTarget;
    image.removeEventListener('click', abrirRegalo);

    const regaloCerrado = document.querySelector('#regalo-cerrado');
    const regaloAbierto = document.querySelector('#regalo-abierto');
    regaloCerrado.classList.add('oculto');
    regaloAbierto.classList.remove('oculto');
}


const image = document.querySelector('#regalo-cerrado img');
image.addEventListener('click', abrirRegalo);