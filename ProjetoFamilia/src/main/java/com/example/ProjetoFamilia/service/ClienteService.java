package com.example.ProjetoFamilia.service;

import com.example.ProjetoFamilia.model.Cliente;
import com.example.ProjetoFamilia.repository.ClienteRepository;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class ClienteService {

    private final ClienteRepository clienteRepository;

    public ClienteService(ClienteRepository clienteRepository) {
        this.clienteRepository = clienteRepository;
    }

    public List<Cliente> listarTodos() {
        return clienteRepository.findAll();
    }
    // BUSCAR POR ID
    public Cliente buscarPorId(int id) {
        return clienteRepository.findById(id).orElse(null);
    }

    // CADASTRAR
    public Cliente salvar(Cliente cliente) {
        return clienteRepository.save(cliente);
    }

    // ATUALIZAR
    public Cliente atualizar(int id, Cliente clienteAtualizado) {

        Cliente cliente = clienteRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Cliente não encontrado"));

        if (clienteAtualizado.getNome() != null) {
            cliente.setNome(clienteAtualizado.getNome());
        }

        if (clienteAtualizado.getTelefone() != null) {
            cliente.setTelefone(clienteAtualizado.getTelefone());
        }

        if (clienteAtualizado.getEndereco() != null) {
            cliente.setEndereco(clienteAtualizado.getEndereco());
        }

        return clienteRepository.save(cliente);
    }

    // EXCLUIR
    public boolean excluir(int id) {

        if (!clienteRepository.existsById(id)) {
            return false;
        }

        clienteRepository.deleteById(id);
        return true;
    }
}
