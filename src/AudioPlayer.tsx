import * as React from 'react';


interface AudioProps {

}

interface BindMoveConfig {
  el: any;
  handleMove: any;
}

const bindMove = (config: BindMoveConfig) => {
  const { el, handleMove } = config;

  el.addEventListener('mousedown', (e: MouseEvent) => {
    handleMove(e);

    document.addEventListener('mousemove', handleMove);

    const mouseUp = (e: MouseEvent) => {
      document.removeEventListener('mousemove', handleMove);
      el.removeEventListener('mouseup', mouseUp);
    };

    document.addEventListener('mouseup', mouseUp);
  });
};


interface AudioState {
  left: string;
}

class Audio extends React.Component<AudioProps, AudioState> {
  // private mediaInput = React.createRef<HTMLInputElement>();
  private media = React.createRef<HTMLAudioElement>();
  private scrollbarRef = React.createRef<HTMLDivElement>();

  constructor(props: AudioProps){
    super(props);
    this.state = {
      left: '0px'
    };
  }

  componentDidMount() {
    // foo();
    console.log(this.media.current);
    console.log(this.scrollbarRef.current);

    bindMove({
      el: this.scrollbarRef.current,
      handleMove: this.handleProgress
    });
  }

  handleProgress(e: MouseEvent) {
    console.log('handleProgress: ');
    console.log(this.scrollbarRef.current);
    // 这边很尴尬，this bindEvent 定义在外边，this 无法获取到 scrollbarRef
    const scrollbar = this.scrollbarRef.current;
    const rectScrollbar = scrollbar.getBoundingClientRect();

    let w: number = rectScrollbar.width - 10; // trick value
    let l: number = (e.pageX - 5) - rectScrollbar.left;

    l = l > w ? w : l;
    l = l < 0 ? 0 : l;

    this.setState({
      left: l + 'px'
    });
  }

  play() {
    this.media.current.play();
    // 这里显示播放器播放状态UI
  }

  pause() {
    this.media.current.pause();
    // 这里显示播放器暂停状态UI
  }

  switchLoop(value: boolean) {
    this.media.current.loop = value;
  }

  render() {
    return (
      <div className='video-wrap'>
        {/* <input type='file' ref={ this.mediaInput } /> */}
        {/* <video src='test.mp4' className='media' ref={ this.media } width='56' height='56'></video> */}
        {/* <audio src='https://music.163.com/song/media/outer/url?id=27705008.mp3' ref={ this.media }></audio> */}
        {/* <audio src='http://isure.stream.qqmusic.qq.com/C4000042fRqf4fC8ZB.m4a?guid=2154121214&vkey=550A8A10C779F7E544F40F1E7C91716BB364DB56FB4B4B49AA8FD38FCA34D1A4A68C94CE6C8B660E7A09DC5B915E90A95443A6DD1451A80E&uin=1476&fromtag=66' ref={ this.media }></audio> */}
        <audio src='/music/m.mp3' ref={ this.media }></audio>
        {/* <audio src='/music/u.mp3' ref={ this.media }></audio> */}
        <div>
          <button onClick={ () => this.play() }>play</button>
          <button onClick={ () => this.pause() }>pause</button>
          <button onClick={ () => this.switchLoop(true) }>loop</button>
          <button onClick={ () => this.switchLoop(false) }>turn off loop</button>
        </div>
        <div className='progress-bar' ref={ this.scrollbarRef }>
          <div className='picker' style={{ left: this.state.left }}></div>
        </div>
      </div>
    );
  }
}

export default Audio;
