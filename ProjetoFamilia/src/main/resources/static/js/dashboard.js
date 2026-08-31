async function carregarResumo() {

    const resposta = await fetch("/clientes");

    const clientes = await resposta.json();

    document.getElementById("totalClientes").textContent = clientes.length;
}

carregarResumo();

