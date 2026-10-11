import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

import PageLayout from '../../templates/PageLayout';
import Button from '../../atoms/Button';
import ErrorMessage from '../../molecules/ErrorMessage';
import ProductCard from '../../molecules/ProductCard';
import { useCart } from '../../context/CardContext';
import type { Produto } from '../../../types/produto';


const API_URL = 'https://projeto-node-step-t5i1.vercel.app';


interface ListaProdutosResponse {
    produtos?: Produto[];
}

const DetalhesProduto = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const { adicionarAoCarrinho, estaNoCarrinho } = useCart();

    const [produto, setProduto] = useState<Produto | null>(null);
    const [relacionados, setRelacionados] = useState<Produto[]>([]);
    const [error, setError] = useState('');

    const role = localStorage.getItem('role');
    const ehUsuario = role === 'user';

    useEffect(() => {
        const fetchProduto = async (): Promise<void> => {
            if (!id) {
                setError('Identificador do produto não informado.');
                return;
            }

            try {
                setError('');
                setProduto(null);

                const { data } = await axios.get<Produto>(
                    `${API_URL}/produtos/${id}`
                );

                setProduto(data);
            } catch (err: unknown) {
                console.error('Erro ao buscar produto:', err);
                setError('Não foi possível carregar o produto.');
            }
        };

        void fetchProduto();
    }, [id]);

    useEffect(() => {
        const fetchRelacionados = async (): Promise<void> => {
            try {
                const { data } = await axios.get<
                    Produto[] | ListaProdutosResponse
                >(`${API_URL}/produtos`);

                const lista = Array.isArray(data)
                    ? data
                    : data.produtos ?? [];

                const outros = lista
                    .filter((p) => p._id !== id)
                    .slice(0, 5);

                setRelacionados(outros);
            } catch (err: unknown) {
                console.error('Erro ao buscar produtos relacionados:', err);
            }
        };

        void fetchRelacionados();
    }, [id]);

    if (!produto && !error) {
        return (
            <PageLayout title="Detalhes do Produto" largura="4xl">
                <p className="text-center text-gray-500 dark:text-gray-400">
                    Carregando produto...
                </p>
            </PageLayout>
        );
    }

    if (error) {
        return (
            <PageLayout title="Detalhes do Produto" largura="4xl">
                <ErrorMessage>{error}</ErrorMessage>

                <div className="mt-6 flex justify-center">
                    <Button
                        variant="primary"
                        className="!w-auto !px-6"
                        onClick={() => navigate('/user/home')}
                    >
                        ← Voltar para a Home
                    </Button>
                </div>
            </PageLayout>
        );
    }

    // Após os retornos acima, o produto está disponível.
    if (!produto) return null;

    const jaEstaNoCarrinho = estaNoCarrinho(produto._id);

    return (
        <PageLayout title="Detalhes do Produto" largura="4xl">
            <button
                type="button"
                onClick={() => navigate(-1)}
                className="mb-6 flex items-center gap-2 text-sm font-medium text-gray-600 transition-colors hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400"
            >
                ← Voltar
            </button>

            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                <div className="flex items-center justify-center rounded-2xl bg-gray-50 p-6 dark:bg-gray-800">
                    <img
                        src={produto.imagem}
                        alt={produto.nome}
                        className="max-h-[400px] w-full object-contain"
                    />
                </div>

                <div className="flex flex-col text-left">
                    <span className="self-start rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-600 dark:bg-blue-900/40 dark:text-blue-300">
                        {produto.categoria}
                    </span>

                    <h1 className="mt-3 text-3xl font-bold text-gray-900 dark:text-white">
                        {produto.nome}
                    </h1>

                    <div className="mt-3 flex items-center gap-2">
                        <span className="text-yellow-400">★</span>

                        <span className="font-medium text-gray-700 dark:text-gray-300">
                            {produto.avaliacao?.nota}
                        </span>

                        <span className="text-sm text-gray-400 dark:text-gray-500">
                            ({produto.avaliacao?.quantidade} avaliações)
                        </span>
                    </div>

                    <p className="mt-4 text-gray-600 dark:text-gray-300">
                        {produto.descricao}
                    </p>

                    <p className="mt-6 text-3xl font-bold text-gray-900 dark:text-white">
                        R$ {Number(produto.preco).toFixed(2)}
                    </p>

                    {ehUsuario && (
                        <div className="mt-6">
                            <Button
                                variant={jaEstaNoCarrinho ? 'ghost' : 'primary'}
                                className="!w-full sm:!w-auto sm:!px-8"
                                disabled={jaEstaNoCarrinho}
                                onClick={() => adicionarAoCarrinho(produto)}
                            >
                                {jaEstaNoCarrinho
                                    ? '✓ Já está no carrinho'
                                    : '🛒 Adicionar ao carrinho'}
                            </Button>
                        </div>
                    )}

                    {!ehUsuario && (
                        <p className="mt-6 text-sm text-gray-400 dark:text-gray-500">
                            Você está logado como administrador — não é possível comprar.
                        </p>
                    )}
                </div>
            </div>

            {relacionados.length > 0 && (
                <section className="mt-16 text-left">
                    <h2 className="mb-6 text-center text-2xl font-bold text-gray-900 dark:text-white">
                        Você também pode gostar
                    </h2>

                    <div className="mx-auto flex max-w-5xl flex-wrap justify-center gap-6">
                        {relacionados.map((p) => (
                            <div
                                key={p._id}
                                className="w-full sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)]"
                            >
                                <ProductCard
                                    produto={p}
                                    role={role}
                                />
                            </div>
                        ))}
                    </div>
                </section>
            )}
        </PageLayout>
    );
};

export default DetalhesProduto;