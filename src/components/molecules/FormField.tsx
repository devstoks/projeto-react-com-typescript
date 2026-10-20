
import type { ChangeEvent, ReactNode } from 'react';

import Label from '../atoms/Label';
import Input from '../atoms/Input';

interface FormFieldProps {
    label: string;
    id: string;
    name: string;
    className?: string;
    type?: string;
    value: string;
    onChange: (
        event: ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => void;
    placeholder?: string;
    as?: 'input' | 'select';
    children?: ReactNode;
}

// Componente reutilizável de campo de formulário.
const FormField = ({
    label,
    id,
    className = '',
    ...inputProps
}: FormFieldProps) => {
    return (
        <div className={`mb-5 text-left ${className}`}>
            <Label htmlFor={id}>{label}</Label>
            <Input id={id} {...inputProps} />
        </div>
    );
};

export default FormField;
