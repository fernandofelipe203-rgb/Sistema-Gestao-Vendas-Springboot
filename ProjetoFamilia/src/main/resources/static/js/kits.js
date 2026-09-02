
const tabela = document.getElementById("tabelaKits");

let kits = [];
let kitSelecionadoId = null;

// LISTAR KITS

async function carregarKits() {

    try {

        const resposta = await fetch("/kits");

        if (!resposta.ok) {
            throw new Error("Erro ao buscar kits");
        }

        kits = await resposta.json();

        console.log("Kits recebidos:", kits);

        tabela.innerHTML = "";

        kits.forEach(kit => {

            const linha = document.createElement("tr");

            linha.innerHTML = `
                <td>${kit.id}</td>
                <td>${kit.nome}</td>
                <td>R$ ${kit.valor}</td>
                <td>
                    <button onclick="editarKit(${kit.id})">
                        Editar
                    </button>
                    <button onclick="verItensKit(${kit.id})">
                        Ver itens
                    </button>
                    <button onclick="excluirKit(${kit.id})">
                        Excluir
                    </button>
                </td>
            `;

            tabela.appendChild(linha);

        });

    } catch (erro) {

        console.error("Erro:", erro);

    }

}


// ELEMENTOS DO FORMULÁRIO

const btnNovoKit = document.getElementById("btnNovoKit");
const formularioKit = document.getElementById("formularioKit");
const btnCancelar = document.getElementById("btnCancelar");
const btnFecharItens = document.getElementById("btnFecharItens");
const areaItensKit = document.getElementById("areaItensKit");

btnFecharItens.addEventListener("click", function() {

    areaItensKit.style.display = "none";

    kitSelecionadoId = null;

});


// ABRIR FORMULÁRIO

btnNovoKit.addEventListener("click", function() {

    formularioKit.style.display = "block";

});


// CANCELAR

btnCancelar.addEventListener("click", function() {

    formularioKit.style.display = "none";

    document.getElementById("idKit").value = "";
    document.getElementById("nome").value = "";
    document.getElementById("valor").value = "";

    document.getElementById("tituloFormulario").textContent =
        "Cadastrar Kit";

});


// SALVAR KIT

const btnSalvar = document.getElementById("btnSalvar");

btnSalvar.addEventListener("click", async function() {

    const nome = document.getElementById("nome").value;
    const valor = Number(document.getElementById("valor").value);
    const id = document.getElementById("idKit").value;

    const kit = {
        nome: nome,
        valor: valor
    };

    try {

        const url = id ? `/kits/${id}` : "/kits";

        const metodo = id ? "PUT" : "POST";

        const resposta = await fetch(url, {

            method: metodo,

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify(kit)

        });

        if (!resposta.ok) {
            throw new Error("Erro ao salvar kit");
        }

        const kitSalvo = await resposta.json();

        console.log("Kit salvo:", kitSalvo);

        if (id) {
            alert("Kit atualizado com sucesso!");
        } else {
            alert("Kit salvo com sucesso!");
        }

        formularioKit.style.display = "none";

        document.getElementById("idKit").value = "";
        document.getElementById("nome").value = "";
        document.getElementById("valor").value = "";

        document.getElementById("tituloFormulario").textContent =
            "Cadastrar Kit";

        carregarKits();

    } catch (erro) {

        console.error("Erro:", erro);

        alert("Erro ao salvar kit.");

    }

});


// EXCLUIR KIT


async function excluirKit(id) {

    const confirmar = confirm(
        "Tem certeza que deseja excluir este kit?"
    );

    if (!confirmar) {
        return;
    }

    try {

        const resposta = await fetch(`/kits/${id}`, {
            method: "DELETE"
        });

        if (!resposta.ok) {

            const erro = await resposta.text();

            console.error("Erro retornado pelo servidor:", erro);

            throw new Error(
                `Erro ao excluir kit. Status: ${resposta.status}`
            );
        }

        alert("Kit excluído com sucesso!");

        carregarKits();

    } catch (erro) {

        console.error("Erro:", erro);

        alert("Não foi possível excluir este kit. Ele já está associado a uma venda.");

    }
}




// EDITAR KIT

