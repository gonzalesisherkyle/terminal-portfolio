import { useState } from 'react';
import TerminalWindow from '../components/TerminalWindow';
import Prompt from '../components/Prompt';
import OutputLine from '../components/OutputLine';
import TerminalField from '../components/TerminalField';
import CommandButton from '../components/CommandButton';
import TerminalReady from '../components/TerminalReady';
import { submitContact } from '../api/contact';
import { getApiError, validateContactFields } from '../utils/validate';

const initialPayload = {
  name: '',
  email: '',
  message: ''
};

export default function Contact() {
  const [payload, setPayload] = useState(initialPayload);
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const updateField = (field, value) => {
    setPayload((current) => ({ ...current, [field]: value }));
    setFieldErrors((current) => {
      if (!current[field]) return current;
      const next = { ...current };
      delete next[field];
      return next;
    });
  };

  const handleSubmit = async () => {
    const validationErrors = validateContactFields(payload);

    if (Object.keys(validationErrors).length > 0) {
      setFieldErrors(validationErrors);
      setError('');
      setStatus('');
      return;
    }

    setFieldErrors({});
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
    <TerminalWindow path="~/portfolio/contact" title="Contact">
      <Prompt path="~/portfolio/contact" cmd="sendmail ./owner" />
      <form
        className="grid gap-3 mt-3"
        onSubmit={(event) => {
          event.preventDefault();
          handleSubmit();
        }}
        noValidate
      >
        <TerminalField
          label="name"
          value={payload.name}
          onChange={(value) => updateField('name', value)}
          placeholder="Ada Lovelace"
          autoComplete="name"
          required
          error={fieldErrors.name}
        />
        <TerminalField
          label="email"
          type="email"
          inputMode="email"
          value={payload.email}
          onChange={(value) => updateField('email', value)}
          placeholder="ada@example.com"
          autoComplete="email"
          required
          error={fieldErrors.email}
        />
        <TerminalField
          label="message"
          value={payload.message}
          onChange={(value) => updateField('message', value)}
          placeholder="I want to discuss a full-stack build."
          required
          error={fieldErrors.message}
          multiline
        />
        <div>
          <CommandButton type="submit" disabled={submitting}>
            {submitting ? 'sending...' : 'send'}
          </CommandButton>
        </div>
        <div aria-live="polite" role="status">
          {status ? <OutputLine value={status} variant="green" /> : null}
          {error ? <OutputLine value={error} variant="red" /> : null}
        </div>
      </form>
      <TerminalReady path="~/portfolio/contact" />
    </TerminalWindow>
  );
}
