const categoriasUrl = "https://www.themealdb.com/api/json/v1/1/categories.php";

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
// Cargar favoritos al inicio de la página
document.addEventListener('DOMContentLoaded', () => {
    // Cargar favoritos desde localStorage
    favoritos = JSON.parse(localStorage.getItem("favoritos")) || [];

    // Cargar recetas favoritas si estamos en la página de favoritos
    cargarRecetasFavoritas();
});