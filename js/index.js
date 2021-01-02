//////////// INITIALIZE //////////// 
fetchAllUsers();
fetchAllDestinations();

//////////// SHOW USER DASHBOARD //////////// 
function renderDashboard(user) {
    currentUser = user
    userDashboard.style.display = "flex"
    initMap();
    initAutocomplete();
    renderMyDestinations();
}

//////////// ALL GLOBAL VARIABLES //////////// 
let allUsers;
let currentUser;
let allDestinations;
let map;
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
const newDestinationForm = document.querySelector("form.new-destination-form")
const destinationFormDiv = document.querySelector("div.destination-form")
const showCard = document.querySelector("div.show-card")
const createNewBtn = document.querySelector("button.create-new-destination-btn")
const destinationList = document.querySelector("div.destinations-list")
const googleMaps = document.querySelector(".google-maps")
const cancelFormBtn = document.querySelector(".cancelFormBtn")


//////////// EVENT LISTENER FOR GOOGLE MAPS ///////////
googleMaps.addEventListener("click", googleMapShowCard)

function googleMapShowCard(e){
    if(e.target.tagName==="H4"){

    let id = e.target.id

    fetch(`http://localhost:3000/destinations/${id}`)
    .then(response => response.json())
    .then(destination => makeNewDestCard(destination))
    }
}   




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

//////////// RENDER GOOGLE MAPS ON DASHBOARD //////////// 
function initMap() {
    map = new google.maps.Map(document.querySelector(".google-maps"), {
    center: { lat: 41.8781, lng: -87.6298 },
    zoom: 11,
  });

  if (currentUser) {
      renderMapMarker(map);
  }
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
          document.querySelector("#name").value = nearPlace.name;
          document.querySelector("#address").value = nearPlace.formatted_address;
          document.querySelector("#latitude").value = nearPlace.geometry.location.lat();
          document.querySelector("#longitude").value = nearPlace.geometry.location.lng();
      })
}

//////////// ADDS DESTINATION MARKERS TO MAP FROM DB //////////// 
function renderMapMarker(map) {
    let myDestinations = allDestinations.filter(dest => dest.user_id === currentUser.id)
    if (myDestinations) {
        myDestinations.forEach(dest => {
            addMarker(dest, map);
        })
    }
}

//////////// ADDS DESTINATION MARKERS TO MAP  //////////// 
newDestinationForm.addEventListener("submit", (e) => {
    e.preventDefault();
    let userId = currentUser.id 
    let latitude = parseFloat(newDestinationForm.latitude.value)
    let longitude = parseFloat(newDestinationForm.longitude.value)

    fetch("http://localhost:3000/destinations", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
            name: newDestinationForm.name.value,
            date_visited: newDestinationForm.date.value,
            address: newDestinationForm.address.value, 
            category: newDestinationForm.category.value,
            comment: newDestinationForm.comment.value,
            visited: newDestinationForm.visited.value,
            cost: newDestinationForm.cost.value,
            attendees: newDestinationForm.attendees.value,
            rating: newDestinationForm.rating.value,
            user_id: userId,
            latitude: latitude,
            longitude: longitude
        })
    })
    .then(response => response.json())
    .then(dest => {
        addMarker(dest, map)
        //////////SAM ADDED ////////
        addNewDestination(dest)
    })
    newDestinationForm.reset() 
    destinationList.hidden = false
    destinationFormDiv.hidden = true

})



function addMarker(dest, map) {
    let infoWindowArray = []

    if (dest.visited === true){
        let marker = new google.maps.Marker({
            position:{lat: dest.latitude, lng: dest.longitude},
            map:map,
            icon: 'http://maps.google.com/mapfiles/ms/icons/green-dot.png'
        })

        let objectDetails =`<h4 id=${dest.id} class="firstHeading">${dest.name}</h4>` + 
        `<p><strong>Address:</strong> ${dest.address}</p>` +
        '<p><strong>Visited?</strong> &#9989;</p>'
    
        let infoWindow = new google.maps.InfoWindow({
            content: objectDetails
        })

        infoWindowArray.push(infoWindow)

        marker.addListener("click", () => {
            infoWindowArray.close();
            infoWindow.open(map, marker)
        })
    } else {
        let marker = new google.maps.Marker({
            position:{lat: dest.latitude, lng: dest.longitude},
            map:map,
            icon: 'http://maps.google.com/mapfiles/ms/icons/red-dot.png'
        })

        let objectDetails =`<h4 id=${dest.id} class="firstHeading">${dest.name}</h4>` + 
        `<p><strong>Address:</strong> ${dest.address}</p>` +
        '<p><strong>Visited?</strong> &#10060;</p>'
    
        let infoWindow = new google.maps.InfoWindow({
            content: objectDetails
        })

        infoWindowArray.push(infoWindow)

        marker.addListener("click", () => {
            infoWindowArray.close();
            infoWindow.open(map, marker)
        })
    }
        
}

//////////SAM ADDED //////////
function addNewDestination(dest) {
    let visitedUl = document.querySelector(".visited-ul")
    let notVisitedUl = document.querySelector(".not-visited-ul")
    if (dest.visited === "Yes") {
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
}

 createNewBtn.addEventListener("click", renderNewForm)

 function renderNewForm(){
    destinationList.hidden = true
    destinationFormDiv.hidden = false
 }

 cancelFormBtn.addEventListener("click", () => {
    newDestinationForm.reset() 
    destinationList.hidden = false
    destinationFormDiv.hidden = true
 })

 //////////// RENDER DESTINATION CARD///////////
function renderCard(e) {
    const id = e.target.dataset.destId

    fetch(`http://localhost:3000/destinations/${id}`)
    .then(response => response.json())
    .then(destination => makeNewDestCard(destination))
}
///////// MAKE DESTINATION CARD //////////////
function makeNewDestCard(destination){
    showCard.innerHTML = ""

    const exitBtn = document.createElement("span")
    exitBtn.innerText = "X"
    exitBtn.addEventListener("click", exitOut)

    const name = document.createElement('h2')
    name.innerText = destination.name
    const img = document.createElement('img')
    img.src = "AddImahe"
    const dateVisited = document.createElement('h3')
    dateVisited.innerText = destination.date_visited
    const address = document.createElement('p')
    address.innerText = ` Address: ${destination.address}`
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
    const hr3 = document.createElement('hr')
    const editBtn = document.createElement("button")
    editBtn.innerText = "Edit Memory"
    editBtn.dataset.id = destination.id
    editBtn.addEventListener("click", editShowCard)
    const deleteBtn = document.createElement("button")
    deleteBtn.innerText = "Delete Memory"
    deleteBtn.dataset.id = destination.id

    showCard.append(exitBtn, name, img, dateVisited, hr1, address, category, visited, cost, attendees, hr2, comment, rating, hr3, editBtn, deleteBtn)
    
    destinationList.hidden = true
    showCard.hidden = false

}

////////// EDIT SHOW CARD//////////////
function editShowCard(e){
    const id = e.target.dataset.id

 
}


////////// EXIT OUT OF SHW CARD/////////////
function exitOut(e){
    console.log(e.target)
    destinationList.hidden = false
    showCard.hidden = true
    // showCard.innerHTML = ""
}