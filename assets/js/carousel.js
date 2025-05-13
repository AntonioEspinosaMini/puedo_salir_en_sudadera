// ********** Codigo para carrusel *********
export function initCarousel() {
    const images = ["sudadera_roj.png", "sudadera_ver.png", "sudadera_ama.png"];
    const imageElement = document.getElementById("sweatshirtImage");

    let currentIndex = 0;

    // Cargar imagen guardada si existe
    const saved = localStorage.getItem("sweatshirtImage");
    if (saved && images.includes(saved)) {
        currentIndex = images.indexOf(saved);
        imageElement.src = `assets/img/${saved}`;
    }

    const updateImage = () => {
        const filename = images[currentIndex];
        imageElement.src = `assets/img/${filename}`;
        localStorage.setItem("sweatshirtImage", filename);
    };

    updateImage();
    imageElement.classList.remove("hidden");

    // Swipe handling
    let startX = 0;

    imageElement.addEventListener("touchstart", (e) => {
        startX = e.touches[0].clientX;
    });

    imageElement.addEventListener("touchend", (e) => {
        const endX = e.changedTouches[0].clientX;
        const diff = endX - startX;

        // Swipe izquierdo o derecho
        if (Math.abs(diff) > 30) {
            if (diff < 0) {
                // Siguiente
                currentIndex = (currentIndex + 1) % images.length;
            } else {
                // Anterior
                currentIndex = (currentIndex - 1 + images.length) % images.length;
            }
            updateImage();
        }
    });
}