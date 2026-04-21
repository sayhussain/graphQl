  // ============ Profile Module ============
// Handles profile data display and initialization

// Format XP with K (thousands) and M (millions) notation - 3 significant figures
function formatXP(xp) {
    if (xp >= 1000000) {
        return (xp / 1000000).toFixed(2) + 'M';
    } else if (xp >= 1000) {
        return (xp / 1000).toFixed(2) + 'K';
    }
    return xp.toString();
}

// Check if user is authenticated
if (!Auth.isTokenValid()) {
    window.location.href = "index.html";
}

// Initialize profile on page load
document.addEventListener("DOMContentLoaded", async function() {
    try {
        // Fetch user profile data using GraphQL module
        const response = await GraphQL.fetchUserProfile();
        
        const user = response.data.user[0];
        const xp = response.data.transaction_aggregate.aggregate.sum.amount;
        const auditRatio = user.auditRatio;
        const allXp = response.data.allXp;
        const projects = response.data.projects;

        // Display user info
        document.getElementById("username").innerText = user.login;
        document.getElementById("xp").innerText = "XP: " + formatXP(xp);
        document.getElementById("audit").innerText = "Audit Ratio: " + auditRatio.toFixed(2);

        // Render graphs
        drawXpGraph(allXp);
        drawPassFailGraph(projects);

    } catch (error) {
        console.error("Failed to load profile:", error);
        alert("Failed to load profile data. Please try again.");
    }
});

// Logout functionality
document.getElementById("logoutBtn").addEventListener("click", function() {
    Auth.clearToken();
    window.location.href = "index.html";
});