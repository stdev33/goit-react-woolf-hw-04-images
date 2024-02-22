import React from 'react';
import { TailSpin } from 'react-loader-spinner';

const Loader = ({ size, color }) => {
  return (
    <div>
      <TailSpin color={color} height={size} width={size} />
    </div>
  );
};

export default Loader;
