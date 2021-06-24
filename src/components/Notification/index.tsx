import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { dom } from '@Utils';

const { CE, Q, ETFade } = dom;

const N = (props: any) => {
  const { id, title, desc } = props;

  const pf = `${'et'}-notification`;

  return (
    <div className={`${pf}`} id={id}>
      <div className={`${pf}-content`}>
        {title && <div className={`${pf}-title`}>{title}</div>}

        <div className={`${pf}-desc`}>{desc}</div>
      </div>

      <div className={`${pf}-close`}>X</div>
    </div>
  );
};

/**
 * wrapPosition?: string 如 topRight
 * id: string            通知框 id
 * className?: string    通知框 className, 方便定制指定样式
 * title: string         通知框标题
 * desc: string          通知框内容
 * callback?: any        出现前回调
 * onClick?: any         点击(查看)通知回调
 * onClose?: any         点击关闭回调
 * duration?: number     若干毫秒后自动关闭
 */
var ETNotification = function (config: any) {
  var tmpItem = document.getElementById(config.id);
  if (tmpItem) {
    return;
  }

  var wrapPosition = config.wrapPosition || 'top-right';

  // var htmlStr = app.renderSync('base/hb-notification', {
  //   notificationId: config.id,
  //   className: config.className || '',
  //   title: config.title,
  //   desc: config.desc,
  // });

  var wrap: any = Q('.et-notification-wrap-' + wrapPosition);

  if (!wrap) {
    wrap = CE('div');
    wrap.className = 'et-notification-wrap et-notification-wrap-' + wrapPosition;
    document.body.appendChild(wrap);
  }

  // Elements.from(htmlStr).inject(wrap);

  let tmpDiv = CE('div');

  ReactDOM.render(<N {...config} />, tmpDiv);

  wrap.appendChild(tmpDiv);

  if (config.callback) {
    config.callback(wrap);
  }

  var notification = Q(`#${config.id}`, wrap);
  var btnNotification = notification;
  var btnClose = Q('.et-notification-close', notification);

  // 执行初始化 fade enter
  ETFade({
    el: notification,
    isEnter: true,
  });

  // 之后代码继续事件的创建与绑定
  var handleEscQuit = function (e: any) {
    if (e.keyCode === 27) {
      handleClose();
    }
  };

  document.body.addEventListener('keydown', handleEscQuit);

  var handleQuit = function (callback: any) {
    ETFade({
      el: notification,
      callback: function () {
        document.body.removeEventListener('keydown', handleEscQuit);
        // notification.dispose();
        const unmountResult = ReactDOM.unmountComponentAtNode(tmpDiv);

        if (unmountResult && tmpDiv.parentNode) {
          tmpDiv.parentNode.removeChild(tmpDiv);
        }

        if (callback) {
          callback();
        }
      },
    });
  };

  var handleClick = function () {
    handleQuit(function () {
      if (config.onClick) {
        config.onClick();
      }
    });
  };

  let handleClose = function (e?: any) {
    // if (e) {
    //   e.stop();
    // }

    handleQuit(function () {
      if (config.onClose) {
        config.onClose();
      }
    });
  };

  btnNotification && btnNotification.addEventListener('click', handleClick);
  btnClose && btnClose.addEventListener('click', handleClose);

  if (config.duration) {
    setTimeout(function () {
      btnClose && btnClose.click();
    }, config.duration);
  }
};

export default ETNotification;
