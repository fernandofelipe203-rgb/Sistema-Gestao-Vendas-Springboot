package com.example.ProjetoFamilia.controller;

import com.example.ProjetoFamilia.model.Kit;
import com.example.ProjetoFamilia.service.KitService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/kits")
@CrossOrigin(origins = "*")
public class KitController {

    private final KitService kitService;

    public KitController(KitService kitService) {
        this.kitService = kitService;
    }

    @GetMapping
    public List<Kit> listar() {
        return kitService.listar();
    }

    @PostMapping
    public Kit salvar(@RequestBody Kit kit) {
        return kitService.salvar(kit);
    }

    @PutMapping("/{id}")
    public Kit atualizar(@PathVariable int id, @RequestBody Kit kit) {
        kit.setId(id);
        return kitService.salvar(kit);
    }

    @DeleteMapping("/{id}")
    public void excluir(@PathVariable int id) {
        kitService.excluir(id);
    }
}

