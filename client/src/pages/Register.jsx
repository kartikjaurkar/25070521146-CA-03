import { useState } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import Alert from '../components/Alert';
import AuthLayout from '../components/AuthLayout';
import Loader from '../components/Loader';
import { useAuth } from '../context/AuthContext';
import { getErrorMessage } from '../services/api';

const initialForm = {
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
};

export default function Register() {
  const { user, loading, register } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const [form, setForm] = useState(initialForm);
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

    if (form.name.trim().length < 2) {
      setError('Please enter your full name.');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      setError('Please enter a valid email address.');
      return;
    }

    if (form.password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setSubmitting(true);

    try {
      await register({
        name: form.name.trim(),
        email: form.email.trim(),
        password: form.password,
        confirmPassword: form.confirmPassword,
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
      eyebrow="Join CineBook"
      title="Create your account"
      subtitle="Save your details, book faster, and keep every ticket in one place."
    >
      {error && <Alert type="error">{error}</Alert>}

      <form className="auth-form" onSubmit={handleSubmit} noValidate>
        <div className="form-field">
          <label htmlFor="name">Full name</label>
          <input
            id="name"
            name="name"
            type="text"
            value={form.name}
            onChange={handleChange}
            placeholder="Your full name"
            autoComplete="name"
            required
          />
        </div>

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

        <div className="form-row">
          <div className="form-field">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              placeholder="At least 6 characters"
              autoComplete="new-password"
              required
            />
          </div>

          <div className="form-field">
            <label htmlFor="confirmPassword">Confirm password</label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              value={form.confirmPassword}
              onChange={handleChange}
              placeholder="Repeat password"
              autoComplete="new-password"
              required
            />
          </div>
        </div>

        <p className="form-hint">
          Use at least 6 characters. Your password is hashed before it is saved.
        </p>

        <button type="submit" className="btn btn-primary btn-block btn-lg" disabled={submitting}>
          {submitting ? 'Creating account…' : 'Create Account'}
        </button>
      </form>

      <p className="auth-switch">
        Already have an account? <Link to="/login">Log in</Link>
      </p>
    </AuthLayout>
  );
}
