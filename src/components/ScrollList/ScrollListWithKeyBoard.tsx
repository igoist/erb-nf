import * as React from 'react';
import * as utils from '@Utils';

import useScrollList from './useScrollList';

import { SearchResultProps } from '@Types';

const { useEffect } = React;

const { scroll2 } = utils;
const { returnCurrent } = scroll2;

let observer: any = null;

/**
 *     current: scroll position, usage -- 56 * current
 * targetIndex: index of the selected item
 */
const ScrollListWithKeyBoard = (props: SearchResultProps) => {
  const { arr, handleEnterKey, tagH } = props;

  const { list, start, end, current, targetIndex, refBox, setCurrent, setTargetIndex, setArr, intiateScrollObserver, getReference } = useScrollList({
    array: arr,
    observer,
  });

  // useEffect(() => {
  //   console.log(current, targetIndex, start, end);
  // });

  useEffect(() => {
    setArr(arr);

    let searchResult: any = document.getElementById('searchResult');
    searchResult.style.height = 0 + 'px';

    setTimeout(() => {
      searchResult.scrollTop = 0;
      searchResult.style.height = tagH * 56 + 'px';
    }, 16);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [arr]);

  const handleItem = (index: number) => {
    handleEnterKey(index);
    console.log(index, targetIndex, current, returnCurrent(current, index));

    setTargetIndex(index);
    setCurrent(returnCurrent(current, index));
  };

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
            title={item.excerpt}
          ></div>
        );
      })}
    </div>
  );
};

export default ScrollListWithKeyBoard;
