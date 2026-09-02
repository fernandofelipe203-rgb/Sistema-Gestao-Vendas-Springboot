const tabela = document.getElementById("tabelaVendas");

let vendas = [];
let vendaSelecionada = null;
let modoEdicao = false;
let vendaEditandoId = null;


// ===============================
// CARREGAR VENDAS
// ===============================

async function carregarVendas() {

    try {

        const resposta = await fetch("/vendas");

        if (!resposta.ok) {
            throw new Error("Erro ao buscar vendas");
        }

        vendas = await resposta.json();

        console.log("Vendas recebidas:", vendas);
        await atualizarVendasAtrasadas();

        preencherTabela();
        atualizarCards();

    } catch (erro) {

        console.error("Erro:", erro);

    }

}


// ===============================
// PREENCHER TABELA
// ===============================

function preencherTabela(lista = vendas) {

    tabela.innerHTML = "";

    lista.forEach(venda => {

        const linha = document.createElement("tr");

        let classeStatus = "";

        if (venda.estadoAtual === "pago") {
            classeStatus = "status-pago";
        } else if (venda.estadoAtual === "pendente") {
            classeStatus = "status-pendente";
        } else if (venda.estadoAtual === "atrasado") {
            classeStatus = "status-atrasado";
        }

        linha.innerHTML = `
            <td>${venda.id}</td>

            <td>
                ${venda.cliente?.nome ?? "Cliente não informado"}
            </td>

                <td>
                    ${venda.kit?.nome ?? "Kit não informado"}
                </td>

                <td>
                    ${formatarMoeda(venda.kit?.valor)}
                </td>

                <td>
                    ${formatarMoeda(venda.custoKit)}
                </td>

                <td class="${venda.lucro >= 0 ? 'lucro-positivo' : 'lucro-negativo'}">
                    ${formatarMoeda(venda.lucro)}
                </td>

                <td>
                    ${formatarData(venda.dataCompra)}
                </td>

            <td>
                ${formatarData(venda.dataVencimento)}
            </td>

            <td>
                <span class="status ${classeStatus}">
                    ${venda.estadoAtual}
                </span>

                ${
                    venda.estadoAtual === "atrasado"
                        ? `<div class="dias-atraso">
                            há ${calcularDiasAtraso(venda.dataVencimento)} dias
                           </div>`
                        : ""
                }
            </td>

            <td>
                <button
                    class="btn-detalhes"
                    onclick="verDetalhes(${venda.id})">
                    Ver
                </button>
            </td>
        `;

        tabela.appendChild(linha);

    });

}
function filtrarVendas() {

    const statusSelecionado =
        document.getElementById("filtroStatus").value;

    const busca =
        document.getElementById("campoBusca").value.toLowerCase();

    const vendasFiltradas = vendas.filter(venda => {

        const nomeCliente =
            venda.cliente?.nome?.toLowerCase() ?? "";

        const nomeKit =
            venda.kit?.nome?.toLowerCase() ?? "";

        const correspondeStatus =
            !statusSelecionado ||
            venda.estadoAtual === statusSelecionado;

        const correspondeBusca =
            nomeCliente.includes(busca) ||
            nomeKit.includes(busca);

        return correspondeStatus && correspondeBusca;
    });

    preencherTabela(vendasFiltradas);
}


// ===============================
// ATUALIZAR CARDS
// ===============================

