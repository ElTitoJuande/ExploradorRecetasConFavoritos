const categoriasUrl = "https://www.themealdb.com/api/json/v1/1/categories.php";
// Cargar las categorías en el select
function cargarCategorias() {
    fetch(categoriasUrl)
        .then(res => res.json())
        .then(data => {
            console.log(data);

            data.categories.forEach(categoria => {
                selectorCategorias.innerHTML += `
                    <option value="${categoria.strCategory}">${categoria.strCategory}</option>
                `;
            });
        })
        .catch(err => console.error("Error al cargar las categorías:", err));
}
// Inicializar la carga de categorías
cargarCategorias();
