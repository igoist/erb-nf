import * as React from 'react';

const { useState, useRef, useEffect } = React;

type InitialPropsType = {
  array: any,
  observer: any
};

/**
 * T : THRESHOLD
 * TO: THRESHOLD_OFFSET
 * TP: THRESHOLD_PADDING
 */
const T = 30;
const TO = 5;
const TP = 10;
const TX = T - TP - 1 - TO; // 14

const useScrollList = (initialProps: InitialPropsType) => {
  const { array, observer } = initialProps;
  const refBox = useRef(null);
  const refTop = useRef(null);
  let refBottom = useRef(null);
  let refOB = useRef(observer);
  const [arr, setArr] = useState(array);

  const listLength = arr.length;
  const maxStartIndex = listLength - 1 - 25 > 0 ? listLength - 1 - 25 : 0; // Maximum index value `start` can take
  const maxEndIndex = listLength > 0 ? listLength - 1 : 0; // Maximum index value `end` can take

  const [start, setStart] = useState(0);
  const [end, setEnd] = useState(TX < maxEndIndex ? TX : maxEndIndex);

  const [current, setCurrent] = useState(0);
  const [targetIndex, setTargetIndex] = useState(0);

  const list = arr.slice(start - TO < 0 ? 0 : start - TO, end + TO);

  const intiateScrollObserver = () => {
    const options = {
      root: refBox.current,
      rootMargin: '0px',
      threshold: 0.1
    };

    if (refOB.current) {
      refOB.current.disconnect();
    }

    refOB.current = new IntersectionObserver(callback, options);

    if (refTop.current) {
      refOB.current.observe(refTop.current);
    }
    if (refBottom.current) {
      refOB.current.observe(refBottom.current);
    }

    // console.log('intiateScrollObserver: ', start, end);
  };

  const callback = (entries: any, observer: any) => {
    entries.forEach((entry: any, index: number) => {
      // Scroll Down
      // We make increments and decrements in 10s
      if (entry.isIntersecting && entry.target.id === 'bottom') {
        // console.log('Scroll down: ', start, end);
        const newEnd = end + TO <= maxEndIndex ? end + TO : maxEndIndex;
        const newStart = end - TX > 0 ? (end - TX <= maxStartIndex ? end - TX : maxStartIndex) : 0;
        // console.log(`old start: ${start}, new: ${newStart} `, end - TX, maxStartIndex, end, TX);

        updateState(newStart, newEnd);
      }

      // Scroll up
      if (entry.isIntersecting && entry.target.id === 'top') {
        // console.log('Scroll up: ', start, end);
        const newStart = start - TO <= 0 ? 0 : start - TO;

        let t = maxEndIndex;
        const newEnd = start + TX <= t ? start + TX : t;

        // console.log(`xold start: ${start}, new: ${newStart} `, end - TX, maxStartIndex, end, TX, newEnd);
        updateState(newStart, newEnd);
      }
    });
  };

  const resetObservation = () => {
    // console.log(refTop.current && refTop.current.className, refBottom.current && refBottom.current.className, start, end);
    if (refTop.current) {
      refOB.current.unobserve(refTop.current);
    }
    if (refBottom.current) {
      refOB.current.unobserve(refBottom.current);
    }
  };

  const updateState = (newStart: number, newEnd: number) => {
    if (start !== newStart || end !== newEnd) {
      resetObservation();
      setStart(newStart);
      setEnd(newEnd);
    }
  };

  const getReference = (item: any) => {
    if (item.currentIndex === start) return refTop;
    if (item.currentIndex === end) return refBottom;
    return null;
  };

  useEffect(() => {
    intiateScrollObserver();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setCurrent(0);
    setTargetIndex(0);
    setStart(0);
    setEnd(TX < maxEndIndex ? TX : maxEndIndex);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [arr]);

  return {
    list,
    start,
    end,
    current,
    targetIndex,
    refBox,
    refTop,
    refBottom,
    refOB,
    setStart,
    setEnd,
    setCurrent,
    setTargetIndex,
    setArr,
    updateState,
    intiateScrollObserver,
    getReference
  };
};

export default useScrollList;
