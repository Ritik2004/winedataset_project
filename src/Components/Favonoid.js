import { useEffect, useState } from "react";
import record from "../winedata.json";

export default function () {
  const [data, setData] = useState(record);
  const [stats, setStats] = useState({});
  useEffect(() => {
    const calculateStatistics = () => {
      const classStats = {};
      data.forEach((entry) => {
        const alcoholClass = entry.Alcohol;

        if (!classStats[alcoholClass]) {
          classStats[alcoholClass] = [];
        }

        classStats[alcoholClass].push(entry.Flavanoids);
      });

      // Calculate mean, median, and mode for each class
      const resultStats = {};
      for (const alcoholClass in classStats) {
        const classData = classStats[alcoholClass];

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

        resultStats[alcoholClass] = {
          mean,
          median,
          mode
        };
      }

      // Set the calculated stats in the state
      setStats(resultStats);
    };

    calculateStatistics();
  }, [data]);

  return (
    <div>
      <h2>Class-wise Mean, Median, and Mode of Flavanoids</h2>
      <table>
        <thead>
          <tr>
            <th>Measure</th>
            {Object.keys(stats).map((alcoholClass) => (
              <th key={alcoholClass}>Class {alcoholClass}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Flavanoids Mean</td>
            {Object.keys(stats).map((alcoholClass) => (
              <td key={alcoholClass}>{stats[alcoholClass].mean.toFixed(3)}</td>
            ))}
          </tr>
          <tr>
            <td>Flavanoids Median</td>
            {Object.keys(stats).map((alcoholClass) => (
              <td key={alcoholClass}>
                {stats[alcoholClass].median.toFixed(3)}
              </td>
            ))}
          </tr>
          <tr>
            <td>Flavanoids Mode</td>
            {Object.keys(stats).map((alcoholClass) => (
              <td key={alcoholClass}>{stats[alcoholClass].mode.toFixed(3)}</td>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  );
}
