
const tabela = document.getElementById("tabelaKits");

let kits = [];
let kitSelecionadoId = null;

function formatarPreco(valor) {
    return Number(valor).toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });
}


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
                <td>${formatarPreco(kit.valor)}</td>
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
const btnFecharFormulario =
    document.getElementById("btnFecharFormulario");

btnFecharFormulario.addEventListener("click", function() {
    formularioKit.style.display = "none";
});

function fecharModalItens() {
    areaItensKit.style.display = "none";
    kitSelecionadoId = null;
}

btnFecharItens.addEventListener("click", fecharModalItens);

document.getElementById("btnFecharX")
    .addEventListener("click", fecharModalItens);


// ABRIR FORMULÁRIO

btnNovoKit.addEventListener("click", function() {

    // Limpa o formulário
    document.getElementById("idKit").value = "";
    document.getElementById("nome").value = "";
    document.getElementById("valor").value = "";
    document.getElementById("custoKit").value = "";
    document.getElementById("lucroKit").value = "";
    document.getElementById("margemLucro").value = "";

    // Limpa a seleção de produto
    const produtoEdicao =
        document.getElementById("produtoEdicao");

    if (produtoEdicao) {
        produtoEdicao.value = "";
    }

    const quantidadeProdutoEdicao =
        document.getElementById("quantidadeProdutoEdicao");

    if (quantidadeProdutoEdicao) {
        quantidadeProdutoEdicao.value = "";
    }

    // Limpa a tabela de produtos
    const tabelaEdicao =
        document.getElementById("tabelaProdutosEdicao");

    if (tabelaEdicao) {
        tabelaEdicao.innerHTML = "";
    }

    // Novo kit não possui ID ainda
    kitSelecionadoId = null;

    // Título
    document.getElementById("tituloFormulario").textContent =
        "Cadastrar Kit";

    // Abre formulário
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
document.getElementById("valor").addEventListener("input", calcularLucroKit);

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

// EDITAR KIT
async function editarKit(id) {

    const kit = kits.find(k => k.id === id);

    if (!kit) {
        alert("Kit não encontrado.");
        return;
    }

    // Define o kit que está sendo editado
    kitSelecionadoId = id;

    document.getElementById("idKit").value = kit.id;
    document.getElementById("nome").value = kit.nome;
    document.getElementById("valor").value = kit.valor;

    document.getElementById("tituloFormulario").textContent =
        "Editar Kit";

    formularioKit.style.display = "block";

    // Carrega produtos do kit
    await carregarItensKit(id);
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
        const tabelaEdicao =
            document.getElementById("tabelaProdutosEdicao");

        if (tabelaEdicao) {
            tabelaEdicao.innerHTML = "";
        }

        let custoTotal = 0;

        itens.forEach(item => {

            const custoProduto =
                item.produto?.preco ?? 0;

            const custoItem =
                custoProduto * item.quantidade;

            custoTotal += custoItem;

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
            if (tabelaEdicao) {

                const linhaEdicao = document.createElement("tr");

                linhaEdicao.innerHTML = `
                    <td>${item.produto.nome}</td>

                    <td>${item.quantidade}</td>

                    <td>
                        <button onclick="excluirItemKit(${kitId}, ${item.id})">
                            Excluir
                        </button>
                    </td>
                `;

                tabelaEdicao.appendChild(linhaEdicao);
            }

        });


        // ===============================
        // CUSTO DO KIT
        // ===============================

        custoTotal =
            Math.round(custoTotal * 100) / 100;


        document.getElementById("custoKit").value =
            custoTotal.toFixed(2);


        // ===============================
        // BUSCAR KIT
        // ===============================

        const kit = kits.find(k => k.id === kitId);

        const valorKit =
            kit?.valor ?? 0;


        // ===============================
        // LUCRO
        // ===============================

        const lucro =
            valorKit - custoTotal;


        // ===============================
        // MARGEM
        // ===============================

        let margem = 0;

        if (valorKit > 0) {

            margem =
                (lucro / valorKit) * 100;

        }


        // ===============================
        // FORMULÁRIO
        // ===============================

        document.getElementById("lucroKit").value =
            lucro.toFixed(2);

        document.getElementById("margemLucro").value =
            margem.toFixed(2) + "%";


        // ===============================
        // MODAL
        // ===============================

        document.getElementById("modalCustoKit").textContent =
            formatarPreco(custoTotal);

        document.getElementById("modalValorKit").textContent =
            formatarPreco(valorKit);

        document.getElementById("modalLucroKit").textContent =
            formatarPreco(lucro);

        document.getElementById("modalMargemKit").textContent =
            margem.toFixed(2) + "%";


        // ===============================
        // COR DO LUCRO
        // ===============================

        const elementoLucro =
            document.getElementById("modalLucroKit");

        elementoLucro.classList.remove(
            "lucro-positivo",
            "lucro-negativo"
        );

        if (lucro >= 0) {

            elementoLucro.classList.add(
                "lucro-positivo"
            );

        } else {

            elementoLucro.classList.add(
                "lucro-negativo"
            );

        }

    } catch (erro) {

        console.error("Erro:", erro);

        alert("Erro ao carregar produtos do kit.");

    }
}
function calcularLucroKit() {

    const custo =
        Number(document.getElementById("custoKit").value) || 0;

    const valor =
        Number(document.getElementById("valor").value) || 0;

    const lucro = valor - custo;

    let margem = 0;

    if (valor > 0) {
        margem = (lucro / valor) * 100;
    }

    document.getElementById("lucroKit").value =
        lucro.toFixed(2);

    document.getElementById("margemLucro").value =
        margem.toFixed(2) + "%";
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
    const selectEdicao = document.getElementById("produtoEdicao");

    try {

        const resposta = await fetch("/produtos");

        if (!resposta.ok) {
            throw new Error("Erro ao buscar produtos");
        }

        const produtos = await resposta.json();

        // SELECT DO "VER ITENS"
        if (select) {

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
        }

        // SELECT DO "EDITAR KIT"
        if (selectEdicao) {

            selectEdicao.innerHTML = `
                <option value="">
                    Selecione um produto
                </option>
            `;

            produtos.forEach(produto => {

                const option = document.createElement("option");

                option.value = produto.id;
                option.textContent = produto.nome;

                selectEdicao.appendChild(option);
            });
        }

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
// ADICIONAR PRODUTO DURANTE EDIÇÃO

const btnAdicionarProdutoEdicao =
    document.getElementById("btnAdicionarProdutoEdicao");

if (btnAdicionarProdutoEdicao) {

    btnAdicionarProdutoEdicao.addEventListener(
        "click",
        async function() {

            const produtoId =
                document.getElementById("produtoEdicao").value;

            const quantidade =
                Number(
                    document.getElementById(
                        "quantidadeProdutoEdicao"
                    ).value
                );

            if (!kitSelecionadoId) {
                alert("Nenhum kit selecionado.");
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
                    throw new Error(
                        "Erro ao adicionar produto"
                    );
                }

                await resposta.json();

                alert("Produto adicionado ao kit!");

                document.getElementById(
                    "quantidadeProdutoEdicao"
                ).value = "";

                document.getElementById(
                    "produtoEdicao"
                ).value = "";

                // Atualiza produtos e cálculos
                await carregarItensKit(
                    kitSelecionadoId
                );

            } catch (erro) {

                console.error("Erro:", erro);

                alert(
                    "Não foi possível adicionar o produto ao kit."
                );
            }
        }
    );
}
// CARREGAR KITS

carregarKits();
carregarProdutos();

