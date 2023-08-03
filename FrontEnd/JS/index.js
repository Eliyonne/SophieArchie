let workslist;
let workcategories;
let logged
let userlogin

//Login verificateur
function Login() {
    if (localStorage.getItem("token") || undefined) {
        logged = localStorage.getItem("token");
        userlogin = true;
        const logIn = document.querySelector("#loginLink");
        logIn.innerHTML = "Logout";
        logIn.style.cursor = "pointer";
        logIn.addEventListener("click", () => LogOut());
        changeinterface_banner();
        changeinterface_gallerie()
        const filter = document.querySelector(".filter");
        filter.style.display = "none"

    }
}

//Logout
function LogOut(){
    const logIn = document.querySelector("#loginLink");
    logIn.innerHTML = '<a href="loginpage.html" >Login</a>';
    localStorage.clear();
    logged = ""
    cleaninterface();
}

//On appel Login à chaque chargement de page (futur main)
Login()
filterbuilder();
gallerybuilder();



//Moddification de la page en utilisateur connecté
function changeinterface_banner() {
    const editmode = document.createElement("div");
    editmode.innerHTML = '<div><image src = "/FrontEnd/assets/icons/editions.svg"></image><p>Mode édition</p></div><button>publier les changements</button>';
    editmode.classList.add("mode__edition");
    const header = document.querySelector("header");
    header.style.marginTop = "100px";
    const body = document.querySelector("body");
    body.before(editmode);
}

//Changement interface gallerie
function changeinterface_gallerie() {
    const gallerie_edit = document.createElement("div");
    gallerie_edit.innerHTML = '<image src = "/FrontEnd/assets/icons/edition-white.svg"></image><p>modifier</p>';
    gallerie_edit.classList.add("modal__call", "gallerie__manager");
    const gallerie_tittle = document.querySelector(".portfolio__tittle");
    gallerie_edit.style.cursor = "pointer";
    gallerie_tittle.append(gallerie_edit);

}

document.querySelector(".modal__call").addEventListener("click", modalup);

//Appel de la modal
function modalup() {
    console.log("bla");
    const modal = document.querySelector("#modal");
    const modal__ajout__wrapper = document.querySelector(".modal__ajout__wrapper");
    //inserer le if ici
    modal__ajout__wrapper.style.display = "none";
    modal.style.display = "flex";
    const modal__gallerie = document.querySelector(".modal__gallerie");
    modal__gallerie.innerHTML="";
    gallerybuildermodale();
    let addgallerie = document.querySelector(".btn__ajout__gallerie");
    let modalwork = document.querySelector(".modal__gallerie__wrapper");
    let modalimage = document.querySelector(".modal__ajout__wrapper");
    const navback = document.querySelector(".back-icon");
    const navbar = document.querySelector(".modal__gallerie__nav");
    const closebutton = document.querySelector(".close-icon");
    closebutton.addEventListener("click", modalclose);
    navback.addEventListener("click", () => {
        modalwork.style.display = "flex";
        modalimage.style.display = "none";
        navback.style.display = "none";
        navbar.classList.remove("justify-space");
    })
    addgallerie.addEventListener("click", () => {
        modalwork.style.display = "none";
        modalimage.style.display = "flex";
        navback.style.display = "flex";
        navbar.classList.add("justify-space");
        let select = document.getElementById("category");
        let title_input = document.getElementById("title");
        select.selectedIndex = 0;
        title_input.value = '';

    })
    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
            modalwork.style.display = "flex";
            modalimage.style.display = "none";
            navback.style.display = "none";
            navbar.classList.remove("justify-space");
        }
    }
}

//fermeture de la modale
function modalclose() {
    const modal = document.querySelector("#modal");
    const modalwork = document.querySelector(".modal__gallerie__wrapper");
    const modalimage = document.querySelector(".modal__ajout__wrapper");
    const navback = document.querySelector(".back-icon");
    const navbar = document.querySelector(".modal__gallerie__nav");
    modal.style.display = "none";
    modalwork.style.display = "flex";
    modalimage.style.display = "none";
    navback.style.display = "none";
    navbar.classList.remove("justify-space");
}

