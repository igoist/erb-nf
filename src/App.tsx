import * as React from 'react';
import { ipcRenderer, remote } from 'electron';
import { coreFn, fuzzyMatch2 } from '@Utils';
// import SearchResult from './SearchResult';
import AudioPlayer from './AudioPlayer';
import VideoPlayer from './VideoPlayer';
import { useAppHook } from '@Models';
import { useDebounceFn } from 'ahooks';
import { ScrollList } from '@Components';
import { ListItemType } from '@Types';
import { Admin, Demo, PictureWall, PageGenerator } from './pages';

const { useEffect, useRef } = React;

const { ScrollListWithPagination, ScrollListWithKeyBoard } = ScrollList;

const { debounce } = coreFn;
const { fuzzyList, transformData } = fuzzyMatch2;

const Loading = () => {
  return (
    <div className='spinner-wrap'>
      <div className='ex-spinner'>
        <div className='ex-spinner-bounce1'></div>
        <div className='ex-spinner-bounce2'></div>
        <div className='ex-spinner-bounce3'></div>
      </div>
    </div>
  );
};

const getTitleIndex = (mode: number, arr: Array<ListItemType>) => {
  let titleIndex;
  if (mode === -1) {
    titleIndex = 'name';
  } else {
    titleIndex = arr[mode].metas.title.dataIndex;
  }

  return titleIndex;
};

