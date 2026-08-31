package com.example.ProjetoFamilia.repository;

import com.example.ProjetoFamilia.model.Cliente;
import com.example.ProjetoFamilia.model.Kit;
import org.springframework.data.jpa.repository.JpaRepository;

public interface KitRepository  extends JpaRepository<Kit, Integer> {
}
