import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TerminalWindow from '../components/TerminalWindow';
import Prompt from '../components/Prompt';
import TerminalField from '../components/TerminalField';
import CommandButton from '../components/CommandButton';
import OutputLine from '../components/OutputLine';
import { login as loginRequest } from '../api/auth';
import { useAuth } from '../hooks/useAuth';
import { getApiError } from '../utils/validate';

export default function Login() {
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const auth = useAuth();
  const navigate = useNavigate();

  const updateField = (field, value) => {
    setCredentials((current) => ({ ...current, [field]: value }));
  };

  const handleLogin = async () => {
    setLoading(true);
    setError('');

    try {
      const data = await loginRequest(credentials);
      auth.login(data.token);
      navigate('/admin');
    } catch (requestError) {
      setError(getApiError(requestError, 'Login failed'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <TerminalWindow path="~/portfolio/login">
      <Prompt path="~/portfolio/login" cmd="sudo ./admin" />
      <div className="grid gap-3 mt-3">
        <TerminalField label="email" value={credentials.email} onChange={(value) => updateField('email', value)} />
        <TerminalField label="password" type="password" value={credentials.password} onChange={(value) => updateField('password', value)} />
        <div>
          <CommandButton onClick={handleLogin} disabled={loading}>
            {loading ? 'authenticating...' : 'login'}
          </CommandButton>
        </div>
        {error ? <OutputLine value={error} variant="red" /> : null}
      </div>
    </TerminalWindow>
  );
}
