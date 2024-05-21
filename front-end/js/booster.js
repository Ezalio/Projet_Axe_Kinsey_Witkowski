async function openBooster() {
    try {
      const response = await fetch("http://127.0.0.1:3000/openBooster", {
        method: "POST",
        headers: {
          'Authorization': 'Bearer ' + localStorage.getItem('token'), 
          'Content-Type': 'application/json'
        }
      });
  
      if (!response.ok) {
        if (response.status === 429) {
          const data = await response.json();
          const nextAvailable = new Date(data.nextAvailable);
          alert(`You can only open a booster once every 24 hours. Next booster available at ${nextAvailable.toLocaleTimeString()}`);
        } else {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
      } else {
        const result = await response.json();
        alert(`Booster opened successfully! You received: ${result.cards.join(', ')}`);
      }
    } catch (error) {
      console.error('Error opening booster:', error);
      alert('Failed to open booster: ' + error.message);
    }
  }
  
  document.getElementById("openBoosterButton").addEventListener("click", openBooster);
  

function showBoosterResults(cards) {
    const modal = document.getElementById('boosterModal');
    const cardsList = document.getElementById('boosterCardsList');
    cardsList.innerHTML = ''; 
    
    cards.forEach(card => {
        cardsList.innerHTML += `<li>${card.name}</li>`; 
    });

    modal.style.display = 'block'; 
}

document.querySelector('.modal-close').addEventListener('click', function() {
    document.getElementById('boosterModal').style.display = 'none';
});



