// ============ Login Module ============
// Handles user authentication

// Verify auth module is loaded
if (typeof Auth === 'undefined') {
    console.error("ERROR: Auth module not loaded! Check if auth.js is linked before login.js");
}

const form = document.getElementById("loginForm");

if (!form) {
    console.error("ERROR: loginForm element not found in DOM");
}

form.addEventListener("submit", async function(event) {
    event.preventDefault();
    
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    const errorElement = document.getElementById("errorMessage");

    // Reset error message
    errorElement.innerText = "";
    errorElement.style.display = "none";

    try {
        // Encode credentials for Basic auth
        const credentials = btoa(`${username}:${password}`);

        const response = await fetch("https://learn.reboot01.com/api/auth/signin", {
            method: "POST",
            headers: {
                "Authorization": `Basic ${credentials}`,
                "Content-Type": "application/json"
            }
        });

        if (!response.ok) {
            throw new Error("Invalid username or password");
        }

        // Try to parse as JSON first, if it fails, treat as string (JWT)
        let token;
        const contentType = response.headers.get("content-type");
        
        console.log("Response Status:", response.status);
        console.log("Content-Type header:", contentType);
        console.log("Response OK:", response.ok);
        
        if (contentType && contentType.includes("application/json")) {
            console.log("Parsing as JSON...");
            const data = await response.json();
            console.log("JSON data:", data);
            
            // Check if the parsed JSON is already the JWT string itself
            if (typeof data === 'string' && data.includes('.')) {
                token = data;
                console.log("Data is JWT string, using directly");
            } else {
                // Otherwise look for token fields
                token = data.token || data.jwt || data.access_token;
                console.log("Looking for token field in object");
            }
        } else {
            console.log("Parsing as plain text (JWT)...");
            token = await response.text();
            console.log("Token from text:", token);
            console.log("Token length:", token.length);
        }

        console.log("Final token value:", token ? "Token exists (" + token.length + " chars)" : "Token is empty");

        if (!token || token.trim() === "") {
            throw new Error("No token received from server");
        }

        // Store token using Auth module
        Auth.setToken(token);

        // Redirect to profile
        window.location.href = "profile.html";

    } catch (error) {
        console.error("Login error:", error);
        errorElement.innerText = error.message || "Login failed. Check your connection.";
        errorElement.style.display = "block";
    }
});
