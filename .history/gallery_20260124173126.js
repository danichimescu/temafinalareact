
const images = [
    '1.jpg',
    '2.jpg',
    '3.jpg',
    '4.jpg',
    '5.jpg',
    '6.jpg',
    '7.jpg',
    '8.jpg',
    '9.jpg',
];

let currentIndex = 0;
const imageDisplay = document.getElementById('imageDisplay');
const imageCounter = document.getElementById('imageCounter');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const thumbnailStrip = document.getElementById('thumbnailStrip');

function displayImage(index) {
    currentIndex = index;
    const imagePath = `assets/gallery/${images[index]}`;

    imageDisplay.innerHTML = `<img src="${imagePath}" alt="Gallery image ${index + 1}">`;
    imageCounter.textContent = `Image ${index + 1} of ${images.length}`;

    prevBtn.disabled = index === 0;
    nextBtn.disabled = index === images.length - 1;

    updateThumbnails();
}

function createThumbnails() {
    thumbnailStrip.innerHTML = '';
    images.forEach((img, index) => {
        const thumb = document.createElement('div');
        thumb.className = 'thumbnail';
        thumb.innerHTML = `<img src="assets/gallery/${img}" alt="Thumbnail ${index + 1}">`;
        thumb.onclick = () => displayImage(index);
        thumbnailStrip.appendChild(thumb);
    });
}

function updateThumbnails() {
    const thumbs = thumbnailStrip.querySelectorAll('.thumbnail');
    thumbs.forEach((thumb, index) => {
        thumb.classList.toggle('active', index === currentIndex);
    });
}

function nextImage() {
    if (currentIndex < images.length - 1) {
        displayImage(currentIndex + 1);
    }
}

function prevImage() {
    if (currentIndex > 0) {
        displayImage(currentIndex - 1);
    }
}

prevBtn.addEventListener('click', prevImage);
nextBtn.addEventListener('click', nextImage);

document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') prevImage();
    if (e.key === 'ArrowRight') nextImage();
});

createThumbnails();
displayImage(0);