//Retourne à l'état déco
function cleaninterface() {
    const editmode = document.querySelector(".mode__edition");
    editmode.remove();
    const gallerie_edit = document.querySelector(".modal__call");
    gallerie_edit.remove();
    const header = document.querySelector("header");
    header.style.margin = "50px 0px 100px 0px";
    const filter = document.querySelector(".filter");
    filter.style.display = "flex"
}

//récupération des traveaux
async function fetchwork() {
    const reception = await fetch('http://localhost:5678/api/works');
    const works = await reception.json();
    return works;
}

//récupération des catégories
async function fetchcate() {
    const catreception = await fetch('http://localhost:5678/api/categories');
    const catarray = await catreception.json();
    const catlist = new Set(catarray) 
    console.log(catlist);
    let uniquecatlist = [...catlist];
    return uniquecatlist;
}

//On crée le filtre
async function filterbuilder() {
    workcategories = await fetchcate();
    let workcat = workcategories.unshift({id:0, name: "Tous"});
    console.log(workcategories);
    let filterlist = `<div class="filter__container">`
    
    workcategories.forEach(Element => {
        filterlist += `<div class="filter__item" id=${Element.id}>${Element.name}</div>`;
    });
    filterlist += `</div>`;
    document.querySelector(".filter").innerHTML = filterlist;
    let filters = document.querySelectorAll(".filter__item");
    console.log(filters);
    filters.forEach(Element => {
        Element.addEventListener("click", async function(){
            let active__cat = Element.id;
            console.log(active__cat);
            if (active__cat != "0") {
                console.log(active__cat);
                async function galleryfiltered() {
                    let active__works = await fetchwork();
                    let active_gallery = ``;
                    for (let i=0; i < active__works.length; i++) {
                        if (active__cat == active__works[i].categoryId) { 
                            let newgallery = `<figure>`;
                            let new__work = `<figcaption><img src=${active__works[i].imageUrl} alt=${active__works[i].title}><figcaption>${active__works[i].title}</figcaption>`
                            newgallery += new__work+`</figure>`
                            active_gallery += newgallery;
                        }
                        
                    }
                    document.querySelector(".gallery").innerHTML = active_gallery;
                }
                galleryfiltered();
            }
            else {
                document.querySelector(".gallery").innerHTML = ``;
                gallerybuilder();
            }
        })
    })

}

//On crée la gallerie
async function gallerybuilder() {
    workslist = await fetchwork();
    for (let i=0; i < workslist.length; i++) {
                let work = document.createElement("figure");
                work.innerHTML = `<figcaption><img src=${workslist[i].imageUrl} alt=${workslist[i].title}><figcaption>${workslist[i].title}</figcaption>`
                document.querySelector(".gallery").appendChild(work);
            };
}

//On crée la gallerie modal
async function gallerybuildermodale() {
    workslist = await fetchwork();
    for (let i=0; i < workslist.length; i++) {
                let work = document.createElement("figure");
                work.innerHTML = 
                `<div class="modal__elements">
                <img src = "/FrontEnd/assets/icons/Move.svg" class="modal-move">
                <img src= "/FrontEnd/assets/icons/bin.svg" class="modal-delete" data-id=${workslist[i].id}>
                </div>
                <img src=${workslist[i].imageUrl} alt=${workslist[i].title} class="modal__figure">
                <figcaption><p>editer</p></figcaption>`
                work.classList.add("modal__work")
                document.querySelector(".modal__gallerie").appendChild(work);
                //on a déplacer supprimer()
            };
    supprimer();

}

//On prépare la suppréssion
function supprimer() {
    const poubelle = document.querySelectorAll(".modal-delete");
    poubelle.forEach((poubelle) => {
        poubelle.addEventListener("click", () => {
        let id = poubelle.dataset.id;
        fetch(`http://localhost:5678/api/works/${id}`, {
            method: "DELETE",
            headers: {
            Authorization: `Bearer ${logged}`,
            },
        }).then((response) => {
            if (response.ok) {
            poubelle.closest(".modal-work").remove();
            for (let i = 0; i < workslist.length; i++) {
                if (workslist[i].id == id) {
                workslist.splice(i, 1);
                if (workslist.length < 1) {
                    let modal = document.querySelector("#modal");
                    modal.style.display = "none";
                    }
                }
                gallerybuildermodale();
            }
        }
        });
    });
    });
} 

