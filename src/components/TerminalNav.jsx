import { NavLink } from 'react-router-dom';

const links = [
  { to: '/', label: './home' },
  { to: '/projects', label: './projects' },
  { to: '/about', label: './about' },
  { to: '/skills', label: './skills' },
  { to: '/contact', label: './contact' }
];

export default function TerminalNav() {
  return (
    <nav className="max-w-4xl mx-auto px-4 pt-5 font-mono text-xs">
      <div className="flex flex-wrap gap-3 border border-term-border rounded-sm px-3 py-2 bg-term-surface">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              `border-b border-dashed transition-all duration-200 ${
                isActive
                  ? 'text-term-green border-term-green'
                  : 'text-term-cyan border-term-cyan/30 hover:text-term-bright hover:border-term-cyan'
              }`
            }
          >
            {link.label}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
