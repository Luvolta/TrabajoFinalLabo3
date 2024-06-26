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
const apiKey = "8639bc0338b347e4aee1a96a146247a8";
const apiUrl = `https://api.rawg.io/api/games?key=${apiKey}&page_size=40`;
const tagUrl = `https://api.rawg.io/api/tags?key=${apiKey}`;

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
        const response = await fetch(tagUrl);
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
    const selectTag = document.getElementById("tag-filter");

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

        // Verificar si el juego está disponible para PC
        const pcPlatform = gameDetail.platforms.find(platform => platform.platform.slug === 'pc');
        if (!pcPlatform) {
            throw new Error('El juego no tiene requisitos para la plataforma PC.');
        }

        // Obtener los requisitos de PC si están disponibles
        const { minimum, recommended } = pcPlatform.requirements || {};

        // Obtener las capturas de pantalla del juego
        const screenshotsUrl = `https://api.rawg.io/api/games/${gameId}/screenshots?key=${apiKey}`;
        const responseScr = await fetch(screenshotsUrl);

        if (!responseScr.ok) {
            throw new Error('La respuesta de red no fue satisfactoria.');
        }

        const gameScreenshots = await responseScr.json();
        const screenshots = gameScreenshots.results.map(screenshot => screenshot.image);

        
        // Abrir una nueva pestaña y establecer su contenido
        const newTab = window.open('', '_blank');
        if (newTab) {
            newTab.document.open();
            newTab.document.write(`
                <html>
                <head>
                    <title>${gameDetail.name}</title>
                    <link rel="icon" type="image/svg+xml" href="public/icon.png">
                    <link rel="stylesheet" href="detail.css">
                </head>
                <body>
                    <div class="game-detail">
                        

                        <h2>${gameDetail.name}</h2>
                        <img src="${gameDetail.background_image}" alt="${gameDetail.name}">
                        <div class="screenshots-container" id="screenshots-container"></div>
                        <p><strong>Descripción:</strong><br>${gameDetail.description}</p>
                        <p><strong>Géneros:</strong> ${gameDetail.genres.map(genre => genre.name).join(', ')}</p>
                        <p><strong>Plataformas:</strong> ${gameDetail.platforms.map(platform => platform.platform.name).join(', ')}</p>
                        <p><strong>Lanzamiento</strong>${gameDetail.released}</p>
                        <p><strong>Metacritic:</strong> ${gameDetail.metacritic}</p>
                        <div class="requisitos">
                            ${minimum ? `<strong>Requisitos Mínimos:</strong><br>${minimum}<br>` : ''}
                            ${recommended ? `<strong>Requisitos Recomendados:</strong><br>${recommended}<br>` : ''}
                        </div>
                    </div>

                </body>
                </html>
            `);

            // Agregar las capturas de pantalla al contenedor
            const screenshotsContainer = newTab.document.getElementById('screenshots-container');
            if (screenshotsContainer) {
                screenshots.forEach((screenshotUrl) => {
                    const imageEl = newTab.document.createElement('img');
                    imageEl.src = screenshotUrl;
                    imageEl.alt = gameDetail.name;
                    screenshotsContainer.appendChild(imageEl);
                });
            } else {
                console.error('No se encontró el contenedor de capturas de pantalla en la nueva pestaña.');
            }
            
            
            newTab.document.close();
        } else {
            throw new Error('No se pudo abrir la nueva pestaña.');
        }
    } catch (error) {
        console.error('Error al obtener detalles del juego:', error);
        alert('Error al obtener detalles del juego. Por favor, inténtalo de nuevo más tarde.');
    }
}
// Evento al cargar el DOM para obtener juegos y tags
document.addEventListener("DOMContentLoaded",async () => {
    getGames();
});
