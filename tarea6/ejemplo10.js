document.querySelectorAll('li.plan').forEach(elem => {
    elem.addEventListener('click', e => {
        let seleccionado = document.getElementById("mispan");
        seleccionado.textContent = e.target.dataset.plan + "" +e.target.dataset.id;
    });
});