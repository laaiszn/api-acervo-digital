import type EmprestimoDTO from "../dto/EmprestimoDTO.js";
import { DatabaseModel } from "./DatabaseModel.js";

const database = new DatabaseModel().pool;

class Emprestimo {

    private id_emprestimo: number = 0;
    private id_aluno: number;
    private id_livro: number;
    private data_emprestimo: Date;
    private data_devolucao: Date;
    private status_emprestimo: string;
    private status_emprestimo_registro: boolean = true;

    constructor(
        _id_aluno: number,
        _id_livro: number,
        _data_emprestimo: Date,
        _status_emprestimo?: string,
        _data_devolucao?: Date
    ) {
        const dataDevolucaoPadrao = new Date(_data_emprestimo);
        dataDevolucaoPadrao.setDate(dataDevolucaoPadrao.getDate() + 7);

        this.id_aluno = _id_aluno;
        this.id_livro = _id_livro;
        this.data_emprestimo = _data_emprestimo;
        this.status_emprestimo = _status_emprestimo ?? "Em Andamento";
        this.data_devolucao = _data_devolucao ?? dataDevolucaoPadrao;
    }

    public getIdEmprestimo(): number {
        return this.id_emprestimo;
    }

    public setIdEmprestimo(value: number) {
        this.id_emprestimo = value;
    }

    public getIdAluno(): number {
        return this.id_aluno;
    }

    public setIdAluno(value: number) {
        this.id_aluno = value;
    }

    public getIdLivro(): number {
        return this.id_livro;
    }

    public setIdLivro(value: number) {
        this.id_livro = value;
    }

    public getDataEmprestimo(): Date {
        return this.data_emprestimo;
    }

    public setDataEmprestimo(value: Date) {
        this.data_emprestimo = value;
    }

    public getDataDevolucao(): Date {
        return this.data_devolucao;
    }

    public setDataDevolucao(value: Date) {
        this.data_devolucao = value;
    }

    public getStatusEmprestimo(): string {
        return this.status_emprestimo;
    }

    public setStatusEmprestimo(value: string) {
        this.status_emprestimo = value;
    }

    public getStatusEmprestimoRegistro(): boolean {
        return this.status_emprestimo_registro;
    }

    public setStatusEmprestimoRegistro(value: boolean) {
        this.status_emprestimo_registro = value;
    }
    /**
    * Retorna uma lista com todos os Emprestimos cadastrados no banco de dados
    * 
    * @returns Lista com todos os Emprestimos cadastrados no banco de dados
    */
    // Método assíncrono que busca todos os empréstimos ativos e retorna uma lista de EmprestimoDTO ou null
static async listarEmprestimos(): Promise<Array<EmprestimoDTO> | null> {
    try {
        const querySelectEmprestimo = `
            SELECT e.id_emprestimo, e.id_aluno, e.id_livro,
                   e.data_emprestimo, e.data_devolucao, e.status_emprestimo, e.status_emprestimo_registro,
                   a.ra, a.nome, a.sobrenome, a.celular, a.email,
                   l.titulo, l.autor, l.editora, l.isbn
            FROM Emprestimo e
            JOIN Aluno a ON e.id_aluno = a.id_aluno
            JOIN Livro l ON e.id_livro = l.id_livro
            WHERE e.status_emprestimo_registro = TRUE;
        `;

        const respostaBD = await database.query(querySelectEmprestimo);

        if (respostaBD.rows.length === 0) {
            return null;
        }

        // ✅ MELHORIA: map() ao invés de forEach + push em lista mutável
        // map() transforma cada linha diretamente em um EmprestimoDTO e retorna
        // o array pronto. Não precisamos criar uma variável vazia e empurrar itens nela,
        // o que tornava o código mais verboso e imperativo.
        const listaDeEmprestimos: Array<EmprestimoDTO> = respostaBD.rows.map((linha: any): EmprestimoDTO => ({
            id_emprestimo:              linha.id_emprestimo,
            data_emprestimo:            linha.data_emprestimo,
            data_devolucao:             linha.data_devolucao,
            status_emprestimo:          linha.status_emprestimo,
            status_emprestimo_registro: linha.status_emprestimo_registro,
            aluno: {
                id_aluno:  linha.id_aluno,
                ra:        linha.ra,
                nome:      linha.nome,
                sobrenome: linha.sobrenome,
                celular:   linha.celular,
                email:     linha.email
            },
            livro: {
                id_livro: linha.id_livro,
                titulo:   linha.titulo,
                autor:    linha.autor,
                editora:  linha.editora,
                isbn:     linha.isbn
            }
        }));

        return listaDeEmprestimos;

    } catch (error) {
        // ✅ MELHORIA: console.error ao invés de console.log
        // Erros devem ser enviados ao canal correto (stderr),
        // facilitando a separação de logs em ferramentas de monitoramento.
        console.error(`Erro ao listar empréstimos: ${error}`);
        return null;
    }
}

