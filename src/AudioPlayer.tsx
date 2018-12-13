import * as React from 'react';


interface AudioProps {

}

// let f = () => {
//   return new Promise((resolve: any) => {
//     setTimeout(() => {
//       resolve(1);
//     }, 2000);
//   });
// }

// let foo = async () => {
//   console.time('foo');
//   let ret = await f();
//   console.timeEnd('foo');
//   console.log(ret);
// };


class Audio extends React.Component<AudioProps, {}> {
  // private mediaInput = React.createRef<HTMLInputElement>();
  private media = React.createRef<HTMLAudioElement>();
  constructor(props: AudioProps){
    super(props);
  }

  componentDidMount() {
    // foo();
    console.log(this.media.current);
  }

  play() {
    this.media.current.play();
    // 这里显示播放器播放状态UI
  }

  pause() {
    this.media.current.pause();
    // 这里显示播放器暂停状态UI
  }

  render() {
    return (
      <div className='video-wrap'>
        {/* <input type='file' ref={ this.mediaInput } /> */}
        {/* <video src='test.mp4' className='media' ref={ this.media } width='56' height='56'></video> */}
        <audio src='https://music.163.com/song/media/outer/url?id=27705008.mp3' ref={ this.media }></audio>
        <div>
          <button onClick={ () => this.play() }>play</button>
          <button onClick={ () => this.pause() }>pause</button>
        </div>
      </div>
    );
  }
}

export default Audio;
