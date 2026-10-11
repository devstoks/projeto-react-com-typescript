
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

// Componentes reutilizáveis da interface
import FormField from '../molecules/FormField';
import ErrorMessage from '../molecules/ErrorMessage';
import Button from '../atoms/Button';

const LoginForm = () => {
    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (
        e: React.FormEvent<HTMLFormElement>
    ): Promise<void> => {
        e.preventDefault();
        setError('');

        if (!email || !password) {
            setError('Todos os campos são obrigatórios!');
            return;
        }

        try {
            // Envia as credenciais e recebe o token JWT.
            const { data } = await axios.post<{ token: string }>(
                'https://projeto-node-step-t5i1.vercel.app/login',
                { email, senha: password }
            );

            const { token } = data;

            localStorage.setItem('token', token);

            // Busca os dados do usuário autenticado.
            const perfil = await axios.get<{
                usuario: { role: string };
            }>(
                'https://projeto-node-step-t5i1.vercel.app/me',
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            localStorage.setItem('role', perfil.data.usuario.role);

            navigate('/user/home');
        } catch (err: unknown) {
            console.error('Erro no login:', err);

            if (axios.isAxiosError<{ message?: string; erro?: string }>(err)) {
                setError(
                    err.response?.data?.message ||
                    err.response?.data?.erro ||
                    'Erro ao fazer login. Tente novamente.'
                );
            } else {
                setError('Erro inesperado ao fazer login.');
            }
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <FormField
                label="Email"
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Digite seu email"
            />

            <FormField
                label="Senha"
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Digite sua senha"
            />

            <ErrorMessage>{error}</ErrorMessage>

            <Button type="submit" variant="primary">
                Entrar
            </Button>
        </form>
    );
};

export default LoginForm;