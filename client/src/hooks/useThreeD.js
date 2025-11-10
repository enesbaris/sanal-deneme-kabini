// client/src/hooks/useThreeD.js
import { useContext } from 'react';
import { ThreeDContext } from '../context/ThreeDContext';

export const useThreeD = () => {
  const context = useContext(ThreeDContext);
  if (!context) {
    throw new Error('useThreeD must be used within a ThreeDProvider');
  }
  return context;
};