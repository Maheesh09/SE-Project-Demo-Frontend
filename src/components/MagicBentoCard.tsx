import { useRef, useEffect, useCallback, ReactNode } from 'react';
import { gsap } from 'gsap';

interface MagicBentoCardProps {
  children: ReactNode;
  className?: string;
  glowColor?: string;
  enableTilt?: boolean;
  clickEffect?: boolean;
  onClick?: () => void;
}

const MagicBentoCard = ({
  children,
  className = '',
  glowColor = '100, 70, 50',
  enableTilt = false,
  clickEffect = true,
  onClick,
}: MagicBentoCardProps) => {
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    const el = cardRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // glow position
    el.style.setProperty('--glow-x', `${(x / rect.width) * 100}%`);
    el.style.setProperty('--glow-y', `${(y / rect.height) * 100}%`);
    el.style.setProperty('--glow-intensity', '1');

    if (enableTilt) {
      const rotateX = ((y - rect.height / 2) / (rect.height / 2)) * -6;
      const rotateY = ((x - rect.width / 2) / (rect.width / 2)) * 6;
      gsap.to(el, { rotateX, rotateY, duration: 0.15, ease: 'power2.out', transformPerspective: 800 });
    }
  }, [enableTilt]);

  const handleMouseLeave = useCallback(() => {
    const el = cardRef.current;
    if (!el) return;
    el.style.setProperty('--glow-intensity', '0');
    if (enableTilt) {
      gsap.to(el, { rotateX: 0, rotateY: 0, duration: 0.3, ease: 'power2.out' });
    }
  }, [enableTilt]);

  const handleClick = useCallback((e: MouseEvent) => {
    if (!clickEffect || !cardRef.current) return;
    const el = cardRef.current;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const maxDist = Math.max(
      Math.hypot(x, y), Math.hypot(x - rect.width, y),
      Math.hypot(x, y - rect.height), Math.hypot(x - rect.width, y - rect.height)
    );
    const ripple = document.createElement('div');
    ripple.style.cssText = `
      position:absolute; width:${maxDist * 2}px; height:${maxDist * 2}px; border-radius:50%;
      background:radial-gradient(circle, rgba(${glowColor},0.3) 0%, rgba(${glowColor},0.1) 40%, transparent 70%);
      left:${x - maxDist}px; top:${y - maxDist}px; pointer-events:none; z-index:100;
    `;
    el.appendChild(ripple);
    gsap.fromTo(ripple, { scale: 0, opacity: 1 }, { scale: 1, opacity: 0, duration: 0.7, ease: 'power2.out', onComplete: () => ripple.remove() });
  }, [clickEffect, glowColor]);

  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;
    el.addEventListener('mousemove', handleMouseMove);
    el.addEventListener('mouseleave', handleMouseLeave);
    el.addEventListener('click', handleClick);
    return () => {
      el.removeEventListener('mousemove', handleMouseMove);
      el.removeEventListener('mouseleave', handleMouseLeave);
      el.removeEventListener('click', handleClick);
    };
  }, [handleMouseMove, handleMouseLeave, handleClick]);

  return (
    <div
      ref={cardRef}
      className={`magic-bento-card magic-bento-card--border-glow ${className}`}
      style={{ position: 'relative', overflow: 'hidden', '--glow-color': glowColor } as React.CSSProperties}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

export default MagicBentoCard;
