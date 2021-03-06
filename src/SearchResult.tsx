import * as React from 'react';
import * as util from '@Utils';
import { SearchResultProps, SearchResultState } from './Types';

const { scroll2 } = util;
const scroll = scroll2;

class SearchResult extends React.Component<SearchResultProps, SearchResultState> {
  constructor(props: SearchResultProps) {
    super(props);
    this.state = {
      targetIndex: 0,
      current: 0
    };
  }

  handleKeyDown = (e: any) => {
    // console.log('The key code is: ' + e.keyCode);

    if ((e.keyCode === 74 && e.ctrlKey) || e.keyCode === 40) {
      this.setState((state: SearchResultState, props: SearchResultProps) => {
        const newTargetIndex = state.targetIndex + 1 > props.arr.length - 1 ? state.targetIndex : state.targetIndex + 1;
        return {
          targetIndex: newTargetIndex,
          current: scroll.returnCurrent(this.state.current, newTargetIndex)
        };
      });
    }

    if ((e.keyCode === 75 && e.ctrlKey) || e.keyCode === 38) {
      this.setState((state: SearchResultState) => {
        const newTargetIndex = state.targetIndex > 0 ? state.targetIndex - 1 : 0;
        return {
          targetIndex: newTargetIndex,
          current: scroll.returnCurrent(this.state.current, newTargetIndex)
        };
      });
    }

    // 因为是全局绑定的 keydown，输入文字会有问题
    if (e.keyCode === 13) {
      if (this.props.arr.length) {
        console.log(this.state);
        // const item = this.props.originData[this.props.arr[this.state.targetIndex].originalIndex];
        // console.log(item.date, item.link);
        // this.props.handleEnterKey(item);

        this.handleItem(this.state.targetIndex);
      }
    }
  };

  componentDidMount() {
    window.addEventListener('keydown', this.handleKeyDown);
  }

  componentWillUnmount() {
    window.removeEventListener('keydown', this.handleKeyDown);
  }

  componentDidUpdate(prevProps: SearchResultProps) {
    if (prevProps.value !== this.props.value) {
      this.setState({
        targetIndex: 0,
        current: 0
      });
    } else {
      let item = document.querySelector('li.selected');
      // 触发时间需要调整 写给函数专门进行判断
      if (item) {
        let searchResult = document.getElementById('searchResult');
        // searchResult.scrollTop = parseInt(56 * this.state.current);
        searchResult.scrollTop = 56 * this.state.current;
      }
    }
  }

  handleItem(index: number) {
    const { handleEnterKey } = this.props;

    handleEnterKey(index);

    this.setState({
      targetIndex: index,
      current: scroll.returnCurrent(this.state.current, index)
    });
  }

  render() {
    const { targetIndex } = this.state;
    const { arr } = this.props;

    console.log(targetIndex, this.state.current);

    return (
      <ul id='searchResult'>
        {arr.map((item, i) => {
          item.index = i;
          return (
            <li
              key={i.toString()}
              className={targetIndex === i ? 'selected' : ''}
              onClick={() => this.handleItem(i)}
              dangerouslySetInnerHTML={{ __html: item.colored }}
            ></li>
          );
        })}
      </ul>
    );
  }
}

export default SearchResult;
