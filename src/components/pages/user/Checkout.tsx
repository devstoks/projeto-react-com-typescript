import { useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';

import PageLayout from '../../templates/PageLayout';
import Button from '../../atoms/Button';
import Input from '../../atoms/Input';
import PaymentMethod from '../../molecules/PayMethod';
import SuccessModal from '../../molecules/SucessModal';
import { useCart } from '../../context/CardContext';

interface FormularioCheckout {
    nome: string;
    cpf: string;
    email: string;
    telefone: string;
    cep: string;
    endereco: string;
    numero: string;
    complemento: string;
    bairro: string;
    cidade: string;
    estado: string;
}

type MetodoPagamento = 'pix' | 'cartao' | 'boleto';

const METODOS_PAGAMENTO: Record<MetodoPagamento, string> = {
    pix: 'Pix',
    cartao: 'Cartão de Crédito',
    boleto: 'Boleto Bancário',
};

const Checkout = () => {
    const navigate = useNavigate();
    const { itens, removerSelecionados } = useCart();

    const itensSelecionados = itens.filter((item) => item.selecionado);

    const [form, setForm] = useState<FormularioCheckout>({
        nome: '',
        cpf: '',
        email: '',
        telefone: '',
        cep: '',
        endereco: '',
        numero: '',
        complemento: '',
        bairro: '',
        cidade: '',
        estado: '',
    });

    const [payment, setPayment] = useState<MetodoPagamento>('pix');
    const [sucesso, setSucesso] = useState('');

    // 👇 tipo alargado para aceitar input E select
    const handleChange = (
        e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ): void => {
        const { name, value } = e.target;

        setForm((anterior) => ({
            ...anterior,
            [name]: value,
        }));
    };

    const handleSubmit = (e: FormEvent<HTMLFormElement>): void => {
        e.preventDefault();

        if (itensSelecionados.length === 0) {
            return;
        }

        const qtdSelecionados = itensSelecionados.length;

        setSucesso(
            `Compra simulada com sucesso!\n` +
            `Cliente: ${form.nome} • ` +
            `Pagamento: ${METODOS_PAGAMENTO[payment]} • ` +
            `Itens: ${qtdSelecionados}`
        );

        removerSelecionados();
    };

    const handleFecharModal = (): void => {
        setSucesso('');
        navigate('/user/carrinho');
    };

    return (
        <PageLayout title="Finalizar Compra" largura="4xl">
            <button
                type="button"
                onClick={() => navigate('/user/carrinho')}
                className="mb-4 flex items-center gap-2 text-sm font-medium text-gray-600 transition-colors hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400"
            >
                ← Voltar ao carrinho
            </button>

            {itensSelecionados.length === 0 ? (
                <div className="py-8 text-center">
                    <p className="text-gray-600 dark:text-gray-300">
                        Não há produtos selecionados para finalizar a compra.
                    </p>

                    <Button
                        type="button"
                        variant="primary"
                        className="mt-4 !w-auto !px-6"
                        onClick={() => navigate('/user/carrinho')}
                    >
                        Voltar ao carrinho
                    </Button>
                </div>
            ) : (
                <form
                    onSubmit={handleSubmit}
                    className="flex flex-col gap-6 text-left"
                >
                    <fieldset className="flex flex-col gap-3 rounded-xl border border-gray-200 p-5 dark:border-gray-700">
                        <legend className="px-2 text-sm font-bold text-blue-600 dark:text-blue-400">
                            👤 Dados Pessoais
                        </legend>

                        <Input
                            name="nome"
                            placeholder="Nome completo"
                            value={form.nome}
                            onChange={handleChange}
                            required
                        />

                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                            <Input
                                name="cpf"
                                placeholder="CPF"
                                value={form.cpf}
                                onChange={handleChange}
                                required
                            />

                            <Input
                                name="telefone"
                                placeholder="Telefone"
                                value={form.telefone}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <Input
                            name="email"
                            type="email"
                            placeholder="E-mail"
                            value={form.email}
                            onChange={handleChange}
                            required
                        />
                    </fieldset>

                    <fieldset className="flex flex-col gap-3 rounded-xl border border-gray-200 p-5 dark:border-gray-700">
                        <legend className="px-2 text-sm font-bold text-blue-600 dark:text-blue-400">
                            📍 Endereço de Entrega
                        </legend>

                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                            <Input
                                name="cep"
                                placeholder="CEP"
                                value={form.cep}
                                onChange={handleChange}
                                required
                            />

                            <Input
                                name="endereco"
                                placeholder="Endereço"
                                value={form.endereco}
                                onChange={handleChange}
                                className="sm:col-span-2"
                                required
                            />
                        </div>

                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                            <Input
                                name="numero"
                                placeholder="Número"
                                value={form.numero}
                                onChange={handleChange}
                                required
                            />

                            <Input
                                name="complemento"
                                placeholder="Complemento"
                                value={form.complemento}
                                onChange={handleChange}
                            />

                            <Input
                                name="bairro"
                                placeholder="Bairro"
                                value={form.bairro}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                            <Input
                                name="cidade"
                                placeholder="Cidade"
                                value={form.cidade}
                                onChange={handleChange}
                                className="sm:col-span-2"
                                required
                            />

                            <Input
                                name="estado"
                                placeholder="Estado (UF)"
                                value={form.estado}
                                onChange={handleChange}
                                maxLength={2}
                                required
                            />
                        </div>
                    </fieldset>

                    <fieldset className="flex flex-col gap-3 rounded-xl border border-gray-200 p-5 dark:border-gray-700">
                        <legend className="px-2 text-sm font-bold text-blue-600 dark:text-blue-400">
                            💳 Forma de Pagamento
                        </legend>

                        <PaymentMethod
                            value="pix"
                            label="Pix"
                            icon="⚡"
                            checked={payment === 'pix'}
                            onChange={() => setPayment('pix')}
                        />

                        <PaymentMethod
                            value="cartao"
                            label="Cartão de Crédito"
                            icon="💳"
                            checked={payment === 'cartao'}
                            onChange={() => setPayment('cartao')}
                        />

                        <PaymentMethod
                            value="boleto"
                            label="Boleto Bancário"
                            icon="🧾"
                            checked={payment === 'boleto'}
                            onChange={() => setPayment('boleto')}
                        />
                    </fieldset>

                    <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
                        <Button
                            type="button"
                            variant="danger"
                            className="!w-auto !px-6"
                            onClick={() => navigate('/user/carrinho')}
                        >
                            ← Voltar
                        </Button>

                        <Button
                            type="submit"
                            variant="success"
                            className="!w-auto !px-6"
                        >
                            Finalizar Compra
                        </Button>
                    </div>
                </form>
            )}

            <SuccessModal
                aberto={!!sucesso}
                titulo="Compra realizada!"
                mensagem={sucesso}
                onFechar={handleFecharModal}
            />
        </PageLayout>
    );
};

export default Checkout;