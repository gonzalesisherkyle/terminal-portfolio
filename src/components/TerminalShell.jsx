import { useEffect, useRef, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTerminal } from '../context/TerminalContext';
import { usePublicData } from '../context/PublicDataContext';
import Prompt from './Prompt';

const validThemes = ['green', 'amber', 'cyberpunk', 'dracula', 'mono'];

export default function TerminalShell({ currentPath }) {
  const navigate = useNavigate();
  const location = useLocation();
    const { about, projects, skills, isInitialLoading } = usePublicData();
  const {
    theme,
    setTheme,
    crtEnabled,
    setCrtEnabled,
    matrixEnabled,
    setMatrixEnabled,
    history,
    addHistory,
    clearHistory
  } = useTerminal();

  const [input, setInput] = useState('');
  const inputRef = useRef(null);

  if (isInitialLoading) {
    return null;
  }

  // Focus input on terminal area click
  const focusInput = () => {
    inputRef.current?.focus();
  };

  const handleCommandSubmit = (e) => {
    e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed) return;

    const parts = trimmed.split(/\s+/);
    const command = parts[0].toLowerCase();
    const args = parts.slice(1);

    let output = null;

    switch (command) {
      case 'help':
        output = (
          <div className="space-y-1 text-term-text mt-1">
            <p className="text-term-green font-bold">Terminal Shell v1.2.0 - Available Commands:</p>
            <div className="grid grid-cols-[140px_1fr] gap-y-1 text-xs pl-2 font-mono">
              <span className="text-term-cyan">ls [dir]</span>
              <span className="text-term-dim">List directory contents</span>
              <span className="text-term-cyan">cd &lt;dir&gt;</span>
              <span className="text-term-dim">Change page (home, projects, about, skills, contact)</span>
              <span className="text-term-cyan">cat &lt;file&gt;</span>
              <span className="text-term-dim">View text/markdown file contents</span>
              <span className="text-term-cyan">theme &lt;name&gt;</span>
              <span className="text-term-dim">Switch style ({validThemes.join(', ')})</span>
              <span className="text-term-cyan">crt</span>
              <span className="text-term-dim">Toggle CRT scanlines and screen flicker</span>
              <span className="text-term-cyan">matrix</span>
              <span className="text-term-dim">Toggle Matrix falling code backdrop</span>
              <span className="text-term-cyan">neofetch</span>
              <span className="text-term-dim">Show developer profile & system specifications</span>
              <span className="text-term-cyan">contact</span>
              <span className="text-term-dim">Show developer email & socials</span>
              <span className="text-term-cyan">clear</span>
              <span className="text-term-dim">Clear screen history</span>
              <span className="text-term-cyan">sudo</span>
              <span className="text-term-dim">Execute a superuser command</span>
            </div>
          </div>
        );
        break;

      case 'ls': {
        const pathArg = args[0] ? args[0].toLowerCase().replace(/\/$/, '') : '';
        const currentCleanDir = currentPath.replace('~/portfolio', '').replace(/^\//, '') || 'home';
        const activePath = pathArg || currentCleanDir;

        if (activePath === 'home') {
          output = (
            <div className="flex flex-wrap gap-4 text-sm font-bold mt-1">
              <span className="text-term-bright">bio.md</span>
              {about?.resumeUrl ? (
                <a href={about.resumeUrl} target="_blank" rel="noreferrer" className="text-term-cyan underline">
                  resume.lnk
                </a>
              ) : null}
              <span className="text-term-amber font-bold">projects/</span>
              <span className="text-term-amber font-bold">skills/</span>
              <span className="text-term-green">contact.sh</span>
            </div>
          );
        } else if (activePath === 'projects') {
          const projNames = projects?.map((p) => p.title.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '.md') || [];
          output = (
            <div className="flex flex-wrap gap-4 text-sm font-bold text-term-bright mt-1">
              {projNames.length > 0 ? (
                projNames.map((name) => <span key={name}>{name}</span>)
              ) : (
                <span className="text-term-dim">No projects found.</span>
              )}
            </div>
          );
        } else if (activePath === 'skills') {
          const skillCats = skills?.map((g) => g.category.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '/') || [];
          output = (
            <div className="flex flex-wrap gap-4 text-sm font-bold text-term-amber mt-1">
              {skillCats.length > 0 ? (
                skillCats.map((cat) => <span key={cat}>{cat}</span>)
              ) : (
                <span className="text-term-dim">No skill categories found.</span>
              )}
            </div>
          );
        } else if (activePath === 'about') {
          output = (
            <div className="flex flex-wrap gap-4 text-sm font-bold mt-1">
              <span className="text-term-bright">bio.md</span>
              {about?.resumeUrl ? (
                <a href={about.resumeUrl} target="_blank" rel="noreferrer" className="text-term-cyan underline">
                  resume.lnk
                </a>
              ) : null}
            </div>
          );
        } else if (activePath === 'contact') {
          output = <div className="text-term-green font-bold mt-1">contact.sh</div>;
        } else {
          output = <span className="text-term-red block mt-1">ls: no such directory: {args[0]}</span>;
        }
        break;
      }

      case 'cd': {
        const dest = args[0] ? args[0].toLowerCase().trim().replace(/^\//, '').replace(/\/$/, '') : '';
        if (!dest || dest === '~' || dest === 'home') {
          navigate('/');
          output = <span className="text-term-dim block mt-1">Navigated to ~/portfolio/home</span>;
        } else if (dest === 'projects') {
          navigate('/projects');
          output = <span className="text-term-dim block mt-1">Navigated to ~/portfolio/projects</span>;
        } else if (dest === 'about') {
          navigate('/about');
          output = <span className="text-term-dim block mt-1">Navigated to ~/portfolio/about</span>;
        } else if (dest === 'skills') {
          navigate('/skills');
          output = <span className="text-term-dim block mt-1">Navigated to ~/portfolio/skills</span>;
        } else if (dest === 'contact') {
          navigate('/contact');
          output = <span className="text-term-dim block mt-1">Navigated to ~/portfolio/contact</span>;
        } else if (dest === '..') {
          navigate('/');
          output = <span className="text-term-dim block mt-1">Navigated to ~/portfolio/home</span>;
        } else {
          output = <span className="text-term-red block mt-1">cd: no such file or directory: {args[0]}</span>;
        }
        break;
      }

      case 'cat': {
        const fileArg = args[0] ? args[0].toLowerCase().trim() : '';
        if (!fileArg) {
          output = <span className="text-term-red block mt-1">usage: cat &lt;filename&gt;</span>;
        } else if (fileArg === 'bio.md' || fileArg === 'bio' || fileArg === 'about') {
          output = <p className="text-term-text leading-relaxed whitespace-pre-wrap mt-1 pr-4 text-justify">{about?.bio || 'Biography not available.'}</p>;
        } else if (fileArg === 'resume.lnk' || fileArg === 'resume') {
          const url = about?.resumeUrl;
          output = (
            <div className="mt-1">
              <p className="text-term-bright">Resume URL:</p>
              {url ? (
                <a href={url} target="_blank" rel="noreferrer" className="text-term-cyan underline break-all">
                  {url}
                </a>
              ) : (
                <span className="text-term-dim">Not set.</span>
              )}
            </div>
          );
        } else if (fileArg === 'contact.sh' || fileArg === 'contact') {
          output = (
            <div className="space-y-1 mt-1 text-term-text">
              <p className="text-term-bright">Contact Information:</p>
              <p><span className="text-term-cyan font-semibold">Email:</span> {about?.email || 'N/A'}</p>
              <p><span className="text-term-cyan font-semibold">Location:</span> {about?.location || 'N/A'}</p>
              <p className="text-term-dim text-xs mt-1">Tip: Use the form on the ./contact page to send a message directly.</p>
            </div>
          );
        } else {
          // Check if matching any project filename
          const projectMatch = projects?.find((p) => {
            const name = p.title.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '.md';
            return fileArg === name || fileArg === p.title.toLowerCase();
          });

          if (projectMatch) {
            output = (
              <div className="space-y-1 border border-term-border p-3 bg-term-surface/50 rounded-sm mt-1 max-w-2xl">
                <p className="text-term-green font-bold text-sm">{projectMatch.title}</p>
                <p className="text-term-text text-xs text-justify whitespace-pre-wrap leading-relaxed">
                  {projectMatch.description}
                </p>
                {projectMatch.technologies?.length ? (
                  <p className="text-term-amber text-xs">
                    Technologies: {projectMatch.technologies.join(', ')}
                  </p>
                ) : null}
                <div className="flex gap-4 text-xs pt-1">
                  {projectMatch.liveUrl && (
                    <a href={projectMatch.liveUrl} target="_blank" rel="noreferrer" className="text-term-cyan underline">
                      ./live
                    </a>
                  )}
                  {projectMatch.repoUrl && (
                    <a href={projectMatch.repoUrl} target="_blank" rel="noreferrer" className="text-term-cyan underline">
                      ./repo
                    </a>
                  )}
                </div>
              </div>
            );
          } else {
            output = <span className="text-term-red block mt-1">cat: {args[0]}: No such file or directory</span>;
          }
        }
        break;
      }

      case 'theme': {
        const themeName = args[0]?.toLowerCase().trim();
        if (!themeName) {
          output = (
            <div className="mt-1 text-term-text">
              <p>Current Theme: <span className="text-term-green font-bold">{theme}</span></p>
              <p className="text-term-dim text-xs">Available themes: {validThemes.join(', ')}</p>
              <p className="text-term-dim text-xs">Usage: theme &lt;name&gt;</p>
            </div>
          );
        } else if (validThemes.includes(themeName)) {
          setTheme(themeName);
          output = <span className="text-term-green block mt-1">Theme changed to {themeName}.</span>;
        } else {
          output = (
            <span className="text-term-red block mt-1">
              theme: unknown theme '{args[0]}'. Select from: {validThemes.join(', ')}
            </span>
          );
        }
        break;
      }

      case 'crt': {
        const nextCrt = !crtEnabled;
        setCrtEnabled(nextCrt);
        localStorage.setItem('terminal-crt', String(nextCrt));
        output = (
          <span className="text-term-green block mt-1">
            CRT monitor effects: {nextCrt ? 'ENABLED' : 'DISABLED'}
          </span>
        );
        break;
      }

      case 'matrix': {
        const nextMatrix = !matrixEnabled;
        setMatrixEnabled(nextMatrix);
        localStorage.setItem('terminal-matrix', String(nextMatrix));
        output = (
          <span className="text-term-green block mt-1">
            Matrix background code rain: {nextMatrix ? 'ENABLED' : 'DISABLED'}
          </span>
        );
        break;
      }

      case 'clear':
        clearHistory();
        setInput('');
        return;

      case 'neofetch':
      case 'systeminfo': {
        output = (
          <div className="flex flex-col md:flex-row gap-5 font-mono text-xs mt-2 p-2 bg-term-green/[0.02] border border-term-border rounded-sm max-w-2xl">
            <pre className="text-term-green leading-none select-none font-bold align-middle">
{`   /\\_/ \\     
  ( o.o )    
   > ^ <     
  /     \\    
 |  | |  |   
 (___)(___)  `}
            </pre>
            <div className="space-y-1 text-term-text">
              <p>
                <span className="text-term-green font-bold">{about?.name || 'Kyle'}</span>
                <span className="text-term-dim">@</span>
                <span className="text-term-cyan font-bold">devbox</span>
              </p>
              <p className="text-term-dim">------------------------------------</p>
              <p><span className="text-term-cyan">OS:</span> WebBox OS v1.2.0 x86_64</p>
              <p><span className="text-term-cyan">Shell:</span> bash (TerminalPortfolioShell)</p>
              <p><span className="text-term-cyan">Framework:</span> React 18.3 + Vite 6</p>
              <p><span className="text-term-cyan">Styles:</span> TailwindCSS + Custom Themes</p>
              <p><span className="text-term-cyan">Theme:</span> {theme.toUpperCase()}</p>
              <p><span className="text-term-cyan">CRT Scanlines:</span> {crtEnabled ? 'ON' : 'OFF'}</p>
              <p><span className="text-term-cyan">Status:</span> <span className="text-term-green">{about?.availability || 'Open for Opportunities'}</span></p>
              <p><span className="text-term-cyan">Position:</span> {about?.title || 'Full-Stack Developer'}</p>
              <p><span className="text-term-cyan">Location:</span> {about?.location || 'N/A'}</p>
            </div>
          </div>
        );
        break;
      }

      case 'contact': {
        output = (
          <div className="space-y-1 mt-1 text-term-text">
            <p className="text-term-green font-bold">Developer Contact Channels:</p>
            <p><span className="text-term-cyan font-semibold">Email:</span> {about?.email || 'N/A'}</p>
            <p><span className="text-term-cyan font-semibold">Location:</span> {about?.location || 'N/A'}</p>
            {about?.resumeUrl && (
              <p>
                <span className="text-term-cyan font-semibold">Resume:</span>{' '}
                <a href={about.resumeUrl} target="_blank" rel="noreferrer" className="text-term-cyan underline">
                  View Resume File
                </a>
              </p>
            )}
            <p className="text-term-dim text-xs mt-1">Tip: Use the './contact' route to submit a form message.</p>
          </div>
        );
        break;
      }

      case 'sudo':
        output = (
          <span className="text-term-red block mt-1">
            {about?.name?.toLowerCase() || 'owner'} is not in the sudoers file. This incident will be reported.
          </span>
        );
        break;

      default:
        output = (
          <span className="text-term-red block mt-1">
            bash: command not found: {command}. Type 'help' for a list of valid commands.
          </span>
        );
    }

    addHistory(trimmed, output, currentPath);
    setInput('');
  };

  // Add click-to-focus on parent container
  return (
    <div onClick={focusInput} className="cursor-text mt-6 border-t border-term-border/40 pt-4 font-mono text-sm">
      {/* Interactive Helper Box for discoverability */}
      {history.length === 0 && (
        <div className="text-term-dim text-xs mb-4 border border-dashed border-term-green/20 p-3 bg-term-green/[0.02] rounded-sm animate-fadeUp">
          <span className="text-term-green font-bold">[!] INTERACTIVE CONSOLE ACTIVE</span>
          <p className="mt-1 leading-relaxed">
            You can type commands directly into this terminal window. 
            Try typing <span className="text-term-cyan font-bold">help</span>, <span className="text-term-cyan font-bold">neofetch</span>, or <span className="text-term-cyan font-bold">matrix</span> and press <span className="text-term-bright font-bold">Enter</span>.
          </p>
        </div>
      )}

      {history.map((h, index) => (
        <div key={index} className="mb-3 animate-fadeUp">
          <Prompt path={h.path} cmd={h.command} />
          {h.output}
        </div>
      ))}

      {/* Interactive Active Prompt */}
      <div className="flex items-center min-w-0">
        <Prompt path={currentPath} />
        <form onSubmit={handleCommandSubmit} className="flex-1 min-w-0 flex items-center">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 bg-transparent border-none outline-none font-mono text-term-bright ml-1 text-sm focus:ring-0 focus:outline-none p-0"
            placeholder="Type 'help'..."
            autoComplete="off"
            autoCapitalize="off"
            spellCheck="false"
          />
        </form>
      </div>

      <div className="text-term-dim text-[10px] mt-2 select-none pointer-events-none opacity-50 flex justify-between">
        <span>Themes: theme [green|amber|cyberpunk|dracula|mono]</span>
        <span>Type 'help' for commands</span>
      </div>
    </div>
  );
}
