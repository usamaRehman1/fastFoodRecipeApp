const searchInput = document.querySelector("#searchInput");
const searchBtn = document.querySelector("#searchBtn");
const recipeList = document.querySelector("#recipeList");
const recipeContainer = document.querySelector("#recipeContainer");
const bookmarkBtn = document.querySelector("#bookmarkBtn");
const recipeTitle = document.querySelector("#recipeTitle");
const loder = document.querySelector("#loder")

const showPopup = (_title, _icon) => {
    Swal.fire({
        title: _title,
        icon: _icon,
        draggable: true
    });
}

const getRecipes = () => {
    fetch(`https://forkify-api.herokuapp.com/api/v2/recipes?search=pizza`)
        .then(data => data.json())
        .then(result => {
            console.log("result", result)
        }).catch(error => {
            console.log("Error =>", error)
        })
}

const ListDisplayHandler = (e) => {
    // console.log(e.id)
    fetch(`https://forkify-api.herokuapp.com/api/v2/recipes/${e.id}`)
        .then(data => data.json())
        .then(result => {
            recipeContainer.classList.remove("hidden")
            recipeTitle.classList.add("hidden")
            let { data: { recipe: { cooking_time, id, image_url, publisher, servings, source_url, title, ingredients } } } = result;
            recipeContainer.innerHTML = `
            <img id="recipeImage" src="${image_url}" class="w-full h-72 object-cover rounded-t-xl" />

            <div class="flex items-center justify-between mb-2">
                <h1 id="recipeTitle" class="text-3xl font-bold text-gray-800">${title}</h1>
                <button class="text-red-500 hover:text-red-600 transition text-2xl">❤️</button>
            </div>

            <div class="flex gap-6 text-gray-600 mb-6">
                <span class="flex items-center gap-1"> ⏱ <strong>${cooking_time}</strong> mins </span>
                <span class="flex items-center gap-1"> 🍽 <strong>${servings}</strong> servings</span>
           </div>

            <div class="p-6">
                <p id="recipePublisher" class="text-gray-500 mb-4">${publisher}</p>
                <h2 class="text-xl font-semibold mb-3">Ingredients</h2>
                <ul id="ingredientsList" class="grid grid-cols-1 md:grid-cols-2 gap-2 mb-6">
                    ${ingredients.map(ing => `
                        <li class="flex items-start gap-2 bg-gray-50 p-3 rounded-lg shadow-sm">
                            <span class="text-red-500 mt-1">✔</span>
                            <span class="text-gray-700">
                                ${ing.quantity ?? ""}
                                ${ing.unit ?? ""}
                                ${ing.description}
                            </span>
                        </li>`).join("")
                    }
                </ul>
                <a id="sourceLink" target="_blank" href="${source_url}"
                    class="inline-block bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg font-semibold transition">
                    View Full Recipe
                </a>
            </div>`
        }).catch(error => {
            console.log("Error =>", error)
        })
}

const updateUI = (response) => {
    const { data: { recipes } } = response;
    // console.log("response => ", recipes)
    loder.classList.add("hidden")

    recipes.forEach(recipe => {
        // console.log(recipe)
        let { id, image_url, publisher, title } = recipe;
        recipeList.innerHTML += `
        <li id=${id} class="flex items-center gap-3 p-2 hover:bg-gray-50 transition cursor-pointer" onclick="ListDisplayHandler(this)">
            <img src="${image_url}" alt="Pasta Salad" class="w-12 h-12 rounded-md object-cover flex-shrink-0" />
            <div class="flex-1 min-w-0">
                <h2 class="text-sm font-medium text-gray-800 truncate">${title}</h2>
                <p class="text-xs text-gray-400 truncate">${publisher}</p>
            </div>
        </li>`
    });
}

searchBtn.addEventListener("click", () => {
    if (searchInput.value && searchInput.value.toLowerCase().trim() != "") {
        console.log("click", searchInput.value.toLowerCase().trim())
        fetch(`https://forkify-api.herokuapp.com/api/v2/recipes?search=${searchInput.value.toLowerCase().trim()}`)
            .then(data => data.json())
            .then(result => {
                // console.log(result.data.recipes.length)
                recipeList.innerHTML = ""
                if (!result.data.recipes.length) {
                    showPopup("Oops! That doesn’t look right. Please check the spelling and try again.", "error")
                    return
                }
                loder.classList.remove("hidden")
                setTimeout(() => {
                    updateUI(result)
                }, 3000)
            }).catch(error => {
                // console.log("Error =>", error)
                showPopup("Your Input is Not present!", "error")
            })
    } else {
        showPopup("Please Enter Valid Input", "error")
    }
})