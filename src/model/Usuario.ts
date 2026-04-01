import { DatabaseModel } from "./DatabaseModel.js";

const database = new DatabaseModel().pool;

class Usuario {

    private id: number = 0;
    private nome: string;
    private email: string;
    private senha: string;
    private role: string;

    constructor(
        _nome: string,
        _email: string,
        _senha: string,
        _role: string = "normal"
    ) {
        this.nome = _nome;
        this.email = _email;
        this.senha = _senha;
        this.role = _role;
    }

    public getId(): number {
        return this.id;
    }

    public setId(id: number): void {
        this.id = id;
    }

    public getNome(): string {
        return this.nome;
    }

    public setNome(nome: string): void {
        this.nome = nome;
    }

    public getEmail(): string {
        return this.email;
    }

    public setEmail(email: string): void {
        this.email = email;
    }

    public getSenha(): string {
        return this.senha;
    }

    public setSenha(senha: string): void {
        this.senha = senha;
    }

    public getRole(): string {
        return this.role;
    }

    public setRole(role: string): void {
        this.role = role;
    }

    static async login(email: string, senha: string): Promise<any | null> {
        try {
            const queryLogin = `
                SELECT id, nome, email, role
                FROM usuario
                WHERE email = $1
                AND senha = $2;
            `;

            const respostaBD = await database.query(queryLogin, [
                email.toLowerCase(),
                senha
            ]);

            if (respostaBD.rows.length === 0) {
                return null;
            }

            return respostaBD.rows[0];

        } catch (error) {
            console.error(`Erro ao realizar login: ${error}`);
            return null;
        }
    }
}

export default Usuario;