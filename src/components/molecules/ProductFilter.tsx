import { useState } from 'react';
import type { KeyboardEvent } from 'react';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import Button from '../atoms/Button';

interface ProductFilterProps {
    opcoes?: string[];
    onFiltrar: (nome: string | null) => void;
}

const ProductFilter = ({
    opcoes = [],
    onFiltrar
}: ProductFilterProps) => {
    const [valorSelecionado, setValorSelecionado] = useState<string | null>(null);

    const handleFiltrar = (): void => {
        onFiltrar(valorSelecionado);
    };

    const handleLimpar = (): void => {
        setValorSelecionado(null);
        onFiltrar(null);
    };

    const handleKeyDown = (
        e: KeyboardEvent<HTMLDivElement>
    ): void => {
        if (e.key === 'Enter') {
            e.preventDefault();

            const digitado = (
                e.target as HTMLInputElement
            ).value.trim() || null;

            onFiltrar(digitado);
        }
    };

    return (
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="flex-1">
                <Autocomplete<string, false, false, false>
                    options={opcoes}
                    value={valorSelecionado}
                    onChange={(_, novoValor) => {
                        setValorSelecionado(novoValor);
                    }}
                    onKeyDown={handleKeyDown}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            label="Buscar produto por nome"
                            variant="outlined"
                            size="small"
                        />
                    )}
                />
            </div>

            <div className="flex gap-2">
                <Button
                    variant="primary"
                    className="!w-auto !px-6"
                    onClick={handleFiltrar}
                >
                    Filtrar
                </Button>

                <Button
                    variant="ghost"
                    className="!w-auto !px-4"
                    onClick={handleLimpar}
                >
                    Limpar
                </Button>
            </div>
        </div>
    );
};

export default ProductFilter;