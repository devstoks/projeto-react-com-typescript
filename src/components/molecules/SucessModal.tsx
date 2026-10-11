import type { ReactNode } from 'react';
import Button from '../atoms/Button';

interface SuccessModalProps {
    aberto: boolean;
    titulo?: string;
    mensagem: ReactNode;
    onFechar: () => void;
}

// Molécula: modal de sucesso reutilizável.
const SuccessModal = ({
    aberto,
    titulo = 'Sucesso!',
    mensagem,
    onFechar
}: SuccessModalProps) => {
    if (!aberto) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl dark:bg-gray-800">
                <div className="mb-4 flex justify-center">
                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-green-100 text-3xl dark:bg-green-900/40">
                        ✓
                    </div>
                </div>

                <h2 className="mb-2 text-center text-xl font-bold text-gray-900 dark:text-white">
                    {titulo}
                </h2>

                <p className="mb-6 text-center text-sm text-gray-500 dark:text-gray-400">
                    {mensagem}
                </p>

                <Button
                    variant="success"
                    onClick={onFechar}
                    className="!w-full"
                >
                    Ir para a Home
                </Button>
            </div>
        </div>
    );
};

export default SuccessModal;