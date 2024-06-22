// logica slider
let currentSlide = 0;
const slides = document.querySelectorAll('.slide');
const totalSlides = slides.length;

document.querySelector('.next').addEventListener('click', () => {
    changeSlide(currentSlide + 1);
});

document.querySelector('.prev').addEventListener('click', () => {
    changeSlide(currentSlide - 1);
});

function changeSlide(newSlide) {
    slides[currentSlide].classList.remove('active');
    
    setTimeout(() => {
        slides[currentSlide].style.display = 'none';
        currentSlide = (newSlide + totalSlides) % totalSlides;
        slides[currentSlide].style.display = 'block';
        setTimeout(() => {
            slides[currentSlide].classList.add('active');
        }, 20);
    }, 500); 
}


setInterval(() => {
    changeSlide(currentSlide + 1);
}, 5000);

slides[currentSlide].style.display = 'block';
setTimeout(() => {
    slides[currentSlide].classList.add('active');
}, 20);


