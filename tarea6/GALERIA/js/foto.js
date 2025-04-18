function createImage(src) {
    const image = document.createElement('img');
    image.src = src;
    return image;
}

function onThumbnailClick(event) {
    currentIndex = parseInt(event.currentTarget.dataset.index);
    const image = createImage(event.currentTarget.src);
    modalView.appendChild(image);

    document.body.classList.add('no-scroll');
    modalView.classList.remove('hidden');

    document.addEventListener('keydown', nextPhoto);
}

function onModalClick() {
    hideModal();
}

function hideModal() {
    document.body.classList.remove('no-scroll');
    modalView.classList.add('hidden');
    modalView.innerHTML = '';
    document.removeEventListener('keydown', nextPhoto);
}

function nextPhoto(event) {
    if (event.key === 'Escape') {
        hideModal();
        return;
    }

    if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') {
        return;
    }

    let nextIndex = currentIndex;
    if (event.key === 'ArrowLeft') {
        nextIndex--;
    } else if (event.key === 'ArrowRight') {
        nextIndex++;
    }

    if (nextIndex < 0 || nextIndex >= PHOTO_LIST.length) {
        return;
    }

    const photoSrc = PHOTO_LIST[nextIndex];
    modalView.innerHTML = '';
    const image = createImage(photoSrc);
    modalView.appendChild(image);
    currentIndex = nextIndex;
}

// Variables globales
let currentIndex = null;
const albumView = document.querySelector('#album-view');
const modalView = document.querySelector('#modal-view');

// Generar miniaturas
for (let i = 0; i < PHOTO_LIST.length; i++) {
    const photoSrc = PHOTO_LIST[i];
    const image = createImage(photoSrc);
    image.dataset.index = i;
    image.addEventListener('click', onThumbnailClick);
    albumView.appendChild(image);
}

// Cerrar modal al hacer clic fuera de la imagen
modalView.addEventListener('click', onModalClick);
