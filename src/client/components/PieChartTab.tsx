import React, { useState } from 'react';
import Grid from '@mui/material/Grid';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import PieChart from './PieChart';

const PieChartTab = ({ pieChartData, totalSpentData }): JSX.Element => {
  const [currentTab, setCurrentTab] = useState<0 | 1>(0);

  const handleChange = (e, newTab) => {
    setCurrentTab(newTab);
  };

  return (
    <>
      <Tabs
        value={currentTab}
        onChange={handleChange}
        sx={{ width: { xs: 400, md: 300, lg: 300, xl: 450 } }}
      >
        <Tab label="Monthly Budget" />
        <Tab label="Total Budget" />
      </Tabs>

      {currentTab === 0 && <PieChart pieChartData={pieChartData} />}

      {currentTab === 1 && <PieChart pieChartData={totalSpentData} />}
    </>
  );
};

export default PieChartTab;
