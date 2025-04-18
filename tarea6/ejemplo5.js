function abrirRegalo(event){
    const image = event.currentTarget;
    image.src = 'giphy.gif';

    const mensaje = document.querySelector('h1');
    mensaje.innerText = 'Tu pastelito!';

    
    image.removeEventListener('click', abrirRegalo);


}

const image = document.querySelector('img');
image.addEventListener('click', abrirRegalo);