package com.example.ProjetoFamilia.controller;

import com.example.ProjetoFamilia.model.Vendas;
import com.example.ProjetoFamilia.service.VendaService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/vendas")
@CrossOrigin
public class VendaController {

    private final VendaService vendaService;

    public VendaController(VendaService vendaService) {
        this.vendaService = vendaService;
    }

    // LISTAR TODAS AS VENDAS
    @GetMapping
    public List<Vendas> listar() {
        return vendaService.listar();
    }

    // BUSCAR VENDA POR ID
    @GetMapping("/{id}")
    public ResponseEntity<Vendas> buscarPorId(@PathVariable int id) {

        Vendas venda = vendaService.buscarPorId(id);

        if (venda == null) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(venda);
    }

    // CADASTRAR VENDA
    @PostMapping
    public ResponseEntity<Vendas> salvar(@RequestBody Vendas venda) {

        Vendas novaVenda = vendaService.salvar(venda);

        return ResponseEntity.status(HttpStatus.CREATED).body(novaVenda);
    }

    // ATUALIZAR VENDA
    @PutMapping("/{id}")
    public ResponseEntity<Vendas> atualizar(
            @PathVariable int id,
            @RequestBody Vendas venda) {

        Vendas vendaAtualizada = vendaService.atualizar(id, venda);

        if (vendaAtualizada == null) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(vendaAtualizada);
    }

    // EXCLUIR VENDA
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> excluir(@PathVariable int id) {

        boolean excluiu = vendaService.excluir(id);

        if (!excluiu) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.noContent().build();
    }
}
