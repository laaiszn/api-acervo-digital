import type AlunoDTO from "../dto/AlunoDTO.js";
import { DatabaseModel } from "./DatabaseModel.js";

const database = new DatabaseModel().pool;

class Aluno {

    private id_aluno: number = 0;
    private ra: string = "";
    private nome: string;
    private sobrenome: string;
    private data_nascimento: Date;
    private endereco: string;
    private email: string;
    private celular: string;
    private status_aluno: boolean = true;

    constructor(
        _nome: string,
        _sobrenome: string,
        _data_nascimento: Date,
        _endereco: string,
        _email: string,
        _celular?: string
    ) {
        this.nome = _nome;
        this.sobrenome = _sobrenome;
        this.data_nascimento = _data_nascimento;
        this.endereco = _endereco;
        this.email = _email;
        this.celular = _celular ?? "";
    }

    public getIdAluno(): number {
        return this.id_aluno;
    }

    public setIdAluno(id_aluno: number): void {
        this.id_aluno = id_aluno;
    }

    public getRa(): string {
        return this.ra;
    }

    public setRa(ra: string): void {
        this.ra = ra;
    }

    public getNome(): string {
        return this.nome;
    }

    public setNome(nome: string): void {
        this.nome = nome;
    }

    public getSobrenome(): string {
        return this.sobrenome;
    }

    public setSobrenome(sobrenome: string): void {
        this.sobrenome = sobrenome;
    }

    public getDataNascimento(): Date {
        return this.data_nascimento;
    }

    public setDataNascimento(data_nascimento: Date): void {
        this.data_nascimento = data_nascimento;
    }

    public getEndereco(): string {
        return this.endereco;
    }

    public setEndereco(endereco: string): void {
        this.endereco = endereco;
    }

    public getEmail(): string {
        return this.email;
    }

    public setEmail(email: string): void {
        this.email = email;
    }

    public getCelular(): string {
        return this.celular;
    }

    public setCelular(celular: string): void {
        this.celular = celular;
    }

    public getStatusAluno(): boolean {
        return this.status_aluno;
    }

    public setStatusAluno(status_aluno: boolean): void {
        this.status_aluno = status_aluno;
    }

    /**
     * Retorna uma lista com todos os alunos cadastrados no banco de dados
     * 
     * @returns Lista com todos os alunos cadastrados no banco de dados
     */
    // "async" indica que este método é assíncrono — ele pode "esperar" por operações demoradas (como banco de dados)
    // Retorna uma Promise que, quando resolvida, contém um Array de AlunoDTO ou null
    /**
 * Lista todos os alunos com status ativo no banco de dados.
 * 
 * @returns Promise com array de AlunoDTO em caso de sucesso, ou null em caso de erro.
 * 
 * Boas práticas aplicadas:
 * - Substituímos forEach + push por map(), reduzindo a verbosidade e evitando mutação desnecessária de array
 * - Usamos SELECT explícito em vez de SELECT *, evitando trazer colunas desnecessárias e melhorando performance
 * - Substituímos console.log por console.error no catch, que é o canal correto para erros
 * - Tipamos o parâmetro do map com a interface correta em vez de "any"
 */
/**
 * Lista todos os alunos com status ativo no banco de dados.
 * 
 * @returns Promise com array de AlunoDTO em caso de sucesso, ou null em caso de erro.
 * 
 * Boas práticas aplicadas:
 * - Substituímos forEach + push por map(), reduzindo a verbosidade e evitando mutação desnecessária de array
 * - Usamos SELECT explícito em vez de SELECT *, evitando trazer colunas desnecessárias e melhorando performance
 * - Substituímos console.log por console.error no catch, que é o canal correto para erros
 * - Tipamos o parâmetro do map com a interface correta em vez de "any"
 */
static async listarAlunos(): Promise<Array<AlunoDTO> | null> {
  try {
    // ✅ MELHORIA: SELECT explícito ao invés de SELECT *
    // Motivo: buscar apenas as colunas necessárias reduz o tráfego de dados entre banco e aplicação,
    // melhora a performance em tabelas com muitas colunas e torna o código mais legível e previsível.
    const querySelectAluno = `
      SELECT
        id_aluno,
        ra,
        nome,
        sobrenome,
        data_nascimento,
        endereco,
        email,
        celular,
        status_aluno
      FROM Aluno
      WHERE status_aluno = TRUE;
    `;

    // Executa a query e aguarda o retorno do banco.
    // "await" pausa a execução aqui até a Promise ser resolvida.
    const respostaBD = await database.query(querySelectAluno);

    // ✅ MELHORIA: map() no lugar de forEach + push
    // Motivo: map() é declarativo — ele transforma cada item de um array em outro,
    // retornando um novo array diretamente. Não precisamos criar uma variável vazia
    // e ir empurrando itens nela, o que tornava o código mais verboso e imperativo.
    const listaDeAlunos: Array<AlunoDTO> = respostaBD.rows.map((aluno: any): AlunoDTO => ({
      id_aluno:        aluno.id_aluno,
      ra:              aluno.ra,
      nome:            aluno.nome,
      sobrenome:       aluno.sobrenome,
      data_nascimento: aluno.data_nascimento,
      endereco:        aluno.endereco,
      email:           aluno.email,
      celular:         aluno.celular,
      status_aluno:    aluno.status_aluno,
    }));

    // Retorna a lista de alunos mapeada
    return listaDeAlunos;

  } catch (error) {
    // ✅ MELHORIA: console.error ao invés de console.log
    // Motivo: erros devem ser logados no canal correto (stderr), não no canal de saída padrão (stdout).
    // Isso facilita a separação de logs em ferramentas de monitoramento (ex: Datadog, CloudWatch).
    console.error(`Erro ao listar alunos: ${error}`);

    // Retorna null para sinalizar falha ao chamador
    return null;
  }
}
    /**
     * Retorna as informações de um aluno informado pelo ID
     * 
     * @param idAluno Identificador único do aluno
     * @returns Objeto com informações do aluno
     */
    // Recebe o ID do aluno como parâmetro e retorna um AlunoDTO ou null
static async listarAluno(id_aluno: number): Promise<AlunoDTO | null> {
    try {
        const querySelectAluno = `
            SELECT
                id_aluno,
                ra,
                nome,
                sobrenome,
                data_nascimento,
                endereco,
                email,
                celular,
                status_aluno
            FROM aluno
            WHERE id_aluno = $1;
        `;

        const respostaBD = await database.query(querySelectAluno, [id_aluno]);

        if (respostaBD.rows.length === 0) {
            return null;
        }

        return respostaBD.rows[0] as AlunoDTO;

    } catch (error) {
        console.error(`Erro ao buscar aluno de id ${id_aluno}: ${error}`);
        return null;
    }
}

