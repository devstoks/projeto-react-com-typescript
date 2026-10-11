import PageLayout from '../../templates/PageLayout';
import RegistrarForm from '../../organisms/RegistrarForm';

// Página: composição do template com o formulário de registro.
const Registrar = () => {
    return (
        <PageLayout title="Criar conta" largura="md">
            <RegistrarForm />
        </PageLayout>
    );
};

export default Registrar;