
export default interface LivroDTO {
    id_livro?: number,
    titulo: string,
    autor: string,
    editora: string,
    ano_publicacao: string,
    isbn: string,
    quant_total: number,
    quant_disponivel: number,
    quant_aquisicao: number,
    valor_aquisicao: number,
    // Indica a situação de circulação do livro — OPCIONAL
    // Exemplos de valores: "Disponível", "Emprestado"
    // Opcional pois o sistema pode definir este valor automaticamente com base na quant_disponivel
    status_livro_emprestado?: string;
    // Status do livro no sistema (true = ativo, false = removido logicamente) — OPCIONAL
    // Opcional pois ao cadastrar um novo livro, o status é definido automaticamente pelo banco
    // Livros com false não aparecem nas listagens, mas continuam no banco para preservar o histórico
    status_livro?: boolean
}