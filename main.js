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
              <img src="${item.foto_exemplo}">
              <h3>${item.nome}</h3>
              <p>${item.comodo}</p>
              <p>${item.categoria}</p>

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

async function adiquirido(id) {
  const response = await fetch(
    `https://lista-itens-casamento.onrender.com/itens/${id}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        adquirido: document.querySelector("#adquirido").checked
      })
    }
  );

  return await response.json();
}

async function editar(id) {
  alert(`editar: ${id}`);
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