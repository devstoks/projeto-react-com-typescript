import { useState } from "react";

// 1. Tipo definido fora do componente (Melhor prática)
type UsuarioType = {
    nome: string;
    idade: number;
    cidade?: string;
};

// Componentes React devem começar com letra Maiúscula
const UsuarioComponent = () => {
    // Definindo os estados controlados
    const [nome, setNome] = useState<string>("");
    const [idade, setIdade] = useState<string>("");
    const [cidade, setCidade] = useState<string>("");
    const [status, setStatus] = useState<string>("sem dados");
    
    // Novo estado para guardar o usuário criado e exibir na tela
    const [usuarioSalvo, setUsuarioSalvo] = useState<UsuarioType | null>(null);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault(); // Evita recarregar a página

        // Validação simples para o TypeScript não reclamar do número vazio
        if (!nome || !idade) {
            setStatus("Por favor, preencha nome e idade.");
            return;
        }

        // Criando o objeto com as variáveis do useState
        const novoUsuario: UsuarioType = {
            nome: nome,
            idade: Number(idade), // Convertendo string do input para number
            cidade: cidade || undefined // Se estiver vazio, envia undefined
        };

        // Salvando nos estados
        setUsuarioSalvo(novoUsuario);
        setStatus("dados carregados!");
    };

    return (
        <div>
            <div>
                <form onSubmit={handleSubmit}>
                    <label htmlFor="nome">Nome: </label>
                    <input 
                        type="text"
                        name="nome"
                        value={nome}
                        onChange={(e) => setNome(e.target.value)} 
                    />
                    <br />

                    <label htmlFor="idade">Idade: </label>
                    <input 
                        type="number"
                        name="idade"
                        value={idade}
                        onChange={(e) => setIdade(e.target.value)} 
                    />
                    <br />

                    <label htmlFor="cidade">Cidade: </label>
                    <input 
                        type="text"
                        name="cidade"
                        value={cidade}
                        placeholder="opcional"
                        onChange={(e) => setCidade(e.target.value)} 
                    />
                    <br />

                    <button type="submit">Enviar</button>
                </form>
            </div>

            <p>Status: {status}</p>

            {/* Renderização condicional: Só exibe se o usuário existir */}
            {usuarioSalvo && (
                <div style={{ marginTop: "20px", borderTop: "1px solid #ccc" }}>
                    <h3>Dados do Usuário:</h3>
                    <p>Olá, <strong>{usuarioSalvo.nome}</strong>!</p>
                    <p>Idade: {usuarioSalvo.idade} anos</p>
                    {usuarioSalvo.cidade && <p>Cidade: {usuarioSalvo.cidade}</p>}
                </div>
            )}
        </div>
    );
};

export default UsuarioComponent;
