//////////// INITIALIZE //////////// 
fetchAllUsers();
fetchAllDestinations();

//////////// SHOW USER DASHBOARD //////////// 
function renderDashboard(user) {
    renderWelcomeMessage(user)
    currentUser = user
    userDashboard.style.display = "flex"
    // secondDashboardDiv.style.display = "flex"
    initMap();
    initAutocomplete();
    renderMyDestinations();
}

//////////// ALL GLOBAL VARIABLES //////////// 
let allUsers;
let currentUser;
let allDestinations;
let map;
let mapMarkers = [];
// Sign-in and Sign-Up variables
const signIn = document.querySelector("li#sign-in")
const signUp = document.querySelector("li#sign-up")
const welcomeScreen = document.querySelector("div#welcome-screen")
const signInForm = document.querySelector("form.sign-in-form")
const signUPForm = document.querySelector("form.sign-up-form")
const signInDiv = document.querySelector(".sign-in-card")
const signUpDiv = document.querySelector(".sign-up-card")
const logInUL = document.querySelector("ul.nav")
const userUL = document.querySelector("ul.user-nav")
// Rendering current user dashboard
const userDashboard = document.querySelector(".dashboard")
const secondDashboardDiv = document.querySelector(".logo-create-new")
const newDestinationForm = document.querySelector("form.new-destination-form")
const destinationFormDiv = document.querySelector("div.destination-form")
const showCard = document.querySelector("div.show-card")
const createNewBtn = document.querySelector("button.create-new-destination-btn")
const destinationList = document.querySelector("div.destinations-list")
const googleMaps = document.querySelector(".google-maps")
const cancelFormBtn = document.querySelector(".cancelFormBtn")
// Account info and account update variables
const accountNavBtn = document.querySelector("#account-view") 
const logOutBtn = document.querySelector("#sign-out") 
const accountInfoCard = document.querySelector(".account-info-card") 
const editAccountCard = document.querySelector(".edit-account-card")
const editAccountForm = document.querySelector("#edit-account-form")
// Edit existing destination information variables 
const editDestDiv = document.querySelector(".edit-destination-div")
const editDestForm = document.querySelector(".edit-destination-form")
const editDestCancelBtn = document.querySelector(".cancelDestUpdateBtn")
// Account information to render on account show card
let firstName = document.querySelector(".account-info-card #first_name");
let lastName = document.querySelector(".account-info-card #last_name");
let email = document.querySelector(".account-info-card #email");

const starOne = document.createElement("span")
const starTwo = document.createElement("span")
const starThree = document.createElement("span")
const starFour = document.createElement("span")
const starFive = document.createElement("span")

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
        allDestinations = destObj;
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

//////////// RENDERS WELCOME MESSAGE IN NAV BAR FOR USER //////////// 
function renderWelcomeMessage(user){
    let welcomeMessage = document.querySelector("#greeting")
    welcomeMessage.innerText = `Welcome ${user.first_name}!`
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
    signUpDiv.hidden = true
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
        if (user.error) {
            alert(user.error);
            signUPForm.reset()
            showSignUpDiv()
        } else{
            renderDashboard(user)
            logInUL.hidden = true
            userUL.hidden = false
        }
    })
}

///////////////// SIGN OUT LOGIC //////////////
logOutBtn.addEventListener("click", logOut)
function logOut(e){
    location.reload()
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
    if (mapMarkers) {
        mapMarkers.forEach(marker => marker.setMap(null))
    }

    if (myDestinations) {
        myDestinations.forEach(dest => {
            addMarker(dest, map);
        })
    }
}
let errorMsg;
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
        if (dest.error) {
            alert(dest.error);
            newDestinationForm.reset()
        } else {
            newDestinationForm.reset() 
            destinationList.hidden = false
            destinationFormDiv.hidden = true
            addMarker(dest, map)
            addNewDestination(dest)
        }
    })
})

