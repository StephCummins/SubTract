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
    <Grid
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
      }}
    >
      <Tabs value={currentTab} onChange={handleChange}>
        <Tab label="Monthly Budget" />
        <Tab label="Total Budget" />
      </Tabs>

      {currentTab === 0 && <PieChart pieChartData={pieChartData} />}

      {currentTab === 1 && <PieChart pieChartData={totalSpentData} />}
    </Grid>
  );
};

export default PieChartTab;
