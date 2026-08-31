package com.example.ProjetoFamilia.repository;

import com.example.ProjetoFamilia.model.Cliente;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ClienteRepository extends JpaRepository<Cliente, Integer> {

}
