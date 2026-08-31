package com.example.ProjetoFamilia.service;

import com.example.ProjetoFamilia.model.Kit;
import com.example.ProjetoFamilia.repository.KitRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class KitService {

    private final KitRepository kitRepository;

    public KitService(KitRepository kitRepository) {
        this.kitRepository = kitRepository;
    }

    public List<Kit> listar() {
        return kitRepository.findAll();
    }

    public Kit salvar(Kit kit) {
        return kitRepository.save(kit);
    }

    public void excluir(int id) {
        kitRepository.deleteById(id);
    }
}

