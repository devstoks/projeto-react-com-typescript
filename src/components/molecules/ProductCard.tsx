import { useNavigate } from 'react-router-dom';

import type { Produto } from '../../types/produto';
import Button from '../atoms/Button';

interface ProductCardProps {
    produto: Produto;
    role: string | null;
    onEditar?: (id: string) => void;
    onExcluir?: (id: string) => void;
}

const ProductCard = ({
    produto,
    role,
    onEditar,
    onExcluir,
}: ProductCardProps) => {
    const navigate = useNavigate();

    const precoFormatado = produto.preco.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL',
    });

    const handleComprar = () => {
        // Por enquanto, abre os detalhes do produto.
        navigate(`/user/produto/${produto._id}`);
    };

    return (
        <div
            className="flex h-full cursor-pointer flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition hover:shadow-md dark:border-gray-700 dark:bg-gray-900"
            onClick={() => navigate(`/user/produto/${produto._id}`)}
        >
            <div className="flex h-48 items-center justify-center bg-gray-50 p-4 dark:bg-gray-800">
                <img
                    src={produto.imagem}
                    alt={produto.nome}
                    className="max-h-full w-full object-contain"
                />
            </div>

            <div className="flex flex-1 flex-col p-4 text-left">
                <span className="self-start rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-600 dark:bg-blue-900/40 dark:text-blue-300">
                    {produto.categoria}
                </span>

                <h3 className="mt-2 line-clamp-2 text-lg font-bold text-gray-900 dark:text-white">
                    {produto.nome}
                </h3>

                {produto.descricao && (
                    <p className="mt-1 line-clamp-2 text-sm text-gray-500 dark:text-gray-400">
                        {produto.descricao}
                    </p>
                )}

                <div className="mt-2 flex items-center gap-2">
                    <span className="text-yellow-400">★</span>

                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        {produto.avaliacao?.nota ?? 'Sem nota'}
                    </span>

                    <span className="text-xs text-gray-400 dark:text-gray-500">
                        ({produto.avaliacao?.quantidade ?? 0})
                    </span>
                </div>

                <p className="mt-3 text-xl font-bold text-gray-900 dark:text-white">
                    {precoFormatado}
                </p>

                {/* Ações exclusivas do administrador. */}
                {role === 'admin' && (
                    <div className="mt-4 flex gap-2">
                        <Button
                            variant="secondary"
                            className="!w-auto !px-4"
                            onClick={(e) => {
                                e.stopPropagation();
                                onEditar?.(produto._id);
                            }}
                        >
                            Editar
                        </Button>

                        <Button
                            variant="danger"
                            className="!w-auto !px-4"
                            onClick={(e) => {
                                e.stopPropagation();
                                onExcluir?.(produto._id);
                            }}
                        >
                            Excluir
                        </Button>
                    </div>
                )}

                {/* Ação exclusiva do usuário comum. */}
                {role === 'user' && (
                    <div className="mt-4">
                        <Button
                            variant="success"
                            className="!w-full"
                            onClick={(e) => {
                                e.stopPropagation();
                                handleComprar();
                            }}
                        >
                            Comprar
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProductCard;
