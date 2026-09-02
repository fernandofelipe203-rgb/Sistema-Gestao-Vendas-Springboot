//BUSCA CLINTES
async function carregarResumo() {

    console.log("Dashboard JS carregou!");

    const respostaClientes = await fetch("/clientes");
    const clientes = await respostaClientes.json();

    console.log("Clientes:", clientes);

    document.getElementById("totalClientes").textContent = clientes.length;

// BUSCA PRODUTOS
    const respostaProdutos = await fetch("/produtos");
    const produtos = await respostaProdutos.json();

    console.log("Produtos:", produtos);
    document.getElementById("totalProdutos").textContent = produtos.length;


//BUSCA KITS
const respostaKits = await fetch("/kits");
const kits = await respostaKits.json();
document.getElementById("totalKits").textContent = kits.length;
}

carregarResumo();

document.getElementById("btnVendas")
    .addEventListener("click", function () {

        window.location.href = "vendas.html";

    });

