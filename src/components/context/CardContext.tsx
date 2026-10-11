// src/components/projeto-final/contexts/CartContext.tsx

import {
    createContext,
    useState,
    useContext,
    useEffect,
} from 'react';
import type { ReactNode } from 'react';

// Dados do produto que podem ser adicionados ao carrinho
interface ProdutoCarrinho {
    _id: string;
    nome: string;
    categoria?: string;
    imagem: string;
}

// Estrutura de cada item armazenado no carrinho
interface CartItem extends ProdutoCarrinho {
    selecionado: boolean;
}

// Propriedades disponibilizadas pelo contexto
interface CartContextProps {
    itens: CartItem[];
    adicionarAoCarrinho: (produto: ProdutoCarrinho) => void;
    removerDoCarrinho: (id: string) => void;
    alternarSelecao: (id: string) => void;
    selecionarTodos: (valor: boolean) => void;
    limparCarrinho: () => void;
    removerSelecionados: () => void;
    estaNoCarrinho: (id: string) => boolean;
}

interface CartProviderProps {
    children: ReactNode;
}

// Contexto global do carrinho
const CartContext = createContext<CartContextProps | undefined>(undefined);

const CART_KEY = 'carrinho';

export const CartProvider = ({ children }: CartProviderProps) => {
    const [itens, setItens] = useState<CartItem[]>(() => {
        try {
            const salvo = localStorage.getItem(CART_KEY);

            return salvo ? (JSON.parse(salvo) as CartItem[]) : [];
        } catch {
            return [];
        }
    });

    // Salva o carrinho sempre que os itens mudarem
    useEffect(() => {
        localStorage.setItem(CART_KEY, JSON.stringify(itens));
    }, [itens]);

    // Adiciona um produto, evitando duplicados
    const adicionarAoCarrinho = (produto: ProdutoCarrinho): void => {
        setItens((anteriores) => {
            if (anteriores.some((item) => item._id === produto._id)) {
                return anteriores;
            }

            return [
                ...anteriores,
                {
                    _id: produto._id,
                    nome: produto.nome,
                    categoria: produto.categoria,
                    imagem: produto.imagem,
                    selecionado: true,
                },
            ];
        });
    };

    // Remove um produto pelo identificador
    const removerDoCarrinho = (id: string): void => {
        setItens((anteriores) =>
            anteriores.filter((item) => item._id !== id)
        );
    };

    // Alterna a seleção de um item
    const alternarSelecao = (id: string): void => {
        setItens((anteriores) =>
            anteriores.map((item) =>
                item._id === id
                    ? { ...item, selecionado: !item.selecionado }
                    : item
            )
        );
    };

    // Seleciona ou desmarca todos os itens
    const selecionarTodos = (valor: boolean): void => {
        setItens((anteriores) =>
            anteriores.map((item) => ({
                ...item,
                selecionado: valor,
            }))
        );
    };

    // Esvazia o carrinho
    const limparCarrinho = (): void => {
        setItens([]);
    };

    // Remove somente os itens selecionados
    const removerSelecionados = (): void => {
        setItens((anteriores) =>
            anteriores.filter((item) => !item.selecionado)
        );
    };

    // Verifica se o produto já está no carrinho
    const estaNoCarrinho = (id: string): boolean => {
        return itens.some((item) => item._id === id);
    };

    return (
        <CartContext.Provider
            value={{
                itens,
                adicionarAoCarrinho,
                removerDoCarrinho,
                alternarSelecao,
                selecionarTodos,
                limparCarrinho,
                removerSelecionados,
                estaNoCarrinho,
            }}
        >
            {children}
        </CartContext.Provider>
    );
};

// Hook personalizado
export const useCart = (): CartContextProps => {
    const context = useContext(CartContext);

    if (!context) {
        throw new Error('useCart deve ser usado dentro de CartProvider');
    }

    return context;
};