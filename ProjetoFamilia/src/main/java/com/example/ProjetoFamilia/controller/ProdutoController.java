package com.example.ProjetoFamilia.controller;

import com.example.ProjetoFamilia.model.Produto;
import com.example.ProjetoFamilia.service.ProdutoService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/produtos")
@CrossOrigin(origins = "*")
public class ProdutoController {

    private final ProdutoService produtoService;

    public ProdutoController(ProdutoService produtoService) {
        this.produtoService = produtoService;
    }

    @GetMapping
    public List<Produto> listar() {
        return produtoService.listar();
    }

    @PostMapping
    public Produto salvar(@RequestBody Produto produto) {
        return produtoService.salvar(produto);
    }
    @PutMapping("/{id}")
    public Produto atualizar(@PathVariable int id, @RequestBody Produto produto) {
        produto.setId(id);
        System.out.println("Produto atualizado com sucesso");
        return produtoService.salvar(produto);
    }

    @DeleteMapping("/{id}")
    public void excluir(@PathVariable int id) {
        produtoService.excluir(id);
        System.out.println("Produto excluido com sucesso");
    }
}