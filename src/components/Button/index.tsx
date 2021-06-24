import * as React from 'react';

const { useEffect, useRef } = React;

const pf = `${'et'}-btn`;

export const BtnNeon = (props: any) => {
  const { color, size, text, onClick } = props;

  let ex = `${color || 'red'} ${size || ''}`;

  return (
    <div className={`${pf} type-neon is-bounce ${ex}`} onClick={onClick}>
      {text || 'Button'}
    </div>
  );
};

export const BtnNeon2 = (props: any) => {
  const { color, size, text, onClick } = props;

  let ex = `${color || 'red'} ${size || ''}`;

  return (
    <div className={`${pf} type-neon2 is-bounce ${ex}`} onClick={onClick}>
      {text || 'Button'}
    </div>
  );
};

export const BtnGradient = (props: any) => {
  const { color, size, text, onClick } = props;

  const btnRef = useRef(null);

  useEffect(() => {
    let btn = btnRef.current;
    if (!btn) {
      return;
    }

    const handleMouseMove = (e: any) => {
      const x = e.pageX - btn.offsetLeft;
      const y = e.pageY - btn.offsetTop;

      btn.style.setProperty('--x', x + 'px');
      btn.style.setProperty('--y', y + 'px');
    };

    btn.addEventListener('mousemove', handleMouseMove);

    return () => {
      btn.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  let ex = `${color || 'red'} ${size || ''}`;

  return (
    <button className={`${pf} type-gradient is-bounce ${ex}`} ref={btnRef} onClick={onClick}>
      {text || 'Button'}
    </button>
  );
};

export default BtnGradient;
