///// SIDE NAV //////
// Fonction pour ouvrir la barre latérale
function openNav() {
  document.getElementById("mySidebar").style.width = "250px";
}

// Fonction pour fermer la barre latérale
function closeNav() {
  document.getElementById("mySidebar").style.width = "0";
}

document.addEventListener("DOMContentLoaded", function () {
  const topbarBtn = document.querySelector(".floating-btn");
  const modal = document.querySelector(".modal");

  // Fonction pour ouvrir la modale
  function openModal() {
    modal.style.display = "block";
  }

  // Fonction pour fermer la modale
  function closeModal() {
    modal.style.display = "none";
  }

  // Ouvrir la modale lors du clic sur le bouton flottant
  topbarBtn.addEventListener("click", openModal);

  // Fermer la modale lors du clic sur le bouton de fermeture
  const closeModalBtn = document.querySelector(".close");
  closeModalBtn.addEventListener("click", closeModal);

  // Fermer la modale lors du clic en dehors de celle-ci
  window.addEventListener("click", function (event) {
    if (event.target == modal) {
      closeModal();
    }
  });

  // Ouvrir la modale lors du clic sur le lien "trade" dans l'en-tête
  const tradeLink = document.querySelector("#trade-link");
  tradeLink.addEventListener("click", openModal);
});


document.addEventListener("DOMContentLoaded", function () {
  adjustNavForUserStatus();
});

function adjustNavForUserStatus() {
  const token = localStorage.getItem("token");
  const loginLink = document.querySelector("a[href='login.html']"); 

  if (token) {
    loginLink.textContent = "Profile";
    loginLink.href = "profile.html";

    const logoutLink = document.createElement("a");
    logoutLink.href = "#";
    logoutLink.textContent = "Logout";
    logoutLink.onclick = function () {
      localStorage.removeItem("token");
      window.location.href = "index.html"; 
    };
    const sidebar = document.getElementById("mySidebar");
    sidebar.appendChild(logoutLink);
  } else {
    loginLink.textContent = "Login";
    loginLink.href = "login.html";
  }
}