const App = () => {
  const searchInput = useRef(null);
  const { AppArr, value, data, loading, result, mode, dispatch, setMode } = useAppHook.useContainer();

  const item = AppArr[mode];

  const handleFuzzy = (v: string) => {
    let ret = v === '' ? [] : fuzzyList(value, data.list, getTitleIndex(mode, AppArr));

    dispatch({
      type: 'saveResult',
      payload: {
        result: ret,
      },
    });
  };

  const { run } = useDebounceFn(handleFuzzy, {
    wait: 300,
  });

  const handleChange = (event: any) => {
    dispatch({
      type: 'save',
      payload: {
        value: event.target.value,
      },
    });

    run(event.target.value.trim());
  };

  const handleClick = () => {
    dispatch({
      type: 'toModeZero',
    });
  };

  const handleEnterKey = (index: number) => {
    const tmpItem = result[index];

    if (mode === -1) {
      let tmp = AppArr.filter((item) => {
        return item.visible;
      });

      // console.log('xxxxxxx', index, tmp, tmp[index].index);
      setMode(tmp[index].index);
    } else if (item.name === 'v2ex Nodes') {
      let tmpMode = AppArr.filter((item) => {
        return item.name === 'v2ex Node';
      })[0].index;
      console.log('enter: ', tmpMode, tmpItem.id);

      dispatch({
        type: 'toV2Node',
        payload: {
          mode: tmpMode,
          id: tmpItem.id,
        },
      });
    } else {
      console.log(data.list[tmpItem.originalIndex].title);
      console.log(data.list[tmpItem.originalIndex].link || data.list[tmpItem.originalIndex].url);

      if (data.list[tmpItem.originalIndex].link) {
        ipcRenderer.send('open-tab', { link: data.list[tmpItem.originalIndex].link });
      }
    }
  };

  useEffect(() => {
    const handleMC = () => {
      // const notification = {
      //   title: 'Notification with image',
      //   body: 'Short message plus a custom image',
      //   icon: './img/programming.png'//path.join(__dirname, './public/img/programming.png')
      // };
      // const myNotification = new (window as any).Notification(notification.title, notification);
      // handleDispatch()
      console.log('mode-change: ', mode);

      if (item.type === 'Demo') {
        // do something else
        ipcRenderer.send('et-fade-leave', {});
      } else {
        dispatch({
          type: 'toModeZero',
        });
      }
    };

    ipcRenderer.on('mode-change', handleMC);

    const handleMC2 = () => {
      dispatch({
        type: 'toModeZero',
      });
    };

    ipcRenderer.on('et-to-mode-zero-renderer', handleMC2);

    const handleKeyDown = (e: any) => {
      if (((e.keyCode === 74 && e.ctrlKey) || e.keyCode === 40) && value === '') {
        if (result.length !== data.list.length) {
          dispatch({
            type: 'saveResult',
            payload: {
              result: transformData(data.list, getTitleIndex(mode, AppArr)),
              from: 'handleKeyDown',
            },
          });
        }
      }
      if (e.keyCode === 27 && value === '' && result.length > 0) {
        dispatch({
          type: 'saveBoth',
          payload: {
            value: '',
            result: [],
            from: 'handleKeyDown',
          },
        });
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    const handleClickThrough = debounce((e: any) => {
      if (e.target === document.documentElement) {
        ipcRenderer.send('et-set-window', {
          type: 'et-ignore-mouse-event',
          payload: true,
        });
      } else {
        ipcRenderer.send('et-set-window', {
          type: 'et-ignore-mouse-event',
          payload: false,
        });
      }
    }, 100);

    window.addEventListener('mousemove', handleClickThrough);

    return () => {
      ipcRenderer.removeListener('mode-change', handleMC);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('mousemove', handleClickThrough);
    };
  });

  useEffect(() => {
    ipcRenderer.on('focus-toggle', () => {
      if (searchInput.current === document.activeElement) {
        searchInput.current.blur();
      } else {
        searchInput.current.focus();
      }
    });

    // 配合 antd dark theme
    document.body.dataset.theme = 'dark';
  }, []);

  let tagH = result.length > 10 ? 10 : result.length;

  // 这里之后会有一个新标记区别是否 fullscreen (目前只有是全屏或不是全屏)
  if (item) {
    if (item.type === 'PageGenerator' || item.type === 'Admin' || item.type === 'Demo') {
      // do nothing
    } else if (item.type === 'ScrollList') {
      ipcRenderer.send('change-win', {
        listHeight: tagH,
      });
    }
  } else if (mode === -1) {
    ipcRenderer.send('change-win', {
      type: 'to-mode-zero',
      listHeight: tagH,
    });
  } else {
    ipcRenderer.send('change-win', { listHeight: 10 });
  }

  const toPage = (page: number) => {
    dispatch({
      type: 'toV2NodePage',
      payload: {
        id: data.id,
        page,
      },
    });
  };

  // item.type -> the real item component
  const renderMain = () => {
    if (mode === 6) {
      return <ScrollListWithPagination arr={result} handleEnterKey={handleEnterKey} tagH={tagH} dispatch={dispatch} payload={data} toPage={toPage} />;
    } else if (mode === -1 || (item && item.type === 'ScrollList')) {
      return <ScrollListWithKeyBoard arr={result} handleEnterKey={handleEnterKey} tagH={tagH} dispatch={dispatch} payload={data} />;
    } else if (item && item.name === 'Music') {
      // <VideoPlayer />
      return <AudioPlayer />;
    } else if (item && item.type === 'Admin') {
      return <Admin />;
    } else if (item && item.type === 'Demo') {
      return <Demo />;
    } else if (item && item.type === 'PageGenerator') {
      return <PageGenerator />;
    } else if (item && item.type === 'PictureWall') {
      return <PictureWall />;
    }
  };

  // the right icon type(set at here, or at admin)
  const returnType = (mode: number) => {
    if (mode === -1) {
      return 'apps';
    } else if (item && item.type === 'Music') {
      return 'music';
    } else {
      return 'scroll-list';
    }
  };

  // if the search bar should be hidden
  const returnInputWrapperStyle = () => {
    return item && item.isSearchHidden ? { display: 'none' } : {};
  };

  return (
    <>
      <div id='inputWrapper' style={returnInputWrapperStyle()}>
        <input id='searchInput' value={value} onChange={(e) => handleChange(e)} ref={searchInput} />
        {loading ? (
          <Loading />
        ) : (
          <div className={`inputAfter type-${returnType(mode)}`} onClick={handleClick}>
            <button aria-label='搜索' type='button' className='btn searchBar-searchIcon Button--primary shake-hard'>
              <span></span>
            </button>
          </div>
        )}
      </div>
      {renderMain()}
    </>
  );
};

export default App;
