
fetch("http://localhost:3000/users/7")
    .then(response => response.json())
    .then(user => {
        console.log(user)
    })