import { useEffect, useState } from 'react';
import AdminShell from '../../components/AdminShell';
import Prompt from '../../components/Prompt';
import OutputLine from '../../components/OutputLine';
import TerminalField from '../../components/TerminalField';
import CommandButton from '../../components/CommandButton';
import { getAbout, updateAbout } from '../../api/about';
import { getApiError } from '../../utils/validate';

const blankAbout = {
  name: '',
  title: '',
  bio: '',
  bioSnippet: '',
  location: '',
  availability: 'available'
};

const availabilityOptions = [
  { value: 'available', label: 'available' },
  { value: 'busy', label: 'busy' },
  { value: 'unavailable', label: 'unavailable' }
];

export default function AdminAbout() {
  const [form, setForm] = useState(blankAbout);
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    getAbout()
      .then((about) => {
        if (about) {
          setForm({
            name: about.name || '',
            title: about.title || '',
            bio: about.bio || '',
            bioSnippet: about.bioSnippet || '',
            location: about.location || '',
            availability: about.availability || 'available'
          });
        }
      })
      .catch(() => setForm(blankAbout));
  }, []);

  const updateField = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const handleSave = async () => {
    if (!form.name.trim() || !form.title.trim() || !form.bio.trim() || !form.bioSnippet.trim()) {
      setError('Name, title, full bio, and bio snippet are required');
      setStatus('');
      return;
    }

    try {
      const saved = await updateAbout(form);
      setForm({
        name: saved.name || '',
        title: saved.title || '',
        bio: saved.bio || '',
        bioSnippet: saved.bioSnippet || '',
        location: saved.location || '',
        availability: saved.availability || 'available'
      });
      setStatus('about updated');
      setError('');
    } catch (requestError) {
      setError(getApiError(requestError, 'About save failed'));
      setStatus('');
    }
  };

  return (
    <AdminShell path="~/portfolio/admin/about">
      <Prompt path="~/portfolio/admin/about" cmd="vim ./about/profile" />
      <div className="grid gap-3 mt-3">
        <div className="grid md:grid-cols-2 gap-3">
          <TerminalField label="name" value={form.name} onChange={(value) => updateField('name', value)} />
          <TerminalField label="title" value={form.title} onChange={(value) => updateField('title', value)} />
        </div>
        <TerminalField label="bioSnippet" value={form.bioSnippet} onChange={(value) => updateField('bioSnippet', value)} multiline />
        <TerminalField label="fullBio" value={form.bio} onChange={(value) => updateField('bio', value)} multiline />
        <div className="grid md:grid-cols-2 gap-3">
          <TerminalField label="location" value={form.location} onChange={(value) => updateField('location', value)} />
          <TerminalField label="availability" value={form.availability} options={availabilityOptions} onChange={(value) => updateField('availability', value)} />
        </div>
        <div>
          <CommandButton onClick={handleSave}>save</CommandButton>
        </div>
        {status ? <OutputLine value={status} variant="green" /> : null}
        {error ? <OutputLine value={error} variant="red" /> : null}
      </div>
    </AdminShell>
  );
}