////////// RENDER NEW GOOGLE MAP MARKER //////////////
function addMarker(dest, map) {
    if (dest.visited === true){
        let marker = new google.maps.Marker({
            position:{lat: dest.latitude, lng: dest.longitude},
            map:map,
            icon: './assets/images/blue-visited-marker.png'
        })

        let objectDetails =`<h4 id=${dest.id} class="firstHeading">${dest.name}</h4>` + 
        `<p><strong>Address:</strong> ${dest.address}</p>` +
        '<p><strong>Visited?</strong> &#9989;</p>'
    
        let infoWindow = new google.maps.InfoWindow({
            content: objectDetails
        })
        mapMarkers.push(marker)
        marker.addListener("click", () => {
            infoWindow.open(map, marker)
        })
    } else {
        let marker = new google.maps.Marker({
            position:{lat: dest.latitude, lng: dest.longitude},
            map:map,
            icon: './assets/images/red-notVisited-marker.png'
        })

        let objectDetails =`<h4 id=${dest.id} class="firstHeading">${dest.name}</h4>` + 
        `<p><strong>Address:</strong> ${dest.address}</p>` +
        '<p><strong>Visited?</strong> &#10060;</p>'
    
        let infoWindow = new google.maps.InfoWindow({
            content: objectDetails
        })
        mapMarkers.push(marker)
        marker.addListener("click", () => {
            infoWindow.open(map, marker)
        })
    } 
}

////////// ADD NEW DESTINATION TO LIST (VISITED / NOT VISITED) //////////
function addNewDestination(dest) {
    let visitedUl = document.querySelector(".visited-ul")
    let notVisitedUl = document.querySelector(".not-visited-ul")
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
}

////////// RENDER CREATE NEW DESTINATION FORM //////////////
 createNewBtn.addEventListener("click", renderNewForm)
 function renderNewForm(){
    destinationList.hidden = true
    destinationFormDiv.hidden = false
    showCard.hidden = true
    editAccountCard.hidden = true
    editAccountForm.hidden = true
    accountInfoCard.hidden = true
    editDestDiv.hidden = true
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
    // const img = document.createElement('img')
    // img.src = destination.image
    const dateVisitedHeader = document.createElement('h4')
    dateVisitedHeader.innerText = "Date Visited:"
    const dateVisited = document.createElement('p')
    dateVisited.innerText = `${destination.date_visited}`
    if (destination.date_visited === "" && destination.visited) {
        dateVisited.innerText = "Date: Please enter the date you attended!"
    }

    const addressHeader = document.createElement('h4')
    addressHeader.innerText = "Address:"
    const address = document.createElement('p')
    address.innerText = `${destination.address}`

    const categoryHeader = document.createElement('h4')
    categoryHeader.innerText = "Category:"
    const category = document.createElement('p')
    category.innerText = `${destination.category}`

    const commentHeader = document.createElement('h4')
    commentHeader.innerText = "Comment:"
    const comment = document.createElement('p')
    comment.classList.add("comment-text-area")
    comment.innerText = `${destination.comment}`

    const visitedHeader = document.createElement('h4')
    visitedHeader.innerText = "Visited:"
    const visited = document.createElement('p')
    if (destination.visited) {
        visited.innerHTML = "&#9989;"
    } else {
        visited.innerHTML = "&#10060;"
    }

    const costHeader = document.createElement('h4')
    costHeader.innerText = "Cost:"
    const cost = document.createElement('p')
    cost.innerText = `Cost: $${destination.cost}`
    
    const attendeesHeader = document.createElement('h4')
    attendeesHeader.innerText = "Attendees:"
    const attendees = document.createElement('p')
    attendees.innerText = `${destination.attendees}`

    const ratingHeader = document.createElement('h4')
    ratingHeader.innerText = "Your Rating:"

    starOne.setAttribute("class", "fa fa-star")
    starOne.setAttribute("id", "star-one")

    starTwo.setAttribute("class", "fa fa-star")
    starTwo.setAttribute("id", "star-two")

    starThree.setAttribute("class", "fa fa-star")
    starThree.setAttribute("id", "star-three")

    starFour.setAttribute("class", "fa fa-star")
    starFour.setAttribute("id", "star-four")

    starFive.setAttribute("class", "fa fa-star")
    starFive.setAttribute("id", "star-five")

    const rating = document.createElement("p")
    rating.append(starOne, starTwo, starThree, starFour, starFive) 
    renderRatingStars(destination)

    const hr1 = document.createElement('hr')
    const hr2 = document.createElement('hr')
    const hr3 = document.createElement('hr')

    const btnDiv = document.createElement("div")
    btnDiv.classList.add("show-card-btns")

    const editBtn = document.createElement("button")
    editBtn.id = "edit-destination-btn"
    editBtn.innerText = "Edit"
    editBtn.dataset.id = destination.id
    editBtn.addEventListener("click", fetchCurrentDest)

    const deleteBtn = document.createElement("button")
    deleteBtn.id = "delete-destination-btn"
    deleteBtn.innerText = "Delete"
    deleteBtn.dataset.id = destination.id
    deleteBtn.addEventListener("click", deleteDestination)

    btnDiv.append(editBtn, deleteBtn)
    showCard.append(exitBtn, name, hr1, dateVisitedHeader, dateVisited, addressHeader, address, categoryHeader, category, visitedHeader, visited, costHeader, cost, attendeesHeader, attendees, hr2, commentHeader, comment, ratingHeader, rating, hr3, btnDiv)
    
    destinationList.hidden = true
    showCard.hidden = false
}

