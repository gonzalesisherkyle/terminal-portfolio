import { useEffect, useMemo, useState } from 'react';
import AdminShell from '../../components/AdminShell';
import Prompt from '../../components/Prompt';
import OutputLine from '../../components/OutputLine';
import TerminalField from '../../components/TerminalField';
import CommandButton from '../../components/CommandButton';
import AdminSkillRow from '../../components/AdminSkillRow';
import TerminalModal from '../../components/TerminalModal';
import { createSkill, deleteSkill, getSkills, updateSkill } from '../../api/skills';
import { flattenSkillGroups, groupSkillsByCategory } from '../../utils/terminal';
import { getApiError, validateSkillPayload } from '../../utils/validate';

const blankSkill = {
  name: '',
  category: ''
};

export default function AdminSkills() {
  const [groups, setGroups] = useState([]);
  const [form, setForm] = useState(blankSkill);
  const [editingId, setEditingId] = useState('');
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');

  const flatSkills = useMemo(() => flattenSkillGroups(groups), [groups]);
  const groupedSkills = useMemo(() => groupSkillsByCategory(flatSkills), [flatSkills]);

  const loadSkills = () => {
    getSkills()
      .then(setGroups)
      .catch(() => setGroups([]));
  };

  useEffect(() => {
    loadSkills();
  }, []);

  const updateField = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const resetForm = () => {
    setForm(blankSkill);
    setEditingId('');
  };

  const openCreate = () => {
    resetForm();
    setStatus('');
    setError('');
    setIsEditorOpen(true);
  };

  const closeEditor = () => {
    resetForm();
    setError('');
    setIsEditorOpen(false);
  };

  const handleEdit = (skill) => {
    setEditingId(skill._id);
    setForm({
      name: skill.name || '',
      category: skill.category || ''
    });
    setStatus('');
    setError('');
    setIsEditorOpen(true);
  };

  const handleSave = async () => {
    const validationError = validateSkillPayload(form);

    if (validationError) {
      setError(validationError);
      setStatus('');
      return;
    }

    const payload = {
      name: form.name.trim(),
      category: form.category.trim()
    };

    try {
      if (editingId) {
        await updateSkill(editingId, payload);
        setStatus('skill updated');
      } else {
        await createSkill(payload);
        setStatus('skill created');
      }
      setError('');
      resetForm();
      setIsEditorOpen(false);
      loadSkills();
    } catch (requestError) {
      setError(getApiError(requestError, 'Skill save failed'));
      setStatus('');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this skill?')) {
      return;
    }

    try {
      await deleteSkill(id);
      setStatus('skill deleted');
      setError('');
      loadSkills();
    } catch (requestError) {
      setError(getApiError(requestError, 'Skill delete failed'));
      setStatus('');
    }
  };

  return (
    <AdminShell path="~/portfolio/admin/skills">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Prompt path="~/portfolio/admin/skills" cmd="ls ./skills --grouped" />
        <CommandButton onClick={openCreate}>add skill</CommandButton>
      </div>
      {status ? <OutputLine value={status} variant="green" /> : null}
      {!isEditorOpen && error ? <OutputLine value={error} variant="red" /> : null}
      {groupedSkills.length ? (
        <div className="mt-3 space-y-4">
          {groupedSkills.map((group) => (
            <section key={group.category}>
              <Prompt path="~/portfolio/admin/skills" cmd={`ls ./skills/${group.category.toLowerCase()}`} />
              {group.skills.map((skill) => (
                <AdminSkillRow
                  key={skill._id}
                  skill={skill}
                  onEdit={() => handleEdit(skill)}
                  onDelete={() => handleDelete(skill._id)}
                />
              ))}
            </section>
          ))}
        </div>
      ) : (
        <OutputLine value="# no skills created" variant="dim" />
      )}
      <TerminalModal
        open={isEditorOpen}
        path="~/portfolio/admin/skills"
        command={editingId ? 'vim ./skills/current' : 'touch ./skills/new'}
        onClose={closeEditor}
      >
        <div className="grid gap-3">
          <div className="grid md:grid-cols-2 gap-3">
            <TerminalField label="name" value={form.name} onChange={(value) => updateField('name', value)} />
            <TerminalField label="category" value={form.category} onChange={(value) => updateField('category', value)} />
          </div>
          <div className="flex flex-wrap gap-2">
            <CommandButton onClick={handleSave}>{editingId ? 'update' : 'create'}</CommandButton>
            <CommandButton onClick={closeEditor}>cancel</CommandButton>
          </div>
          {error ? <OutputLine value={error} variant="red" /> : null}
        </div>
      </TerminalModal>
    </AdminShell>
  );
}
