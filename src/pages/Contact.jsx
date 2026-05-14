import { useState } from 'react';
import TerminalWindow from '../components/TerminalWindow';
import Prompt from '../components/Prompt';
import OutputLine from '../components/OutputLine';
import TerminalField from '../components/TerminalField';
import CommandButton from '../components/CommandButton';
import TerminalReady from '../components/TerminalReady';
import { submitContact } from '../api/contact';
import { getApiError, validateContactPayload } from '../utils/validate';

const initialPayload = {
  name: '',
  email: '',
  message: ''
};

export default function Contact() {
  const [payload, setPayload] = useState(initialPayload);
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const updateField = (field, value) => {
    setPayload((current) => ({ ...current, [field]: value }));
  };

  const handleSubmit = async () => {
    const validationError = validateContactPayload(payload);

    if (validationError) {
      setError(validationError);
      setStatus('');
      return;
    }

    setSubmitting(true);
    setError('');
    setStatus('');

    try {
      await submitContact(payload);
      setPayload(initialPayload);
      setStatus('message queued');
    } catch (requestError) {
      setError(getApiError(requestError, 'Message failed'));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <TerminalWindow path="~/portfolio/contact">
      <Prompt path="~/portfolio/contact" cmd="sendmail ./owner" />
      <div className="grid gap-3 mt-3">
        <TerminalField label="name" value={payload.name} onChange={(value) => updateField('name', value)} placeholder="Ada Lovelace" />
        <TerminalField label="email" value={payload.email} onChange={(value) => updateField('email', value)} placeholder="ada@example.com" />
        <TerminalField
          label="message"
          value={payload.message}
          onChange={(value) => updateField('message', value)}
          placeholder="I want to discuss a full-stack build."
          multiline
        />
        <div>
          <CommandButton onClick={handleSubmit} disabled={submitting}>
            {submitting ? 'sending...' : 'send'}
          </CommandButton>
        </div>
        {status ? <OutputLine value={status} variant="green" /> : null}
        {error ? <OutputLine value={error} variant="red" /> : null}
      </div>
      <TerminalReady path="~/portfolio/contact" />
    </TerminalWindow>
  );
}
