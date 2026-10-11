import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import type { AxiosError } from 'axios';

import ProductCard from '../molecules/ProductCard';
import ErrorMessage from '../molecules/ErrorMessage';
import type { Produto } from '../../types/produto';

const API_URL = 'https://projeto-node-step-t5i1.vercel.app';

interface ProductListProps {
    termoFiltro?: string | null;
    onProdutosCarregados?: (produtos: Produto[]) => void;
}

interface ApiError {
    message?: string;
    erro?: string;
}

const ProductList = ({
    termoFiltro = null,
    onProdutosCarregados,
}: ProductListProps) => {
    const [produtos, setProdutos] = useState<Produto[]>([]);
    const [error, setError] = useState('');

    const navigate = useNavigate();
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');

    // Busca os produtos cadastrados na API.
    const listarProdutos = async () => {
        try {
            const { data } = await axios.get<Produto[]>(
                `${API_URL}/produtos`
            );

            setProdutos(data);
            onProdutosCarregados?.(data);
        } catch (err) {
            setError('Erro ao carregar produtos.');
            console.error(err);
        }
    };

    // Busca os produtos quando o componente é montado.
    useEffect(() => {
        listarProdutos();
    }, []);

    // Abre a página de edição do produto.
    const handleEditar = (id: string) => {
        navigate(`/user/produtos/editar/${id}`);
    };

    // Exclui um produto e atualiza a listagem.
    const handleExcluir = async (id: string) => {
        const confirmar = window.confirm(
            'Tem certeza que deseja excluir este produto?'
        );

        if (!confirmar) return;

        try {
            await axios.delete(`${API_URL}/produtos/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            await listarProdutos();
        } catch (err) {
            const axiosError = err as AxiosError<ApiError>;

            console.error(
                'Erro ao excluir:',
                axiosError.response?.data
            );

            setError('Erro ao excluir produto.');
        }
    };

    // Filtra os produtos pelo nome.
    const produtosFiltrados = termoFiltro
        ? produtos.filter((produto) =>
              produto.nome
                  ?.toLowerCase()
                  .includes(termoFiltro.toLowerCase())
          )
        : produtos;

    if (error) {
        return <ErrorMessage>{error}</ErrorMessage>;
    }

    if (produtosFiltrados.length === 0) {
        return (
            <p className="text-center text-gray-500 dark:text-gray-400">
                {termoFiltro
                    ? `Nenhum produto encontrado para "${termoFiltro}".`
                    : 'Nenhum produto cadastrado ainda.'}
            </p>
        );
    }

    return (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {produtosFiltrados.map((produto) => (
                <ProductCard
                    key={produto._id}
                    produto={produto}
                    onEditar={handleEditar}
                    onExcluir={handleExcluir}
                    role={role}
                />
            ))}
        </div>
    );
};

export default ProductList;