import { CartesianGrid, Label, ResponsiveContainer, Scatter, ScatterChart, Tooltip, XAxis, YAxis } from 'recharts';
import useCommonStore from '../../../stores/common';
import { CHART_MARGIN } from '../../../utils/constants';

interface Props {
  type: 'X' | 'Y';
  thermometersId: string[];
}

const ScatterPlot = ({ thermometersId, type }: Props) => {
  const thermometerMap = useCommonStore((state) => state.thermometerMap);

  const data = thermometersId
    .map((id) => {
      const thermometer = thermometerMap.get(id);
      if (!thermometer) return { x: -1, y: 0 };
      if (type === 'X') {
        return { x: thermometer.x, y: thermometer.value };
      } else {
        return { x: 1 - thermometer.y, y: thermometer.value };
      }
    })
    .filter((d) => d.x !== -1);

  const unit = '°C';
  const labelText = type === 'X' ? 'Width' : 'Height';

  return (
    <div className="chart-container">
      <ResponsiveContainer width="100%" height={'100%'}>
        <ScatterChart margin={CHART_MARGIN}>
          <CartesianGrid />

          <XAxis dataKey="x" name="X" type="number" domain={[0, 1]} allowDataOverflow={true}>
            <Label value={`${type} (Image ${labelText})`} offset={-5} position="bottom" />
          </XAxis>
          <YAxis dataKey="y" name="T" type="number">
            <Label value={`T (${unit})`} angle={-90} position={'center'} dx={-5} />
          </YAxis>

          <Tooltip
            formatter={(v: number, name: string, prop) => {
              if (prop.dataKey === 'x') {
                return v.toFixed(3);
              } else {
                return v.toFixed(2) + unit;
              }
            }}
          />

          <Scatter isAnimationActive={false} data={data} fill="#8884d8" line shape="cross" />
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ScatterPlot;
