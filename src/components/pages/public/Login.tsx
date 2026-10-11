import PageLayout from '../../templates/PageLayout';
import LoginForm from '../../organisms/LoginForm';

// Página: composição do template com o formulário de login.
const Login = () => {
    return (
        <PageLayout title="Login" largura="md">
            <LoginForm />
        </PageLayout>
    );
};

export default Login;