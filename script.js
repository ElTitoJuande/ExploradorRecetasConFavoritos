const selectorCategorias = document.querySelector("#nombre");
const listaRecetas = document.querySelector("#listaRecetas");
const recetasUrl = "https://www.themealdb.com/api/json/v1/1/filter.php?c=";

// Mostrar recetas de una categoría seleccionada
function mostrarRecetasDeLaCategoria(categoria) {
    fetch(`${recetasUrl}${categoria}`)
        .then(res => res.json())
        .then(data => {
            listaRecetas.innerHTML = ""; // Limpiar las recetas anteriores
            data.meals.forEach(meal => {
                listaRecetas.innerHTML += `
                    <div class="col-md-4">
                        <div class="card text-white bg-secondary mb-3">
                            <div class="card-header">
                                <img src="${meal.strMealThumb}" class="img-fluid">
                            </div>
                            <div class="card-body">
                                <h4 class="card-title">${meal.strMeal}</h4>
                                <a href="#" onclick="mostrarDetalles('${meal.idMeal}')" class="btn btn-danger my-3">Más detalles</a>
                            </div>
                        </div>
                    </div>
                `;
            });
        })
        .catch(err => console.error("Error al mostrar las recetas:", err));
}

// Función para generar la lista de ingredientes
function generarListaIngredientes(meal) {
    let ingredientes = "";

    // Iterar sobre las propiedades strIngredient y strMeasure
    for (let i = 1; i <= 20; i++) {
        const ingrediente = meal[`strIngredient${i}`];
        const medida = meal[`strMeasure${i}`];

        if (ingrediente && ingrediente.trim()) {
            ingredientes += `<li>${ingrediente} - ${medida}</li>`;
        }
    }
    return ingredientes;
}
// Cargar favoritos desde localStorage al iniciar
let favoritos = JSON.parse(localStorage.getItem("favoritos")) || [];

function mostrarDetalles(idMeal) {
    const url = `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${idMeal}`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            const meal = data.meals[0];

            // Seleccionar elementos del modal
            const modalTitulo = document.getElementById("exampleModalLabel");
            const modalCuerpo = document.querySelector(".modal-body");
            const btnFavoritos = document.getElementById("btn-favoritos");

            // Actualizar título del modal
            modalTitulo.textContent = meal.strMeal;

            // Actualizar cuerpo del modal
            modalCuerpo.innerHTML = `
                <div class="text-center mb-3">
                    <img src="${meal.strMealThumb}" alt="${meal.strMeal}" class="img-fluid rounded">
                </div>
                <p>${meal.strInstructions}</p>
                <h4>Ingredientes:</h4>
                <ul>
                    ${generarListaIngredientes(meal)}
                </ul>
            `;

            // Verificar si la receta ya está en favoritos
            const esFavorito = favoritos.includes(idMeal);

            // Actualizar texto y funcionalidad del botón de favoritos
            btnFavoritos.textContent = esFavorito ? "Eliminar de favoritos" : "Añadir a favoritos";
            btnFavoritos.onclick = () => {
                if (!esFavorito) {
                    // Añadir a favoritos
                    favoritos.push(idMeal);
                    guardarFavoritos();
                    alert("Receta añadida a favoritos.");
                    btnFavoritos.textContent = "Eliminar de favoritos";
                } else {
                    // Eliminar de favoritos
                    favoritos = favoritos.filter(id => id !== idMeal);
                    guardarFavoritos();
                    alert("Receta eliminada de favoritos.");
                    btnFavoritos.textContent = "Añadir a favoritos";
                }
            };

            // Mostrar el modal
            const modal = new bootstrap.Modal(document.getElementById("exampleModal"));
            modal.show();
        })
        .catch(err => console.error("Error al cargar los detalles:", err));
}

// Función para guardar favoritos en localStorage
function guardarFavoritos() {
    localStorage.setItem("favoritos", JSON.stringify(favoritos));
}
// Función para cargar recetas favoritas
function cargarRecetasFavoritas() {
    const recetasFavoritas = document.getElementById('recetasFavoritas');

    // Verificar si estamos en la página de favoritos
    if (recetasFavoritas) {
        // Limpiar contenido previo
        recetasFavoritas.innerHTML = '';

        // Si no hay favoritos
        if (favoritos.length === 0) {
            recetasFavoritas.innerHTML = `
                <div class="col-12 text-center text-white">
                    <p>No tienes recetas favoritas aún</p>
                </div>
            `;
            return;
        }

        // Cargar detalles de cada receta favorita
        favoritos.forEach(idMeal => {
            fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${idMeal}`)
                .then(response => response.json())
                .then(data => {
                    const meal = data.meals[0];
                    recetasFavoritas.innerHTML += `
                        <div class="col-md-4">
                            <div class="card text-white bg-secondary mb-3">
                                <div class="card-header">
                                    <img src="${meal.strMealThumb}" class="img-fluid">
                                </div>
                                <div class="card-body">
                                    <h4 class="card-title">${meal.strMeal}</h4>
                                    <a href="#" onclick="mostrarDetalles('${meal.idMeal}')" class="btn btn-danger my-3">Más detalles</a>
                                </div>
                            </div>
                        </div>
                    `;
                })
                .catch(err => console.error("Error al cargar receta favorita:", err));
        });
    }
}

// Modificar la función de guardar favoritos para cargar favoritos
function guardarFavoritos() {
    localStorage.setItem("favoritos", JSON.stringify(favoritos));

    // Si estamos en la página de favoritos, recargar las recetas
    if (window.location.pathname.includes('favoritos.html')) {
        cargarRecetasFavoritas();
    }
}