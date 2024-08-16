import ScatterPlot from './scatterPlot';

interface Props {
  thermometersId: string[];
}

const ChartManager = ({ thermometersId }: Props) => {
  return (
    <>
      <ScatterPlot thermometersId={thermometersId} type="X" />
      <ScatterPlot thermometersId={thermometersId} type="Y" />
    </>
  );
};

export default ChartManager;
