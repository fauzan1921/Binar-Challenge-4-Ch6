const login = async () => {
    const username = document.getElementById("username").value
    const password = document.getElementById("password").value
    
    if(username === "fauzan" && password === "asdf"){
        window.location.href = 'http://localhost:3000/dashboard'
    }else{
        alert('Failed to Login')
    }
}

//BUTTON CREATE
const handleNewUser = async() => {
    let regUsername = document.getElementById("newUsername").value
    let regAge = document.getElementById("newAge").value
    let regCity = document.getElementById("newCity").value
    let regNationality = document.getElementById("newNationality").value

    const resp = await fetch('http://localhost:3000/new-user', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            username: regUsername,
            age: regAge,
            city: regCity,
            nationality: regNationality
        })
    })
    if(resp.status === 201){
        alert("New User Created")
        document.getElementById("newUsername").value = null
        document.getElementById("newAge").value = null
        document.getElementById("newCity").value = null
        document.getElementById("newNationality").value = null
        location.reload()
    }else{
        alert("Failed to Create New User")
    }
}

//BUTTON SEARCH
const searchByUsername = async () => {
    const username = document.getElementById("findUsername").value
    const resp = await fetch(`http://localhost:3000/search/${username}`)
  
    if(resp.status===404){
      alert("Username Not Found")
    }else{
        const data = await resp.json()
        console.log(data)
        window.location.href = `/userdata/${data.id}`
    }
  }


//BUTTON EDIT
const editUser = async (userId) => {
    const age = document.getElementById("age").value
    const city = document.getElementById("city").value
    const nationality = document.getElementById("nationality").value

    const resp = await fetch(`http://localhost:3000/update-biodata/${userId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            age: age,
            city: city,
            nationality: nationality
        })
    })
    if(resp.status === 202){
        alert("Data Updated")
        location.reload()
    }else{
        alert("Failed to Update Data")
    }
  }

//BUTTON DELETE
const userDelete = async (userId) => {
    let ans = confirm('Are you sure?')
    if (ans){
      await fetch(`http://localhost:3000/delete-user/${userId}`, {
        method: 'DELETE'
      })
  
      location.reload()
    }
}