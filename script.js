const recipes = [
    { 
        name: "Spaghetti Carbonara", 
        ingredients: ["spaghetti", "eggs", "bacon", "parmesan cheese"],
        image: "carbornara.jpg",
        diet: [],
        cuisine: "italian",
        cookingTime: 30
    },
    {
        name: "Vegetarian Chili",
        ingredients: ["beans", "tomatoes", "onions", "bell peppers", "chili powder", "cumin"],
        image: "veggie-chili.jpg",
        diet: ["vegetarian", "vegan"],
        cuisine: "mexican",
        cookingTime: 45
    },
    {
        name: "Chicken Tikka Masala",
        ingredients: ["chicken", "yogurt", "tomato sauce", "cream", "garam masala", "rice"],
        image: "chicken-tikka-masala.jpg",
        diet: ["gluten-free"],
        cuisine: "indian",
        cookingTime: 60
    },
    {
        name: "Mushroom Risotto",
        ingredients: ["arborio rice", "mushrooms", "onion", "white wine", "parmesan cheese", "butter"],
        image: "mushroom-risotto.jpg",
        diet: ["vegetarian"],
        cuisine: "italian",
        cookingTime: 40
    },
    {
        name: "Fish Tacos",
        ingredients: ["white fish", "tortillas", "cabbage slaw", "avocado", "lime", "cilantro"],
        image: "fish-tacos.jpg",
        diet: [],
        cuisine: "mexican",
        cookingTime: 30
    }
];

const users = [
    {username: "user1", password: "password1"},
    {username: "user2", password: "password2"}
];

let currentUser = null;

function showLoginModal() {
    document.getElementById('loginModal').classList.remove('hidden');
}

function hideLoginModal() {
    document.getElementById('loginModal').classList.add('hidden');
}

function login() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    const user = users.find(u => u.username === username && u.password === password);

    if (user) {
        currentUser = user;
        hideLoginModal();
        updateLoginStatus();
    } else {
        alert('Invalid username or password');
    }
}

function logout() {
    currentUser = null;
    updateLoginStatus();
}

function updateLoginStatus() {
    const loginToggle = document.getElementById('loginToggle');
    if (currentUser) {
        loginToggle.textContent = `Logout (${currentUser.username})`;
        loginToggle.onclick = logout;
    } else {
        loginToggle.textContent = 'Login';
        loginToggle.onclick = showLoginModal;
    }
}

function setTheme(isDark) {
    if (isDark) {
        document.documentElement.classList.add('dark');
    } else {
        document.documentElement.classList.remove('dark');
    }
}

function toggleTheme() {
    document.documentElement.classList.toggle('dark');
    const isDark = document.documentElement.classList.contains('dark');
    localStorage.setItem('darkMode', isDark);
}

function advancedSearch() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const dietFilter = document.getElementById('dietFilter').value;
    const cuisineFilter = document.getElementById('cuisineFilter').value;
    const maxTime = document.getElementById('maxTime').value;

    const filteredRecipes = recipes.filter(recipe => {
        const matchesSearch = recipe.name.toLowerCase().includes(searchTerm) || 
                              recipe.ingredients.some(ing => ing.toLowerCase().includes(searchTerm));
        const matchesDiet = !dietFilter || recipe.diet.includes(dietFilter);
        const matchesCuisine = !cuisineFilter || recipe.cuisine === cuisineFilter;
        const matchesTime = !maxTime || recipe.cookingTime <= parseInt(maxTime);

        return matchesSearch && matchesDiet && matchesCuisine && matchesTime;
    });

    displayRecipes(filteredRecipes);
}

function displayRecipes(recipes) {
    const recipeList = document.getElementById('recipeList');
    recipeList.innerHTML = '';
    recipes.forEach((recipe, index) => {
        const recipeElement = document.createElement('div');
        recipeElement.classList.add('recipe-card', 'bg-white', 'dark:bg-gray-800', 'rounded-lg', 'overflow-hidden', 'shadow-lg', 'animate__animated', 'animate__fadeIn');
        recipeElement.style.animationDelay = `${index * 0.1}s`;
        recipeElement.innerHTML = `
            <div class="recipe-image" style="background-image: url('${recipe.image}')"></div>
            <div class="p-4">
                <h2 class="text-xl font-semibold mb-2 text-gray-800 dark:text-gray-100">${recipe.name}</h2>
                <p class="text-gray-600 dark:text-gray-300">Cuisine: ${recipe.cuisine}</p>
                <p class="text-gray-600 dark:text-gray-300">Cooking Time: ${recipe.cookingTime} mins</p>
                <p class="text-gray-600 dark:text-gray-300">Diet: ${recipe.diet.join(', ') || 'None'}</p>
                <p class="text-gray-600 dark:text-gray-300">Ingredients: ${recipe.ingredients.join(', ')}</p>
            </div>
        `;
        recipeList.appendChild(recipeElement);
    });

    anime({
        targets: '.recipe-card',
        translateY: [50, 0],
        opacity: [0, 1],
        duration: 1000,
        delay: anime.stagger(100),
        easing: 'easeOutElastic(1, .8)'
    });
}

document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.getElementById('searchInput');
    const searchButton = document.getElementById('searchButton');
    const themeToggle = document.getElementById('themeToggle');
    const loginButton = document.getElementById('loginButton');

    // Create and add login toggle button
    const loginToggle = document.createElement('button');
    loginToggle.id = 'loginToggle';
    loginToggle.classList.add('px-4', 'py-2', 'rounded-lg', 'bg-blue-500', 'text-white', 'ml-2');
    loginToggle.textContent = 'Login';
    themeToggle.parentNode.insertBefore(loginToggle, themeToggle.nextSibling);

    searchButton.addEventListener('click', advancedSearch);
    searchInput.addEventListener('keyup', function(event) {
        if (event.key === 'Enter') {
            advancedSearch();
        }
    });

    themeToggle.addEventListener('click', toggleTheme);

    // Set initial theme
    const savedDarkMode = localStorage.getItem('darkMode');
    if (savedDarkMode === 'true') {
        setTheme(true);
    }

    // Initial display of all recipes
    displayRecipes(recipes);

    // Connect login button to showLoginModal function
    loginToggle.addEventListener('click', showLoginModal);
    loginButton.addEventListener('click', login);

    // Close the modal if clicking outside of it
    window.onclick = function(event) {
        const modal = document.getElementById('loginModal');
        if (event.target == modal) {
            hideLoginModal();
        }
    }

    updateLoginStatus();
});