function atualizarCards() {
    const totalVendas = vendas.length;
    const faturamentoTotal = vendas.reduce(
        (total, venda) => total + (venda.kit?.valor ?? 0),
        0
    );
    const aReceberTotal = vendas
        .filter(venda =>
            venda.estadoAtual === "pendente" ||
            venda.estadoAtual === "atrasado"
        )
        .reduce(
            (total, venda) => total + (venda.kit?.valor ?? 0),
            0
        );
        const recebidoTotal = vendas
            .filter(venda => venda.estadoAtual === "pago")
            .reduce(
                (total, venda) => total + (venda.kit?.valor ?? 0),
                0
            );

    const pagas = vendas.filter(
        venda => venda.estadoAtual === "pago"
    ).length;

    const pendentes = vendas.filter(
        venda => venda.estadoAtual === "pendente"
    ).length;

    const atrasadas = vendas.filter(
        venda => venda.estadoAtual === "atrasado"
    ).length;
    const lucroTotal = vendas
        .filter(venda => venda.estadoAtual === "pago")
        .reduce(
            (total, venda) => total + (venda.lucro ?? 0),
            0
        );
    document.getElementById("totalVendas").textContent =
        totalVendas;

        document.getElementById("faturamentoTotal").textContent =
            formatarMoeda(faturamentoTotal);
    document.getElementById("aReceberTotal").textContent =
        formatarMoeda(aReceberTotal);

        document.getElementById("recebidoTotal").textContent =
            formatarMoeda(recebidoTotal);


    document.getElementById("totalPagas").textContent = pagas;

    document.getElementById("totalPendentes").textContent = pendentes;

    document.getElementById("totalAtrasadas").textContent = atrasadas;

    document.getElementById("lucroTotal").textContent =
        formatarMoeda(lucroTotal);

        const elementoLucroTotal =
            document.getElementById("lucroTotal");

        elementoLucroTotal.classList.remove(
            "lucro-positivo",
            "lucro-negativo"
        );

        elementoLucroTotal.classList.add(
            lucroTotal >= 0
                ? "lucro-positivo"
                : "lucro-negativo"
        );

}


// ===============================
// FORMATAR DATA
// ===============================

function formatarData(data) {

    if (!data) {
        return "-";
    }
    // ===============================
    // ATUALIZAR STATUS ATRASADOS
    // ===============================



    const partes = data.split("-");

    return `${partes[2]}/${partes[1]}/${partes[0]}`;
}

// ===============================
// CALCULAR DIAS DE ATRASO
// ===============================

function calcularDiasAtraso(dataVencimento) {

    if (!dataVencimento) {
        return 0;
    }

    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);

    const vencimento =
        new Date(dataVencimento + "T00:00:00");

    const diferenca =
        hoje - vencimento;

    const dias =
        Math.floor(diferenca / (1000 * 60 * 60 * 24));

    return dias > 0 ? dias : 0;
}
async function atualizarVendasAtrasadas() {

    const hoje = new Date();

    hoje.setHours(0, 0, 0, 0);

    const vendasAtrasadas = [];

    vendas.forEach(venda => {

        if (
            venda.estadoAtual === "pendente" &&
            venda.dataVencimento
        ) {

            const vencimento =
                new Date(venda.dataVencimento + "T00:00:00");

            if (vencimento < hoje) {

                venda.estadoAtual = "atrasado";

                vendasAtrasadas.push(venda);
            }
        }
    });


    // Se não encontrou nenhuma venda atrasada
    if (vendasAtrasadas.length === 0) {
        return;
    }


    // Salvar as alterações no banco
    for (const venda of vendasAtrasadas) {

        try {

            const resposta = await fetch(
                `/vendas/${venda.id}`,
                {
                    method: "PUT",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({
                        cliente: {
                            id: venda.cliente.id
                        },

                        kit: {
                            id: venda.kit.id
                        },

                        dataCompra: venda.dataCompra,

                        prazo: venda.prazo,

                        dataVencimento: venda.dataVencimento,

                        estadoAtual: "atrasado"
                    })
                }
            );


            if (!resposta.ok) {

                throw new Error(
                    `Erro ao atualizar venda ${venda.id}`
                );
            }


            console.log(
                `Venda ${venda.id} atualizada para atrasado.`
            );


        } catch (erro) {

            console.error(
                `Erro ao atualizar venda ${venda.id}:`,
                erro
            );
        }
    }
}


// ===============================
// VER DETALHES
// ===============================


