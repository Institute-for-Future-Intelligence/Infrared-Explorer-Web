import { ConfigProvider, Slider } from 'antd';
import playButton from '../../../assets/play-button.svg';
import pauseButton from '../../../assets/pause-button.svg';

interface Props {
  isPlaying: boolean;
  currFrameIndex: number;
  lastFrameIndex: number;
  onClickPlayButton: () => void;
  onSlide: (n: number) => void;
}
const ControlBar = ({ isPlaying, currFrameIndex, lastFrameIndex, onClickPlayButton, onSlide }: Props) => {
  const toTime = (n: number | undefined) => {
    if (n === undefined) return '00:00/00:00';
    const time = Math.round(n * 0.2);
    const minutes = Math.floor(time / 60);
    const secondes = Math.floor(time % 60);
    return `${minutes < 10 ? 0 : ''}${minutes}:${secondes < 10 ? 0 : ''}${secondes}`;
  };

  return (
    <div className="control-bar">
      <div className="button-wrapper" onClick={onClickPlayButton}>
        {isPlaying ? <img src={pauseButton} /> : <img src={playButton} />}
      </div>

      <span style={{ color: 'white', margin: '0 8px' }}>
        {toTime(currFrameIndex)}/{toTime(lastFrameIndex)}
      </span>
      <ConfigProvider
        theme={{
          components: {
            Slider: {
              railBg: 'grey',
              railHoverBg: 'white',
            },
          },
        }}
      >
        <Slider
          className="slider"
          value={currFrameIndex}
          max={lastFrameIndex}
          onChange={onSlide}
          tooltip={{
            formatter: toTime,
          }}
        />
      </ConfigProvider>
    </div>
  );
};

export default ControlBar;
