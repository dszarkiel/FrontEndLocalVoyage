//////////// INITIALIZE //////////// 
fetchAllUsers();
fetchAllDestinations();

//////////// ALL GLOBAL VARIABLES //////////// 
let allUsers;
let currentUser;
let allDestinations;
const signIn = document.querySelector("li#sign-in")
const signUp = document.querySelector("li#sign-up")
const welcomeScreen = document.querySelector("div#welcome-screen")
const signInForm = document.querySelector("form.sign-in-form")
const signUPForm = document.querySelector("form.sign-up-form")
const signInDiv = document.querySelector(".sign-in-card")
const signUpDiv = document.querySelector(".sign-up-card")
const logInUL = document.querySelector("ul.nav")
const userUL = document.querySelector("ul.user-nav")
const userDashboard = document.querySelector(".dashboard")
const newDestForm = document.querySelector(".new-destination-form")
const cardDiv = document.querySelector(".destination-card")
cardDiv.style.display = "none"
//////////// FETCH ALL USERS IN DB //////////// 
function fetchAllUsers(){
    fetch("http://localhost:3000/users")
    .then(resp => resp.json())
    .then(usersObj => {
        allUsers = usersObj
    })
}
//////////// FETCH ALL DESTINATIONS IN DB //////////// 
function fetchAllDestinations() {
    fetch("http://localhost:3000/destinations")
    .then(resp => resp.json())
    .then(destObj => {
        allDestinations = destObj
    })
} 


//////////// SIGN IN LOGIC //////////// 
signIn.addEventListener("click", () => {
    showSignInDiv()
})

function showSignInDiv() {
    welcomeScreen.style.display = "none"
    signInDiv.hidden = false
    signUpDiv.hidden = true
    cardDiv.hidden = true
} 

signInForm.addEventListener("submit", submitSignIn)
function submitSignIn(e){
    e.preventDefault()
    let userEmail = e.target["email"].value
    let currentUser = allUsers.find(user => user.email === userEmail)
    if (currentUser) {
        console.log("was found")
        signInDiv.hidden = true
        logInUL.hidden = true
        userUL.hidden = false
        cardDiv.hidden = true
        renderDashboard(currentUser)
    } else {
        alert("Username does not exist!")
        signInDiv.hidden = true
        signUpDiv.hidden = false
    }
}

//////////// SIGN UP LOGIC //////////// 
signUp.addEventListener("click", () => {
    showSignUpDiv()
})

function showSignUpDiv() {
    welcomeScreen.style.display = "none"
    signUpDiv.hidden = false
    signInDiv.hidden = true
    cardDiv.hidden = true
} 

signUPForm.addEventListener("submit", submitSignUp)
function submitSignUp(e) {
    e.preventDefault();
    let userFirstName = e.target["first-name"].value
    let userLastName = e.target["last-name"].value
    let userEmail = e.target["email"].value
    
    fetch("http://localhost:3000/users", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
            first_name: userFirstName,
            last_name: userLastName,
            email: userEmail
        })
    })
    .then(resp => resp.json())
    .then(user => {
        renderDashboard(user)
    })
    logInUL.hidden = true
    userUL.hidden = false
}


//////////// RENDER ALL EXISTING DESTINATIONS IN DESTINATIONS LIST ////////////
function renderMyDestinations() {
    let myDestinations = allDestinations.filter(dest => dest.user_id === currentUser.id)
    let visitedUl = document.querySelector(".visited-ul")
    let notVisitedUl = document.querySelector(".not-visited-ul")
    myDestinations.forEach(dest => {
        if (dest.visited === true) {
            let visitedLi = document.createElement("li")
            visitedLi.textContent = dest.name 
            visitedLi.dataset.destId = dest.id
            visitedLi.addEventListener("click", renderCard)
            visitedUl.append(visitedLi)
        } else {
            let notVisitedLi = document.createElement("li")
            notVisitedLi.textContent = dest.name 
            notVisitedLi.dataset.destId = dest.id
            notVisitedLi.addEventListener("click", renderCard)
            notVisitedUl.append(notVisitedLi)
        }
    })
}

