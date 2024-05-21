async function fetchAndDisplayCards() {
  const response = await fetch("https://hp-api.lainocs.fr/characters");
  const data = await response.json();

  const collectionContainer = document.querySelector(".cards"); // Obtenir le conteneur de la collection

  // Itérer sur chaque personnage/carte
  data.forEach((character) => {
    // Créer un élément de carte
    const card = document.createElement("div");
    card.classList.add("card");
    card.setAttribute(
      "data-house",
      character.house ? character.house.toLowerCase() : "unknown"
    ); // Définir l'attribut data-house

    // Créer un lien pour envelopper le contenu de la carte
    const cardLink = document.createElement("a");
    cardLink.classList.add("card-link");
    cardLink.href = `card-detail.html?id=${character.slug}`; // Redirection vers la page de détail avec l'ID du personnage
    card.appendChild(cardLink);

    // Créer un élément d'image pour le personnage
    const image = document.createElement("img");
    image.src = character.image;
    image.alt = character.name;
    cardLink.appendChild(image);

    // Créer un élément de paragraphe pour le nom du personnage
    const name = document.createElement("p");
    name.textContent = character.name;
    cardLink.appendChild(name);

    // Créer le bouton favori
    const favoriteButton = document.createElement("button");
    favoriteButton.classList.add("favorite-btn");
    favoriteButton.textContent = "⭐";
    card.appendChild(favoriteButton);

    // Ajouter la carte au conteneur de la collection
    collectionContainer.appendChild(card);
  });

  // Configurer les filtres et la recherche
  setupFiltersAndSearch();
}

fetchAndDisplayCards();

// Fonction pour configurer les filtres et la recherche
function setupFiltersAndSearch() {
  // Filtre
  const filterButtons = document.querySelectorAll(".filter button");
  const cards = document.querySelectorAll(".card");

  // Écouter les clics sur les boutons de filtre
  filterButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      const house = button.getAttribute("data-house");
      filterCards(house);
    });
  });

  // Fonction pour filtrer les cartes selon la maison
  function filterCards(house) {
    cards.forEach(function (card) {
      const cardHouse = card.getAttribute("data-house");
      const favoriteButton = card.querySelector(".favorite-btn");
      const isFavorite =
        favoriteButton && favoriteButton.classList.contains("active");

      if (house === "all") {
        card.style.display = "block";
      } else if (house === "fav") {
        if (isFavorite) {
          card.style.display = "block";
        } else {
          card.style.display = "none";
        }
      } else if (house === "other") {
        if (cardHouse === "unknown") {
          card.style.display = "block";
        } else {
          card.style.display = "none";
        }
      } else {
        if (cardHouse === house) {
          card.style.display = "block";
        } else {
          card.style.display = "none";
        }
      }
    });
  }

  // Bouton Fav
  const favoriteButtons = document.querySelectorAll(".favorite-btn");

  // Écouter les clics sur les boutons Favoris
  favoriteButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      if (button.classList.contains("active")) {
        button.classList.remove("active");
        button.style.backgroundColor = "";
      } else {
        button.classList.add("active");
        button.style.backgroundColor = "steelblue";
      }
    });
  });

  // Recherche
  const searchInput = document.getElementById("search-input");

  // Écouter les saisies dans la barre de recherche
  searchInput.addEventListener("input", function () {
    const query = searchInput.value.trim().toLowerCase();

    cards.forEach(function (card) {
      const cardName = card.querySelector("p").textContent.toLowerCase();
      if (cardName.includes(query)) {
        card.style.display = "block";
      } else {
        card.style.display = "none";
      }
    });
  });
}


