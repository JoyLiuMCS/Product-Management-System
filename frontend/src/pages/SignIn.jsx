import AuthForm from '../components/AuthForm';

export default function SignIn() {
  return (
    <div className="auth-page">
      <AuthForm type="signin" />
    </div>
  );
}