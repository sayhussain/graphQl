// ============ GraphQL Module ============
// Handles all GraphQL API requests

const GraphQL = {
    API_URL: "https://learn.reboot01.com/api/graphql-engine/v1/graphql",

    /**
     * Execute a GraphQL query
     * @param {string} query - GraphQL query string
     * @returns {Promise<object>} - GraphQL response data
     */
    async query(query) {
        const token = Auth.getToken();
        
        if (!token) {
            throw new Error("No token available. Please login first.");
        }

        try {
            const response = await fetch(this.API_URL, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ query })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();

            // Check for GraphQL errors
            if (data.errors) {
                console.error("GraphQL Error:", data.errors[0].message);
                throw new Error(data.errors[0].message);
            }

            return data;
        } catch (error) {
            console.error("GraphQL Query Error:", error);
            throw error;
        }
    },

    /**
     * Fetch user profile data
     * @returns {Promise<object>} - User data
     */
    async fetchUserProfile() {
        const query = `
            query {
                user {
                    login
                    email
                    attrs
                    auditRatio
                    totalUp
                    totalDown
                    campus
                }
                transaction_aggregate(
                    where: {
                        event: { path: { _eq: "/bahrain/bh-module" } },
                        type: { _eq: "xp" }
                    }
                ) {
                    aggregate {
                        sum {
                            amount
                        }
                    }
                }
                level: transaction(
                    order_by: { amount: desc },
                    limit: 1,
                    where: {
                        type: { _eq: "level" },
                        path: { _like: "/bahrain/bh-module%" }
                    }
                ) {
                    amount
                }
                projects: transaction(
                    where: {
                        type: { _eq: "xp" },
                        object: { type: { _eq: "project" } }
                    },
                    order_by: { createdAt: asc }
                ) {
                    id
                    object {
                        name
                    }
                    amount
                    createdAt
                }
                allXp: transaction(
                    where: {
                        event: { path: { _eq: "/bahrain/bh-module" } },
                        type: { _eq: "xp" }
                    },
                    order_by: { createdAt: asc }
                ) {
                    id
                    object {
                        name
                        type
                    }
                    amount
                    createdAt
                }
            }
        `;

        return this.query(query);
    }
};
