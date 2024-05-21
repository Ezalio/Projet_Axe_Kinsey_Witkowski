async function fetchUser() {
    const token = localStorage.getItem("token");
    if (!token) {
        window.location.href = "login.html";
        return;
    }

    try {
        const response = await fetch("http://127.0.0.1:3000/getMyProfile", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch profile: status ${response.status}`);
        }

        const data = await response.json();
        console.log("Received Data:", data);

        document.getElementById("username").textContent = data.user.username;
        document.getElementById("email").textContent = data.user.email;

        const cardsContainer = document.getElementById("cards-container");
        cardsContainer.innerHTML = ""; 

        if (data.user.cards.length > 0) {
            for (const card of data.user.cards) {
                const cardDetails = await fetchCardDetails(card.cardId);
                if (cardDetails) {
                    const cardElement = createCardElement(cardDetails, card.quantity, card.favorite, card.id);
                    cardsContainer.appendChild(cardElement);
                } else {
                    console.error('Card details not found for cardId:', card.cardId);
                }
            }
        } else {
            cardsContainer.textContent = "No cards available for this user.";
        }
    } catch (error) {
        console.error("Error fetching user profile:", error);
    }
}

async function fetchCardDetails(cardId) {
    try {
        const response = await fetch(`https://hp-api.lainocs.fr/characters`);
        const data = await response.json();
        const cardDetails = data.find(character => character.id === cardId);
        return cardDetails;
    } catch (error) {
        console.error('Failed to fetch card details:', error);
        return null;
    }
}

function createCardElement(cardDetails, quantity, favorite, userCardId) {
    if (!cardDetails) {
        throw new Error('Card details are required to create a card element.');
    }

    const cardElement = document.createElement("div");
    cardElement.classList.add("card");

    const cardLink = document.createElement("a");
    cardLink.classList.add("card-link");
    cardLink.href = `card-detail.html?id=${cardDetails.slug}`;
    cardElement.appendChild(cardLink);

    const image = document.createElement("img");
    image.src = cardDetails.image;
    image.alt = cardDetails.name;
    cardLink.appendChild(image);

    const name = document.createElement("p");
    name.textContent = cardDetails.name;
    cardLink.appendChild(name);

    const quantityElement = document.createElement("p");
    quantityElement.textContent = `Quantity: ${quantity}`;
    cardElement.appendChild(quantityElement);

    //const favoriteButton = document.createElement("button");
    //favoriteButton.classList.add("favorite-btn");
    //favoriteButton.textContent = favorite ? "⭐" : "☆";
    //favoriteButton.onclick = () => toggleFavorite(userCardId, !favorite, favoriteButton);
    //cardElement.appendChild(favoriteButton);

    if (cardDetails.house) {
        cardElement.classList.add(cardDetails.house.toLowerCase());
    }

    return cardElement;
}

async function toggleFavorite(cardId, favorite, button) {
    const token = localStorage.getItem("token");

    try {
        const response = await fetch("http://127.0.0.1:3000/toggleFavorite", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            },
            body: JSON.stringify({ cardId, favorite }),
        });

        if (response.ok) {
            button.textContent = favorite ? "⭐" : "☆";
        } else {
            console.error('Failed to update favorite status');
        }
    } catch (error) {
        console.error("Error toggling favorite status:", error);
    }
}

fetchUser();

// Logs out
function logout() {
    console.log("Logging out user.");
    localStorage.removeItem("token");
    window.location.href = "login.html";
}

