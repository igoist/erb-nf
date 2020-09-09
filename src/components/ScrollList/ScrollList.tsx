import * as React from 'react';
import * as util from '@Utils';

import { SearchResultProps } from '@Interfaces';

const { useState, useRef, useEffect } = React;

const { copy, scroll2 } = util;
const { returnCurrent } = scroll2;

const arr: any = [];

for (let i = 0; i < 115; i++) {
  arr.push({
    currentIndex: i,
    colored: `xx-` + i
  });
}

/**
 * T : THRESHOLD
 * TO: THRESHOLD_OFFSET
 * TP: THRESHOLD_PADDING
 */
const T = 30;
const TO = 5;
const TP = 10;
const TX = T - TP - 1 - TO; // 14

let observer: any = null;

const List = (props: SearchResultProps) => {
  const { arr, handleEnterKey, tagH } = props;

  const refBox = useRef(null);
  const refTop = useRef(null);
  let refBottom = useRef(null);
  let refOB = useRef(observer);

  //
  const listLength = arr.length;
  const maxStartIndex = listLength - 1 - 25 > 0 ? listLength - 1 - 25 : 0; // Maximum index value `start` can take
  const maxEndIndex = listLength > 0 ? listLength - 1 : 0; // Maximum index value `end` can take

  const [start, setStart] = useState(0);
  const [end, setEnd] = useState(TX < maxEndIndex ? TX : maxEndIndex);

  const [current, setCurrent] = useState(0);
  const [targetIndex, setTargetIndex] = useState(0);

  const list = arr.slice(start - TO < 0 ? 0 : start - TO, end + TO);

  useEffect(() => {
    console.log(current, targetIndex, start, end);
  });

  useEffect(() => {
    setCurrent(0);
    setTargetIndex(0);
    setStart(0);
    setEnd(TX < maxEndIndex ? TX : maxEndIndex);

    let searchResult: any = document.getElementById('searchResult');
    searchResult.style.height = 0 + 'px';

    setTimeout(() => {
      searchResult.scrollTop = 0;
      searchResult.style.height = tagH * 56 + 'px';
    }, 16);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [arr]);

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

  const updateState = (newStart: number, newEnd: number) => {
    if (start !== newStart || end !== newEnd) {
      resetObservation();
      setStart(newStart);
      setEnd(newEnd);
    }
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

  const handleItem = (index: number) => {
    handleEnterKey(index);
    console.log(index, targetIndex, current, returnCurrent(current, index));

    setTargetIndex(index);
    setCurrent(returnCurrent(current, index));
  };

  useEffect(() => {
    intiateScrollObserver();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: any) => {
      if (e.keyCode === 74 || e.keyCode === 40) {
        const newTargetIndex = targetIndex + 1 > arr.length - 1 ? targetIndex : targetIndex + 1;
        const newCurrent = returnCurrent(current, newTargetIndex);

        setTargetIndex(newTargetIndex);
        setCurrent(newCurrent);
      }

      if (e.keyCode === 75 || e.keyCode === 38) {
        const newTargetIndex = targetIndex > 0 ? targetIndex - 1 : 0;
        const newCurrent = returnCurrent(current, newTargetIndex);

        setTargetIndex(newTargetIndex);
        setCurrent(newCurrent);
      }

      if (e.keyCode === 13) {
        if (arr.length) {
          handleItem(targetIndex);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  });

  useEffect(() => {
    let item = document.querySelector('.s-item.selected');
    // 触发时间需要调整 写给函数专门进行判断
    if (item) {
      let searchResult: any = document.getElementById('searchResult');
      searchResult.scrollTop = 56 * current;
    } else {
      console.log(`I can't get the selected item: `, current, targetIndex);
    }
  }, [current]);

  useEffect(() => {
    intiateScrollObserver();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [start, end]);

  const getReference = (item: any) => {
    if (item.currentIndex === start) return refTop;
    if (item.currentIndex === end) return refBottom;
    return null;
  };

  return (
    <div id='searchResult' style={{ height: '0' }} ref={refBox}>
      {list.map((item: any, index: number) => {
        const top = 56 * (index + (start - 5 > 0 ? start - 5 : 0)) + 'px';
        const refVal = getReference(item);
        const id = item.currentIndex === start ? 'top' : item.currentIndex === end ? 'bottom' : undefined;
        return (
          <div
            className={`s-item ${'id-' + item.currentIndex}` + (targetIndex === item.currentIndex ? ' selected' : '')}
            key={'s-item-' + item.currentIndex}
            style={{ top }}
            ref={refVal}
            id={id}
            onClick={() => handleItem(item.currentIndex)}
            dangerouslySetInnerHTML={{ __html: item.colored }}
            data-id={item.currentIndex}
          ></div>
        );
      })}
    </div>
  );
};

export default List;
