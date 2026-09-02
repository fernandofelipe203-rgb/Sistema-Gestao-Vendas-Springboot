package com.example.ProjetoFamilia.repository;

import com.example.ProjetoFamilia.model.ItensKit;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ItensKitRepository extends JpaRepository<ItensKit, Integer> {

    List<ItensKit> findByKitId(int kitId);
    Optional<ItensKit> findByKitIdAndProdutoId(int kitId, int produtoId);
}