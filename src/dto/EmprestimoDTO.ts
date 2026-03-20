
export default interface EmprestimoDTO {

    id_emprestimo: number,
    aluno: {
        // ID do aluno — OBRIGATÓRIO dentro do objeto aluno
        // É o único campo obrigatório pois é a chave que liga o empréstimo ao aluno no banco
        id_aluno: number,
        nome?: string,
        sobrenome?: string,
        data_nascimento?: Date,
        endereco?: string,
        email?: string,
        ra?: string,
        status_aluno?: boolean
    },

    // Objeto aninhado que representa o livro vinculado ao empréstimo — OBRIGATÓRIO
    // Assim como o objeto aluno acima, os dados do livro foram declarados inline
    livro: {
        // ID do livro — OBRIGATÓRIO dentro do objeto livro
        // É o único campo obrigatório pois é a chave que liga o empréstimo ao livro no banco
        id_livro: number,
        // Os campos abaixo são todos OPCIONAIS — trazidos conforme a necessidade da tela ou operação

        titulo?: string,
        autor?: string,
        editora?: string,
        ano_publicacao?: string,
        isbn?: string,
        quant_total?: number,
        quant_disponivel?: number,
        quant_aquisicao?: number,
        valor_aquisicao?: number,
        status_livro_emprestado?: string;
        status_livro?: boolean
    },

    // Data em que o empréstimo foi realizado — OBRIGATÓRIO
    // Todo empréstimo precisa ter uma data de início registrada
    data_emprestimo: Date,

    // Data prevista para devolução do livro — OPCIONAL
    // Pode ser omitida em certas operações, já que o sistema calcula automaticamente (empréstimo + 7 dias)
    data_devolucao?: Date,

    // Situação atual do empréstimo — OPCIONAL
    // Exemplos de valores: "Em Andamento", "Devolvido", "Atrasado"
    // Opcional pois ao criar um empréstimo, o status é definido automaticamente como "Em Andamento"
    status_emprestimo?: string,

    // Indica se o registro do empréstimo está ativo no sistema (true) ou removido logicamente (false) — OPCIONAL
    // Assim como o status_aluno e status_livro, controla a visibilidade do registro sem apagar do banco
    status_emprestimo_registro?: boolean
}