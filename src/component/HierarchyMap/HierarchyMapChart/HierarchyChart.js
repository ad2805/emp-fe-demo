import React, { useEffect } from 'react';
import * as echarts from 'echarts';

const TreeChart = ({ chartData }) => {
  useEffect(() => {
    if (chartData) {
      const chart = echarts.init(document.getElementById('chart'));
      const option = {
        tooltip: {
          trigger: 'item',
          triggerOn: 'mousemove'
        },
        series: [
          {
            type: 'tree',
            id: 0,
            name: 'tree1',
            data: [chartData],
            top: '10%',
            left: '8%',
            bottom: '22%',
            right: '20%',
            symbolSize: 7,
            edgeShape: 'polyline',
            edgeForkPosition: '63%',
            initialTreeDepth: 3,
            lineStyle: {
              width: 2
            },
            label: {
              backgroundColor: '#fff',
              position: 'left',
              verticalAlign: 'middle',
              align: 'right',
              fontWeight: 'bold'
            },
            leaves: {
              label: {
                position: 'right',
                verticalAlign: 'middle',
                align: 'left',
                fontWeight: 'bold'
              }
            },
            emphasis: {
              focus: 'descendant'
            },
            expandAndCollapse: true,
            animationDuration: 550,
            animationDurationUpdate: 750
          }
        ]
      };
      chart.setOption(option);
    }
  }, [chartData]);

  return <div id="chart" style={{ width: '100%', height: '600px' }} />;
};

export default TreeChart;
