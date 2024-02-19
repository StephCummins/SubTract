import React from 'react';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import PieChart from './PieChart';

const TabPanel = (value, index, title, pieChartData): JSX.Element => {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
    >
      {value === index && (
        <Grid item xs={12} md={4}>
          <Typography variant="h3" color="primary">
            {title}
          </Typography>
          <PieChart pieChartData={pieChartData} />
        </Grid>
      )}
    </div>
  );
};

export default TabPanel;
