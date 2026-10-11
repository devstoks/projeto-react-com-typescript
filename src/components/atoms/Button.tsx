
// Define as variantes de aparência disponíveis para o botão
type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'success' | 'ghost';

// Define as propriedades que o componente Button aceitará
interface ButtonProps {
    children: React.ReactNode;
    type?: 'button' | 'submit' | 'reset';
    onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
    variant?: ButtonVariant;
    className?: string;
    disabled?: boolean;
}

// Componente Button
const Button = ({
    children,
    type = 'button',
    onClick,
    variant = 'primary',
    className = '',
    disabled = false,
}: ButtonProps) => {

    // Classes de estilo para cada variante
    const variants: Record<ButtonVariant, string> = {
        primary: 'bg-blue-500 text-white hover:bg-blue-600',
        secondary: 'bg-gray-500 text-white hover:bg-gray-600',
        danger: 'bg-red-500 text-white hover:bg-red-600',
        success: 'bg-green-600 text-white hover:bg-green-700',
        ghost: 'text-gray-700 hover:bg-gray-100',
    };

    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled}
            className={`w-full rounded py-2 font-semibold transition ${
                variants[variant]
            } ${
                disabled
                    ? 'cursor-not-allowed opacity-50 hover:brightness-100'
                    : ''
            } ${className}`}
        >
            {children}
        </button>
    );
};

export default Button;