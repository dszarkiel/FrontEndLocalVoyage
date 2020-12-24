let currentUser = ""
let allUsers = []

const signIn = document.querySelector("li#sign-in")
const welcomeScreen = document.querySelector("div#welcome-screen")
const signInForm = document.querySelector("form.sign-in-form")

function main(){
    fetchAllUsers()
    console.log(allUsers)
}
signIn.addEventListener("click", () => {
    showSignInDiv()
})
function showSignInDiv() {
    let signInDiv = document.querySelector(".sign-in-card")
    console.log("this works")
    welcomeScreen.style.display = "none"
    signInDiv.hidden = false
} 
signInForm.addEventListener("submit", submitSignIn)
function submitSignIn(e){
    e.preventDefault()
    let userEmail = e.target["email"].value
    if allUsers.find(user ==> )
}

function fetchAllUsers(){
    fetch("http://localhost:3000/users")
    .then(resp => resp.json())
    .then(usersObj => {
        allUsers = usersObj
        use
    })
}
////////// Initialize //////////
main()