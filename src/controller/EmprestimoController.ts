import Emprestimo from "../model/Emprestimo.js";
import { type Request, type Response } from "express";
import type EmprestimoDTO from "../dto/EmprestimoDTO.js";

class EmprestimoController extends Emprestimo {

    static async todos(req: Request, res: Response): Promise<Response> {
        try {
            const listaDeEmprestimos = await Emprestimo.listarEmprestimos();
            return res.status(200).json(listaDeEmprestimos);
        } catch (error) {
            console.error(`Erro ao listar empréstimos: ${error}`);
            return res.status(500).json({ mensagem: 'Erro ao listar os empréstimos.' });
        }
    }

    // ✅ MELHORIA: Promise<Response> adicionado e return nas respostas
    // Todos os métodos do controller devem ter a mesma assinatura para manter consistência.
    // O "return" garante que a execução para após enviar a resposta, evitando que
    // o Express tente enviar uma segunda resposta e lance um erro em runtime.
    static async emprestimo(req: Request, res: Response): Promise<Response> {
        try {
            const idEmprestimo: number = parseInt(req.params.id as string);
            const emprestimo = await Emprestimo.listarEmprestimo(idEmprestimo);
            return res.status(200).json(emprestimo);
        } catch (error) {
            console.error(`Erro ao buscar empréstimo de id ${req.params.id}: ${error}`);
            return res.status(500).json({ mensagem: "Erro ao recuperar as informações do empréstimo." });
        }
    }

    static async cadastrar(req: Request, res: Response): Promise<Response> {
        try {
            const dadosRecebidos: EmprestimoDTO = req.body;

            const emprestimo = new Emprestimo(
                dadosRecebidos.aluno.id_aluno,
                dadosRecebidos.livro.id_livro,
                new Date(dadosRecebidos.data_emprestimo),
                dadosRecebidos.status_emprestimo ?? "",
                dadosRecebidos.data_devolucao ? new Date(dadosRecebidos.data_devolucao) : undefined
            );

            const result = await Emprestimo.cadastrarEmprestimo(emprestimo);

            if (result) {
                return res.status(201).json({ mensagem: 'Empréstimo cadastrado com sucesso.' });
            } else {
                return res.status(500).json({ mensagem: 'Não foi possível cadastrar o empréstimo no banco de dados.' });
            }
        } catch (error) {
            console.error(`Erro ao cadastrar empréstimo: ${error}`);
            return res.status(500).json({ mensagem: 'Erro ao cadastrar o empréstimo.' });
        }
    }

    static async atualizar(req: Request, res: Response): Promise<Response> {
        try {
            const dadosRecebidos: EmprestimoDTO = req.body;
            const idEmprestimo = parseInt(req.params.id as string);

            const result = await Emprestimo.atualizarEmprestimo(
                idEmprestimo,
                dadosRecebidos.aluno.id_aluno,
                dadosRecebidos.livro.id_livro,
                new Date(dadosRecebidos.data_emprestimo),
                dadosRecebidos.data_devolucao ? new Date(dadosRecebidos.data_devolucao) : new Date(),
                dadosRecebidos.status_emprestimo ?? ""
            );

            if (result) {
                return res.status(200).json({ mensagem: 'Empréstimo atualizado com sucesso.' });
            } else {
                return res.status(500).json({ mensagem: 'Não foi possível atualizar o empréstimo no banco de dados.' });
            }
        } catch (error) {
            console.error(`Erro ao atualizar empréstimo: ${error}`);
            return res.status(500).json({ mensagem: 'Erro ao atualizar o empréstimo.' });
        }
    }

    static async remover(req: Request, res: Response): Promise<Response> {
        try {
            const idEmprestimo = parseInt(req.params.id as string);
            const resultado = await Emprestimo.removerEmprestimo(idEmprestimo);

            if (resultado) {
                return res.status(200).json({ mensagem: 'Empréstimo removido com sucesso.' });
            } else {
                return res.status(404).json({ mensagem: 'Empréstimo não encontrado para exclusão.' });
            }
        } catch (error) {
            console.error(`Erro ao remover empréstimo: ${error}`);
            return res.status(500).json({ mensagem: "Erro ao remover empréstimo." });
        }
    }
}

export default EmprestimoController;