import * as React from 'react';
import { ipcRenderer, remote } from 'electron';
import { fuzzyMatch2 } from './util/';
import SearchResult from './SearchResult';
import AudioPlayer from './AudioPlayer';
import VideoPlayer from './VideoPlayer';
import { ListItemInterface, AppState } from './Interfaces';

const { useState, useEffect, useRef } = React;

const originData: Array<ListItemInterface> = remote.getGlobal('sharedObject').originData;
const { fuzzyList } = fuzzyMatch2;

const AppArr: any = [
  {
    name: 'Apps',
    mode: 0
  },
  {
    name: 'Search',
    mode: 1
  },
  {
    name: 'Music',
    mode: 2
  }
];

const handleSwitch = (mode: number) => {
  switch (mode) {
    case 0:
      return {
        mode,
        data: AppArr
      };
    case 1:
      return {
        mode,
        data: originData
      };
    default:
      return {
        mode,
        data: originData
      };
  }
}

const handleModeChange = (mode: number) => {
  let newMode = mode + 1;
  if (newMode === AppArr.length) {
    newMode = 0;
  }
  return handleSwitch(newMode);
};

const App = () => {
  const searchInput = useRef(null);
  const [value, setValue] = useState('');
  const [data, setData] = useState(AppArr);
  const [result, setResult] = useState([]);
  const [mode, setMode] = useState(0);

  const handleChange = (event: any) => {
    let ret = event.target.value.trim() === '' ? [] : fuzzyList(event.target.value, data, mode);
    setValue(event.target.value);
    setResult(ret);
  }

  const handleClick = () => {
    // !!! Type
    console.log('current: ', mode, typeof mode);
    const handled = handleModeChange(mode);
    console.log('enter handleClick', handled);
    setData(handled.data);
    setMode(handled.mode);
  }

  const handleState = (mode: number) => {
    let tmp: any = handleSwitch(mode);
    tmp.value = '';
    tmp.result = [];
  }

  useEffect(() => {
    const s = () => {
      console.log('sss: ', mode, value);
    }
    ipcRenderer.on('mode-change', (event: any, arg: any) => {
      // const handled = handleModeChange(mode);
      // setData(handled.data);
      // setMode(handled.mode);
      s();
    });

    ipcRenderer.on('foucs-toggle', () => {
      console.log(searchInput);
      if (searchInput.current === document.activeElement) {
        searchInput.current.blur();
      } else {
        searchInput.current.focus();
      }
    });
  }, []);

  if (mode !== (AppArr.length - 1)) {
    ipcRenderer.send('change-win', { listHeight: result.length > 10 ? 10 : result.length });
    console.log(result.length, value);
  } else {
    ipcRenderer.send('change-win', { listHeight: 1 });
  }

  return (
    <div>
      <div id='inputWrapper'>
        <input id='searchInput' value={ value } onChange={ handleChange } ref={ searchInput } />
        <div className={ `inputAfter mode-${ mode }` } onClick={ handleClick }>
          <button aria-label='搜索' type='button' className='btn searchBar-searchIcon Button--primary'>
            <span></span>
          </button>
        </div>
      </div>
      {
        mode !== (AppArr.length - 1) ? (
          <SearchResult
            value={ value }
            arr={ result }
            originData={ data }
            mode={ mode }
            handleState={ handleState }
          />
        ) : (
          <VideoPlayer />
          // <AudioPlayer />
        )
      }
    </div>
  );
};


class AppO extends React.Component<{}, AppState> {
  private searchInput = React.createRef<HTMLInputElement>();

  constructor(props: {}) {
    super(props);
    this.state = {
      value: '',
      data: [],
      result: [],
      mode: 0
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.handleState = this.handleState.bind(this);
  }

  componentDidMount() {
    this.setState({
      data: AppArr
    });

    ipcRenderer.on('mode-change', (event: any, arg: any) => {
      // const notification = {
      //   title: 'Notification with image',
      //   body: 'Short message plus a custom image',
      //   icon: './img/programming.png'//path.join(__dirname, './public/img/programming.png')
      // };
      // const myNotification = new window.Notification(notification.title, notification);

      this.setState((state: AppState) => handleModeChange(state.mode));
    });

    ipcRenderer.on('foucs-toggle', () => {
      console.log(this.searchInput);
      if (this.searchInput.current === document.activeElement) {
        this.searchInput.current.blur();
      } else {
        this.searchInput.current.focus();
      }
    });
  }

  handleChange(event: any) {
    const { data, mode } = this.state;
    let ret = event.target.value.trim() === '' ? [] : fuzzyList(event.target.value, data, mode);

    this.setState({
      value: event.target.value,
      result: ret
    });
  }

  handleClick() {
    this.setState((state: AppState) => handleModeChange(state.mode));
  }

  handleState(mode: number) {
    let tmp: any;
    tmp = handleSwitch(mode);
    tmp.value = '';
    tmp.result = [];
    this.setState(tmp);
  }

  render() {
    const { value, data, result, mode } = this.state;
    const arr = result;
    if (mode !== (AppArr.length - 1)) {
      ipcRenderer.send('change-win', { listHeight: arr.length > 10 ? 10 : arr.length });
      console.log(arr.length, value);
    } else {
      ipcRenderer.send('change-win', { listHeight: 1 });
    }

    return (
      <div>
        <div id='inputWrapper'>
          <input id='searchInput' value={ value } onChange={ this.handleChange } ref={ this.searchInput } />
          <div className={ `inputAfter mode-${ mode }` } onClick={ this.handleClick }>
            <button aria-label='搜索' type='button' className='btn searchBar-searchIcon Button--primary'>
              <span></span>
            </button>
          </div>
        </div>
        {
          mode !== (AppArr.length - 1) ? (
            <SearchResult
              value={ value }
              arr={ arr }
              originData={ data }
              mode={ mode }
              handleState={ this.handleState }
            />
          ) : (
            <VideoPlayer />
            // <AudioPlayer />
          )
        }
      </div>
    );
  }
}

export default App;
