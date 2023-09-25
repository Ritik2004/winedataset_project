import { useEffect, useState } from "react";
import record from "../winedata.json";

export default function () {
  const [data, setData] = useState(record);
  const [gammaStats, setGammaStats] = useState({}); // Store calculated stats here

  useEffect(() => {
    // Assuming you have already loaded the dataset into the 'data' state

    // Calculate "Gamma" for each data point and group by "Alcohol" class
    const calculateGamma = () => {
      const classGamma = {};

      data.forEach((entry) => {
        const alcoholClass = entry.Alcohol;
        const gamma = (entry.Ash * entry.Hue) / entry.Magnesium;

        if (!classGamma[alcoholClass]) {
          classGamma[alcoholClass] = [];
        }

        classGamma[alcoholClass].push(gamma);
      });

      // Calculate mean, median, and mode for "Gamma" for each class
      const resultGammaStats = {};
      for (const alcoholClass in classGamma) {
        const classData = classGamma[alcoholClass];

        // Calculate Mean
        const mean =
          classData.reduce((acc, value) => acc + parseFloat(value), 0) /
          classData.length;

        // Calculate Median
        const sortedData = [...classData].sort((a, b) => a - b);
        let median;
        if (sortedData.length % 2 === 0) {
          const mid1 = sortedData[sortedData.length / 2 - 1];
          const mid2 = sortedData[sortedData.length / 2];
          median = (mid1 + mid2) / 2;
        } else {
          median = sortedData[(sortedData.length - 1) / 2];
        }

        // Calculate Mode
        const modeMap = {};
        let maxCount = 0;
        let mode;
        classData.forEach((value) => {
          if (!modeMap[value]) {
            modeMap[value] = 1;
          } else {
            modeMap[value]++;
          }

          if (modeMap[value] > maxCount) {
            maxCount = modeMap[value];
            mode = value;
          }
        });

        resultGammaStats[alcoholClass] = {
          mean,
          median,
          mode
        };
      }

      // Set the calculated Gamma stats in the state
      setGammaStats(resultGammaStats);
    };

    calculateGamma();
  }, [data]);

  return (
    <div>
      <h2>Class-wise Mean, Median, and Mode of Gamma</h2>
      <table>
        <thead>
          <tr>
            <th>Measure</th>
            {Object.keys(gammaStats).map((alcoholClass) => (
              <th key={alcoholClass}>Class {alcoholClass}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Gamma Mean</td>
            {Object.keys(gammaStats).map((alcoholClass) => (
              <td key={alcoholClass}>
                {gammaStats[alcoholClass].mean.toFixed(3)}
              </td>
            ))}
          </tr>
          <tr>
            <td>Gamma Median</td>
            {Object.keys(gammaStats).map((alcoholClass) => (
              <td key={alcoholClass}>
                {gammaStats[alcoholClass].median.toFixed(3)}
              </td>
            ))}
          </tr>
          <tr>
            <td>Gamma Mode</td>
            {Object.keys(gammaStats).map((alcoholClass) => (
              <td key={alcoholClass}>
                {gammaStats[alcoholClass].mode.toFixed(3)}
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  );
}
