import { useEffect, useState } from 'react';
import AdminShell from '../../components/AdminShell';
import Prompt from '../../components/Prompt';
import OutputLine from '../../components/OutputLine';
import TerminalField from '../../components/TerminalField';
import CommandButton from '../../components/CommandButton';
import ProjectCard from '../../components/ProjectCard';
import Pagination from '../../components/Pagination';
import TerminalModal from '../../components/TerminalModal';
import TerminalLoader from '../../components/TerminalLoader';
import { createProject, deleteProject, getProjects, updateProject } from '../../api/projects';
import { usePagination } from '../../hooks/usePagination';
import { getApiError } from '../../utils/validate';
import { joinList, parseCsvList } from '../../utils/format';

const blankProject = {
  title: '',
  description: '',
  technologies: '',
  liveUrl: '',
  repoUrl: '',
  featured: false
};

export default function AdminProjects() {
  const [projects, setProjects] = useState([]);
  const [form, setForm] = useState(blankProject);
  const [editingId, setEditingId] = useState('');
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');
  const pagination = usePagination(projects, 6);

  const loadProjects = () => {
    setLoading(true);
    setLoadError('');
    getProjects()
      .then((projectData) => {
        setProjects(projectData);
      })
      .catch((requestError) => {
        setProjects([]);
        setLoadError(getApiError(requestError, 'Projects load failed'));
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadProjects();
  }, []);

  const updateField = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const resetForm = () => {
    setForm(blankProject);
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

  const handleEdit = (project) => {
    setEditingId(project._id);
    setForm({
      title: project.title || '',
      description: project.description || '',
      technologies: joinList(project.technologies),
      liveUrl: project.liveUrl || '',
      repoUrl: project.repoUrl || '',
      featured: Boolean(project.featured)
    });
    setStatus('');
    setError('');
    setIsEditorOpen(true);
  };

  const handleSave = async () => {
    if (!form.title.trim() || !form.description.trim()) {
      setError('Project title and description are required');
      setStatus('');
      return;
    }

    const payload = {
      title: form.title.trim(),
      description: form.description.trim(),
      technologies: parseCsvList(form.technologies),
      liveUrl: form.liveUrl.trim(),
      repoUrl: form.repoUrl.trim(),
      featured: form.featured
    };

    try {
      if (editingId) {
        await updateProject(editingId, payload);
        setStatus('project updated');
      } else {
        await createProject(payload);
        setStatus('project created');
      }
      setError('');
      resetForm();
      setIsEditorOpen(false);
      loadProjects();
    } catch (requestError) {
      setError(getApiError(requestError, 'Project save failed'));
      setStatus('');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this project?')) {
      return;
    }

    try {
      await deleteProject(id);
      setStatus('project deleted');
      setError('');
      loadProjects();
    } catch (requestError) {
      setError(getApiError(requestError, 'Project delete failed'));
      setStatus('');
    }
  };

  return (
    <AdminShell path="~/portfolio/admin/projects">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Prompt path="~/portfolio/admin/projects" cmd="ls ./projects" />
        <CommandButton onClick={openCreate} disabled={loading}>add project</CommandButton>
      </div>
      {status ? <OutputLine value={status} variant="green" /> : null}
      {!isEditorOpen && error ? <OutputLine value={error} variant="red" /> : null}
      {loadError ? <OutputLine value={loadError} variant="red" /> : null}
      {loading ? (
        <TerminalLoader value="loading projects..." />
      ) : loadError ? (
        <div className="mt-3">
          <CommandButton onClick={loadProjects}>retry</CommandButton>
        </div>
      ) : projects.length ? (
        <>
          {pagination.items.map((project) => (
            <div key={project._id}>
              <ProjectCard project={project} />
              <div className="flex gap-2 mb-2">
                <CommandButton onClick={() => handleEdit(project)}>edit</CommandButton>
                <CommandButton onClick={() => handleDelete(project._id)} variant="danger">
                  delete
                </CommandButton>
              </div>
            </div>
          ))}
          <Pagination
            currentPage={pagination.currentPage}
            totalPages={pagination.totalPages}
            onPrev={pagination.prevPage}
            onNext={pagination.nextPage}
            onPageChange={pagination.goToPage}
          />
        </>
      ) : (
        <OutputLine value="# no projects created" variant="dim" />
      )}
      <TerminalModal
        open={isEditorOpen}
        path="~/portfolio/admin/projects"
        command={editingId ? 'vim ./projects/current' : 'touch ./projects/new'}
        onClose={closeEditor}
      >
        <div className="grid gap-3">
          <TerminalField label="title" value={form.title} onChange={(value) => updateField('title', value)} />
          <TerminalField label="description" value={form.description} onChange={(value) => updateField('description', value)} multiline />
          <TerminalField label="technologies" value={form.technologies} onChange={(value) => updateField('technologies', value)} placeholder="React, Node.js, MongoDB" />
          <div className="grid md:grid-cols-2 gap-3">
            <TerminalField label="liveUrl" value={form.liveUrl} onChange={(value) => updateField('liveUrl', value)} />
            <TerminalField label="repoUrl" value={form.repoUrl} onChange={(value) => updateField('repoUrl', value)} />
          </div>
          <TerminalField label="featured" type="checkbox" checked={form.featured} onChange={(value) => updateField('featured', value)} />
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
