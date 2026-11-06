const API = "https://lista-itens-casamento.onrender.com";

const selectComodo = document.querySelector("#comodo");
const selectCategoria = document.querySelector("#categoria");

async function carregarCombos() {

    const comodos = await fetch(`${API}/comodo`)
        .then(r => r.json());
		
    const categorias = await fetch(`${API}/categoria`)
        .then(r => r.json());

    comodos.forEach(comodo => {
        selectComodo.innerHTML += `
            <option value="${comodo}">
                ${comodo}
            </option>
        `;
    });

    categorias.forEach(categoria => {
        selectCategoria.innerHTML += `
            <option value="${categoria}">
                ${categoria}
            </option>
        `;
    });
}

carregarCombos();

document.querySelector("#form").addEventListener("submit", async (e) => {
    e.preventDefault();

    const item = {
        nome: document.querySelector("#nome").value,
		foto_exemplo: document.querySelector("#foto").value,
		link_exemplo: document.querySelector("#link-exemplo").value,
        comodo: selectComodo.value,
        categoria: selectCategoria.value,
		presente: document.querySelector("#presente").checked,
        adquirido: document.querySelector("#adquirido").checked
    };

    await fetch(`${API}/itens`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(item)
    });

    e.target.reset();
});

const form = document.getElementById("form");
const foto = document.getElementById("amostra");
const links = document.getElementById("links");
const content = document.getElementById("content");

const titulo = document.getElementById("titulo");
const imagens = document.getElementById("imagens");
const entradas = document.getElementById("entradas");


function mudança() {
	if(window.innerHeight > window.innerWidth){
		form.style.width = "80%";
		content.style.flexDirection = "column";
		titulo.style.height = "10%";
		content.style.height = "90%";

		imagens.style.height = "30%";
		imagens.style.width = "100%";

		entradas.style.height = "70%";
		entradas.style.width = "100%";

		links.style.width = "100%";
	} else {
		form.style.width = "50%";
		content.style.flexDirection = "row-reverse";
		titulo.style.height = "20%";
		content.style.height = "80%";

		links.style.width = "80%";

		imagens.style.height = "100%";
		imagens.style.width = "50%";

		entradas.style.height = "100%";
		entradas.style.width = "50%";
	}
}

mudança();

window.addEventListener("resize", () => mudança());

foto.addEventListener("error", function() {
    fotoPadrao();
});

function fotoPadrao() {
    foto.src = "./../Assets/midia/imags/Flores_cotorno.png";
}

fotoPadrao();

const fotoInput = document.getElementById("foto");

fotoInput.addEventListener("input", (e) => {
    foto.src = `${e.target.value}`;
});

