let clienteEditandoId = null;
let clientes = [];
async function listarClientes() {

    const resposta = await fetch("/clientes");

    clientes = await resposta.json();

    const tabela = document.getElementById("tabelaClientes");

    tabela.innerHTML = "";

    clientes.forEach(cliente => {

        const linha = document.createElement("tr");

        linha.innerHTML = `
            <td>${cliente.id}</td>
            <td>${cliente.nome}</td>
            <td>${cliente.telefone}</td>
            <td>${cliente.endereco}</td>
            <td class="acoes">
                <button class="btn-editar" onclick="abrirEdicao(${cliente.id})">
                    Editar
                </button>

                <button class="btn-excluir" onclick="excluirCliente(${cliente.id})">
                    Excluir
                </button>
            </td>
        `;

        tabela.appendChild(linha);
    });
}


function abrirCadastro() {

    clienteEditandoId = null;

    document.getElementById("btnSalvar").textContent = "Cadastrar";

    document.getElementById("modalCadastro").style.display = "flex";
}
async function abrirEdicao(id) {

    const resposta = await fetch(`/clientes/${id}`);

    const cliente = await resposta.json();

    clienteEditandoId = id;

    document.getElementById("nome").value = cliente.nome;
    document.getElementById("telefone").value = cliente.telefone;
    document.getElementById("endereco").value = cliente.endereco;

    document.getElementById("modalCadastro").style.display = "flex";
}


function fecharCadastro() {

    document.getElementById("modalCadastro").style.display = "none";

}


async function cadastrarCliente() {

    const nome = document.getElementById("nome").value;
    const telefone = document.getElementById("telefone").value;
    const endereco = document.getElementById("endereco").value;

    const cliente = {
        nome: nome,
        telefone: telefone,
        endereco: endereco
    };

    const resposta = await fetch("/clientes", {

        method: "POST",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify(cliente)

    });


    if (resposta.ok) {

        alert("Cliente cadastrado com sucesso!");

        fecharCadastro();

        document.getElementById("nome").value = "";
        document.getElementById("telefone").value = "";
        document.getElementById("endereco").value = "";

        listarClientes();

    } else {

        alert("Erro ao cadastrar cliente.");

    }
}
async function salvarCliente() {

    const nome = document.getElementById("nome").value;
    const telefone = document.getElementById("telefone").value;
    const endereco = document.getElementById("endereco").value;

    const cliente = {
        nome: nome,
        telefone: telefone,
        endereco: endereco
    };

    // Se não estiver editando, cadastra
    if (clienteEditandoId === null) {

        const resposta = await fetch("/clientes", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify(cliente)
        });

        if (resposta.ok) {

            alert("Cliente cadastrado com sucesso!");

            fecharCadastro();

            limparFormulario();

            listarClientes();

        } else {

            alert("Erro ao cadastrar cliente.");

        }

        return;
    }

    // Se estiver editando, atualiza
    const resposta = await fetch(`/clientes/${clienteEditandoId}`, {

        method: "PUT",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify(cliente)
    });

    if (resposta.ok) {

        alert("Cliente atualizado com sucesso!");

        fecharCadastro();

        limparFormulario();

        listarClientes();

    } else {

        alert("Erro ao atualizar cliente.");

    }
}
function limparFormulario() {

    document.getElementById("nome").value = "";
    document.getElementById("telefone").value = "";
    document.getElementById("endereco").value = "";

    clienteEditandoId = null;

    document.getElementById("btnSalvar").textContent = "Cadastrar";
}

async function excluirCliente(id) {

    const confirmar = confirm(
        "Deseja realmente excluir este cliente?"
    );

    if (!confirmar) {
        return;
    }

    const resposta = await fetch(`/clientes/${id}`, {
        method: "DELETE"
    });

    if (resposta.ok) {

        alert("Cliente excluído com sucesso!");

        listarClientes();

    } else {

        alert("Erro ao excluir cliente.");

    }
}
function filtrarClientes() {

    const busca = document
        .getElementById("buscarCliente")
        .value
        .toLowerCase();

    const tabela = document.getElementById("tabelaClientes");

    tabela.innerHTML = "";

    const clientesFiltrados = clientes.filter(cliente =>
        cliente.nome.toLowerCase().includes(busca)
    );

    clientesFiltrados.forEach(cliente => {

        const linha = document.createElement("tr");

        linha.innerHTML = `
            <td>${cliente.id}</td>
            <td>${cliente.nome}</td>
            <td>${cliente.telefone}</td>
            <td>${cliente.endereco}</td>

            <td class="acoes">

                <button class="btn-editar" onclick="abrirEdicao(${cliente.id})">
                    Editar
                </button>

                <button class="btn-excluir" onclick="excluirCliente(${cliente.id})">
                    Excluir
                </button>

            </td>
        `;

        tabela.appendChild(linha);
    });
}
// Carrega os clientes automaticamente ao abrir a página
listarClientes();
