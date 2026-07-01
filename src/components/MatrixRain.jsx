import { useEffect, useRef } from 'react';
import { useTerminal } from '../context/TerminalContext';
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion';

const themeColors = {
  green: '#39ff14',
  amber: '#ffb300',
  cyberpunk: '#ff007f',
  dracula: '#50fa7b',
  mono: '#555555'
};

const bgColors = {
  green: '#0c0f0c',
  amber: '#0f0d0a',
  cyberpunk: '#08030f',
  dracula: '#282a36',
  mono: '#fafafa'
};

const FRAME_INTERVAL = 33;

export default function MatrixRain() {
  const { theme } = useTerminal();
  const prefersReducedMotion = usePrefersReducedMotion();
  const canvasRef = useRef(null);

  useEffect(() => {
    if (prefersReducedMotion) {
      return undefined;
    }

    const canvas = canvasRef.current;
    if (!canvas) return undefined;

    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let lastFrame = 0;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      columns = Math.floor(canvas.width / fontSize) + 1;
      drops = Array(columns).fill(1);
    };

    const chars = 'ｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉﾊﾋﾌﾍﾎﾏﾐﾑﾒﾓﾔﾕﾖﾗﾘﾙﾚﾛﾜﾝ1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const charArr = chars.split('');
    const fontSize = 14;
    let columns = Math.floor(window.innerWidth / fontSize) + 1;
    let drops = Array(columns).fill(1);

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const activeColor = themeColors[theme] || themeColors.green;
    const activeBg = bgColors[theme] || bgColors.green;

    const draw = () => {
      ctx.fillStyle = activeBg === '#fafafa' ? 'rgba(250, 250, 250, 0.08)' : 'rgba(13, 13, 13, 0.06)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = activeColor;
      ctx.font = `${fontSize}px monospace`;

      for (let i = 0; i < drops.length; i++) {
        const text = charArr[Math.floor(Math.random() * charArr.length)];
        const x = i * fontSize;
        const y = drops[i] * fontSize;

        ctx.fillText(text, x, y);

        if (y > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }
    };

    const render = (timestamp) => {
      animationFrameId = requestAnimationFrame(render);
      if (document.hidden) return;
      if (timestamp - lastFrame < FRAME_INTERVAL) return;
      lastFrame = timestamp;
      draw();
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [theme, prefersReducedMotion]);

  const activeBg = bgColors[theme] || bgColors.green;

  if (prefersReducedMotion) {
    return null;
  }

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none z-[-1] opacity-[0.45] md:opacity-[0.25]"
      style={{ backgroundColor: activeBg }}
    />
  );
}
