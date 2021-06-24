import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { dom } from '@Utils';

const { addClass, removeClass, ETFade, ETZoom, setTransformOrigin, offset } = dom;

const { useEffect, useState, useRef } = React;

const confirm = (config: any) => {
  let div = document.createElement('div');

  if (config.id) {
    div.id = config.id;
  }

  if (config.targetParent) {
    config.targetParent.appendChild(div);
  } else {
    document.body.appendChild(div);
  }

  function close(...args: any) {
    destroy(...args);
  }

  function destroy(...args: any) {
    const unmountResult = ReactDOM.unmountComponentAtNode(div);

    if (unmountResult && div.parentNode) {
      div.parentNode.removeChild(div);
    }

    if (config.onCancel) {
      config.onCancel(...args);
    }
  }

  function render(props: any) {
    /**
     * https://github.com/ant-design/ant-design/issues/23623
     *
     * Sync render blocks React event. Let's make this async.
     */
    setTimeout(() => {
      ReactDOM.render(<Modal {...props} />, div);
    });
  }

  let currentConfig = { ...config, close, visible: true, wrap: div };

  render(currentConfig);
};

/**
 * title?: string           弹窗标题
 * content: any             弹窗主要内容
 * initCallback?: () => any 初始化函数
 * okText?: string          提交按钮文本
 * cancelText?: string      取消按钮文本
 * onOK?: () => any         提交后逻辑, 可以不传, 就当默认关闭
 * mp?: Object              鼠标点击位置 mousePosition
 */
const Modal = (props: any) => {
  const { title, content, initCallback, okText, cancelText, onOK, close, mp } = props;

  const [visible, setVisible] = useState(props.visible);

  const maskRef = useRef(null);
  const modalRef = useRef(null);

  const pf = 'et-modal';

  useEffect(() => {
    addClass('et-scroll-forbidden', document.body);

    // 若使用下面这种方式注册事件, 事件的响应顺序就乱了
    // 那时, content 中组件的事件定义必须通过类似 useEffect(() => { ... }, []) 的形式
    // 换句话说, 通用组件的编码形式会被限定, 会给开发工作带来额外负担
    // wrap &&
    //   wrap.addEventListener('click', () => {
    //     console.log('enter wrap clik');
    //     // setVisible(false);
    //   });
    // modalRef.current &&
    //   modalRef.current.addEventListener(
    //     'click',
    //     (e) => {
    //       // e.stopPropagation();
    //       console.log('enter stopPropagation');
    //     },
    //     false
    //   );

    const modal = modalRef.current;
    if (mp) {
      const elOffset = offset(modal);
      setTransformOrigin(modal, mp.x - elOffset.left + 'px ' + (mp.y - elOffset.top) + 'px');
    } else {
      setTransformOrigin(modal, '');
    }

    if (initCallback) {
      initCallback();
    }

    const handleEscQuit = (e: any) => {
      if (e.keyCode === 27) {
        handleClose();
      }
    };

    document.body.addEventListener('keydown', handleEscQuit);

    return () => {
      document.body.removeEventListener('keydown', handleEscQuit);
    };
  }, []);

  useEffect(() => {
    let method = mp ? ETZoom : ETFade;

    if (visible) {
      if (maskRef.current && modalRef.current) {
        ETFade({
          el: maskRef.current,
          isEnter: true,
        });

        // removeClass('is-hidden', modalRef.current);

        method({
          el: modalRef.current,
          isEnter: true,
        });
      }
    } else {
      ETFade({
        el: maskRef.current,
      });

      method({
        el: modalRef.current,
        callback: () => {
          removeClass('et-scroll-forbidden', document.body);
          close();
        },
      });
    }
  }, [visible]);

  const handleClose = () => {
    setVisible(false);
  };

  const handleOK = () => {
    if (onOK) {
      onOK();
    }

    handleClose();
  };

  const stopPropagation = (e: any) => {
    e.stopPropagation();
  };

  return (
    <>
      <div className={`${pf}-mask`} ref={maskRef} onClick={handleClose}></div>
      <div className={`${pf}-wrap`}>
        <div className={`${pf}`} ref={modalRef} onClick={stopPropagation}>
          <div className={`${pf}-content`}>
            <div className={`${pf}-close ${pf}-btn-close`}></div>

            {title && (
              <div className={`${pf}-header`}>
                <div className={`${pf}-title`}>{title}</div>
              </div>
            )}

            <div className={`${pf}-body`}>{content}</div>

            <div className={`${pf}-footer`}>
              {cancelText && (
                <div className={`et-btn is-bounce ${pf}-btn ${pf}-btn-cancel`} onClick={handleClose}>
                  {cancelText}
                </div>
              )}
              {okText && (
                <div className={`et-btn is-bounce ${pf}-btn ${pf}-btn-submit`} onClick={handleOK}>
                  {okText}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

Modal.confirm = confirm;

export default Modal;
