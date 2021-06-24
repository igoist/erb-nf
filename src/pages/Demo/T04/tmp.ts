const cMM = (n: number) => {
  return Math.min(Math.max(0, n), 255);
};

export const useDither = (props: any) => {
  const { tmpCanvasData, tmpContext, width, height } = props;
  for (let x = 0; x < width; x++) {
    for (let y = 0; y < height; y++) {
      let point = y * width * 4 + x * 4 + 0;
      let tmpV;

      // tmpCanvasData.data[point + 1] = 0;
      // tmpCanvasData.data[point + 2] = 0;

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
};

export const useGrey = (props: any) => {
  const { tmpCanvasData, tmpContext, width, height } = props;

  for (let x = 0; x < width; x++) {
    for (let y = 0; y < height; y++) {
      let point = y * width * 4 + x * 4 + 0;
      let red = tmpCanvasData.data[point];
      let yellow = tmpCanvasData.data[point];
      let blue = tmpCanvasData.data[point];
      let tmpV = cMM(red * 0.299 + yellow * 0.587 + blue * 0.114);

      tmpCanvasData.data[point] = tmpV;
      tmpCanvasData.data[point + 1] = tmpV;
      tmpCanvasData.data[point + 2] = tmpV;
    }
  }

  tmpContext.putImageData(tmpCanvasData, 0, 0);

  return tmpCanvasData;
};

// export const useGreyToRGB = (props: any) => {
//   const { tmpCanvasData, tmpContext, width, height } = props;

//   for (let x = 0; x < width; x++) {
//     for (let y = 0; y < height; y++) {
//       let point = y * width * 4 + x * 4 + 0;

//       let grey = tmpCanvasData.data[point];

//       // let red = grey;
//       // let yellow = tmpCanvasData.data[point];
//       let blue = tmpCanvasData.data[point] - 0.299 * grey - 0.587;

//       // tmpCanvasData.data[point] = red;
//       // tmpCanvasData.data[point + 1] = yellow;
//       tmpCanvasData.data[point + 2] = blue;
//     }
//   }

//   tmpContext.putImageData(tmpCanvasData, 0, 0);

//   return tmpCanvasData;
// };
