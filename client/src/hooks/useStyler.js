import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const color = '#eaeff3';
let initStyleValue = {};

export const useStyler = (elements) => {
  for (let el of elements) {
    initStyleValue[el.style] = 'white';
  }

  const location = useLocation();
  const [style, setStyle] = useState(initStyleValue);

  const resetStyle = () => {
    setStyle(() => initStyleValue);
  };
  const styleHandler = () => {
    const path = location.pathname.substring(1);
    setStyle((values) => ({ ...values, [path]: color }));
  };

  useEffect(() => {
    resetStyle();
    styleHandler();
  }, [location]);

  return [style];
};
