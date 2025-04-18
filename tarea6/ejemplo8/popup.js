window.onload = () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (activeTab) => {
        const tabld = activeTab[0].id;
        mostrarGato();
    });
};


const mostrarGato = () => {
    document.getElementById(
        "cat_image"
    ).src = 'https://cataas.com/cat/gif/says/Hola?type=small';
};