function verDetalhes(id) {
    vendaSelecionada = id;

    const venda = vendas.find(
        venda => venda.id === id
    );

    if (!venda) {
        return;
    }


    // ID DA VENDA

    document.getElementById("modalVendaId").textContent =
        venda.id;


    // CLIENTE

    document.getElementById("modalClienteNome").textContent =
        venda.cliente?.nome ?? "Cliente não informado";

    document.getElementById("modalClienteTelefone").textContent =
        "📞 " + (venda.cliente?.telefone ?? "Telefone não informado");

    document.getElementById("modalClienteEndereco").textContent =
        "📍 " + (venda.cliente?.endereco ?? "Endereço não informado");


    // KIT

    document.getElementById("modalKitNome").textContent =
        venda.kit?.nome ?? "Kit não informado";


    document.getElementById("modalKitValor").textContent =
        formatarMoeda(venda.kit?.valor);

        document.getElementById("modalValorVenda").textContent =
            formatarMoeda(venda.kit?.valor);

        document.getElementById("modalCustoKit").textContent =
            formatarMoeda(venda.custoKit);

        const modalLucro = document.getElementById("modalLucro");

        modalLucro.textContent =
            formatarMoeda(venda.lucro);

        modalLucro.className =
            venda.lucro >= 0
                ? "lucro-positivo"
                : "lucro-negativo";


    // ITENS DO KIT

    const listaItens = document.getElementById("modalItensKit");

    listaItens.innerHTML = "";


    if (venda.kit?.itens && venda.kit.itens.length > 0) {

        venda.kit.itens.forEach(item => {

            const div = document.createElement("div");

            div.className = "item-kit";

            div.innerHTML = `
                <span>
                    ${item.produto?.nome ?? "Produto não informado"}
                </span>

                <span>
                    ${item.quantidade}
                </span>
            `;

            listaItens.appendChild(div);

        });

    } else {

        listaItens.innerHTML =
            "<span>Nenhum item encontrado.</span>";

    }


    // DATAS

    document.getElementById("modalDataCompra").textContent =
        formatarData(venda.dataCompra);

    document.getElementById("modalDataVencimento").textContent =
        formatarData(venda.dataVencimento);

    document.getElementById("modalPrazo").textContent =
        venda.prazo;


    // STATUS

    const status = document.getElementById("modalStatus");

    status.textContent = venda.estadoAtual;

    status.className = "status";


    if (venda.estadoAtual === "pago") {

        status.classList.add("status-pago");

    } else if (venda.estadoAtual === "pendente") {

        status.classList.add("status-pendente");

    } else if (venda.estadoAtual === "atrasado") {

        status.classList.add("status-atrasado");

    }


    // ABRIR MODAL

    document.getElementById("modalVenda").style.display = "flex";

}

function fecharModal() {

    document.getElementById("modalVenda").style.display = "none";

}
async function excluirVenda() {

    if (!vendaSelecionada) {
        return;
    }

    const confirmar = confirm(
        "Tem certeza que deseja excluir esta venda?"
    );

    if (!confirmar) {
        return;
    }

    try {

        const resposta = await fetch(
            `/vendas/${vendaSelecionada}`,
            {
                method: "DELETE"
            }
        );

        if (!resposta.ok) {
            throw new Error("Erro ao excluir venda");
        }

        fecharModal();

        await carregarVendas();

        vendaSelecionada = null;

        alert("Venda excluída com sucesso!");

    } catch (erro) {

        console.error("Erro ao excluir venda:", erro);

        alert("Erro ao excluir a venda.");

    }
}
async function editarVenda() {

    if (!vendaSelecionada) {
        return;
    }

    const venda = vendas.find(
        venda => venda.id === vendaSelecionada
    );

    if (!venda) {
        return;
    }

    // Ativa modo edição
    modoEdicao = true;
    vendaEditandoId = venda.id;

    console.log("Editando venda:", venda);

    // Fecha detalhes
    fecharModal();

    // Abre formulário
    document.getElementById("modalNovaVenda").style.display = "flex";

    // Carrega clientes e kits
    await carregarClientesVenda();
    await carregarKitsVenda();

    // =========================
    // PREENCHER DADOS
    // =========================

    document.getElementById("selectCliente").value =
        venda.cliente?.id ?? "";

    document.getElementById("selectKit").value =
        venda.kit?.id ?? "";

    document.getElementById("novaDataCompra").value =
        venda.dataCompra ?? "";

    document.getElementById("novoPrazo").value =
        String(venda.prazo ?? 7);

    document.getElementById("novoStatus").value =
        venda.estadoAtual ?? "pendente";

    // Calcula novamente o vencimento
    calcularVencimento();

    // Atualiza informações do cliente
    document
        .getElementById("selectCliente")
        .dispatchEvent(new Event("change"));

    // Atualiza informações do kit
    document
        .getElementById("selectKit")
        .dispatchEvent(new Event("change"));
}