////////// RENDER RATING STARS BASED ON DEST RATING //////////////
function renderRatingStars(dest){
    if(dest.rating === 1){
        starOne.setAttribute("class", "fa fa-star checked")
    }
    if(dest.rating === 2){
        starOne.setAttribute("class", "fa fa-star checked")
        starTwo.setAttribute("class", "fa fa-star checked")
    }
    if(dest.rating === 3){
        starOne.setAttribute("class", "fa fa-star checked")
        starTwo.setAttribute("class", "fa fa-star checked")
        starThree.setAttribute("class", "fa fa-star checked")
    }
    if(dest.rating === 4){
        starOne.setAttribute("class", "fa fa-star checked")
        starTwo.setAttribute("class", "fa fa-star checked")
        starThree.setAttribute("class", "fa fa-star checked")
        starFour.setAttribute("class", "fa fa-star checked")
    }
    if(dest.rating === 5){
        starOne.setAttribute("class", "fa fa-star checked")
        starTwo.setAttribute("class", "fa fa-star checked")
        starThree.setAttribute("class", "fa fa-star checked")
        starFour.setAttribute("class", "fa fa-star checked")
        starFive.setAttribute("class", "fa fa-star checked")
    }
}

////////// GET CURRENT INFO ON DEST THAT IS GETTING UPDATED //////////////
function fetchCurrentDest(e) {
    const id = e.target.dataset.id
    showCard.hidden = true
    editDestDiv.hidden = false

    fetch(`http://localhost:3000/destinations/${id}`)
    .then(response => response.json())
    .then(dest => {
        renderEditDestForm(dest)
    })
}

////////// GRAB ALL FORM FIELDS FROM UPDATE DEST FORM//////////////
let updatedName = document.querySelector("#updated-name")
let updatedDate = document.querySelector("#updated-date")
let updatedCategory = document.querySelector("#updated-category")
let updatedComment = document.querySelector("#updated-comment")
let updatedVisited = document.getElementsByName("updated-visited")
let notUpdatedVisited = document.querySelector("#updated-not-visited")
let updatedCost = document.querySelector("#updated-cost")
let updatedAttendees = document.querySelector("#updated-attendees")
let updatedRating = document.querySelector("#updated-rating")

////////// POPULATE EDIT DEST FORM WITH EXISTING VALUES //////////////
function renderEditDestForm(currentDest){
    updatedName.value = currentDest.name
    updatedDate.value = currentDest.date_visited
    updatedCategory.value = currentDest.category
    updatedComment.value = currentDest.comment
    updatedCost.value = currentDest.cost
    updatedAttendees.value = currentDest.attendees
    updatedRating.value = currentDest.rating
    editDestForm.dataset.id = currentDest.id
 
    editDestForm.addEventListener("submit", patchUpdateDest)
}

