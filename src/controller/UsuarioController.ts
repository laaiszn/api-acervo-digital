import Usuario from "../model/Usuario.js";
import { type Request, type Response } from "express";
import type UsuarioDTO from "../dto/UsuarioDTO.js";

class UsuarioController extends Usuario {

    static async autenticar (req: Request, res: Response): Promise<Response> {
        try {
            const dadosRecebidos: UsuarioDTO = req.body;

            // Valida se o email é do domínio correto
            if (!dadosRecebidos.email.endsWith("@adigital.com.br")) {
                return res.status(403).json({ mensagem: "E-mail inválido. Utilize o domínio @adigital.com.br" });
            }

            const usuario = await Usuario.login(
                dadosRecebidos.email,
                dadosRecebidos.senha
            );

            if (usuario) {
                return res.status(200).json({ 
                    mensagem: "Login realizado com sucesso.",
                    usuario: usuario
                });
            } else {
                return res.status(401).json({ mensagem: "E-mail ou senha incorretos." });
            }

        } catch (error) {
            console.error(`Erro ao realizar login: ${error}`);
            return res.status(500).json({ mensagem: "Erro ao realizar login." });
        }
    }
}

export default UsuarioController;   