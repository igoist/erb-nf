import * as React from 'react';

const { useState, useEffect } = React;

const millisecondToDate = (time: number) => {
  const second = Math.floor(time % 60);
  let minite = Math.floor(time / 60);
  // let hour
  // if(minite > 60) {
  //   hour = minite / 60
  //   minite = minite % 60
  //   return `${Math.floor(hour)}:${Math.floor(minite)}:${Math.floor(second)}`
  // }
  return `${ minite }:${ second >= 10 ? second : `0${second}`}`;
};


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

interface AudioConfig {
  el: HTMLAudioElement;
  callback: (percent: number) => void;
}

class Audio {
  media: HTMLAudioElement;
  callback: (percent: number) => void;
  private intervalId: number;

  constructor(config: AudioConfig) {
    const { el, callback } = config;
    this.media = el;
    this.callback = callback;
    this.intervalId = 0;
  }

  play() {
    this.media.play();
    // 这里显示播放器播放状态UI
    console.log('Audio now is playing.');

    this.intervalId = setInterval(() => {
      this.callback(this.getCurrentTime() / this.getDuration());
    });
    console.log(this.intervalId);
  }

  pause() {
    this.media.pause();
    console.log('Audio now is paused.');
    // 这里显示播放器暂停状态UI
    clearInterval(this.intervalId);
  }

  switchLoop(value: boolean) {
    this.media.loop = value;
    console.log('Audio now loop is: ', value);
  }

  getCurrentTime() {
    return this.media.currentTime;
  }

  setCurrentTime(time: number) {
    this.media.currentTime = time;
  }

  setCurrentTimePercent(percent: number) {
    this.media.currentTime = percent * this.media.duration;
  }

  getDuration() {
    return this.media.duration;
  }
}


// interface AudioPlayerState {
//   left: string;
// }

let tmpLeft = '0px';
let tmpCurrentSongSrc = '/music/m.mp3';
// /Users/Egoist/Music/QQ音乐/Linked Horizon-暁の鎮魂歌 (拂晓的镇魂歌) (TV Size).flac
let media: (Audio | null) = null;


const returnState = () => {
  return {
    left: tmpLeft,
    currentSongSrc: tmpCurrentSongSrc,
  };
};

const AudioPlayer = () => {
  const mediaRef = React.createRef<HTMLAudioElement>();
  const scrollbarRef = React.createRef<HTMLDivElement>();

  let scrollbar: (HTMLDivElement | null) = null;

  const [state, setState] = useState(returnState());

  const handleProgress = (e: MouseEvent) => {
    console.log('handleProgress: ', scrollbarRef.current);
    console.log('handleProgress2: ', scrollbar);
    const rectScrollbar = scrollbar.getBoundingClientRect();

    let w: number = rectScrollbar.width - 10; // trick value
    let l: number = (e.pageX - 5) - rectScrollbar.left;

    l = l > w ? w : l;
    l = l < 0 ? 0 : l;

    tmpLeft = l + 'px';

    // ...
    media.setCurrentTimePercent(l / w);

    setState(returnState());
  }

  useEffect(() => {
    console.log('init');
    // console.log(mediaRef.current);
    // console.log(scrollbarRef.current);

    scrollbar = scrollbarRef.current;
    const rectScrollbar = scrollbar.getBoundingClientRect();

    media = new Audio({
      el: mediaRef.current,
      callback: (percent: number) => {
        tmpLeft = percent * (rectScrollbar.width - 10) + 'px';

        setState(returnState());
      }
    });

    bindMove({
      el: scrollbarRef.current,
      handleMove: handleProgress
    });
  }, []);

  const play = () => {
    console.log(media);
    media.play();
  }

  const pause = () => {
    media.pause();
  }

  const switchLoop = (v: boolean) => {
    media.switchLoop(v);
  }

  const getCurrentTime = () => {
    console.log('getCurrentTime: ', media.getCurrentTime());
  }

  const getDuration = () => {
    console.log('getCurrentDuration: ', media.getDuration());
  }



  return (
    <div className='video-wrap'>
      {/* <input type='file' ref={ this.mediaInput } /> */}
      {/* <video src='test.mp4' className='media' ref={ this.media } width='56' height='56'></video> */}
      {/* <audio src='https://music.163.com/song/media/outer/url?id=27705008.mp3' ref={ this.media }></audio> */}
      {/* <audio src='http://isure.stream.qqmusic.qq.com/C4000042fRqf4fC8ZB.m4a?guid=2154121214&vkey=550A8A10C779F7E544F40F1E7C91716BB364DB56FB4B4B49AA8FD38FCA34D1A4A68C94CE6C8B660E7A09DC5B915E90A95443A6DD1451A80E&uin=1476&fromtag=66' ref={ this.media }></audio> */}
      <audio src={ state.currentSongSrc } ref={ mediaRef }></audio>
      {/* <audio src='/music/u.mp3' ref={ mediaRef }></audio> */}
      <div>
        <button onClick={ () => play() }>play</button>
        <button onClick={ () => pause() }>pause</button>
        <button onClick={ () => switchLoop(true) }>turn on loop</button>
        <button onClick={ () => switchLoop(false) }>turn off loop</button>
        <button onClick={ () => getCurrentTime() }>getCurrentTime</button>
        <button onClick={() => getDuration()}>getDuration</button>


      </div>
      <div className='progress-bar' ref={ scrollbarRef }>
        <div className='picker' style={{ left: state.left }}></div>
      </div>
    </div>
  );
}



export default AudioPlayer;
