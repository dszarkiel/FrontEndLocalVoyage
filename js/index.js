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
const newDestinationForm = document.querySelector(".new-destination-form")

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
            visitedUl.append(visitedLi)
        } else {
            let notVisitedLi = document.createElement("li")
            notVisitedLi.textContent = dest.name 
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
})


function addMarker(dest, map) {
    let marker = new google.maps.Marker({
        position:{lat: dest.latitude, lng: dest.longitude},
        map:map,
    })

    let infoWindow = new google.maps.InfoWindow({
        content: dest.name
    })

    marker.addListener("click", () => {
        infoWindow.open(map, marker)
    })
}

//////////SAM ADDED //////////
function addNewDestination(dest) {
    let visitedUl = document.querySelector(".visited-ul")
    let notVisitedUl = document.querySelector(".not-visited-ul")
    if (dest.visited === true) {
        let visitedLi = document.createElement("li")
        visitedLi.textContent = dest.name 
        visitedUl.append(visitedLi)
    } else {
        let notVisitedLi = document.createElement("li")
        notVisitedLi.textContent = dest.name 
        notVisitedUl.append(notVisitedLi)
        }
}

 