//////////// RENDER DESTINATION CARD///////////
function renderCard(e) {
    const id = e.target.dataset.destId

    fetch(`http://localhost:3000/destinations/${id}`)
    .then(response => response.json())
    .then(destination => makeNewDestCard(destination))
}
///////// MAKE DESTINATION CARD //////////////
function makeNewDestCard(destination) {
    const exitBtn = document.querySelector("#exit")
    exitBtn.addEventListener("click", exitOut)
    const showPage = document.querySelector(".show-page")
    const name = document.createElement('h2')
    name.innerText = destination.name
    const img = document.createElement('img')
    img.src = "AddImage"
    const dateVisited = document.createElement('h3')
    dateVisited.innerText = destination.date_visited
    const address = document.createElement('p')
    address.innerText = ` Address: ${document.address}`
    const category = document.createElement('p')
    category.innerText = `Category: ${destination.category}`
    const comment = document.createElement('p')
    comment.innerText = `Comments: ${destination.comment}`
    const visited = document.createElement('p')
    visited.innerText = `Visited? ${destination.visited}`
    const cost = document.createElement('p')
    cost.innerText = `Cost: ${destination.cost}`
    const attendees = document.createElement('p')
    attendees.innerText = `Attendees: ${destination.attendees}`
    const rating = document.createElement('p')
    rating.innerText = `${destination.rating} stars`
    const hr1 = document.createElement('hr')
    const hr2 = document.createElement('hr')
    const editBtn = document.createElement('button')
    editBtn.innerText = "Edit"
    const deleteBtn = document.createElement('button')
    deleteBtn.innerText = "Delete"
    cardDiv.append(name, img, dateVisited, hr1, address, category, visited, cost, attendees, hr2, comment, rating, editBtn, deleteBtn)
    cardDiv.hidden = false
    cardDiv.style.display = "block"
    showPage.hidden = true
    userDashboard.append(cardDiv)
    
}

////////// EXIT OUT OF SHW CARD/////////////
function exitOut(e){
    console.log(e.target)
    const showPage = document.querySelector(".show-page")
    const cardDiv = document.querySelector(".destination-card")
    cardDiv.hidden = true
    showPage.hidden = false
    cardDiv.style.display = "none"
    userDashboard.append(showPage)
}

//////////// ADD NEW DESTINATION//////////////
newDestForm.addEventListener("submit", addNewDestination)
function addNewDestination(e){
    e.preventDefault()
    console.log(e.target)
    const destName = document.querySelector("#google-search").value
    const destDate = document.querySelector("#date").value
    const destAddress = document.querySelector("#address").value
    const destCategory = document.querySelector("#category").value
    const destComment = document.querySelector("#comment").value
    const destVisited = document.querySelector("#visited").value
    const destCost = document.querySelector("#cost").value
    const destAttendees = document.querySelector("#attendees").value
    const destRating = document.querySelector("#rating").value

    let visitedUl = document.querySelector(".visited-ul")
    let notVisitedUl = document.querySelector(".not-visited-ul")
    if (destVisited === true) {
        let visitedLi = document.createElement("li")
        visitedLi.textContent = destName 
        visitedLi.dataset.destId = dest.id
        visitedLi.addEventListener("click", renderCard)
        visitedUl.append(visitedLi)
    } else {
        let notVisitedLi = document.createElement("li")
        notVisitedLi.textContent = destName 
        notVisitedLi.addEventListener("click", renderCard)
        notVisitedUl.append(notVisitedLi)
    }

    fetch("http://localhost:3000/destinations", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            name: destName,
            date_visited: destDate,
            address: destAddress, 
            category: destCategory, 
            comment: destComment,
            visited: destVisited,
            cost: destCost,
            attendees: destAttendees,
            rating: destRating,
            user_id: currentUser.id
        })
    })
    .then(response => response.json())
    .then(destination=> renderMyDestinations(destination))
    
}





//////////// RENDER GOOGLE MAPS ON DASHBOARD //////////// 
function initMap() {
  let map = new google.maps.Map(document.querySelector(".google-maps"), {
    center: { lat: 41.8781, lng: -87.6298 },
    zoom: 11,
  });

  if (currentUser) {
      renderMapMarker(map);
  }
//   renderMapMarker();
}

//////////// RENDER GOOGLE MAP AUTOCOMPLETE ADDRESS ON DASHBOARD //////////// 
function initAutocomplete() {
    let autocomplete;
    autocomplete = new google.maps.places.Autocomplete(
        document.getElementById("google-search"),
        { types: ["establishment"] }
      );

      google.maps.event.addListener(autocomplete, "place_changed", function(){
          nearPlace = autocomplete.getPlace();
          document.querySelector("#address").value = nearPlace.formatted_address;
          document.querySelector("#coordinates").value = nearPlace.geometry.location;
      })
}


function renderMapMarker(map) {
    let marker = new google.maps.Marker({
        position:{lat:41.9093619, lng:-87.65253059999999},
        map:map
    })
}

//////////// SHOW USER DASHBOARD //////////// 
function renderDashboard(user) {
    currentUser = user
    userDashboard.style.display = "flex"
    initMap();
    initAutocomplete();
    renderMyDestinations();
}