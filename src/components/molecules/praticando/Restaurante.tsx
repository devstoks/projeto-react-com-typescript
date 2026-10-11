import { useState } from "react";


const StatusPedido = {
    Pendente: "PENDENTE",
    Preparando: "PREPARANDO",
    Pronto: "PRONTO",
    Entregue: "ENTREGUE",
} as const;

type StatusPedido =
    typeof StatusPedido[keyof typeof StatusPedido];

interface Produto {
    id: number;
    nome: string;
    preco: number;
}



const Pedido = () => {

    const produto: Produto = {
        id: 1,
        nome: "Hamburguer Duplo com Cheddar",
        preco: 20.00
    }

    const [msg, setmsg] = useState<string>("");


    function processandoPedido(status: StatusPedido): void {
        switch (status) {
            case StatusPedido.Pendente:
                setmsg("Aguardando confirmacao do pagamento...");
                break;
            case StatusPedido.Entregue:
                setmsg("Pedindo entregue com sucesso.");
                break;
            case StatusPedido.Preparando:
                setmsg("Seu pedido esta sendo preparado");
                break;
            case StatusPedido.Pronto:
                setmsg("Seu pedido foi finalizado. Pronto para retirada");
                break;
            default:
                setmsg("status desconhecido");
        }
    }


    return (
        <div>

            <button onClick={() => processandoPedido(StatusPedido.Preparando)}>
                Processar pedido
            </button>


            O seu {produto.nome}, no valor R$ {produto.preco} esta {msg}
        </div>
    );
};

export default Pedido;