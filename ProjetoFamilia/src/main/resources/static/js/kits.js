
const tabela = document.getElementById("tabelaKits");

let kits = [];


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


// CARREGAR KITS

carregarKits();

