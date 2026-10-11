interface LabelProps {
    children: React.ReactNode;
    htmlFor?: string;
    className?: string;
}

// Componente Label
const Label = ({
    children,
    className = '',
    htmlFor = '',
}: LabelProps) => {
    return (
        <label
            htmlFor={htmlFor}
            className={`mb-1 block text-left text-sm font-semibold text-gray-700 dark:text-gray-200 ${className}`}
        >
            {children}
        </label>
    );
};

export default Label;