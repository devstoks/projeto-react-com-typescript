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

    // Todos os estados são string (o input sempre devolve string).
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

        const fetchProduto = async () => {
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
            } catch (err) {
                console.error('Erro ao buscar produto:', err);
                setError('Erro ao carregar produto.');
            }
        };

        fetchProduto();
    }, [ehEdicao, id]);

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError('');

        if (
            !nome ||
            !preco ||
            !descricao ||
            !categoria ||
            !nota ||
            !quantidade ||
            !imagem
        ) {
            setError('Todos os campos são obrigatórios!');
            return;
        }

        const payload: ProdutoPayload = {
            nome,
            preco: Number(preco),
            descricao,
            categoria,
            imagem,
            avaliacao: {
                nota: Number(nota),
                quantidade: Number(quantidade),
            },
        };

        try {
            if (ehEdicao) {
                await axios.put(`${API_URL}/produtos/${id}`, payload, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                setSucesso('Produto atualizado com sucesso!');
            } else {
                await axios.post(`${API_URL}/produtos`, payload, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                setSucesso('Produto criado com sucesso!');
            }
        } catch (err) {
            const axiosError = err as AxiosError<ApiError>;

            console.error('Erro:', axiosError.response?.data);

            setError(
                axiosError.response?.data?.message ||
                    axiosError.response?.data?.erro ||
                    `Erro ao ${ehEdicao ? 'atualizar' : 'criar'} produto.`
            );
        }
    };

    const handleFecharModal = () => {
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
                        value={nome}
                        onChange={(e) => setNome(e.target.value)}
                        placeholder="Ex: iPhone 12"
                    />

                    <FormField
                        label="Categoria"
                        id="categoria"
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
                        type="number"
                        value={preco}
                        onChange={(e) => setPreco(e.target.value)}
                        placeholder="0,00"
                    />

                    <FormField
                        label="Avaliação (0 a 5)"
                        id="nota"
                        type="number"
                        value={nota}
                        onChange={(e) => setNota(e.target.value)}
                        placeholder="Ex: 4.7"
                    />
                </div>

                <FormField
                    label="Quantidade de avaliações"
                    id="quantidade"
                    type="number"
                    value={quantidade}
                    onChange={(e) => setQuantidade(e.target.value)}
                    placeholder="Ex: 100"
                />

                <FormField
                    label="URL da imagem"
                    id="imagem"
                    type="url"
                    value={imagem}
                    onChange={(e) => setImagem(e.target.value)}
                    placeholder="https://exemplo.com/imagem.jpg"
                />

                <FormField
                    label="Descrição"
                    id="descricao"
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