////////// PATCH REQUEST TO UPDATE DEST INFORMATION IN BACKEND //////////////
function patchUpdateDest(e){
    e.preventDefault();

    let destId = e.target.dataset.id
    fetch(`http://localhost:3000/destinations/${destId}`, {
        method: "PATCH",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify ({
            name: updatedName.value,
            date_visited: updatedDate.value,
            category: updatedCategory.value,
            comment: updatedComment.value,
            visited: editDestForm.updatedVisited.value,
            cost: updatedCost.value,
            attendees: updatedAttendees.value,
            rating: updatedRating.value
        })

    })
    .then(response => response.json())
    .then(dest => {
        makeNewDestCard(dest)
        editDestDiv.hidden = true
        removeOutdatedLi(dest);
        addNewDestination(dest)
        addMarker(dest, map)
    })
}

////////// CANCEL BTN OUT OF UPDATE DEST FORM  /////////////
editDestCancelBtn.addEventListener("click", () => {
    newDestinationForm.reset() 
    showCard.hidden = false
    editDestDiv.hidden = true
 })

function removeOutdatedLi(dest){
    let allNodeLis = destinationList.querySelectorAll("li")
    let allLis = Array.from(allNodeLis)
    let destinationId = dest.id
    let wantedLi = allLis.find(item =>
        item.dataset.destId === destinationId.toString()
    )
    wantedLi.remove();
}


////////// EXIT OUT OF CURRENT CARD CARD/////////////
function exitOut(e){
    destinationList.hidden = false
    showCard.hidden = true
    accountInfoCard.hidden = true
    editAccountCard.hidden = true
}


////////// NAV BTN THAT DISPLAYS ACCOUNT INFO /////////////
accountNavBtn.addEventListener("click", () => {
    renderAccountInfo(currentUser);
})
////////// RENDER ACCOUNT INFO CARD //////////////
function renderAccountInfo(user) {
    accountInfoCard.hidden = false
    destinationList.hidden = true
    destinationFormDiv.hidden = true
    showCard.hidden = true
    editAccountCard.hidden = true

    firstName.textContent = user.first_name
    lastName.textContent = user.last_name
    email.textContent = user.email

    let exitBtn = document.querySelector("#account-exit")
    exitBtn.addEventListener("click", exitOut)

    let userEditBtn = document.querySelector(".account-info-card #edit-account-btn")
    userEditBtn.addEventListener("click", renderEditAccountForm)
}

////////// RENDER EDIT ACCOUNT FORM AND POPULATE WITH EXISTING DATA//////////////
function renderEditAccountForm(){
    accountInfoCard.hidden = true
    editAccountCard.hidden = false
    editAccountForm.hidden = false

    let firstNameField = document.querySelector("#edit-account-form #new-first-name")
    firstNameField.value = currentUser.first_name
    let lastNameField = document.querySelector("#edit-account-form #new-last-name")
    lastNameField.value = currentUser.last_name
    let emailField = document.querySelector("#edit-account-form #new-email")
    emailField.value = currentUser.email

    let exitBtn = document.querySelector("#edit-account-exit")
    exitBtn.addEventListener("click", exitOut)
}

////////// UPDATE ACCOUNT INFORMATION  /////////////
editAccountForm.addEventListener("submit", updateAccount)
function updateAccount(e){
    e.preventDefault();
    let userId = currentUser.id
    let newFirstName = document.querySelector("#edit-account-form #new-first-name").value
    let newLastName = document.querySelector("#edit-account-form #new-last-name").value
    let newEmail = document.querySelector("#edit-account-form #new-email").value
    
    fetch(`http://localhost:3000/users/${userId}`, {
        method: "PATCH",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
            first_name: newFirstName,
            last_name: newLastName,
            email: newEmail
        })
    })
    .then(response => response.json())
    .then(newUserInfo => {
        renderAccountInfo(newUserInfo)
        currentUser = newUserInfo
    })
}

///////// Delete Destination //////////
function deleteDestination(e){
    let id = e.target.dataset.id
    fetch(`http://localhost:3000/destinations/${id}`, {
        method: "DELETE"
    })
    .then(resp => resp.json())
    .then(dest => {
        removeOutdatedLi(dest);
        fetchAllDestinations();
        setTimeout(function(){renderMapMarker(map)}, 10)
    })
    showCard.hidden = true
    destinationList.hidden = false  
}