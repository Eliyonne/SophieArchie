let tokenid;
let islogged;

document.querySelector("#loginuser").addEventListener("submit",  send);


function send(e) {
    e.preventDefault();
    fetch("http://localhost:5678/api/users/login", {
        method: 'POST',
        headers: {
            'accept' : 'application/json',
            'Content-Type' : 'application/json'
        },
        body: JSON.stringify({
            "email" : document.getElementById("email").value,
            "password" : document.getElementById("Motdepasse").value
        })
    }).then(function(res){
        if (res.ok == true) {
            console.log("marche");
            console.log(res);
            return res.json();
        }
        else{
            alert("Informations de connexion erronnés.") //a modifier
        }
    }).then((data) => {
        console.log(data);
        tokenid = data.token;
        localStorage.setItem("token", tokenid);
        location.href = "./index.html";
    }).catch((err) => console.log(err));
    

};
    



    
