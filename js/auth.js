// ============ Auth Module ============
// Handles token storage, retrieval, and validation

const Auth = {
    /**
     * Store JWT token in localStorage
     * @param {string} token - JWT token
     */
    setToken(token) {
        if (!token || typeof token !== 'string') {
            throw new Error("Invalid token");
        }
        localStorage.setItem("token", token);
        console.log("Token stored successfully");
    },

    /**
     * Get JWT token from localStorage
     * @returns {string|null} - JWT token or null if not found
     */
    getToken() {
        return localStorage.getItem("token");
    },

    /**
     * Check if token exists and is valid
     * @returns {boolean} - True if token exists and has valid format
     */
    isTokenValid() {
        const token = this.getToken();
        if (!token) return false;
        
        // JWT should have 3 parts separated by dots
        const parts = token.split('.');
        return parts.length === 3;
    },

    /**
     * Clear token from localStorage (logout)
     */
    clearToken() {
        localStorage.removeItem("token");
        // Replace history so back button won't go back to profile
        history.replaceState(null, document.title, window.location.href);
        console.log("Token cleared");
    },

    /**
     * Decode JWT to get payload (without verification)
     * @returns {object|null} - Decoded payload or null
     */
    decodeToken() {
        const token = this.getToken();
        if (!token) return null;
        
        try {
            const parts = token.split('.');
            if (parts.length !== 3) return null;
            
            const payload = JSON.parse(atob(parts[1]));
            return payload;
        } catch (error) {
            console.error("Failed to decode token:", error);
            return null;
        }
    }
};
