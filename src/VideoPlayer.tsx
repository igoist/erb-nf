import * as React from 'react';


interface VideoPlayerProps {

}

class VideoPlayer extends React.Component<{}, {}> {
  // private mediaInput = React.createRef<HTMLInputElement>();
  private media = React.createRef<HTMLVideoElement>();
  constructor(props: any){
    // 首先获取到媒体对象，指代 video 元素本身，下文所有video元素都以此代替。
    // this.media = document.querySelector('.J_kpMedia');
    super(props);
  }

  componentDidMount() {
    // this.mediaInput.current.addEventListener('change', () => {
    //   console.log(this.mediaInput.current.files);
    // });
  }

  // 然后是 play 和 pause 方法。
  play() {
    // 执行原生play()方法
    this.media.current.play();
    // 这里显示播放器播放状态UI
  }

  pause() {
    // 执行原生pause()方法
    this.media.current.pause();
    // 这里显示播放器暂停状态UI
  }

  render() {
    return (
      <div className='video-wrap'>
        {/* <input type='file' ref={ this.mediaInput } /> */}
        {/* <video src='test.mp4' className='media' ref={ this.media } width='56' height='56'></video> */}
        <video src='test.mp4' className='media' ref={ this.media } width='56' height='56'></video>
        <div className='control-group'>
          <button onClick={ () => this.play() }>play</button>
          <button onClick={ () => this.pause() }>pause</button>
        </div>
      </div>
    );
  }
}

export default VideoPlayer;
