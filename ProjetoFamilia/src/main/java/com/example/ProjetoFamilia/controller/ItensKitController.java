package com.example.ProjetoFamilia.controller;

import com.example.ProjetoFamilia.model.ItensKit;
import com.example.ProjetoFamilia.service.ItensKitService;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/kits")
public class ItensKitController {

    private final ItensKitService itensKitService;

    public ItensKitController(ItensKitService itensKitService) {
        this.itensKitService = itensKitService;
    }

    @PostMapping("/{kitId}/itens")
    public ItensKit adicionarItem(
            @PathVariable int kitId,
            @RequestBody Map<String, Integer> dados) {

        int produtoId = dados.get("produtoId");
        int quantidade = dados.get("quantidade");

        return itensKitService.adicionarItem(
                kitId,
                produtoId,
                quantidade
        );
    }
    @GetMapping("/{kitId}/itens")
    public List<ItensKit> listarItensDoKit(@PathVariable int kitId) {
        return itensKitService.listarItensDoKit(kitId);
    }
    @DeleteMapping("/{kitId}/itens/{itemId}")
    public String excluirItem
            (@PathVariable int kitId,
             @PathVariable int itemId) {

        itensKitService.excluirItem(itemId);
        return "Item exlcuido do kit com sucesso!";
    }
}