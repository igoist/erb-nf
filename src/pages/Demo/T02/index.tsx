import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as utils from '../utils';

const { useState, useEffect, useRef } = React;
const { hbFade } = utils;

const HBModal = (props: any) => {
  const pf = 'hb-modal';
  const modalRef = useRef();

  useEffect(() => {
    // const modal = modalRef.current;
    // hbFade({
    //   el: modal,
    //   isEnter: true,
    // });
    // console.log('modal enter', props.children, props);
    // return () => {
    //   console.log('modal leave');
    //   hbFade({
    //     el: modal,
    //     isEnter: false,
    //   });
    // };
    console.log('111');
  }, []);

  useEffect(() => {
    console.log('2222222');
    if (modalRef) {
      const modal = modalRef.current;

      console.log('enter modalRef: ', modal);
      if (modal) {
        if (props.visible) {
          hbFade({
            el: modal,
            isEnter: true,
          });
        } else {
          hbFade({
            el: modal,
            isEnter: false,
          });
        }
      }
    }
  });

  return (
    <div className={`${pf}`} ref={modalRef}>
      <div>XX</div>
      <div>AA</div>
      {props.children}
    </div>
  );
};

const HBConfirm = (config: any) => {
  let div = document.createElement('div');
  document.body.appendChild(div);

  function close(...args: any[]) {
    render({ ...config, close, visible: false, afterClose: destroy.bind(this, ...args) });
  }

  const destroy = (...args: any[]) => {
    const unmountResult = ReactDOM.unmountComponentAtNode(div);
    if (unmountResult && div.parentNode) {
      div.parentNode.removeChild(div);
    }

    const triggerCancel = args && args.length && args.some((param) => param && param.triggerCancel);
    if (config.onCancel && triggerCancel) {
      config.onCancel(...args);
    }
  };

  const render = (props: any) => {
    ReactDOM.render(<HBModal {...props} />, div);
  };

  render({ ...config, visible: true, close });

  return {
    destroy: close,
  };
};

const Wrap = () => {
  useEffect(() => {
    const div = document.createElement('div');

    document.body.appendChild(div);

    console.log('enter Wrap', div);
    ReactDOM.render(<HBModal />, div);

    return () => {
      console.log('enter Wrap unmount');

      ReactDOM.unmountComponentAtNode(div);

      setTimeout(() => {
        console.log('remove node');
        document.body.removeChild(div);
      }, 2000);
    };
  }, []);

  return null;
};

const T = () => {
  const [s, setS] = useState(true);
  const mRef: any = useRef();

  // useEffect(() => {
  //   mRef =
  // }, [])

  // useEffect(() => {
  //   console.log('========== mRef: ', mRef, s);

  //   if (mRef && !s) {
  //     mRef.current = HBConfirm([]);
  //   } else {
  //     if (mRef) {
  //       mRef.current.destroy([]);
  //     }
  //   }
  // }, [s]);

  const handleClick = () => {
    setS(!s);
  };

  return (
    <div>
      <div onClick={handleClick}>Button</div>

      {/* {s && <Wrap />} */}

      <HBModal visible={s}>
        <div>zzzzzzzzzzzzzz</div>
        <div>zzzzzzzzzzzzzz</div>
        <div>zzzzzzzzzzzzzz</div>
        <div>zzzzzzzzzzzzzz</div>
        <div>zzzzzzzzzzzzzz</div>
      </HBModal>
    </div>
  );
};

export default T;
