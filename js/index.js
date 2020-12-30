//////////// INITIALIZE //////////// 



//////////// ALL GLOBAL VARIABLES //////////// 
let currentUser;
let allUsers;
const signIn = document.querySelector("li#sign-in")
const signUp = document.querySelector("li#sign-up")
const welcomeScreen = document.querySelector("div#welcome-screen")
const signInForm = document.querySelector("form.sign-in-form")
const signUPForm = document.querySelector("form.sign-up-form")
const signInDiv = document.querySelector(".sign-in-card")
const signUpDiv = document.querySelector(".sign-up-card")
const logInUL = document.querySelector("ul.nav")
const userUL = document.querySelector("ul.user-nav")

const container = document.querySelector(".container")
const logOutLi = document.querySelector("#sign-out")
const locations = document.querySelector(".visited")
locations.addEventListener("click", showLocationCard)
const locationCard = document.querySelector(".location-card")
locationCard.style.display = "none"
const commentBtn = document.querySelector(".comment-section")


fetchAllUsers();
//////////// FETCH ALL USERS IN DB //////////// 
function fetchAllUsers(){
    fetch("http://localhost:3000/users")
    .then(resp => resp.json())
    .then(users => {
        ALL_USERS = users
        users.forEach(user => {
            user
        })
        
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
    locationCard.style.display = "none"
} 



signInForm.addEventListener("submit", submitSignIn)
function submitSignIn(e){
    e.preventDefault()
    let userEmail = e.target["email"].value

    // let currentUser = allUsers.find(user => user.email === userEmail)
    // if (currentUser) {
        console.log("was found")
        signInDiv.hidden = true
        logInUL.hidden = true
        userUL.hidden = false
        container.hidden = false
        locationCard.hidden = true

        renderDashboard(userEmail)
    // } else {
    //     alert("Username does not exist!")
    //     signInDiv.hidden = true
    //     signUpDiv.hidden = false
    // }
}

//////////// SIGN UP LOGIC //////////// 
signUp.addEventListener("click", () => {
    showSignUpDiv()
})

function showSignUpDiv() {
    welcomeScreen.style.display = "none"
    signUpDiv.hidden = false
    signInDiv.hidden = true
    locationCard.hidden = true
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
    locationCard.hidden = true
}

//////////// SHOW USER DASHBOARD //////////// 
function renderDashboard(userEmail) {
    currentUser = userEmail
    }

logOutLi.addEventListener("click", logOut)
function logOut(e){
    console.log(e.target)
    welcomeScreen.style.display = "block"
    logInUL.hidden = false
    userUL.hidden = true
    locationCard.hidden = true
    container.hidden = true
}


function showLocationCard(e){
    if (e.target.tagName === "LI") {
    console.log(e.target)
        locationCard.hidden = false
        locationCard.style.display = "grid"
        commentBtn.style.display = "inline-block"
        container.hidden = true
    }
}