function editarKit(id) {

    const kit = kits.find(k => k.id === id);

    if (!kit) {

        alert("Kit não encontrado.");

        return;

    }

    document.getElementById("idKit").value = kit.id;
    document.getElementById("nome").value = kit.nome;
    document.getElementById("valor").value = kit.valor;

    document.getElementById("tituloFormulario").textContent =
        "Editar Kit";

    formularioKit.style.display = "block";

}

// ITENS DO KIT
// ================================

async function verItensKit(kitId) {

    kitSelecionadoId = kitId;

    const area = document.getElementById("areaItensKit");

    area.style.display = "block";

    const kit = kits.find(k => k.id === kitId);

    if (kit) {
        document.getElementById("tituloItensKit").textContent =
            `Produtos do Kit ${kit.nome}`;
    }

    await carregarItensKit(kitId);
}
async function carregarItensKit(kitId) {

    try {

        const resposta = await fetch(`/kits/${kitId}/itens`);

        if (!resposta.ok) {
            throw new Error("Erro ao buscar itens do kit");
        }

        const itens = await resposta.json();

        const tabelaItens =
            document.getElementById("tabelaItensKit");

        tabelaItens.innerHTML = "";

        itens.forEach(item => {

            const linha = document.createElement("tr");

            linha.innerHTML = `
                <td>${item.produto.nome}</td>
                <td>${item.quantidade}</td>
                <td>
                    <button onclick="excluirItemKit(${kitId}, ${item.id})">
                        Excluir
                    </button>
                </td>
            `;

            tabelaItens.appendChild(linha);

        });

    } catch (erro) {

        console.error("Erro:", erro);

        alert("Erro ao carregar produtos do kit.");

    }
}
async function excluirItemKit(kitId, itemId) {

    const confirmar = confirm(
        "Deseja remover este produto do kit?"
    );

    if (!confirmar) {
        return;
    }

    try {

        const resposta = await fetch(
            `/kits/${kitId}/itens/${itemId}`,
            {
                method: "DELETE"
            }
        );

        if (!resposta.ok) {
            throw new Error("Erro ao excluir item");
        }

        alert("Produto removido do kit!");

        carregarItensKit(kitId);

    } catch (erro) {

        console.error("Erro:", erro);

        alert("Não foi possível remover o produto.");

    }
}
async function carregarProdutos() {

    const select = document.getElementById("produto");

    try {

        const resposta = await fetch("/produtos");

        if (!resposta.ok) {
            throw new Error("Erro ao buscar produtos");
        }

        const produtos = await resposta.json();

        select.innerHTML = `
            <option value="">
                Selecione um produto
            </option>
        `;

        produtos.forEach(produto => {

            const option = document.createElement("option");

            option.value = produto.id;
            option.textContent = produto.nome;

            select.appendChild(option);

        });

    } catch (erro) {

        console.error("Erro:", erro);

        alert("Não foi possível carregar os produtos.");

    }
}
// ADICIONAR PRODUTO AO KIT
// ================================

const btnAdicionarProduto =
    document.getElementById("btnAdicionarProduto");

btnAdicionarProduto.addEventListener("click", async function() {

    const produtoId =
        document.getElementById("produto").value;

    const quantidade =
        Number(document.getElementById("quantidadeProduto").value);

    if (!kitSelecionadoId) {
        alert("Primeiro selecione um kit.");
        return;
    }

    if (!produtoId) {
        alert("Selecione um produto.");
        return;
    }

    if (!quantidade || quantidade <= 0) {
        alert("Informe uma quantidade válida.");
        return;
    }

    const item = {
        produtoId: Number(produtoId),
        quantidade: quantidade
    };

    console.log("Enviando:", item);
    console.log("Kit:", kitSelecionadoId);

    try {

        const resposta = await fetch(
            `/kits/${kitSelecionadoId}/itens`,
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify(item)
            }
        );

        if (!resposta.ok) {

            const erro = await resposta.text();

            console.error("Erro do servidor:", erro);

            throw new Error(
                `Erro ao adicionar produto. Status: ${resposta.status}`
            );
        }

        const itemSalvo = await resposta.json();

        console.log("Item salvo:", itemSalvo);

        alert("Produto adicionado ao kit!");

        document.getElementById("quantidadeProduto").value = "";

        await carregarItensKit(kitSelecionadoId);

    } catch (erro) {

        console.error("Erro:", erro);

        alert("Não foi possível adicionar o produto ao kit.");

    }

});
// CARREGAR KITS

carregarKits();
carregarProdutos();

