
import { useState } from 'react';
import type { FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

import FormField from '../molecules/FormField';
import ErrorMessage from '../molecules/ErrorMessage';
import Button from '../atoms/Button';

interface LoginResponse {
    token: string;
}

interface PerfilResponse {
    usuario: {
        role: string;
    };
}

interface ApiError {
    message?: string;
    erro?: string;
}

const API_URL = 'https://projeto-node-step-t5i1.vercel.app';

const LoginForm = () => {
    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (
        e: FormEvent<HTMLFormElement>
    ): Promise<void> => {
        e.preventDefault();
        setError('');

        if (!email || !password) {
            setError('Todos os campos são obrigatórios!');
            return;
        }

        try {
            // Envia as credenciais e recebe o token JWT.
            const { data } = await axios.post<LoginResponse>(
                `${API_URL}/login`,
                {
                    email,
                    senha: password,
                }
            );

            const { token } = data;

            localStorage.setItem('token', token);

            // Busca o perfil do usuário autenticado.
            const perfil = await axios.get<PerfilResponse>(
                `${API_URL}/me`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            localStorage.setItem('role', perfil.data.usuario.role);

            navigate('/user/home');
        } catch (err: unknown) {
            console.error('Erro no login:', err);

            if (axios.isAxiosError<ApiError>(err)) {
                // Evita manter credenciais parciais se a consulta do perfil falhar.
                localStorage.removeItem('token');
                localStorage.removeItem('role');

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
                name="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Digite seu email"
            />

            <FormField
                label="Senha"
                id="password"
                name="password"
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
