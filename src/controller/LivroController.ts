import Livro from "../model/Livro.js";
import { type Request, type Response } from "express";
import type LivroDTO from "../dto/LivroDTO.js";

class LivroController extends Livro {

    // ✅ MELHORIA: Promise<Response> adicionado e return nas respostas
    // Consistência com todos os outros métodos do controller e prevenção
    // de envio duplo de resposta em runtime.
    static async todos(req: Request, res: Response): Promise<Response> {
        try {
            const listaDeLivros = await Livro.listarLivros();
            return res.status(200).json(listaDeLivros);
        } catch (error) {
            console.error(`Erro ao listar livros: ${error}`);
            return res.status(500).json({ mensagem: "Erro ao recuperar as informações dos livros." });
        }
    }

    // ✅ MELHORIA: Promise<Response> adicionado
    // ✅ MELHORIA: console.log → console.error
    // ✅ MELHORIA: resposta de erro retorna objeto JSON consistente com os demais métodos
    static async livro(req: Request, res: Response): Promise<Response> {
        try {
            const idLivro = parseInt(req.params.id as string);
            const livro = await Livro.listarLivro(idLivro);
            return res.status(200).json(livro);
        } catch (error) {
            console.error(`Erro ao buscar livro de id ${req.params.id}: ${error}`);
            return res.status(500).json({ mensagem: "Erro ao recuperar as informações do livro." });
        }
    }

    // ✅ MELHORIA: Promise<Response> adicionado
    // ✅ MELHORIA: status 200 → 201 no cadastro bem-sucedido
    // 201 Created é o código correto para criação de recursos, consistente com os demais controllers.
    static async cadastrar(req: Request, res: Response): Promise<Response> {
        try {
            const dadosRecebidos: LivroDTO = req.body;

            const novoLivro = new Livro(
                dadosRecebidos.titulo,
                dadosRecebidos.autor,
                dadosRecebidos.editora,
                (dadosRecebidos.ano_publicacao ?? 0).toString(),
                dadosRecebidos.isbn,
                dadosRecebidos.quant_total,
                dadosRecebidos.quant_disponivel,
                dadosRecebidos.quant_aquisicao,
                dadosRecebidos.valor_aquisicao ?? 0
            );

            const result = await Livro.cadastrarLivro(novoLivro);

            if (result) {
                return res.status(201).json({ mensagem: 'Livro cadastrado com sucesso.' });
            } else {
                return res.status(500).json({ mensagem: 'Não foi possível cadastrar o livro no banco de dados.' });
            }
        } catch (error) {
            console.error(`Erro ao cadastrar livro: ${error}`);
            return res.status(500).json({ mensagem: 'Erro ao cadastrar o livro.' });
        }
    }

    // ✅ MELHORIA: status 201 → 200 na remoção bem-sucedida
    // 201 Created é semanticamente incorreto para remoções — o correto é 200 OK.
    static async remover(req: Request, res: Response): Promise<Response> {
        try {
            const idLivro = parseInt(req.params.id as string);
            const result = await Livro.removerLivro(idLivro);

            if (result) {
                return res.status(200).json({ mensagem: 'Livro removido com sucesso.' });
            } else {
                return res.status(404).json({ mensagem: 'Livro não encontrado para exclusão.' });
            }
        } catch (error) {
            console.error(`Erro ao remover livro de id ${req.params.id}: ${error}`);
            return res.status(500).json({ mensagem: 'Erro ao remover o livro.' });
        }
    }

    static async atualizar(req: Request, res: Response): Promise<Response> {
        try {
            const idLivro = parseInt(req.params.id as string);
            const dadosRecebidos: LivroDTO = req.body;

            const livro = new Livro(
                dadosRecebidos.titulo,
                dadosRecebidos.autor,
                dadosRecebidos.editora,
                (dadosRecebidos.ano_publicacao ?? 0).toString(),
                dadosRecebidos.isbn,
                dadosRecebidos.quant_total,
                dadosRecebidos.quant_disponivel,
                dadosRecebidos.quant_aquisicao,
                dadosRecebidos.valor_aquisicao ?? 0
            );

            livro.setIdLivro(idLivro);

            const result = await Livro.atualizarLivro(livro);

            if (result) {
                return res.status(200).json({ mensagem: "Cadastro atualizado com sucesso." });
            } else {
                // ✅ MELHORIA: status 400 → 500
                // O livro não foi atualizado por uma falha interna (não encontrado ou inativo),
                // não por dados malformados pelo cliente — 500 é semanticamente mais correto aqui.
                return res.status(500).json({ mensagem: "Não foi possível atualizar o livro no banco de dados." });
            }
        } catch (error) {
            console.error(`Erro ao atualizar livro de id ${req.params.id}: ${error}`);
            return res.status(500).json({ mensagem: "Erro ao atualizar o livro." });
        }
    }
}

export default LivroController;