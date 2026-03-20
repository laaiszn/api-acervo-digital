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
        // ✅ MELHORIA: SELECT explícito ao invés de SELECT *
        // Buscar apenas as colunas necessárias reduz o tráfego de dados entre
        // banco e aplicação, melhora a performance em tabelas com muitas colunas
        // e torna o contrato da query claro — quem ler sabe exatamente o que vem do banco.
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

        // O "$1" é um prepared statement — protege contra SQL Injection,
        // pois o banco trata o valor como dado, nunca como código.
        const respostaBD = await database.query(querySelectAluno, [id_aluno]);

        // ✅ MELHORIA: verificação explícita antes de acessar rows[0]
        // Sem essa checagem, se o id não existir no banco, rows[0] seria undefined
        // e o retorno abaixo lançaria um TypeError silencioso.
        if (respostaBD.rows.length === 0) {
            return null;
        }

        // ✅ MELHORIA: retorno direto com "as AlunoDTO" ao invés de montar o objeto manualmente
        // O banco já retorna as colunas com os mesmos nomes definidos no SELECT,
        // que batem exatamente com os campos do AlunoDTO.
        // Montar o objeto campo a campo era repetição desnecessária.
        return respostaBD.rows[0] as AlunoDTO;

    } catch (error) {
        // ✅ MELHORIA: console.error com o id_aluno ao invés de console.log genérico
        // console.error envia para o canal correto (stderr).
        // Incluir o id facilita rastrear qual busca falou nos logs.
        console.error(`Erro ao listar aluno de id ${id_aluno}: ${error}`);
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
        // ✅ MELHORIA: RETURNING id_aluno ao invés de uma segunda query de verificação
        // Após o INSERT, pedimos ao banco que retorne o ID gerado.
        // Isso confirma que o registro foi criado sem precisar de um SELECT adicional,
        // economizando uma ida e volta ao banco.

        const result = await database.query(queryInsertAluno, [
            aluno.getNome().toUpperCase(),      // Nome padronizado em maiúsculas
            aluno.getSobrenome().toUpperCase(), // Sobrenome padronizado em maiúsculas
            aluno.getDataNascimento(),
            aluno.getEndereco().toUpperCase(),  // Endereço padronizado em maiúsculas
            aluno.getEmail().toLowerCase(),     // E-mail padronizado em minúsculas
            aluno.getCelular()
        ]);

        // ✅ MELHORIA: retorno direto da expressão booleana ao invés de if/else
        // "result.rows.length > 0" já é um booleano.
        // Usar if (result.rows.length > 0) { return true } return false é redundante,
        // pois estamos apenas transformando um booleano em outro booleano.
        return result.rows.length > 0;

    } catch (error) {
        // ✅ MELHORIA: console.error ao invés de console.log
        // Erros devem ser enviados ao canal correto (stderr),
        // facilitando a separação de logs em ferramentas de monitoramento.
        console.error(`Erro ao cadastrar aluno: ${error}`);
        return false;
    }
}

static async removerAluno(id_aluno: number): Promise<boolean> {
    // ✅ MELHORIA: conexão dedicada do pool para uso da transação
    // database.query() usa uma conexão aleatória do pool a cada chamada.
    // Para transações, precisamos de uma conexão fixa — todas as queries
    // devem rodar na mesma conexão para que o BEGIN/COMMIT funcione corretamente.
    const client = await database.connect();

    try {
        const aluno: AlunoDTO | null = await this.listarAluno(id_aluno);

        // ✅ MELHORIA: early return com condição invertida
        // Saímos cedo se o aluno não existir ou já estiver inativo,
        // evitando aninhamento desnecessário no restante do código.
        if (!aluno || !aluno.status_aluno) {
            return false;
        }

        // ✅ MELHORIA: transação com BEGIN / COMMIT / ROLLBACK
        // O código anterior executava duas queries independentes.
        // Se a segunda falhasse, o banco ficaria inconsistente:
        // empréstimos desativados, mas o aluno ainda ativo.
        // Com a transação, as duas operações são atômicas:
        // ou as duas acontecem juntas, ou nenhuma acontece.
        await client.query("BEGIN");

        await client.query(
            `UPDATE emprestimo
             SET status_emprestimo_registro = FALSE
             WHERE id_aluno = $1;`,
            [id_aluno]
        );

        await client.query(
            `UPDATE aluno
             SET status_aluno = FALSE
             WHERE id_aluno = $1;`,
            [id_aluno]
        );

        // Confirma as alterações — só aqui as mudanças ficam permanentes no banco
        await client.query("COMMIT");

        return true;

    } catch (error) {
        // Se qualquer query falhar, o ROLLBACK desfaz tudo que foi feito desde o BEGIN
        await client.query("ROLLBACK");
        console.error(`Erro ao remover aluno de id ${id_aluno}: ${error}`);
        return false;

    } finally {
        // ✅ MELHORIA: finally com client.release()
        // O bloco finally executa sempre, independente de sucesso ou erro.
        // Sem isso, uma falha poderia deixar a conexão ocupada indefinidamente,
        // esgotando o pool e travando toda a aplicação.
        client.release();
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
        // ✅ MELHORIA: aluno.id_aluno → aluno.getIdAluno()
        // O atributo id_aluno é privado na classe Aluno.
        // Acessar atributos privados diretamente viola o encapsulamento do TypeScript.
        // O getter é a forma correta e segura de obter esse valor.
        const alunoConsulta: AlunoDTO | null = await this.listarAluno(aluno.getIdAluno());

        // ✅ MELHORIA: early return com condição invertida
        // Ao invés de aninhar todo o código dentro de um if,
        // saímos cedo quando a condição não é atendida.
        // Isso reduz o nível de indentação e torna o fluxo mais legível.
        if (!alunoConsulta || !alunoConsulta.status_aluno) {
            return false;
        }

        const queryAtualizarAluno = `
            UPDATE Aluno SET
                nome            = $1,
                sobrenome       = $2,
                data_nascimento = $3,
                endereco        = $4,
                celular         = $5,
                email           = $6
            WHERE id_aluno = $7;
        `;

        const respostaBD = await database.query(queryAtualizarAluno, [
            aluno.getNome().toUpperCase(),
            aluno.getSobrenome().toUpperCase(),
            aluno.getDataNascimento(),
            aluno.getEndereco().toUpperCase(),
            aluno.getCelular(),
            aluno.getEmail().toLowerCase(),
            aluno.getIdAluno()
        ]);

        // ✅ MELHORIA: (respostaBD.rowCount ?? 0) > 0 ao invés de respostaBD.rowCount != 0
        // O tipo do rowCount no driver pg é "number | null".
        // Se for null e compararmos direto com != 0, o resultado pode ser inesperado.
        // O operador "??" garante que, se rowCount for null, usamos 0 como valor padrão.
        return (respostaBD.rowCount ?? 0) > 0;

    } catch (error) {
        // ✅ MELHORIA: console.error com id do aluno ao invés de console.log genérico
        // console.error envia para o canal correto (stderr).
        // Incluir o id facilita identificar qual atualização falhou nos logs.
        console.error(`Erro ao atualizar aluno de id ${aluno.getIdAluno()}: ${error}`);
        return false;
    }
}
}



export default Aluno;