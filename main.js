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

document.querySelector('.menu-icon').addEventListener('click', function() {
    document.querySelector('.menu').classList.add('active');
});

document.querySelector('.menu-icon').addEventListener('click', function() {
    document.querySelector('body').classList.add('bloqueo');
});

document.querySelector('.closeMenu-icon').addEventListener('click', function() {
    document.querySelector('.menu').classList.remove('active');
});


//API
const apiKey = "c917c32c98164da594fa9b1655e69d07";
const apiUrl = `https://api.rawg.io/api/games?key=${apiKey}`;

// Detail  https://api.rawg.io/api/games/{id}

async function getGames() {
  const response = await fetch(apiUrl);
  const data = await response.json();
  displayGames(data.results);
}

function displayGames(games) {
  const gameContainer = document.getElementById("game-container");
  games.forEach((game) => {
    const gameCard = document.createElement("div");

    gameCard.innerHTML = `<img src="${game.background_image}" alt="${game.name}"> <h3>${game.name}</h3>`;

    gameContainer.appendChild(gameCard);
    console.log(game);
  });
}

document.addEventListener("DOMContentLoaded", getGames);

function displayGames(games) {
    const gameContainer = document.getElementById("game-container");
    games.forEach((game) => {
      const gameCard = document.createElement("div");
      const gameId = game.id; // Obtener el ID del juego
  
      // Agregar un evento de clic para abrir el detalle del juego
      gameCard.addEventListener("click", () => {
        openGameDetails(gameId);
      });
  
      gameCard.innerHTML = `
        <img src="${game.background_image}" alt="${game.name}">
        <h3>${game.name}</h3>
      `;
  
      gameContainer.appendChild(gameCard);
    });
  }
  
  function openGameDetails(gameId) {
    const detailUrl = `https://api.rawg.io/api/games/${gameId}?key=${apiKey}`;
  
    // Abrir una nueva pestaña con la URL del detalle del juego
    window.open(detailUrl, "_blank");
  }