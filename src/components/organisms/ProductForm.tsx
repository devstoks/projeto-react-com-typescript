
import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import type { AxiosError } from 'axios';

import FormField from '../molecules/FormField';
import ErrorMessage from '../molecules/ErrorMessage';
import SuccessModal from '../molecules/SucessModal';
import Button from '../atoms/Button';

const API_URL = 'https://projeto-node-step-t5i1.vercel.app';

interface ProductFormProps {
    modo?: 'criar' | 'editar';
    id?: string | null;
}

interface ProdutoResponse {
    nome?: string;
    preco?: number | string;
    descricao?: string;
    categoria?: string;
    imagem?: string;
    avaliacao?: {
        nota?: number | string;
        quantidade?: number | string;
    };
}

interface ProdutoPayload {
    nome: string;
    preco: number;
    descricao: string;
    categoria: string;
    imagem: string;
    avaliacao: {
        nota: number;
        quantidade: number;
    };
}

interface ApiError {
    message?: string;
    erro?: string;
}

const ProductForm = ({ modo = 'criar', id = null }: ProductFormProps) => {
    const navigate = useNavigate();
    const token = localStorage.getItem('token');

    const [nome, setNome] = useState('');
    const [preco, setPreco] = useState('');
    const [descricao, setDescricao] = useState('');
    const [categoria, setCategoria] = useState('');
    const [nota, setNota] = useState('');
    const [quantidade, setQuantidade] = useState('');
    const [imagem, setImagem] = useState('');

    const [error, setError] = useState('');
    const [sucesso, setSucesso] = useState('');

    const ehEdicao = modo === 'editar';

    useEffect(() => {
        if (!ehEdicao || !id) return;

        const fetchProduto = async (): Promise<void> => {
            try {
                const { data } = await axios.get<ProdutoResponse>(
                    `${API_URL}/produtos/${id}`
                );

                setNome(data.nome ?? '');
                setPreco(data.preco !== undefined ? String(data.preco) : '');
                setDescricao(data.descricao ?? '');
                setCategoria(data.categoria ?? '');
                setNota(
                    data.avaliacao?.nota !== undefined
                        ? String(data.avaliacao.nota)
                        : ''
                );
                setQuantidade(
                    data.avaliacao?.quantidade !== undefined
                        ? String(data.avaliacao.quantidade)
                        : ''
                );
                setImagem(data.imagem ?? '');
            } catch (err: unknown) {
                console.error('Erro ao buscar produto:', err);
                setError('Erro ao carregar produto.');
            }
        };

        void fetchProduto();
    }, [ehEdicao, id]);

    const handleSubmit = async (
        e: FormEvent<HTMLFormElement>
    ): Promise<void> => {
        e.preventDefault();
        setError('');

        if (
            !nome.trim() ||
            !preco ||
            !descricao.trim() ||
            !categoria ||
            !nota ||
            !quantidade ||
            !imagem.trim()
        ) {
            setError('Todos os campos são obrigatórios!');
            return;
        }

        const precoNumero = Number(preco);
        const notaNumero = Number(nota);
        const quantidadeNumero = Number(quantidade);

        if (
            !Number.isFinite(precoNumero) ||
            precoNumero <= 0 ||
            !Number.isFinite(notaNumero) ||
            notaNumero < 0 ||
            notaNumero > 5 ||
            !Number.isInteger(quantidadeNumero) ||
            quantidadeNumero < 0
        ) {
            setError('Confira o preço, a avaliação e a quantidade informados.');
            return;
        }

        const payload: ProdutoPayload = {
            nome: nome.trim(),
            preco: precoNumero,
            descricao: descricao.trim(),
            categoria,
            imagem: imagem.trim(),
            avaliacao: {
                nota: notaNumero,
                quantidade: quantidadeNumero,
            },
        };

        try {
            if (ehEdicao) {
                if (!id) {
                    setError('ID do produto não informado.');
                    return;
                }

                await axios.put(`${API_URL}/produtos/${id}`, payload, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                setSucesso('Produto atualizado com sucesso!');
            } else {
                await axios.post(`${API_URL}/produtos`, payload, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                setSucesso('Produto criado com sucesso!');
            }
        } catch (err: unknown) {
            const axiosError = err as AxiosError<ApiError>;

            console.error('Erro:', axiosError.response?.data);

            setError(
                axiosError.response?.data?.message ||
                axiosError.response?.data?.erro ||
                `Erro ao ${ehEdicao ? 'atualizar' : 'criar'} produto.`
            );
        }
    };

    const handleFecharModal = (): void => {
        setSucesso('');
        navigate('/user/home');
    };

    return (
        <>
            <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 gap-x-4 sm:grid-cols-2">
                    <FormField
                        label="Nome do produto"
                        id="nome"
                        name="nome"
                        value={nome}
                        onChange={(e) => setNome(e.target.value)}
                        placeholder="Ex: iPhone 12"
                    />

                    <FormField
                        label="Categoria"
                        id="categoria"
                        name="categoria"
                        as="select"
                        value={categoria}
                        onChange={(e) => setCategoria(e.target.value)}
                    >
                        <option value="">Selecione</option>
                        <option value="masculino">Masculino</option>
                        <option value="feminino">Feminino</option>
                        <option value="eletronicos">Eletrônicos</option>
                        <option value="joias">Joias</option>
                    </FormField>
                </div>

                <div className="grid grid-cols-1 gap-x-4 sm:grid-cols-2">
                    <FormField
                        label="Preço (R$)"
                        id="preco"
                        name="preco"
                        type="number"
                        value={preco}
                        onChange={(e) => setPreco(e.target.value)}
                        placeholder="0,00"
                    />

                    <FormField
                        label="Avaliação (0 a 5)"
                        id="nota"
                        name="nota"
                        type="number"
                        value={nota}
                        onChange={(e) => setNota(e.target.value)}
                        placeholder="Ex: 4.7"
                    />
                </div>

                <FormField
                    label="Quantidade de avaliações"
                    id="quantidade"
                    name="quantidade"
                    type="number"
                    value={quantidade}
                    onChange={(e) => setQuantidade(e.target.value)}
                    placeholder="Ex: 100"
                />

                <FormField
                    label="URL da imagem"
                    id="imagem"
                    name="imagem"
                    type="url"
                    value={imagem}
                    onChange={(e) => setImagem(e.target.value)}
                    placeholder="https://exemplo.com/imagem.jpg"
                />

                <FormField
                    label="Descrição"
                    id="descricao"
                    name="descricao"
                    value={descricao}
                    onChange={(e) => setDescricao(e.target.value)}
                    placeholder="Descreva o produto..."
                />

                <ErrorMessage>{error}</ErrorMessage>

                <Button
                    type="submit"
                    variant={ehEdicao ? 'success' : 'primary'}
                >
                    {ehEdicao ? 'Atualizar Produto' : 'Criar Produto'}
                </Button>
            </form>

            <SuccessModal
                aberto={!!sucesso}
                titulo={ehEdicao ? 'Produto atualizado!' : 'Produto criado!'}
                mensagem={sucesso}
                onFechar={handleFecharModal}
            />
        </>
    );
};

export default ProductForm;
