// import * as React from "react";

// export interface AppProps {
//   compiler: string;
//   framework: string;
// }

// export const App = (props: AppProps) => <h1>Hello2222 from { props.compiler } and { props.framework }!</h1>;


import * as React from 'react';
import { ipcRenderer, remote } from 'electron';
import { fuzzyMatch } from './util/';
import SearchResult from './SearchResult';

const originData = remote.getGlobal('sharedObject').originData;

class App extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      value: '',
      data: [],
      result: [],
      mode: 0
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }

  componentDidMount() {
    this.setState({
      data: originData
    });

    ipcRenderer.on('mode-change', (event: any, arg: any) => {
      // const notification = {
      //   title: 'Notification with image',
      //   body: 'Short message plus a custom image',
      //   icon: './img/programming.png'//path.join(__dirname, './public/img/programming.png')
      // };
      // const myNotification = new window.Notification(notification.title, notification);

      this.setState((state: any) => {
        return {
          mode: state.mode === 0 ? 1 : 0
        };
      });
    });
  }

  handleChange(event: any) {
    // console.log(event.target.value);
    let ret = event.target.value.trim() === '' ? [] : fuzzyMatch.fuzzyList(event.target.value, originData, this.state.mode);
    // console.log(ret);
    // console.log(ret.length);
    this.setState({
      value: event.target.value,
      result: ret
    });
  }

  handleClick() {
    this.setState((state: any) => {
      return {
        mode: state.mode === 0 ? 1 : 0
      };
    });
  }

  render() {
    const { value, result, mode } = this.state;
    const arr = result;
    ipcRenderer.send('change-win', { listHeight: arr.length > 10 ? 10 : arr.length });
    console.log(arr.length, value);

    return (
      <div>
        <div id='inputWrapper'>
          <input id='searchInput' value={ value } onChange={ this.handleChange } />
          <div className={ `inputAfter ${ mode === 0 ? '' : 'toggle' }`} onClick={ this.handleClick }>
            <button aria-label='搜索' type='button' className='btn searchBar-searchIcon Button--primary'>
              <span></span>
            </button>
          </div>
        </div>
        <SearchResult value={ value } arr={ arr } originData={ originData } />
      </div>
    );
  }
}

export default App;
