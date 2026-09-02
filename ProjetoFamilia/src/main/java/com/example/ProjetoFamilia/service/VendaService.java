package com.example.ProjetoFamilia.service;

import com.example.ProjetoFamilia.model.Vendas;
import com.example.ProjetoFamilia.repository.VendaRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class VendaService {

    private final VendaRepository vendaRepository;

    public VendaService(VendaRepository vendaRepository) {
        this.vendaRepository = vendaRepository;
    }

    public List<Vendas> listar() {
        return vendaRepository.findAll();
    }

    public Vendas buscarPorId(int id) {
        return vendaRepository.findById(id)
                .orElse(null);
    }

    public Vendas salvar(Vendas venda) {
        return vendaRepository.save(venda);
    }

    public Vendas atualizar(int id, Vendas venda) {

        Vendas vendaExistente = vendaRepository.findById(id)
                .orElse(null);

        if (vendaExistente == null) {
            return null;
        }

        vendaExistente.setCliente(venda.getCliente());
        vendaExistente.setKit(venda.getKit());
        vendaExistente.setDataCompra(venda.getDataCompra());
        vendaExistente.setPrazo(venda.getPrazo());
        vendaExistente.setDataVencimento(venda.getDataVencimento());
        vendaExistente.setEstadoAtual(venda.getEstadoAtual());

        return vendaRepository.save(vendaExistente);
    }

    public boolean excluir(int id) {

        if (!vendaRepository.existsById(id)) {
            return false;
        }

        vendaRepository.deleteById(id);
        return true;
    }
}
