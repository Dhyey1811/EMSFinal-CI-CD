// src/reportWebVitals.js
export const loadWebVitals = () =>
  import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => ({
    getCLS,
    getFID,
    getFCP,
    getLCP,
    getTTFB,
  }));

const reportWebVitals = (onPerfEntry) => {
  if (onPerfEntry && typeof onPerfEntry === 'function') {
    loadWebVitals().then((metrics) => {
      metrics.getCLS(onPerfEntry);
      metrics.getFID(onPerfEntry);
      metrics.getFCP(onPerfEntry);
      metrics.getLCP(onPerfEntry);
      metrics.getTTFB(onPerfEntry);
    });
  }
};

export default reportWebVitals;
