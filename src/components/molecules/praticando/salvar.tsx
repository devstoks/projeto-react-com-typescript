
import { useState } from "react";

const Testar = () => {
    const [somaFeita, setResultado] = useState<number>(0);

    // Função para somar
    const somar = (a: number, b: number): number => {
        return a + b;
    };

    // Função que organiza as funções
    const chamarSoma = () => {
        const numberA = 10;
        const numberB = 5;
        const resultado = somar(numberA, numberB);

        setResultado(resultado);
    };

    return (
        <div>
            <button onClick={chamarSoma}>Somar</button>

            <br />
            <br />

            <p>O resultado da soma é {somaFeita}</p>
        </div>
    );
};

export default Testar;
