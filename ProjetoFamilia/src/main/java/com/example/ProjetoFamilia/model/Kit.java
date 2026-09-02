package com.example.ProjetoFamilia.model;

import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "kits")
public class Kit {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    private String nome;
    private double valor;

    @OneToMany(mappedBy = "kit", cascade = CascadeType.ALL)
    private List<ItensKit> itens = new ArrayList<>();

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

    public double getValor() {
        return valor;
    }

    public void setValor(double valor) {
        this.valor = valor;
    }

    public List<ItensKit> getItens() {
        return itens;
    }

    public void setItens(List<ItensKit> itens) {
        this.itens = itens;
    }
}