import { useState } from 'react';
import Thermometer from './thermometer';

interface Props {
  thermometersId: string[];
  onUpdate: (id: string, x: number, y: number) => void;
}

export const THERMOMETERS_WRAPPER_ID = 'thermometers-wrapper';

const Thermometers = ({ thermometersId, onUpdate }: Props) => {
  return (
    <div id={THERMOMETERS_WRAPPER_ID}>
      {thermometersId.map((id, index) => (
        <Thermometer key={id} index={index} id={id} onUpdate={onUpdate} />
      ))}
      {/* <canvas
        id="thermometers-canvas"
        onPointerMove={(e) => {
          console.log(e);
        }}
      /> */}
    </div>
  );
};

export default Thermometers;
