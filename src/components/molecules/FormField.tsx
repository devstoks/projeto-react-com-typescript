import Label from '../atoms/Label';
import Input from '../atoms/Input';

interface FormFieldProps {
    label: string;
    id: string;
    className?: string;
    type?: string;
    value: string;
    onChange: (
        event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => void;
    placeholder?: string;
    as?: 'input' | 'select';
    children?: React.ReactNode;
    name: string;
}

// Componente que representa um campo de formulário com rótulo e input
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