function formatarMoeda(valor) {

    if (valor == null) {
        valor = 0;
    }

    return valor.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });

}





// ===============================
// INICIAR
// ===============================

carregarVendas();

document.querySelector(".btn-nova-venda")
    .addEventListener("click", abrirNovaVenda);

async function abrirNovaVenda() {

    document.getElementById("modalNovaVenda").style.display = "flex";

    await carregarClientesVenda();
    await carregarKitsVenda();

    const hoje = new Date().toISOString().split("T")[0];

    document.getElementById("novaDataCompra").value = hoje;

    calcularVencimento();
}

function fecharNovaVenda() {
    document.getElementById("modalNovaVenda").style.display = "none";

        modoEdicao = false;
        vendaEditandoId = null;
}
// ===============================
// CALCULAR VENCIMENTO
// ===============================

function calcularVencimento() {

    const dataCompra =
        document.getElementById("novaDataCompra").value;

    const prazo =
        parseInt(document.getElementById("novoPrazo").value);

    const campoVencimento =
        document.getElementById("novaDataVencimento");

    if (!dataCompra || !prazo) {
        campoVencimento.value = "";
        return;
    }

    const data = new Date(dataCompra + "T00:00:00");

    data.setDate(data.getDate() + prazo);

    const ano = data.getFullYear();
    const mes = String(data.getMonth() + 1).padStart(2, "0");
    const dia = String(data.getDate()).padStart(2, "0");

    campoVencimento.value =
        `${ano}-${mes}-${dia}`;
}
document.getElementById("novaDataCompra")
    .addEventListener("change", calcularVencimento);

document.getElementById("novoPrazo")
    .addEventListener("change", calcularVencimento);

async function carregarClientesVenda() {

    const select = document.getElementById("selectCliente");

    try {

        const resposta = await fetch("/clientes");

        if (!resposta.ok) {
            throw new Error("Erro ao buscar clientes");
        }

        const clientes = await resposta.json();

        console.log("Clientes recebidos:", clientes);
        console.log("Select encontrado:", select);

        select.innerHTML = "";

        const opcaoInicial = document.createElement("option");
        opcaoInicial.value = "";
        opcaoInicial.textContent = "Selecione um cliente";

        select.appendChild(opcaoInicial);

        clientes.forEach(cliente => {

            const option = document.createElement("option");

            option.value = cliente.id;
            option.textContent = cliente.nome;

            select.appendChild(option);

        });

        console.log("Opções no select:", select.options.length);

    } catch (erro) {

        console.error("Erro ao carregar clientes:", erro);

    }
}
// ===============================
// SELECIONAR CLIENTE
// ===============================

document.getElementById("selectCliente").addEventListener("change", async function () {

    const id = this.value;

    const info = document.getElementById("infoCliente");

    if (!id) {

        info.style.display = "none";

        return;
    }

    try {

        const resposta = await fetch(`/clientes/${id}`);

        if (!resposta.ok) {
            throw new Error("Erro ao buscar cliente");
        }

        const cliente = await resposta.json();

        console.log("Cliente selecionado:", cliente);

        document.getElementById("novoClienteNome").textContent =
            cliente.nome;

        document.getElementById("novoClienteTelefone").textContent =
            "📞 " + (cliente.telefone ?? "Telefone não informado");

        document.getElementById("novoClienteEndereco").textContent =
            "📍 " + (cliente.endereco ?? "Endereço não informado");

        info.style.display = "flex";

    } catch (erro) {

        console.error("Erro ao carregar cliente:", erro);

    }

});
let kitsVenda = [];

