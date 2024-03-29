import { dom } from '@Utils';

const { CE, Q, ETFade, htmlToElement } = dom;

const ETMessage = (config: any) => {
  // tmp prefix
  const prefix = 'et';

  const pf = `${prefix}-message`;
  const { content, duration = 2000, type = 'warn' } = config;

  let wrap = Q(`.${pf}-wrap`);

  if (!wrap) {
    wrap = CE('div');
    wrap.className = `${pf}-wrap`;
    document.body.appendChild(wrap);
  }

  const t = `${pf}-${type}`;

  const msg = htmlToElement(`
    <div class='${pf}'>
      <div class='${pf}-content ${t}'>
        ${content}
      </div>
    </div>
  `);

  wrap.appendChild(msg);

  ETFade({
    el: msg,
    isEnter: true,
  });

  let hasQuit = false;

  const handleClick = () => {
    if (hasQuit) {
      return;
    }

    hasQuit = true;

    ETFade({
      el: msg,
      callback: () => {
        wrap.removeChild(msg);
      },
    });
  };

  msg.addEventListener('click', handleClick);

  setTimeout(() => {
    handleClick();
  }, duration);
};

const duration = 2000;

ETMessage.success = (content: string) => {
  ETMessage({
    content,
    duration,
    type: 'success',
  });
};

ETMessage.warn = (content: string) => {
  ETMessage({
    content,
    duration,
    type: 'warn',
  });
};

ETMessage.error = (content: string) => {
  ETMessage({
    content,
    duration,
    type: 'error',
  });
};

export default ETMessage;
