import { useEffect, useState } from 'react';
import AdminShell from '../../components/AdminShell';
import Prompt from '../../components/Prompt';
import OutputLine from '../../components/OutputLine';
import CommandButton from '../../components/CommandButton';
import ContactMessageCard from '../../components/ContactMessageCard';
import Pagination from '../../components/Pagination';
import TerminalLoader from '../../components/TerminalLoader';
import { deleteContact, getContacts, markAsRead } from '../../api/contact';
import { usePagination } from '../../hooks/usePagination';
import { getApiError } from '../../utils/validate';

export default function AdminMessages() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');
  const pagination = usePagination(messages, 6);

  const loadMessages = () => {
    setLoading(true);
    setLoadError('');
    getContacts()
      .then((messageData) => {
        setMessages(messageData);
      })
      .catch((requestError) => {
        setMessages([]);
        setLoadError(getApiError(requestError, 'Messages load failed'));
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadMessages();
  }, []);

  const handleRead = async (id) => {
    try {
      await markAsRead(id);
      setStatus('message marked read');
      setError('');
      loadMessages();
    } catch (requestError) {
      setError(getApiError(requestError, 'Message update failed'));
      setStatus('');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this message?')) {
      return;
    }

    try {
      await deleteContact(id);
      setStatus('message deleted');
      setError('');
      loadMessages();
    } catch (requestError) {
      setError(getApiError(requestError, 'Message delete failed'));
      setStatus('');
    }
  };

  return (
    <AdminShell path="~/portfolio/admin/messages">
      <Prompt path="~/portfolio/admin/messages" cmd="mail --list" />
      {status ? <OutputLine value={status} variant="green" /> : null}
      {error ? <OutputLine value={error} variant="red" /> : null}
      {loadError ? <OutputLine value={loadError} variant="red" /> : null}
      {loading ? (
        <TerminalLoader value="loading messages..." />
      ) : loadError ? (
        <div className="mt-3">
          <CommandButton onClick={loadMessages}>retry</CommandButton>
        </div>
      ) : messages.length ? (
        <>
          <div className="mt-3">
            {pagination.items.map((message) => (
              <ContactMessageCard
                key={message._id}
                message={message}
                onRead={() => handleRead(message._id)}
                onDelete={() => handleDelete(message._id)}
              />
            ))}
          </div>
          <Pagination
            currentPage={pagination.currentPage}
            totalPages={pagination.totalPages}
            onPrev={pagination.prevPage}
            onNext={pagination.nextPage}
            onPageChange={pagination.goToPage}
          />
        </>
      ) : (
        <OutputLine value="# no contact messages" variant="dim" />
      )}
    </AdminShell>
  );
}
