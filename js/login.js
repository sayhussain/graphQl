const form = document.getElementById("loginForm")

form.addEventListener("submit", function(event){
    event.preventDefault()
    //read username and password from form
    const username = document.getElementById(username).value
    const password = document.getElementById(password).value
    
    //change username and pass to base64 for basic auth
    const base64Credentials = btoa(username + ":" + password)   

    fetch("https://((DOMAIN))/api/auth/signin", {
        method: "post",
        headers: {
            "Authintication": "Basic" + base64Credentials,
            "Content-Type": "Application/json"
        }
    })
    //request to backend and handle response
    .then(response => {
        if(!response.ok){
            document.getElementById("errorMessage").innerText = "Invalid username or password"
            throw new Error("Login failed")
            
        }
        return response.json()
    })
    //if login successful, store token and redirect to dashboard
    .then(data => {
        const token = data.token
        localStorage.setItem("token", token)
        window.location.href = "dashboard.html"
    })
    .catch(error => {
        console.log(error.message)
    })
})
