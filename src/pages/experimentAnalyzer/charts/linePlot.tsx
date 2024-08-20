import {
  CartesianGrid,
  Label,
  Legend,
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { CHART_MARGIN, PRESET_COLORS } from '../../../utils/constants';
import useCommonStore from '../../../stores/common';
import { Thermometer } from '../../../types';
import React, { useEffect, useState } from 'react';
import { getTemperatureAtPosition } from '../../../utils/temperatureReader';

const unit = '°C';

interface WrapperProps {
  thermometersId: string[];
  thermoArrayBufferData: ArrayBuffer[];
  step: number;
  currFrameIndex: number;
  updateFrame: (index: number) => void;
}

interface Props {
  thermometers: Thermometer[];
  thermoArrayBufferData: ArrayBuffer[];
  step: number;
  currFrameIndex: number;
  updateFrame: (index: number) => void;
}

const Wrapper = ({ thermometersId, thermoArrayBufferData, step, currFrameIndex, updateFrame }: WrapperProps) => {
  const thermometerMap = useCommonStore((state) => state.thermometerMap);
  const thermometers = thermometersId.map((id) => thermometerMap.get(id)).filter((v) => v !== undefined);
  return (
    <LinePlot
      thermometers={thermometers}
      thermoArrayBufferData={thermoArrayBufferData}
      step={step}
      currFrameIndex={currFrameIndex}
      updateFrame={updateFrame}
    />
  );
};

const LinePlot = React.memo(
  ({ thermometers, thermoArrayBufferData, step, currFrameIndex, updateFrame }: Props) => {
    const [data, setData] = useState<any>(null);

    const init = async () => {
      const data: any = [];
      thermoArrayBufferData.forEach((arrayBuffer, index) => {
        const frameData = { time: (index * step * 0.2).toFixed(1) } as any;
        thermometers.forEach((thermometer, index) => {
          frameData[`T${index}`] = getTemperatureAtPosition(arrayBuffer, thermometer.x, thermometer.y);
        });
        data.push(frameData);
      });
      setData(data);
    };

    useEffect(() => {
      init();
    }, [thermometers, thermoArrayBufferData]);

    let refX = '0.0';
    if (data) {
      const index = data.map((d: any) => d.time).findIndex((t: string) => currFrameIndex / 5 < Number(t));
      if (index !== -1) {
        refX = data[index - 1].time;
      } else {
        refX = data[data.length - 1].time;
      }
    }

    return (
      <div className="chart-container">
        <ResponsiveContainer width="100%" height={'100%'}>
          <LineChart
            width={500}
            height={300}
            data={data}
            margin={CHART_MARGIN}
            onMouseDown={(data) => {
              if (data.activeLabel) {
                updateFrame(Number(data.activeLabel) * 5);
              }
            }}
          >
            <CartesianGrid />

            <XAxis dataKey="time">
              <Label value={'Time (Second)'} offset={-5} position="bottom" />
            </XAxis>

            <YAxis>
              <Label value={`T (${unit})`} angle={-90} position={'center'} dx={-5} />
            </YAxis>

            <ReferenceLine x={refX} stroke="orange" strokeWidth={2} />

            <Tooltip />

            {data &&
              thermometers.map((value, i) => {
                return (
                  <Line key={i} type="monotone" dataKey={`T${i}`} stroke={PRESET_COLORS[i]} isAnimationActive={false} />
                );
              })}
          </LineChart>
        </ResponsiveContainer>
      </div>
    );
  },
  (prev, next) => {
    if (prev.currFrameIndex !== next.currFrameIndex) return false;
    if (prev.thermoArrayBufferData !== next.thermoArrayBufferData) return false;
    if (prev.thermometers.length !== next.thermometers.length) return false;
    for (let i = 0; i < prev.thermometers.length; i++) {
      const pt = prev.thermometers[i];
      const nt = next.thermometers[i];
      if (pt.x !== nt.x || pt.y !== nt.y) return false;
    }
    return true;
  },
);

export default Wrapper;
