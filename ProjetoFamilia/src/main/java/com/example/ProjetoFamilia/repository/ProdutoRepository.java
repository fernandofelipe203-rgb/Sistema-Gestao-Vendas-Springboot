package com.example.ProjetoFamilia.repository;

import com.example.ProjetoFamilia.model.Cliente;
import com.example.ProjetoFamilia.model.Produto;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProdutoRepository  extends JpaRepository<Produto, Integer> {
}
