import { useEffect, useRef, useState } from 'react';
import ThermometerSVG from '../../../assets/thermometer.svg?react';
import Draggable, { ControlPosition, DraggableData, DraggableEvent } from 'react-draggable';
import React from 'react';
import { TemperatureUnit, Thermometer } from '../../../types';
import useCommonStore from '../../../stores/common';

interface WrapperProps {
  id: string;
  index: number;
  onUpdate: (id: string, x: number, y: number) => void;
}

interface ComponentProps {
  index: number;
  thermometer: Thermometer;
  onUpdate: (id: string, x: number, y: number) => void;
}

const Wrapper = ({ id, index, onUpdate }: WrapperProps) => {
  const thermometer = useCommonStore((state) => state.thermometerMap.get(id));
  if (!thermometer) return null;
  return <ThermometerComponent index={index} thermometer={thermometer} onUpdate={onUpdate} />;
};

const ThermometerComponent = ({ thermometer, index, onUpdate }: ComponentProps) => {
  const { id, x, y, value, unit } = thermometer;

  const selected = false;
  const [hovered, setHovered] = useState(false);
  const [defaultPosition, setDefaultPosition] = useState<ControlPosition | null>(null);

  // bypass warning: https://github.com/react-grid-layout/react-draggable/issues/749
  const nodeRef = React.useRef(null);

  const wrapperRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    // wait for layout finsh
    setTimeout(() => {
      wrapperRef.current = document.getElementById('thermometers-wrapper');
      if (wrapperRef.current) {
        setDefaultPosition({ x: x * wrapperRef.current.clientWidth, y: y * wrapperRef.current.clientHeight });
      }
    }, 200);
  }, []);

  if (!defaultPosition) return null;

  const unitText = unit === TemperatureUnit.celsius ? 'C' : 'F';

  const getColor = () => {
    if (hovered) {
      return 'rgba(0,140,140,1)';
    } else if (selected) {
      return 'yellow';
    } else {
      return 'white';
    }
  };

  const onPointerEnter = () => setHovered(true);
  const onPointerLeave = () => setHovered(false);

  const onDragStop = (e: DraggableEvent, data: DraggableData) => {
    if (wrapperRef.current) {
      const wrapper = wrapperRef.current;
      const x = data.x / wrapper.clientWidth;
      const y = data.y / wrapper.clientHeight;
      onUpdate(id, x, y);
    }
  };

  return (
    <Draggable nodeRef={nodeRef} defaultPosition={defaultPosition} bounds={'parent'} onStop={onDragStop}>
      <div ref={nodeRef} className="draggable-div" onPointerEnter={onPointerEnter} onPointerLeave={onPointerLeave}>
        <div className="thermometer-component">
          <ThermometerSVG className="thermometer-svg" style={{ fill: getColor() }} />
          <span
            className="thermometer-text"
            style={{ color: getColor() }}
          >{`T${index}: ${value.toFixed(2)}° ${unitText}`}</span>
        </div>
      </div>
    </Draggable>
  );
};

export default Wrapper;
