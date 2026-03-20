import type LivroDTO from "../dto/LivroDTO.js";
import { DatabaseModel } from "./DatabaseModel.js";

const database = new DatabaseModel().pool;

class Livro {
    private id_livro: number = 0;
    private titulo: string;
    private autor: string;
    private editora: string;
    private ano_publicacao: string;
    private isbn: string;
    private quant_total: number;
    private quant_disponivel: number;
    private valor_aquisicao: number;
    private status_livro_emprestado: string = "Disponível";
    private status_livro: boolean = false;

    constructor(
        _titulo: string,
        _autor: string,
        _editora: string,
        _ano_publicacao: string,
        _isbn: string,
        _quant_total: number,
        _quant_disponivel: number,
        _quant_aquisicao: number,
        _valor_aquisicao: number
    ) {
        this.titulo = _titulo;
        this.autor = _autor;
        this.editora = _editora;
        this.ano_publicacao = _ano_publicacao;
        this.isbn = _isbn;
        this.quant_total = _quant_total;
        this.quant_disponivel = _quant_disponivel;
        this.valor_aquisicao = _valor_aquisicao;
    }

    public getIdLivro(): number {
        return this.id_livro;
    }

    public setIdLivro(value: number) {
        this.id_livro = value;
    }

    public getTitulo(): string {
        return this.titulo;
    }

    public setTitulo(value: string) {
        this.titulo = value;
    }

    public getAutor(): string {
        return this.autor;
    }

    public setAutor(value: string) {
        this.autor = value;
    }

    public getEditora(): string {
        return this.editora;
    }

    public setEditora(value: string) {
        this.editora = value;
    }

    public getAnoPublicacao(): string {
        return this.ano_publicacao;
    }

    public setAnoPublicacao(value: string) {
        this.ano_publicacao = value;
    }

    public getIsbn(): string {
        return this.isbn;
    }

    public setIsbn(value: string) {
        this.isbn = value;
    }

    public getQuantTotal(): number {
        return this.quant_total;
    }

    public setQuantTotal(value: number) {
        this.quant_total = value;
    }

    public getQuantDisponivel(): number {
        return this.quant_disponivel;
    }

    public setQuantDisponivel(value: number) {
        this.quant_disponivel = value;
    }

    public getValorAquisicao(): number {
        return this.valor_aquisicao;
    }

    public setValorAquisicao(value: number) {
        this.valor_aquisicao = value;
    }

    public getStatusLivroEmprestado(): string {
        return this.status_livro_emprestado;
    }

    public setStatusLivroEmprestado(value: string) {
        this.status_livro_emprestado = value;
    }

    public getStatusLivro(): boolean {
        return this.status_livro;
    }

    public setStatusLivro(value: boolean) {
        this.status_livro = value;
    }


