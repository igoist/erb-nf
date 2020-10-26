import * as React from 'react';
import { ipcRenderer, remote } from 'electron';
import { fuzzyMatch2 } from '@Utils';
// import SearchResult from './SearchResult';
import AudioPlayer from './AudioPlayer';
import VideoPlayer from './VideoPlayer';
// import { ListItemInterface, AppState } from './Interfaces';
import { AppHook, AppArr } from '@Models';
import { useDebounceFn } from 'ahooks';
import { ScrollList } from '@Components';

import { PictureWall, Admin } from './pages';

const { useEffect, useRef } = React;

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

const App = () => {
  const searchInput = useRef(null);
  const tt = AppHook.useContainer();
  const { value, data, loading, result, mode, dispatch, setMode } = tt;

  const handleFuzzy = (v: string) => {
    let ret = v === '' ? [] : fuzzyList(value, data.list, data.mode);

    dispatch({
      type: 'saveResult',
      payload: {
        result: ret
      }
    });
  };

  const { run } = useDebounceFn(handleFuzzy, {
    wait: 300
  });

  const handleChange = (event: any) => {
    dispatch({
      type: 'save',
      payload: {
        value: event.target.value
      }
    });

    run(event.target.value.trim());
  };

  const handleClick = () => {
    dispatch({
      type: 'toModeZero'
    });
  };

  const handleEnterKey = (index: number) => {
    const item = result[index];

    if (mode === 0) {
      setMode(item.mode);
    } else if (mode === 5) {
      dispatch({
        type: 'toV2Node',
        payload: {
          id: item.id
        }
      });
    } else {
      console.log(data.list[item.originalIndex].title);
      console.log(data.list[item.originalIndex].link || data.list[item.originalIndex].url);

      if (data.list[item.originalIndex].link) {
        ipcRenderer.send('open-tab', { link: data.list[item.originalIndex].link });
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

      dispatch({
        type: 'toModeZero'
      });
    };

    ipcRenderer.on('mode-change', handleMC);

    const handleKeyDown = (e: any) => {
      if (((e.keyCode === 74 && e.ctrlKey) || e.keyCode === 40) && value === '') {
        if (result.length !== data.list.length) {
          dispatch({
            type: 'saveResult',
            payload: {
              result: transformData(data.list, mode),
              from: 'handleKeyDown'
            }
          });
        }
      }
      if (e.keyCode === 27 && value === '' && result.length > 0) {
        dispatch({
          type: 'saveBoth',
          payload: {
            value: '',
            result: [],
            from: 'handleKeyDown'
          }
        });
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      ipcRenderer.removeListener('mode-change', handleMC);
      window.removeEventListener('keydown', handleKeyDown);
    };
  });

  useEffect(() => {
    ipcRenderer.on('foucs-toggle', () => {
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

  if (mode === 3) {
    ipcRenderer.send('change-win', { listHeight: 1 });
  } else if (mode === 8 || mode === 9) {
    ipcRenderer.send('change-win', { listHeight: 10 });
  } else {
    ipcRenderer.send('change-win', {
      listHeight: tagH
    });
  }

  return (
    <>
      <div id='inputWrapper'>
        <input id='searchInput' value={value} onChange={(e) => handleChange(e)} ref={searchInput} />
        {loading ? (
          <Loading />
        ) : (
          <div className={`inputAfter mode-${mode}`} onClick={handleClick}>
            <button aria-label='搜索' type='button' className='btn searchBar-searchIcon Button--primary shake-hard'>
              <span></span>
            </button>
          </div>
        )}
      </div>
      {(mode === 0 || mode === 1 || mode === 2 || mode === 4 || mode === 5 || mode === 6 || mode === 7) && (
        <ScrollList arr={result} handleEnterKey={handleEnterKey} tagH={tagH} dispatch={dispatch} payload={data} />
      )}
      {mode === 3 && (
        // <VideoPlayer />
        <AudioPlayer />
      )}
      {mode === 8 && <PictureWall />}
      {mode === 9 && <Admin />}
    </>
  );
};

export default App;