    /**
     * Retorna as informações de um empréstimo informado pelo ID
     * 
     * @param id_emprestimo Identificador único do empréstimo
     * @returns Objeto com informações do empréstimo
     */
    // Recebe o ID do empréstimo e retorna um único EmprestimoDTO ou null
static async listarEmprestimo(id_emprestimo: number): Promise<EmprestimoDTO | null> {
    try {
        const querySelectEmprestimo = `
            SELECT e.id_emprestimo, e.id_aluno, e.id_livro,
                   e.data_emprestimo, e.data_devolucao, e.status_emprestimo, e.status_emprestimo_registro,
                   a.ra, a.nome, a.sobrenome, a.celular, a.email,
                   l.titulo, l.autor, l.editora, l.isbn
            FROM Emprestimo e
            JOIN Aluno a ON e.id_aluno = a.id_aluno
            JOIN Livro l ON e.id_livro = l.id_livro
            WHERE e.id_emprestimo = $1;
        `;

        const respostaBD = await database.query(querySelectEmprestimo, [id_emprestimo]);

        // ✅ MELHORIA: verificação explícita antes de acessar rows[0]
        // Sem essa checagem, se o id não existir no banco, rows[0] seria undefined
        // e a montagem do objeto abaixo lançaria um TypeError silencioso.
        if (respostaBD.rows.length === 0) {
            return null;
        }

        // ✅ MELHORIA: destructuring de rows[0] para evitar repetição
        // Ao invés de acessar respostaBD.rows[0].campo em cada linha,
        // extraímos a linha uma única vez e usamos diretamente.
        const linha = respostaBD.rows[0];

        const emprestimoDTO: EmprestimoDTO = {
            id_emprestimo:              linha.id_emprestimo,
            data_emprestimo:            linha.data_emprestimo,
            data_devolucao:             linha.data_devolucao,
            status_emprestimo:          linha.status_emprestimo,
            status_emprestimo_registro: linha.status_emprestimo_registro,
            aluno: {
                id_aluno:  linha.id_aluno,
                ra:        linha.ra,
                nome:      linha.nome,
                sobrenome: linha.sobrenome,
                celular:   linha.celular,
                email:     linha.email
            },
            livro: {
                id_livro: linha.id_livro,
                titulo:   linha.titulo,
                autor:    linha.autor,
                editora:  linha.editora,
                isbn:     linha.isbn
            }
        };

        return emprestimoDTO;

    } catch (error) {
        // ✅ MELHORIA: mensagem de erro com o id_emprestimo
        // Incluir o id facilita rastrear qual busca falhou nos logs.
        console.error(`Erro ao buscar empréstimo de id ${id_emprestimo}: ${error}`);
        return null;
    }
}

