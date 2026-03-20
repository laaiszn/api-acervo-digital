import Aluno from "../model/Aluno.js";
import { type Request, type Response } from "express";
import type AlunoDTO from "../dto/AlunoDTO.js";

class AlunoController extends Aluno {

    static async todos(req: Request, res: Response) {
        try {
            const listaDeAlunos = await Aluno.listarAlunos();
            res.status(200).json(listaDeAlunos);
        } catch (error) {
            console.error(`Erro ao listar alunos: ${error}`);
            res.status(500).json("Erro ao recuperar as informações do aluno.");
        }
    }

    static async aluno(req: Request, res: Response) {
        try {
            const idAluno = parseInt(req.params.id as string);
            const aluno = await Aluno.listarAluno(idAluno);
            res.status(200).json(aluno);
        } catch (error) {
            console.error(`Erro ao buscar aluno: ${error}`);
            res.status(500).json("Erro ao recuperar as informações do aluno.");
        }
    }

    static async cadastrar(req: Request, res: Response) {
        try {
            const dadosRecebidos: AlunoDTO = req.body;

            const novoAluno = new Aluno(
                dadosRecebidos.nome,
                dadosRecebidos.sobrenome,
                dadosRecebidos.data_nascimento ?? new Date("1900-01-01"),
                dadosRecebidos.endereco ?? '',
                dadosRecebidos.email ?? '',
                dadosRecebidos.celular
            );

            const result = await Aluno.cadastrarAluno(novoAluno);

            if (result) {
                return res.status(201).json({ mensagem: `Aluno cadastrado com sucesso.` });
            } else {
                return res.status(500).json({ mensagem: 'Não foi possível cadastrar o aluno no banco de dados.' });
            }
        } catch (error) {
            console.error(`Erro ao cadastrar aluno: ${error}`);
            return res.status(500).json({ mensagem: 'Erro ao cadastrar o aluno.' });
        }
    }

    static async remover(req: Request, res: Response): Promise<Response> {
        try {
            const idAluno = parseInt(req.params.id as string);
            const result = await Aluno.removerAluno(idAluno);

            if (result) {
                // ⚠️ Status corrigido de 201 para 200 — 201 é reservado para criação de recursos
                return res.status(200).json({ mensagem: 'Aluno removido com sucesso.' });
            } else {
                return res.status(404).json({ mensagem: 'Aluno não encontrado para exclusão.' });
            }
        } catch (error) {
            console.error(`Erro ao remover aluno: ${error}`);
            return res.status(500).json({ mensagem: 'Erro ao remover aluno.' });
        }
    }

    static async atualizar(req: Request, res: Response): Promise<Response> {
        try {
            const dadosRecebidos: AlunoDTO = req.body;

            const aluno = new Aluno(
                dadosRecebidos.nome,
                dadosRecebidos.sobrenome,
                dadosRecebidos.data_nascimento ?? new Date("1900-01-01"),
                dadosRecebidos.endereco ?? '',
                dadosRecebidos.email ?? '',
                dadosRecebidos.celular
            );

            aluno.setIdAluno(parseInt(req.params.id as string));

            const result = await Aluno.atualizarAluno(aluno);

            if (result) {
                return res.status(200).json({ mensagem: "Cadastro atualizado com sucesso." });
            } else {
                return res.status(500).json({ mensagem: 'Não foi possível atualizar o aluno no banco de dados.' });
            }
        } catch (error) {
            console.error(`Erro ao atualizar aluno: ${error}`);
            return res.status(500).json({ mensagem: "Erro ao atualizar aluno." });
        }
    }
}

export default AlunoController;