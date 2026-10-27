import { useState } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import Alert from '../components/Alert';
import AuthLayout from '../components/AuthLayout';
import Loader from '../components/Loader';
import { useAuth } from '../context/AuthContext';
import { getErrorMessage } from '../services/api';

export default function Login() {
  const { user, loading, login } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const from = location.state?.from;
  const redirectTo = from
    ? `${from.pathname}${from.search || ''}${from.hash || ''}`
    : '/';

  if (loading) {
    return <Loader label="Checking your session…" />;
  }

  if (user) {
    return <Navigate to={redirectTo} replace />;
  }

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    if (!form.email.trim() || !form.password) {
      setError('Please enter your email and password.');
      return;
    }

    setSubmitting(true);

    try {
      await login({
        email: form.email.trim(),
        password: form.password,
      });
      navigate(redirectTo, { replace: true });
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthLayout
      eyebrow="Member access"
      title="Welcome back"
      subtitle="Log in to continue your booking and manage your tickets."
    >
      {error && <Alert type="error">{error}</Alert>}

      <form className="auth-form" onSubmit={handleSubmit} noValidate>
        <div className="form-field">
          <label htmlFor="email">Email address</label>
          <input
            id="email"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            placeholder="you@example.com"
            autoComplete="email"
            required
          />
        </div>

        <div className="form-field">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            placeholder="Enter your password"
            autoComplete="current-password"
            required
          />
        </div>

        <button type="submit" className="btn btn-primary btn-block btn-lg" disabled={submitting}>
          {submitting ? 'Logging in…' : 'Login'}
        </button>
      </form>

      <p className="auth-switch">
        New to CineBook? <Link to="/register">Create an account</Link>
      </p>
    </AuthLayout>
  );
}
