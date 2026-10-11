export interface Produto {
    _id: string;
    nome: string;
    imagem: string;
    categoria: string;
    descricao?: string;
    preco: number;
    avaliacao?: {
        nota?: number;
        quantidade?: number;
    };
}