async function carregarKitsVenda() {

    const select = document.getElementById("selectKit");

    try {

        const resposta = await fetch("/kits");

        if (!resposta.ok) {
            throw new Error("Erro ao buscar kits");
        }

        kitsVenda = await resposta.json();

        console.log("Kits recebidos:", kitsVenda);

        select.innerHTML = `
            <option value="">Selecione um kit</option>
        `;

        kitsVenda.forEach(kit => {

            const option = document.createElement("option");

            option.value = kit.id;
            option.textContent = kit.nome;

            select.appendChild(option);

        });

    } catch (erro) {

        console.error("Erro ao carregar kits:", erro);

    }
}
// KIT
document.getElementById("selectKit").addEventListener("change", function () {

    const id = parseInt(this.value);

    const infoKit = document.getElementById("infoKit");
    const listaItens = document.getElementById("novoItensKit");

    if (!id) {

        infoKit.style.display = "none";

        listaItens.innerHTML =
            "<span>Selecione um kit para visualizar os itens.</span>";

        return;
    }

    const kit = kitsVenda.find(k => k.id === id);

    if (!kit) {

        console.error("Kit não encontrado:", id);

        return;
    }

    // Nome do kit
    document.getElementById("novoKitNome").textContent =
        kit.nome;

    // Valor do kit
    document.getElementById("novoKitValor").textContent =
        formatarMoeda(kit.valor);

    infoKit.style.display = "block";

    // Limpa os itens anteriores
    listaItens.innerHTML = "";

    if (kit.itens && kit.itens.length > 0) {

        kit.itens.forEach(item => {

            const div = document.createElement("div");

            div.className = "item-kit";

            div.innerHTML = `
                <span>${item.produto?.nome ?? "Produto não informado"}</span>
                <span>${item.quantidade}</span>
            `;

            listaItens.appendChild(div);
        });

    } else {

        listaItens.innerHTML =
            "<span>Nenhum item encontrado.</span>";
    }

});
// ===============================
// SALVAR NOVA VENDA
// ===============================

async function salvarNovaVenda() {

    const clienteId =
        document.getElementById("selectCliente").value;

    const kitId =
        document.getElementById("selectKit").value;

    const dataCompra =
        document.getElementById("novaDataCompra").value;

    const prazo =
        parseInt(document.getElementById("novoPrazo").value);

    const dataVencimento =
        document.getElementById("novaDataVencimento").value;

    const estadoAtual =
        document.getElementById("novoStatus").value;


    // ===============================
    // VALIDAÇÕES
    // ===============================

    if (!clienteId) {
        alert("Selecione um cliente.");
        return;
    }

    if (!kitId) {
        alert("Selecione um kit.");
        return;
    }

    if (!dataCompra) {
        alert("Informe a data da compra.");
        return;
    }


    // ===============================
    // MONTAR VENDA
    // ===============================

    const venda = {

        cliente: {
            id: parseInt(clienteId)
        },

        kit: {
            id: parseInt(kitId)
        },

        dataCompra: dataCompra,

        prazo: prazo,

        dataVencimento: dataVencimento,

        estadoAtual: estadoAtual

    };


    console.log("Venda sendo enviada:", venda);


    try {

        let url = "/vendas";
        let metodo = "POST";

        if (modoEdicao) {
            url = `/vendas/${vendaEditandoId}`;
            metodo = "PUT";
        }

        const resposta = await fetch(url, {
            method: metodo,

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify(venda)

        });


        if (!resposta.ok) {

            const erroTexto = await resposta.text();

            console.error("Erro do servidor:", erroTexto);

            throw new Error("Erro ao salvar venda");

        }


        const novaVenda = await resposta.json();

        console.log("Venda salva:", novaVenda);


        // ===============================
        // FECHAR MODAL
        // ===============================
        const estavaEditando = modoEdicao;
        fecharNovaVenda();


        // ===============================
        // RECARREGAR TABELA
        // ===============================

        await   carregarVendas();


       if (estavaEditando) {
           alert("Venda atualizada com sucesso!");
       } else {
           alert("Venda cadastrada com sucesso!");
       }


    } catch (erro) {

        console.error("Erro ao salvar venda:", erro);

        alert("Erro ao salvar a venda.");

    }

}
document.getElementById("modalVenda").style.display = "none";
document.getElementById("modalNovaVenda").style.display = "none";
document.getElementById("filtroStatus")
    .addEventListener("change", filtrarVendas);

document.getElementById("campoBusca")
    .addEventListener("input", filtrarVendas);