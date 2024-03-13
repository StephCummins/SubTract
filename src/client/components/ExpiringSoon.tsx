import React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import PriorityHighIcon from '@mui/icons-material/PriorityHigh';
import theme from './MaterialUITheme';
import { ThemeProvider } from '@mui/material/styles';
import Typography from '@mui/material/Typography';

const ExpiringSoon = ({ expiringSoon }): JSX.Element => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Typography
        component="h1"
        variant="h5"
        color="primary"
        sx={{ textAlign: 'left' }}
        gutterBottom
      >
        Free Trials Expiring Soon
      </Typography>
      <List>
        {expiringSoon.length > 0 &&
          expiringSoon.map((sub: (string | number)[], idx: number) => {
            return (
              <ListItem key={idx}>
                <ListItemIcon>
                  <PriorityHighIcon
                    style={{
                      color: 'red'
                    }}
                  />
                </ListItemIcon>
                {sub[0]} free trial expiring in: {sub[1]} day(s) | Upcoming
                monthly fee: $ {sub[2]}
              </ListItem>
            );
          })}
      </List>
    </ThemeProvider>
  );
};

export default ExpiringSoon;
