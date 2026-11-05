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

const lista = document.querySelector(".list");

async function carregarItens() {
    try {
        const itens = await fetch(`${API}/itens`)
            .then(r => r.json());

        lista.innerHTML = "";


        itens.forEach(item => {            
            lista.innerHTML += `
                <div class="item">
                <div class="infos">
                    <img src="${item.foto_exemplo}">
                    <h3>${item.nome}</h3>
                    <p>${item.comodo}</p>
                    <p>${item.categoria}</p>
                </div>
                <div class="interacao">
                    <div class="check">
                    <label>
                        <input
                            type="checkbox"
                            name="presente"
                            ${item.presente ? "checked" : ""}
                            onchange="presente(${item.id}, this.checked)"
                        >
                        <p>Presente</p>
                    </label>

                    <label>
                        <input
                            type="checkbox"
                            name="adquirido"
                            ${item.adquirido ? "checked" : ""}
                            onchange="adquirido(${item.id}, this.checked)"
                        >
                        <p>Adquirido</p>
                    </label>
                    </div>

                    <div class="imagines">
                    <button onclick="editar(${item.id})">✏️</button>
                    <button onclick="deletar(${item.id})">🗑️</button>
                    </div>
                </div>
                </div>
            `;
        });
    } catch (erro) {
        console.error("Erro ao carregar itens:", erro);
    }
}

carregarItens();

setInterval(carregarItens, 5000);

async function presente(id, valor) {
    try {
        await fetch(`${API}/itens/${id}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                presente: valor
            })
        });
    } catch (erro) {
        console.error("Erro ao atualizar presente:", erro);
    }
}

async function adquirido(id, valor) {
  try {
    await fetch(`${API}/itens/${id}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            adquirido: valor
        })
    });
} catch (erro) {
    console.error("Erro ao atualizar presente:", erro);
}
}

const fundo = document.getElementById("fundo");

async function editar(id) {
    fundo.style.display = "flex";

    try {
        const item = await fetch(`${API}/itens/${id}`).then(r => r.json());

          fundo.innerHTML += `
            <div class="preto" onclick="sairEdicao()">
            </div>
            <div id="form" class="form">
                <h2 id="titulo">Informações</h2>
                <div class="content" id="content">
                    <div class="foto" id="imagens">
                        <img src="${item.foto_exemplo}" id="amostra">
                    </div>
                    <div class="entradas" id="entradas">
                        <div class="inputs">
                            <input type="text" id="nome" placeholder="Nome do item" required class="input" value="${item.nome}">
                            <input type="text" id="foto" placeholder="foto de exemplo" class="input" value="${item.foto_exemplo}">
                            <input type="text" id="link-exemplo" placeholder="Link de exemplo" class="input" value="${item.link_exemplo}">
                        </div>
                        <div class="selects">
                            <select id="comodo_pop">
                            </select>
                            <select id="categoria_pop"></select>
                        </div>
                        <div class="button">
                            <button onclick="salvarAlteracao(${item.id})">Salvar</button>
                        </div>
                    </div>
                </div>
            </div>
        `;

        const selectComodo = document.querySelector("#comodo_pop");
        const selectCategoria = document.querySelector("#categoria_pop");

        const comodos = await fetch(`${API}/comodo`).then(r => r.json());
            
        const categorias = await fetch(`${API}/categoria`).then(r => r.json());

        selectComodo.innerHTML += `
            <option value="${item.comodo}">${item.comodo}</option>
        `;

        selectCategoria.innerHTML += `
            <option value="${item.categoria}">${item.categoria}</option>
        `;

        comodos.forEach(comodo => {
            if(comodo != item.comodo){
                selectComodo.innerHTML += `
                    <option value="${comodo}">
                        ${comodo}
                    </option>
                `;
            }
        });

        categorias.forEach(categoria => {
            if(categoria != item.categoria){
                selectCategoria.innerHTML += `
                    <option value="${categoria}">
                        ${categoria}
                    </option>
                `;
            }
        });
    } catch (erro) {
        console.error("Erro ao carregar itens:", erro);
    }

    
}

function sairEdicao() {
    fundo.style.display = "none";
    fundo.innerHTML = "";
}

async function deletar(id) {
  try {
    const response = await fetch(`${API}/itens/${id}`, {
        method: "DELETE"
    });

    if (!response.ok) {
        throw new Error("Erro ao excluir item");
    }

    location.reload();

  } catch (error) {
      console.error(error);
      alert("Erro ao excluir item");
  }
}

async function salvarAlteracao(id) {
    const selectComodo = document.querySelector("#comodo_pop");
    const selectCategoria = document.querySelector("#categoria_pop");

    const item = {
        nome: document.querySelector("#nome").value,
		foto_exemplo: document.querySelector("#foto").value,
		link_exemplo: document.querySelector("#link-exemplo").value,
        comodo: selectComodo.value,
        categoria: selectCategoria.value,
    };

    await fetch(`${API}/itens/${id}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(item)
    });

    sairEdicao();
    carregarItens();
}