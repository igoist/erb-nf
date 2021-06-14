import * as React from 'react';
import { useImmer } from 'use-immer';

import img from './01.jpg';

const { useEffect, useState, useRef } = React;

const cMM = (n: number) => {
  return Math.min(Math.max(0, n), 255);
};

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

          for (let x = 0; x < width; x++) {
            for (let y = 0; y < height; y++) {
              let point = y * width * 4 + x * 4 + 0;
              let tmpV;

              tmpCanvasData.data[point + 1] = 0;
              tmpCanvasData.data[point + 2] = 0;

              if (tmpCanvasData.data[point] > 127) {
                tmpV = tmpCanvasData.data[point] - 255;
                tmpCanvasData.data[point] = 255;
                // tmpCanvasData.data[point + 1] = tmpCanvasData.data[point + 1] / 2;
                // tmpCanvasData.data[point + 2] = tmpCanvasData.data[point + 2] / 2;
              } else {
                tmpV = tmpCanvasData.data[point];
                tmpCanvasData.data[point] = 0;
              }

              let a = (tmpV * 7) / 16;
              let b = (tmpV * 1) / 16;
              let c = (tmpV * 5) / 16;
              let d = (tmpV * 3) / 16;

              if (y !== height - 1 && x !== 0 && x !== width - 1) {
                tmpCanvasData.data[y * width * 4 + (x + 1) * 4 + 0] = cMM(tmpCanvasData.data[y * width * 4 + (x + 1) * 4 + 0] + a);
                tmpCanvasData.data[(y + 1) * width * 4 + (x + 1) * 4 + 0] = cMM(tmpCanvasData.data[(y + 1) * width * 4 + (x + 1) * 4 + 0] + b);
                tmpCanvasData.data[(y + 1) * width * 4 + (x + 0) * 4 + 0] = cMM(tmpCanvasData.data[(y + 1) * width * 4 + (x + 0) * 4 + 0] + c);
                tmpCanvasData.data[(y + 1) * width * 4 + (x - 1) * 4 + 0] = cMM(tmpCanvasData.data[(y + 1) * width * 4 + (x - 1) * 4 + 0] + d);
              }
            }
          }

          tmpContext.putImageData(tmpCanvasData, 0, 0);
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

        <div className={`${pf}-btn`} onClick={handle1}>
          Toggle
        </div>
      </div>

      <Right />
    </div>
  );
};

export default AppUseImmerTest;
