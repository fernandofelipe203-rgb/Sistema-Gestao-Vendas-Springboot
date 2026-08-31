
async function carregarResumo() {

    console.log("Dashboard JS carregou!");

    const respostaClientes = await fetch("/clientes");
    const clientes = await respostaClientes.json();

    console.log("Clientes:", clientes);

    document.getElementById("totalClientes").textContent = clientes.length;


    const respostaProdutos = await fetch("/produtos");
    const produtos = await respostaProdutos.json();

    console.log("Produtos:", produtos);

    document.getElementById("totalProdutos").textContent = produtos.length;

}

carregarResumo();

