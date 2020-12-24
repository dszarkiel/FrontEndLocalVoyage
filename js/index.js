let CURRENT_USER = ""

let signIn = document.querySelector("#signin")


signIn.addEventListener("click", () => {
    showSignInDiv()
})

function showSignInDiv() {
    let signInDiv = document.querySelector(".signin-card")
    
    signInDiv.hidden = false
} 
