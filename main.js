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
  
  

  // Función para abrir detalles del juego en una nueva pestaña
  async function openGameDetails(gameId) {
    try {
        const detailUrl = `https://api.rawg.io/api/games/${gameId}?key=${apiKey}`;
        const response = await fetch(detailUrl);
        if (!response.ok) {
            throw new Error('Network response was not ok.');
        }
        const gameDetail = await response.json();

        const newTab = window.open('', '_blank');
        if (newTab) {
            newTab.document.write(`
                <html>
                <head>
                    <title>${gameDetail.name}</title>
                    <style>
                        body { font-family: Arial, sans-serif; }
                        .game-detail { max-width: 600px; margin: 20px auto; padding: 10px; border: 1px solid #ccc; border-radius: 5px; }
                        .game-detail img { max-width: 100%; height: auto; display: block; margin: 10px auto; }
                        .game-detail h2 { text-align: center; }
                        .game-detail p { margin-bottom: 10px; }
                    </style>
                </head>
                <body>
                    <div class="game-detail">
                        <h2>${gameDetail.name}</h2>
                        <img src="${gameDetail.background_image}" alt="${gameDetail.name}">
                        <p><strong>Rating:</strong> ${gameDetail.rating}</p>
                        <p><strong>Released:</strong> ${gameDetail.released}</p>
                        <p><strong>Description:</strong> ${gameDetail.description_raw}</p>
                    </div>
                </body>
                </html>
            `);
        } else {
            throw new Error('Failed to open new tab.');
        }
    } catch (error) {
        console.error('Error fetching game details:', error);
        alert('Error fetching game details. Please try again later.');
    }
}
