import { ExperimentGraphOption } from '../../../types';
import LinePlot from './linePlot';
import ScatterPlot from './scatterPlot';

interface Props {
  thermometersId: string[];
  thermoArrayBufferData: ArrayBuffer[] | null;
  step: number;
  updateFrame: (index: number) => void;
  currFrameIndex: number;
  graphsOptions: ExperimentGraphOption[] | undefined;
}

const ChartManager = ({
  thermometersId,
  thermoArrayBufferData,
  step,
  currFrameIndex,
  graphsOptions,
  updateFrame,
}: Props) => {
  if (!graphsOptions || graphsOptions.length === 0) return null;

  return (
    <>
      {graphsOptions.map((option, idx) => {
        switch (option) {
          case ExperimentGraphOption.time: {
            if (!thermoArrayBufferData) return null;

            return (
              <LinePlot
                thermometersId={thermometersId}
                thermoArrayBufferData={thermoArrayBufferData}
                step={step}
                currFrameIndex={currFrameIndex}
                updateFrame={updateFrame}
                key={idx}
              />
            );
          }
          case ExperimentGraphOption.spaceX: {
            return <ScatterPlot key={idx} thermometersId={thermometersId} type="X" />;
          }
          case ExperimentGraphOption.spaceY: {
            return <ScatterPlot key={idx} thermometersId={thermometersId} type="Y" />;
          }
        }
      })}
    </>
  );
};

export default ChartManager;
