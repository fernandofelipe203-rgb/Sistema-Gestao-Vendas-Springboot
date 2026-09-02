package com.example.ProjetoFamilia.model;

import jakarta.persistence.*;

import java.time.LocalDate;

@Entity
public class Vendas {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;
    @ManyToOne
    @JoinColumn(name = "cliente_id")
    private Cliente cliente;
    @ManyToOne
    @JoinColumn(name = "kit_id")
    private Kit kit;
    private LocalDate dataCompra;

    private int prazo;

    private LocalDate dataVencimento;

    private String estadoAtual;


    // CONSTRUTOR VAZIO
    public Vendas() {
    }


    // GETTERS E SETTERS

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public Cliente getCliente() {
        return cliente;
    }

    public void setCliente(Cliente cliente) {
        this.cliente = cliente;
    }

    public Kit getKit() {
        return kit;
    }

    public void setKit(Kit kit) {
        this.kit = kit;
    }

    public LocalDate getDataCompra() {
        return dataCompra;
    }

    public void setDataCompra(LocalDate dataCompra) {
        this.dataCompra = dataCompra;
    }

    public int getPrazo() {
        return prazo;
    }

    public void setPrazo(int prazo) {
        this.prazo = prazo;
    }

    public LocalDate getDataVencimento() {
        return dataVencimento;
    }

    public void setDataVencimento(LocalDate dataVencimento) {
        this.dataVencimento = dataVencimento;
    }

    public String getEstadoAtual() {
        return estadoAtual;
    }

    public void setEstadoAtual(String estadoAtual) {
        this.estadoAtual = estadoAtual;
    }
    public double getCustoKit() {

        if (kit == null || kit.getItens() == null) {
            return 0;
        }

        double custo = 0;

        for (ItensKit item : kit.getItens()) {

            if (item.getProduto() != null) {
                custo += item.getProduto().getPreco() * item.getQuantidade();
            }
        }

        return Math.round(custo * 100.0) / 100.0;
    }


    public double getLucro() {

        if (kit == null) {
            return 0;
        }

        double lucro = kit.getValor() - getCustoKit();

        return Math.round(lucro * 100.0) / 100.0;
    }
}
