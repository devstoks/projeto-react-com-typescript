
import { useState } from 'react';
import type { FormEvent, ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

import FormField from '../molecules/FormField';
import ErrorMessage from '../molecules/ErrorMessage';
import Button from '../atoms/Button';

type Role = '' | 'user' | 'admin';

interface ErroApi {
    message?: string;
    erro?: string;
}

const RegistrarForm = () => {
    const navigate = useNavigate();

    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState<Role>('');
    const [error, setError] = useState('');

    const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d).{6,}$/;
    const roleRegex = /^(user|admin)$/;

    const handleSubmit = async (
        e: FormEvent<HTMLFormElement>
    ): Promise<void> => {
        e.preventDefault();
        setError('');

        if (!username || !email || !password || !role) {
            setError('Todos os campos são obrigatórios!');
            return;
        }

        if (!usernameRegex.test(username)) {
            setError(
                'Username inválido! Use entre 3 e 20 caracteres, apenas letras, números e _.'
            );
            return;
        }

        if (!emailRegex.test(email)) {
            setError('Email inválido!');
            return;
        }

        if (!passwordRegex.test(password)) {
            setError(
                'A senha deve ter no mínimo 6 caracteres, com pelo menos uma letra e um número!'
            );
            return;
        }

        if (!roleRegex.test(role)) {
            setError('Role inválido! Escolha entre user ou admin.');
            return;
        }

        try {
            await axios.post(
                'https://projeto-node-step-t5i1.vercel.app/registrar',
                {
                    nome: username,
                    email,
                    role,
                    senha: password
                }
            );

            navigate('/login');
        } catch (err: unknown) {
            if (axios.isAxiosError<ErroApi>(err)) {
                console.error('Status:', err.response?.status);
                console.error('Resposta da API:', err.response?.data);

                setError(
                    err.response?.data?.message ||
                    err.response?.data?.erro ||
                    'Erro ao registrar usuário. Tente novamente.'
                );
            } else {
                console.error('Erro inesperado:', err);
                setError('Erro ao registrar usuário. Tente novamente.');
            }
        }
    };

    const handleRoleChange = (
        e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ): void => {
        setRole(e.target.value as Role);
    };

    return (
        <form onSubmit={handleSubmit}>
            <FormField
                label="Nome"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Digite seu nome"
            />

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

            <FormField
                label="Função"
                id="role"
                as="select"
                value={role}
                onChange={handleRoleChange}
            >
                <option value="">Selecione uma função</option>
                <option value="user">Usuário</option>
                <option value="admin">Administrador</option>
            </FormField>

            <ErrorMessage>{error}</ErrorMessage>

            <Button type="submit" variant="primary">
                Registrar
            </Button>
        </form>
    );
};

export default RegistrarForm;
