import * as React from 'react';

import { Button, ETMessage, ETModal, ETNotification } from '@Components';
import { dom } from '@Utils';

const { BtnGradient, BtnNeon, BtnNeon2 } = Button;
console.log(Button);

const { addClass, removeClass, ETFade } = dom;

const Demo = () => {
  const pf = 'et-demo';

  const openModal = (e: any) => {
    ETModal.confirm({
      id: `et-test-modal`,
      title: '测试用弹窗',
      content: (
        <>
          <div>XXXXXXXXXXXXX</div>
          <div>XXXXXXXXXXXXX</div>
          <div>XXXXXXXXXXXXX</div>
          <div>XXXXXXXXXXXXX</div>
          <div>XXXXXXXXXXXXX</div>
          <div>XXXXXXXXXXXXX</div>
        </>
      ),
      initCallback: () => {
        // console.log('tzs');
      },
      okText: '确认',
      cancelText: '取消',
      onOK: () => {},
      onCancel: () => {},
      // zoom
      mp: {
        x: e.pageX,
        y: e.pageY,
      },
    });
  };

  const sendNotification = () => {
    ETNotification({
      id: 'et-notification-tmp-id',
      // className: 'hb-notification-system-dm',
      title: 'TTTTTTTTTT',
      desc: 'DDDDDDDDDDDDDD',
      // callback: ,
      // onClick: onClick,
      // onClose: onClose
      // duration: 2000,
    });
  };

  const BtnBox = (props: any) => {
    const { C, size } = props;

    const commonProps = {
      size,
      // size: 'lg',
      // onClick: () => ETMessage.success('sssssss'),
      onClick: openModal,
      // onClick: sendNotification,
    };

    return (
      <div className={`${pf}-btn-box`}>
        <div className={`${pf}-btn-box-row`}>
          <div className={`${pf}-btn-box-item`}>
            <C {...commonProps} color={'red'} />
          </div>
          <div className={`${pf}-btn-box-item`}>
            <C {...commonProps} color={'orange'} />
          </div>
          <div className={`${pf}-btn-box-item`}>
            <C {...commonProps} color={'yellow'} />
          </div>
          <div className={`${pf}-btn-box-item`}>
            <C {...commonProps} color={'green'} />
          </div>
          <div className={`${pf}-btn-box-item`}>
            <C {...commonProps} color={'blue'} />
          </div>
          <div className={`${pf}-btn-box-item`}>
            <C {...commonProps} color={'purple'} />
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className={`${pf} clearfix`}>
      <BtnBox C={BtnNeon2} size={'sm'} />
      <BtnBox C={BtnNeon2} />
      <BtnBox C={BtnNeon2} size={'lg'} />
      <BtnBox C={BtnNeon} size={'sm'} />
      <BtnBox C={BtnNeon} />
      <BtnBox C={BtnNeon} size={'lg'} />
      <BtnBox C={BtnGradient} size={'sm'} />
      <BtnBox C={BtnGradient} />
      <BtnBox C={BtnGradient} size={'lg'} />
      {/* <div onClick={openModal}>openModal</div> */}
    </div>
  );
};

export default Demo;