    /**
     * Retorna uma lista com todos os livros cadastrados no banco de dados
     * 
     * @returns Lista com todos os livros cadastrados no banco de dados
     */
    // Método assíncrono que busca todos os livros ativos e retorna uma lista de LivroDTO ou null
 static async listarLivros(): Promise<Array<LivroDTO> | null> {
    try {
        // ✅ MELHORIA: SELECT explícito ao invés de SELECT *
        // Buscar apenas as colunas necessárias reduz o tráfego de dados e torna
        // o contrato da query claro — quem ler sabe exatamente o que vem do banco.
        const querySelectLivro = `
            SELECT
                id_livro,
                titulo,
                autor,
                editora,
                ano_publicacao,
                isbn,
                quant_total,
                quant_disponivel,
                quant_aquisicao,
                valor_aquisicao,
                status_livro_emprestado,
                status_livro
            FROM Livro
            WHERE status_livro = TRUE;
        `;
        
        const respostaBD = await database.query(querySelectLivro);

        // ✅ MELHORIA: map() ao invés de forEach + push em lista mutável
        // map() transforma cada linha diretamente em um LivroDTO e retorna o array pronto,
        // sem precisar criar uma variável vazia e empurrar itens nela.
        const listaDeLivros: Array<LivroDTO> = respostaBD.rows.map((livro): LivroDTO => ({
            id_livro:                livro.id_livro,
            titulo:                  livro.titulo,
            autor:                   livro.autor,
            editora:                 livro.editora,
            ano_publicacao:          livro.ano_publicacao,
            isbn:                    livro.isbn,
            quant_total:             livro.quant_total,
            quant_disponivel:        livro.quant_disponivel,
            quant_aquisicao:         livro.quant_aquisicao,
            valor_aquisicao:         livro.valor_aquisicao,
            status_livro_emprestado: livro.status_livro_emprestado,
            status_livro:            livro.status_livro
        }));

        return listaDeLivros;

    } catch (error) {
        // ✅ MELHORIA: console.error ao invés de console.log
        // Erros devem ser enviados ao canal correto (stderr).
        console.error(`Erro ao listar livros: ${error}`);
        return null;
    }
}

static async listarLivro(id_livro: number): Promise<LivroDTO | null> {
    try {
        // ✅ MELHORIA: SELECT explícito ao invés de SELECT *
        const querySelectLivro = `
            SELECT
                id_livro,
                titulo,
                autor,
                editora,
                ano_publicacao,
                isbn,
                quant_total,
                quant_disponivel,
                quant_aquisicao,
                valor_aquisicao,
                status_livro_emprestado,
                status_livro
            FROM livro
            WHERE id_livro = $1;
        `;

        const respostaBD = await database.query(querySelectLivro, [id_livro]);

        // ✅ MELHORIA: verificação explícita antes de acessar rows[0]
        // Sem essa checagem, se o id não existir, rows[0] seria undefined
        // e o retorno abaixo lançaria um TypeError silencioso.
        if (respostaBD.rows.length === 0) {
            return null;
        }

        // ✅ MELHORIA: retorno direto com "as LivroDTO" ao invés de montar o objeto manualmente
        // O banco já retorna as colunas com os mesmos nomes do LivroDTO.
        // Montar o objeto campo a campo era repetição desnecessária.
        return respostaBD.rows[0] as LivroDTO;

    } catch (error) {
        // ✅ MELHORIA: mensagem de erro com id_livro para facilitar o debug
        console.error(`Erro ao buscar livro de id ${id_livro}: ${error}`);
        return null;
    }
}

static async cadastrarLivro(livro: Livro): Promise<boolean> {
    try {
        const queryInsertLivro = `
            INSERT INTO Livro (titulo, autor, editora, ano_publicacao, isbn, quant_total, quant_disponivel, valor_aquisicao, status_livro_emprestado)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
            RETURNING id_livro;
        `;

        const valores = [
            livro.getTitulo().toUpperCase(),
            livro.getAutor().toUpperCase(),
            livro.getEditora().toUpperCase(),
            livro.getAnoPublicacao().toUpperCase(),
            livro.getIsbn().toUpperCase(),
            livro.getQuantTotal(),
            livro.getQuantDisponivel(),
            livro.getValorAquisicao(),
            livro.getStatusLivroEmprestado().toUpperCase()
        ];

        const result = await database.query(queryInsertLivro, valores);

        // ✅ MELHORIA: retorno direto da expressão booleana, sem if/else e sem console.log de sucesso
        // "result.rows.length > 0" já é um booleano — o if era redundante.
        // Logs de operações rotineiras poluem o output.
        return result.rows.length > 0;

    } catch (error) {
        console.error(`Erro ao cadastrar livro: ${error}`);
        return false;
    }
}

static async removerLivro(id_livro: number): Promise<boolean> {
    // ✅ MELHORIA: transação com BEGIN / COMMIT / ROLLBACK
    // O código anterior executava duas queries independentes.
    // Se a segunda falhasse, os empréstimos seriam desativados mas o livro continuaria ativo.
    // Com a transação, as duas operações são atômicas: ou as duas acontecem, ou nenhuma acontece.
    const client = await database.connect();

    try {
        const livro: LivroDTO | null = await this.listarLivro(id_livro);

        // ✅ MELHORIA: early return com condição invertida
        // Saímos cedo se o livro não existir ou já estiver inativo,
        // evitando aninhamento desnecessário no restante do código.
        if (!livro || !livro.status_livro) {
            return false;
        }

        await client.query("BEGIN");

        await client.query(
            `UPDATE emprestimo
             SET status_emprestimo_registro = FALSE
             WHERE id_livro = $1;`,
            [id_livro]
        );

        const result = await client.query(
            `UPDATE livro
             SET status_livro = FALSE
             WHERE id_livro = $1;`,
            [id_livro]
        );

        await client.query("COMMIT");

        // ✅ MELHORIA: (rowCount ?? 0) > 0 ao invés de rowCount != 0
        // rowCount pode ser null no tipo do pg; o ?? garante que tratamos esse caso com segurança.
        return (result.rowCount ?? 0) > 0;

    } catch (error) {
        // Se qualquer query falhar, o ROLLBACK desfaz tudo que foi feito desde o BEGIN
        await client.query("ROLLBACK");
        console.error(`Erro ao remover livro de id ${id_livro}: ${error}`);
        return false;

    } finally {
        // ✅ MELHORIA: finally com client.release()
        // Garante que a conexão volta ao pool sempre, independente de sucesso ou erro,
        // evitando vazamento de conexões que travaria toda a aplicação.
        client.release();
    }
}

static async atualizarLivro(livro: Livro): Promise<boolean> {
    try {
        // ✅ MELHORIA: getIdLivro() ao invés de livro.id_livro
        // O atributo é privado — acessá-lo diretamente viola o encapsulamento.
        const livroConsulta: LivroDTO | null = await this.listarLivro(livro.getIdLivro());

        // ✅ MELHORIA: early return com condição invertida
        if (!livroConsulta || !livroConsulta.status_livro) {
            return false;
        }

        // ✅ MELHORIA: query formatada com SET em linhas alinhadas
        // Facilita a leitura e identificação de cada campo atualizado.
        const queryAtualizarLivro = `
            UPDATE Livro SET
                titulo                  = $1,
                autor                   = $2,
                editora                 = $3,
                ano_publicacao          = $4,
                isbn                    = $5,
                quant_total             = $6,
                quant_disponivel        = $7,
                valor_aquisicao         = $8,
                status_livro_emprestado = $9
            WHERE id_livro = $10;
        `;

        const valores = [
            livro.getTitulo().toUpperCase(),
            livro.getAutor().toUpperCase(),
            livro.getEditora().toUpperCase(),
            livro.getAnoPublicacao().toUpperCase(),
            livro.getIsbn().toUpperCase(),
            livro.getQuantTotal(),
            livro.getQuantDisponivel(),
            livro.getValorAquisicao(),
            livro.getStatusLivroEmprestado().toUpperCase(),
            livro.getIdLivro()
        ];

        const respostaBD = await database.query(queryAtualizarLivro, valores);

        // ✅ MELHORIA: retorno direto da expressão booleana com ?? para tratar rowCount null
        return (respostaBD.rowCount ?? 0) > 0;

    } catch (error) {
        // ✅ MELHORIA: console.error com id do livro ao invés de console.log genérico
        console.error(`Erro ao atualizar livro de id ${livro.getIdLivro()}: ${error}`);
        return false;
    }
}
}

// Exporta a classe Livro para que possa ser importada e usada em outros arquivos do projeto
export default Livro;