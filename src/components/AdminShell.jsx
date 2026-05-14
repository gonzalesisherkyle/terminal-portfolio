import { NavLink, useNavigate } from 'react-router-dom';
import TerminalWindow from './TerminalWindow';
import CommandButton from './CommandButton';
import { useAuth } from '../hooks/useAuth';

const adminLinks = [
  { to: '/admin', label: './dashboard' },
  { to: '/admin/projects', label: './projects' },
  { to: '/admin/about', label: './about' },
  { to: '/admin/skills', label: './skills' },
  { to: '/admin/messages', label: './messages' }
];

export default function AdminShell({ path, children }) {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <TerminalWindow path={path}>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div className="flex flex-wrap gap-2 text-xs">
          {adminLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === '/admin'}
              className={({ isActive }) =>
                `rounded-sm border px-2 py-1 transition-all duration-200 ${
                  isActive
                    ? 'border-term-green text-term-green bg-term-green/[0.06]'
                    : 'border-term-border text-term-cyan hover:border-term-green hover:text-term-green'
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </div>
        <CommandButton onClick={handleLogout}>logout</CommandButton>
      </div>
      {children}
    </TerminalWindow>
  );
}