    /**
     * Cadastra um novo empréstimo no banco de dados
     */
    // Recebe um objeto Emprestimo completo e tenta inseri-lo no banco
  static async cadastrarEmprestimo(emprestimo: Emprestimo): Promise<boolean> {
    try {
        const queryInsertEmprestimo = `
            INSERT INTO Emprestimo (id_aluno, id_livro, data_emprestimo, data_devolucao, status_emprestimo)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING id_emprestimo;
        `;

        // ✅ MELHORIA: getters ao invés de acesso direto aos atributos privados
        // Mesmo dentro da classe, usar getters é a forma correta de acessar atributos privados.
        // Isso garante consistência e permite que qualquer lógica futura adicionada
        // nos getters seja aplicada automaticamente aqui também.
        const valores = [
            emprestimo.getIdAluno(),
            emprestimo.getIdLivro(),
            emprestimo.getDataEmprestimo(),
            emprestimo.getDataDevolucao(),
            emprestimo.getStatusEmprestimo()
        ];

        const resultado = await database.query(queryInsertEmprestimo, valores);

        // ✅ MELHORIA: (resultado.rowCount ?? 0) > 0 ao invés de resultado.rowCount != 0
        // O tipo do rowCount no driver pg é "number | null".
        // O operador "??" garante que, se rowCount for null, usamos 0 como valor padrão,
        // evitando uma comparação inesperada com null.
        // ✅ MELHORIA: retorno direto da expressão booleana, sem if/else desnecessário
        // e sem console.log de sucesso — logs de operações rotineiras poluem o output.
        return (resultado.rowCount ?? 0) > 0;

    } catch (error) {
        console.error(`Erro ao cadastrar empréstimo: ${error}`);
        return false;
    }
}

    /**
     * Atualiza os dados de um empréstimo existente no banco de dados
     */
    // Diferente dos outros métodos, este recebe os dados separados como parâmetros individuais (não um objeto Emprestimo)
 static async atualizarEmprestimo(
    id_emprestimo: number,
    id_aluno: number,
    id_livro: number,
    data_emprestimo: Date,
    data_devolucao: Date,
    status_emprestimo: string
): Promise<boolean> {
    try {
        // ✅ MELHORIA: query formatada com indentação consistente
        // Melhora a legibilidade e torna mais fácil identificar cada campo atualizado.
        const queryUpdateEmprestimo = `
            UPDATE Emprestimo
            SET
                id_aluno          = $1,
                id_livro          = $2,
                data_emprestimo   = $3,
                data_devolucao    = $4,
                status_emprestimo = $5
            WHERE id_emprestimo = $6
            RETURNING id_emprestimo;
        `;

        const valores = [id_aluno, id_livro, data_emprestimo, data_devolucao, status_emprestimo, id_emprestimo];

        const resultado = await database.query(queryUpdateEmprestimo, valores);

        // ✅ MELHORIA: early return com (rowCount ?? 0) > 0 ao invés de throw new Error
        // Lançar um erro manualmente só para capturá-lo no catch logo abaixo é um
        // antipadrão — o try/catch tem custo de performance e deve ser reservado para
        // erros inesperados, não para fluxos previsíveis como "registro não encontrado".
        // Retornar false diretamente é mais simples, eficiente e legível.
        if ((resultado.rowCount ?? 0) === 0) {
            return false;
        }

        return true;

    } catch (error) {
        console.error(`Erro ao atualizar empréstimo de id ${id_emprestimo}: ${error}`);
        return false;
    }
}

    /**
     * Remove um empréstimo ativo do banco de dados
     * 
     * @param id_emprestimo 
     * @returns true caso o empréstimo tenha sido removido, false caso contrário
     */
    // Realiza uma remoção lógica: não apaga o registro, apenas muda o status para FALSE
    static async removerEmprestimo(id_emprestimo: number): Promise<boolean> {
        try {
            // Query de remoção lógica — usa UPDATE para desativar o registro em vez de DELETE
            // Isso preserva o histórico de empréstimos no banco de dados
            const queryDeleteEmprestimo = `UPDATE emprestimo 
                                            SET status_emprestimo_registro = FALSE
                                            WHERE id_emprestimo=$1`;

            // Executa a query passando o ID do empréstimo como parâmetro (substitui o $1)
            const respostaBD = await database.query(queryDeleteEmprestimo, [id_emprestimo]);

            // Verifica se pelo menos uma linha foi afetada pelo UPDATE
            if (respostaBD.rowCount != 0) {
                // Exibe mensagem de sucesso no console
                console.log('Empréstimo removido com sucesso!');
                // Retorna true para indicar que a remoção foi bem-sucedida
                return true;
            }

            // Se rowCount for 0, nenhum registro foi encontrado com esse ID — retorna false
            return false;

        } catch (error) {
            // Exibe o erro no console e retorna false em caso de falha
            console.log(`Erro ao remover empréstimo: ${error}`);
            return false;
        }
    }
}

// Exporta a classe Emprestimo para que possa ser importada e usada em outros arquivos do projeto
export default Emprestimo;