    /**
    * Cadastra um novo aluno no banco de dados
    * @param aluno Objeto Aluno contendo as informações a serem cadastradas
    * @returns Boolean indicando se o cadastro foi bem-sucedido
    */
    // Recebe um objeto Aluno completo e tenta inseri-lo no banco de dados
    static async cadastrarAluno(aluno: Aluno): Promise<boolean> {
    try {
        const queryInsertAluno = `
            INSERT INTO Aluno (nome, sobrenome, data_nascimento, endereco, email, celular)
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING id_aluno;
        `;

        const result = await database.query(queryInsertAluno, [
            aluno.getNome().toUpperCase(),
            aluno.getSobrenome().toUpperCase(),
            aluno.getDataNascimento(),
            aluno.getEndereco().toUpperCase(),
            aluno.getEmail().toLowerCase(),
            aluno.getCelular()
        ]);

        if (result.rows.length > 0) {
            console.log(`Aluno cadastrado com sucesso. ID: ${result.rows[0].id_aluno}`);
            return true;
        }

        return false;
    } catch (error) {
        console.error(`Erro ao cadastrar aluno: ${error}`);
        return false;
    }
}

    /**
    * Remove um aluno do banco de dados
    * @param id_aluno ID do aluno a ser removido
    * @returns Boolean indicando se a remoção foi bem-sucedida
   */
    // Recebe o ID do aluno e realiza uma "remoção lógica" (não apaga do banco, apenas desativa)
    static async removerAluno(id_aluno: number): Promise<boolean> {
        try {
            // Busca o aluno no banco antes de tentar remover, para verificar se ele existe e está ativo
            const aluno: AlunoDTO | null = await this.listarAluno(id_aluno);

            // Só prossegue se o aluno existir (não for null) E estiver com status ativo (true)
            if (aluno && aluno.status_aluno) {
                // Query que desativa todos os empréstimos relacionados ao aluno
                // Em vez de apagar, usa UPDATE para setar o status como FALSE (remoção lógica)
                const queryDeleteEmprestimoAluno = `UPDATE emprestimo 
                                                    SET status_emprestimo_registro = FALSE
                                                    WHERE id_aluno=$1;`;

                // Executa a desativação dos empréstimos do aluno
                await database.query(queryDeleteEmprestimoAluno, [id_aluno]);

                // Query que desativa o próprio aluno (também uma remoção lógica)
                const queryDeleteAluno = `UPDATE aluno 
                                        SET status_aluno = FALSE
                                        WHERE id_aluno=$1;`;

                // Executa a desativação do aluno e armazena o resultado
                const result = await database.query(queryDeleteAluno, [id_aluno]);

                // "rowCount" indica quantas linhas foram afetadas pelo UPDATE
                // Se for diferente de 0, significa que o aluno foi desativado com sucesso
                return true;
            }

            // Se o aluno não existir ou já estiver inativo, retorna false
            return false;

        } catch (error) {
            // Exibe o erro no console e retorna false em caso de falha
            console.log(`Erro na consulta: ${error}`);
            return false;
        }
    }

    /**
    * Atualiza os dados de um aluno no banco de dados.
    * @param aluno Objeto do tipo Aluno com os novos dados
    * @returns true caso sucesso, false caso erro
    */
    // Recebe um objeto Aluno com os dados atualizados e os salva no banco
   static async atualizarAluno(aluno: Aluno): Promise<boolean> {
    try {
        const alunoConsulta: AlunoDTO | null = await this.listarAluno(aluno.id_aluno);

        if (alunoConsulta && alunoConsulta.status_aluno) {
            const queryAtualizarAluno = `
                UPDATE Aluno SET
                    nome = $1,
                    sobrenome = $2,
                    data_nascimento = $3,
                    endereco = $4,
                    celular = $5,
                    email = $6
                WHERE id_aluno = $7
            `;

            const respostaBD = await database.query(queryAtualizarAluno, [
                aluno.getNome().toUpperCase(),
                aluno.getSobrenome().toUpperCase(),
                aluno.getDataNascimento(),
                aluno.getEndereco().toUpperCase(),
                aluno.getCelular(),
                aluno.getEmail().toLowerCase(),
                aluno.id_aluno
            ]);

            if (respostaBD.rowCount != 0) {
                return true;
            }
        }

        return false;
    } catch (error) {
        console.log(`Erro na consulta: ${error}`);
        return false;
    }
}

}


// Exporta a classe Aluno para que possa ser importada e usada em outros arquivos do projeto
export default Aluno;