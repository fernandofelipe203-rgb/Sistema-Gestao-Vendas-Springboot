package com.example.ProjetoFamilia.service;

import com.example.ProjetoFamilia.model.ItensKit;
import com.example.ProjetoFamilia.model.Kit;
import com.example.ProjetoFamilia.model.Produto;
import com.example.ProjetoFamilia.repository.ItensKitRepository;
import com.example.ProjetoFamilia.repository.KitRepository;
import com.example.ProjetoFamilia.repository.ProdutoRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ItensKitService {

    private final ItensKitRepository itensKitRepository;
    private final KitRepository kitRepository;
    private final ProdutoRepository produtoRepository;

    public ItensKitService(
            ItensKitRepository itensKitRepository,
            KitRepository kitRepository,
            ProdutoRepository produtoRepository) {

        this.itensKitRepository = itensKitRepository;
        this.kitRepository = kitRepository;
        this.produtoRepository = produtoRepository;
    }

    public ItensKit adicionarItem(int kitId, int produtoId, int quantidade) {

        Kit kit = kitRepository.findById(kitId)
                .orElseThrow(() -> new RuntimeException("Kit não encontrado"));

        Produto produto = produtoRepository.findById(produtoId)
                .orElseThrow(() -> new RuntimeException("Produto não encontrado"));

        Optional<ItensKit> itemExistente =
                itensKitRepository.findByKitIdAndProdutoId(kitId, produtoId);

        if (itemExistente.isPresent()) {

            ItensKit item = itemExistente.get();
            item.setQuantidade(quantidade);

            return itensKitRepository.save(item);
        }

        ItensKit item = new ItensKit();

        item.setKit(kit);
        item.setProduto(produto);
        item.setQuantidade(quantidade);

        return itensKitRepository.save(item);
    }

    public List<ItensKit> listarItensDoKit(int kitId) {
        return itensKitRepository.findByKitId(kitId);
    }
    public void excluirItem(int itemId) {

        if (!itensKitRepository.existsById(itemId)) {
            throw new RuntimeException("Item do kit não encontrado");
        }

        itensKitRepository.deleteById(itemId);
    }
}