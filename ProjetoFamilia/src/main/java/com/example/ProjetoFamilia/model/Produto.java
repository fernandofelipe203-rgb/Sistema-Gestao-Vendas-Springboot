package com.example.ProjetoFamilia.model;

import jakarta.persistence.*;

@Entity
@Table(name = "produtos")
public class Produto {
@Id
@GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;
    private String nome;
    private double preco;
    private int quantidade;
    private double percentualLucro;

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public double getPreco() {
        return preco;
    }

    public void setPreco(double preco) {
        this.preco = preco;
    }

    public int getQuantidade() {
        return quantidade;
    }

    public void setQuantidade(int quantidade) {
        this.quantidade = quantidade;
    }

    public double getPercentualLucro() {
        return percentualLucro;
    }

    public void setPercentualLucro(double percentualLucro) {
        this.percentualLucro = percentualLucro;
    }

    public double getPrecoVenda() {
         return Math.round(preco * (1 + percentualLucro / 100) * 100.0) / 100.0;
    }
}

