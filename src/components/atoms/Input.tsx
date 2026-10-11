import type { ChangeEvent, ReactNode } from 'react';

interface InputProps {
    id?: string;
    name?: string;
    type?: string;
    value: string;
    onChange: (
        event: ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => void;
    placeholder?: string;
    as?: 'input' | 'select';
    children?: ReactNode;
    className?: string;
    required?: boolean;
    maxLength?: number;
}

const Input = ({
    id,
    name,
    type = 'text',
    value,
    onChange,
    placeholder,
    as = 'input',
    children,
    className = '',
    required = false,
    maxLength,
}: InputProps) => {
    const baseClasses =
        'w-full rounded-lg border border-gray-300 bg-white px-4 py-3.5 text-base leading-6 text-gray-900 outline-none transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-400 dark:focus:ring-blue-900/40';

    if (as === 'select') {
        return (
            <select
                id={id}
                name={name}
                value={value}
                onChange={onChange}
                required={required}
                className={`${baseClasses} ${className}`}
            >
                {children}
            </select>
        );
    }

    return (
        <input
            id={id}
            name={name}
            type={type}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            required={required}
            maxLength={maxLength}
            className={`${baseClasses} ${className}`}
        />
    );
};

export default Input;