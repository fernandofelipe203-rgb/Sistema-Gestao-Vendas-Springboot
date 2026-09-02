const tabela = document.getElementById("tabelaProdutos");
let produtos = [];
const buscarProduto = document.getElementById("buscarProduto");
function formatarPreco(preco) {
    return Number(preco).toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });
}
function atualizarPrecoVenda() {

    const preco = Number(document.getElementById("preco").value);
    const percentual = Number(document.getElementById("percentualLucro").value);

    const precoVenda = preco * (1 + percentual / 100);

    document.getElementById("previewCusto").textContent =
        formatarPreco(preco || 0);

    document.getElementById("previewPercentual").textContent =
        (percentual || 0) + "%";

    document.getElementById("previewVenda").textContent =
        formatarPreco(precoVenda || 0);
}
document.getElementById("preco").addEventListener("input", atualizarPrecoVenda);

document.getElementById("percentualLucro").addEventListener("input", atualizarPrecoVenda);


async function carregarProdutos() {


try {

    const resposta = await fetch("/produtos");

    if (!resposta.ok) {
        throw new Error("Erro ao buscar produtos");
    }

    produtos = await resposta.json();
    console.log("Produtos recebidos:", produtos);

    tabela.innerHTML = "";

    produtos.forEach(produto => {

        const linha = document.createElement("tr");

    linha.innerHTML = `
        <td>${produto.id}</td>
        <td>${produto.nome}</td>
        <td>${formatarPreco(produto.preco)}</td>
        <td>${formatarPreco(produto.precoVenda)}</td>
       <td class="lucro">${produto.percentualLucro}%</td>
       <td class="lucro">${formatarPreco(produto.precoVenda - produto.preco)}</td>
        <td>${produto.quantidade}</td>
        <td>
            <button onclick="editarProduto(${produto.id})">Editar</button>
            <button onclick="excluirProduto(${produto.id})">Excluir</button>
        </td>
    `;

        tabela.appendChild(linha);
    });

} catch (erro) {

    console.error("Erro:", erro);

}


}
buscarProduto.addEventListener("input", function () {

    const texto = buscarProduto.value.toLowerCase();

    const produtosFiltrados = produtos.filter(produto =>
        produto.nome.toLowerCase().includes(texto)
    );

    tabela.innerHTML = "";
    if (produtosFiltrados.length === 0) {
        tabela.innerHTML = `
            <tr>
                <td colspan="8" style="text-align: center; padding: 25px;">
                    🔎 Nenhum produto encontrado.
                </td>
            </tr>
        `;

        return;
    }

    produtosFiltrados.forEach(produto => {

        const linha = document.createElement("tr");

        linha.innerHTML = `
            <td>${produto.id}</td>
            <td>${produto.nome}</td>
            <td>${formatarPreco(produto.preco)}</td>
            <td>${formatarPreco(produto.precoVenda)}</td>
            <td class="lucro">${produto.percentualLucro}%</td>
            <td class="lucro">${formatarPreco(produto.precoVenda - produto.preco)}</td>
            <td>${produto.quantidade}</td>
            <td>
                <button onclick="editarProduto(${produto.id})">Editar</button>
                <button onclick="excluirProduto(${produto.id})">Excluir</button>
            </td>
        `;

        tabela.appendChild(linha);
    });
});
const btnNovoProduto = document.getElementById("btnNovoProduto");
const formularioProduto = document.getElementById("formularioProduto");
const btnCancelar = document.getElementById("btnCancelar");
const modalProduto = document.getElementById("modalProduto");

btnNovoProduto.addEventListener("click", function() {

    formularioProduto.style.display = "block";
    modalProduto.style.display = "flex";

});

btnCancelar.addEventListener("click", function() {

    modalProduto.style.display = "none";
    formularioProduto.style.display = "none";

    document.getElementById("idProduto").value = "";
    document.getElementById("nome").value = "";
    document.getElementById("preco").value = "";
    document.getElementById("percentualLucro").value = "";
    document.getElementById("quantidade").value = "";

    document.getElementById("tituloFormulario").textContent = "Cadastrar Produto";

    atualizarPrecoVenda();
});
const btnSalvar = document.getElementById("btnSalvar");

btnSalvar.addEventListener("click", async function() {


const nome = document.getElementById("nome").value;
const preco = Number(document.getElementById("preco").value);
const percentualLucro = Number(document.getElementById("percentualLucro").value);
const quantidade = Number(document.getElementById("quantidade").value);
const id = document.getElementById("idProduto").value;

const produto = {
    nome: nome,
    preco: preco,
    percentualLucro: percentualLucro,
    quantidade: quantidade
};

try {

  const url = id ? `/produtos/${id}` : "/produtos";

  const metodo = id ? "PUT" : "POST";

  const resposta = await fetch(url, {
      method: metodo,
      headers: {
          "Content-Type": "application/json"
      },
      body: JSON.stringify(produto)
  });

    if (!resposta.ok) {
        throw new Error("Erro ao salvar produto");
    }

    const produtoSalvo = await resposta.json();

    console.log("Produto salvo:", produtoSalvo);

    if (id) {
        alert("Produto atualizado com sucesso!");
    } else {
        alert("Produto salvo com sucesso!");
    }

    formularioProduto.style.display = "none";
    modalProduto.style.display = "none";

    document.getElementById("idProduto").value = "";
    document.getElementById("nome").value = "";
    document.getElementById("preco").value = "";
    document.getElementById("percentualLucro").value = "";
    atualizarPrecoVenda();
    document.getElementById("quantidade").value = "";

    document.getElementById("tituloFormulario").textContent = "Cadastrar Produto";

    carregarProdutos();

} catch (erro) {

    console.error("Erro:", erro);
    alert("Erro ao salvar produto.");

}


});
carregarProdutos();
async function excluirProduto(id) {

    const confirmar = confirm("Tem certeza que deseja excluir este produto?");

    if (!confirmar) {
        return;
    }

    try {

        const resposta = await fetch(`/produtos/${id}`, {
            method: "DELETE"
        });

        if (!resposta.ok) {
            throw new Error("Erro ao excluir produto");
        }

        alert("Produto excluído com sucesso!");

        carregarProdutos();

    } catch (erro) {

        console.error("Erro:", erro);
        alert("Erro ao excluir produto.");

    }
}
 function editarProduto(id) {

          const produto = produtos.find(p => p.id === id);

          if (!produto) {
              alert("Produto não encontrado.");
              return;
          }

          document.getElementById("idProduto").value = produto.id;
          document.getElementById("nome").value = produto.nome;
          document.getElementById("preco").value = produto.preco;
          document.getElementById("percentualLucro").value = produto.percentualLucro;
          document.getElementById("quantidade").value = produto.quantidade;

          document.getElementById("tituloFormulario").textContent = "Editar Produto";

          formularioProduto.style.display = "block";
          modalProduto.style.display = "flex";

          atualizarPrecoVenda();
      }
carregarProdutos();