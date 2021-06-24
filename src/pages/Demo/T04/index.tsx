import * as React from 'react';
import { useImmer } from 'use-immer';

import { Popover } from 'antd';
import * as methods from './tmp';
import img from './02.jpg';

const { useEffect, useState, useRef } = React;

const TheCanvas = (props: any) => {
  const { pf } = props;
  const cRef = useRef(null);

  useEffect(() => {
    let tmpCanvas = cRef.current;

    if (!tmpCanvas) {
      return;
    }

    let tmpImg = new Image();

    tmpImg.src = img;

    tmpImg.addEventListener(
      'load',
      () => {
        const width = tmpImg.width;
        const height = tmpImg.height;
        tmpCanvas.width = width;
        tmpCanvas.height = height;
        let tmpContext: any = tmpCanvas.getContext('2d');

        tmpContext.drawImage(tmpImg, 0, 0, width, height);
        let tmpCanvasData = tmpContext.getImageData(0, 0, width, height);

        if (tmpCanvasData && tmpCanvasData.data) {
          let theProps = {
            tmpCanvasData,
            tmpContext,
            width,
            height,
          };
          // console.log(tmpCanvasData);
          // tmpCanvasData = tmpCanvasData.data;
          // console.log(tmpCanvasData.length);

          // for (let x = 0; x < width; x++) {
          //   for (let y = 0; y < height; y++) {
          //     let point = y * width * 4 + x * 4 + 0;
          //     if (tmpCanvasData.data[point] / 2 > 0) {
          //       // console.log('before', tmpCanvasData.data[point]);
          //       tmpCanvasData.data[point] = 0;
          //       // tmpCanvasData.data[point + 1] = tmpCanvasData.data[point + 1] / 2;
          //       // tmpCanvasData.data[point + 2] = tmpCanvasData.data[point + 2] / 2;
          //       // console.log('after', tmpCanvasData.data[point]);
          //     }
          //   }
          // }

          methods.useDither(theProps);
          methods.useGrey(theProps);
        }
      },
      false,
    );
  }, []);

  return (
    <div className={`${pf}-canvas-wrap`}>
      <canvas className={`${pf}-canvas`} ref={cRef}></canvas>
    </div>
  );
};

const AppUseImmerTest = (props: any) => {
  const pf = 'et-img-processing';

  const [visible, setVisible] = useState(true);

  const handle1 = () => {
    setVisible(!visible);
  };
  const TCProps = {
    pf,
  };

  const Right = (): any => {
    if (visible) {
      return (
        <div className={`${pf}-right`}>
          <TheCanvas {...TCProps} />
        </div>
      );
    } else {
      return null;
    }
  };

  return (
    <div className={`${pf}`}>
      <div className={`${pf}-left`}>
        <img src={img} />

        <Popover>
          <div className={`${pf}-btn`} onClick={handle1}>
            Toggle
          </div>
        </Popover>

        <div>
          <div style={{ float: 'left', width: '100px', lineHeight: '18px' }}>啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊</div>
          {/* <div style={{ overflow: 'auto' }}> */}
          <div style={{}}>
            哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈
          </div>
        </div>
      </div>

      <Right />
    </div>
  );
};

export default AppUseImmerTest;
