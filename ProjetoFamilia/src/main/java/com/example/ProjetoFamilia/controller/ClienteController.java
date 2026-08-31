package com.example.ProjetoFamilia.controller;

import com.example.ProjetoFamilia.model.Cliente;
import com.example.ProjetoFamilia.service.ClienteService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/clientes")
public class ClienteController {

    private final ClienteService clienteService;

    public ClienteController(ClienteService clienteService) {
        this.clienteService = clienteService;
    }

    // LISTAR TODOS
    @GetMapping
    public List<Cliente> listarClientes() {
        return clienteService.listarTodos();
    }

    // BUSCAR POR ID
    @GetMapping("/{id}")
    public Cliente buscarPorId(@PathVariable int id) {
        return clienteService.buscarPorId(id);
    }

    // CADASTRAR
    @PostMapping
    public Cliente salvar(@RequestBody Cliente cliente) {
        return clienteService.salvar(cliente);
    }

    // ATUALIZAR
    @PutMapping("/{id}")
    public Cliente atualizar(
            @PathVariable int id,
            @RequestBody Cliente cliente) {

        return clienteService.atualizar(id, cliente);
    }

    // EXCLUIR
    @DeleteMapping("/{id}")
    public ResponseEntity<String> excluir(@PathVariable int id) {

        boolean excluido = clienteService.excluir(id);

        if (!excluido) {
            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body("Cliente não encontrado");
        }

        return ResponseEntity.ok("Cliente excluído com sucesso");
    }
}