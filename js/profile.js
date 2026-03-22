//if user he dont have token, redirect to login page
const token = localStorage.getItem("token")
if(!token){
    window.location.href = "index.html"

}

fetch("https://((DOMAIN))/api/graphql-engine/v1/graphql", {
    method: "post",
    headers:{
        "Authorization": "Bearer " + token,
        "Content-Type": "application/json"
    },
    body: JSON.stringify({
        query: `
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
                    skills: transaction(
                        where: {
                            _and: [
                                {type: { _iregex: "(^|[^[:alnum:]])[[:alnum:]]*skill[[:alnum:]]*($|[^[:alnum:]])" }},
                                {type: {_like: "%skill%"}},
                                {object: {type: {_eq: "project"}}},
                                {type: {_in: [
                                    "skill_prog", "skill_algo", "skill_sys-admin", "skill_front-end", 
                                    "skill_back-end", "skill_stats", "skill_ai", "skill_game", 
                                    "skill_tcp"
                                ]}}
                            ]
                        }
                        order_by: [{type: asc}, {createdAt: desc}]
                        distinct_on: type
                    ) {
                        amount
                        type
                    }
                }
            `
    })
})
    .then(response => response.json())
        .then(data => {
            console.log(data);

            const user = data.data.user[0]
            const xp = data.data.transaction_aggregate.aggregate.sum.amount
             
            // show user info
            document.getElementById("username").innerText = user.login;
            document.getElementById("xp").innerText = "xp: " + xp;
            })
            .catch(error => {
         console.log(error);
        });