// Variables globales para el slider
let currentSlide = 0;
const slides = document.querySelectorAll('.slide');
const totalSlides = slides.length;

// Lógica del slider
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




// Función para obtener juegos desde la API de Rawg
const apiKey = "c917c32c98164da594fa9b1655e69d07";
const apiUrl = `https://api.rawg.io/api/games?key=${apiKey}`;

async function getGames() {
    try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error('La respuesta de red no fue satisfactoria.');
        }
        const data = await response.json();
        const games = data.results;
        const tags = await getTags(); // Obtener los tags disponibles
        displayGames(games, tags);
    } catch (error) {
        console.error('Error al obtener juegos:', error);
    }
}

async function getTags() {
    try {
        const response = await fetch(`https://api.rawg.io/api/tags?key=${apiKey}`);
        if (!response.ok) {
            throw new Error('La respuesta de red no fue satisfactoria.');
        }
        const data = await response.json();
        return data.results;
    } catch (error) {
        console.error('Error al obtener etiquetas:', error);
        return []; // Retorna un arreglo vacío en caso de error
    }
}

// Función para mostrar juegos y filtrar por categorías (tags)
function displayGames(games, tags) {
    const gameContainer = document.getElementById("game-container");
    const selectTag = document.createElement("select");
    selectTag.id = "tag-filter";

    // Opción por defecto para mostrar todos los juegos
    const defaultOption = document.createElement("option");
    defaultOption.value = "";
    defaultOption.textContent = "Todos los juegos";
    selectTag.appendChild(defaultOption);

    // Crear opciones para cada tag disponible
    tags.forEach((tag) => {
        const option = document.createElement("option");
        option.value = tag.id;
        option.textContent = tag.name;
        selectTag.appendChild(option);
    });

    // Agregar evento de cambio para filtrar los juegos
    selectTag.addEventListener("change", () => {
        const selectedTagId = selectTag.value;
        const filteredGames = games.filter((game) => {
            if (selectedTagId === "") {
                return true; // Mostrar todos los juegos si no se selecciona ningún tag
            } else {
                return game.tags && game.tags.find((tag) => tag.id.toString() === selectedTagId);
            }
        });
        renderFilteredGames(filteredGames);
    });

    gameContainer.appendChild(selectTag);

    // Mostrar todos los juegos inicialmente
    renderFilteredGames(games);
}

// Función para renderizar juegos filtrados
function renderFilteredGames(filteredGames) {
    const gameContainer = document.getElementById("game-container");
    gameContainer.innerHTML = "";

    filteredGames.forEach((game) => {
        const gameCard = document.createElement("div");
        gameCard.classList.add('game-card'); // Clase para estilizar el contenedor del juego
        gameCard.addEventListener("click", () => {
            openGameDetails(game.id);
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
            throw new Error('La respuesta de red no fue satisfactoria.');
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
                        <p><strong>Lanzamiento:</strong> ${gameDetail.released}</p>
                        <p><strong>Descripción:</strong> ${gameDetail.description_raw}</p>
                    </div>
                </body>
                </html>
            `);
        } else {
            throw new Error('No se pudo abrir la nueva pestaña.');
        }
    } catch (error) {
        console.error('Error al obtener detalles del juego:', error);
        alert('Error al obtener detalles del juego. Por favor, inténtalo de nuevo más tarde.');
    }
}

// Evento al cargar el DOM para obtener juegos y tags
document.addEventListener("DOMContentLoaded", () => {
    getGames();
});
