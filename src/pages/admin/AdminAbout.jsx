import { useEffect, useState } from 'react';
import AdminShell from '../../components/AdminShell';
import Prompt from '../../components/Prompt';
import OutputLine from '../../components/OutputLine';
import TerminalField from '../../components/TerminalField';
import CommandButton from '../../components/CommandButton';
import TerminalLoader from '../../components/TerminalLoader';
import { getAbout, updateAbout } from '../../api/about';
import { getApiError } from '../../utils/validate';

const blankAbout = {
  name: '',
  title: '',
  bio: '',
  bioSnippet: '',
  resumeUrl: '',
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
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [loadError, setLoadError] = useState('');
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');

  const loadAbout = () => {
    setLoading(true);
    setLoadError('');
    getAbout()
      .then((about) => {
        if (about) {
          setForm({
            name: about.name || '',
            title: about.title || '',
            bio: about.bio || '',
            bioSnippet: about.bioSnippet || '',
            resumeUrl: about.resumeUrl || '',
            location: about.location || '',
            availability: about.availability || 'available'
          });
        }
      })
      .catch((requestError) => {
        setLoadError(getApiError(requestError, 'About load failed'));
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadAbout();
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
      setSaving(true);
      const saved = await updateAbout(form);
      setForm({
        name: saved.name || '',
        title: saved.title || '',
        bio: saved.bio || '',
        bioSnippet: saved.bioSnippet || '',
        resumeUrl: saved.resumeUrl || '',
        location: saved.location || '',
        availability: saved.availability || 'available'
      });
      setStatus('about updated');
      setError('');
    } catch (requestError) {
      setError(getApiError(requestError, 'About save failed'));
      setStatus('');
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminShell path="~/portfolio/admin/about">
      <Prompt path="~/portfolio/admin/about" cmd="vim ./about/profile" />
      {loading ? (
        <TerminalLoader value="loading profile..." />
      ) : loadError ? (
        <div className="grid gap-3 mt-3">
          <OutputLine value={loadError} variant="red" />
          <div>
            <CommandButton onClick={loadAbout}>retry</CommandButton>
          </div>
        </div>
      ) : (
        <div className="grid gap-3 mt-3">
          <div className="grid md:grid-cols-2 gap-3">
            <TerminalField label="name" value={form.name} onChange={(value) => updateField('name', value)} />
            <TerminalField label="title" value={form.title} onChange={(value) => updateField('title', value)} />
          </div>
          <TerminalField label="bioSnippet" value={form.bioSnippet} onChange={(value) => updateField('bioSnippet', value)} multiline />
          <TerminalField label="fullBio" value={form.bio} onChange={(value) => updateField('bio', value)} multiline />
          <TerminalField label="resumeUrl" value={form.resumeUrl} onChange={(value) => updateField('resumeUrl', value)} placeholder="https://example.com/resume.pdf or /resume.pdf" />
          <div className="grid md:grid-cols-2 gap-3">
            <TerminalField label="location" value={form.location} onChange={(value) => updateField('location', value)} />
            <TerminalField label="availability" value={form.availability} options={availabilityOptions} onChange={(value) => updateField('availability', value)} />
          </div>
          <div>
            <CommandButton onClick={handleSave} disabled={saving}>
              {saving ? 'saving' : 'save'}
            </CommandButton>
          </div>
          {saving ? <TerminalLoader value="saving profile..." /> : null}
          {status ? <OutputLine value={status} variant="green" /> : null}
          {error ? <OutputLine value={error} variant="red" /> : null}
        </div>
      )}
    </AdminShell>
  );
}
