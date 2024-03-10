import React, { useState, useEffect } from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import PriorityHighIcon from '@mui/icons-material/PriorityHigh';
import Typography from '@mui/material/Typography';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@mui/material/styles';
import theme from './MaterialUITheme';
import type Subscription from '../models/subscriptionInterface';

const ExpiringSoon = ({ expiringSoon }): JSX.Element => {
  // const [subsExpiring, setSubsExpiring] = useState<(string | number)[][]>([]);

  // useEffect(() => {
  //   loadExpiringSoon(subs);
  // }, [subs]);

  // const currentTime = new Date().getTime();

  // const loadExpiringSoon = (subs: Subscription[]) => {
  //   const freeTrialEnds: (string | number)[][] = [];

  //   subs.forEach((sub: Subscription) => {
  //     if (sub.freeTrial) {
  //       const endDate = new Date(sub.dateFreeTrialEnds!);
  //       const timeDifference = endDate.getTime() - currentTime;
  //       const dayDifference = Math.round(
  //         timeDifference / (1000 * 60 * 60 * 24)
  //       );

  //       if (dayDifference >= 0 && dayDifference <= 60) {
  //         const endingSoon: (string | number)[] = [
  //           sub.name,
  //           dayDifference,
  //           sub.monthlyFee!
  //         ];
  //         freeTrialEnds.push(endingSoon);
  //       }
  //     }

  //     setSubsExpiring(freeTrialEnds);
  //   });
  // };

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
                {sub[0]} is expiring in: {sub[1]} day(s) | Upcoming monthly fee:
                $ {sub[2]}
              </ListItem>
            );
          })}
        {/* {subsExpiring.length > 0 &&
          subsExpiring.map((sub: (string | number)[], idx) => {
            return (
              <ListItem key={idx}>
                <ListItemIcon>
                  <PriorityHighIcon
                    style={{
                      color: 'red'
                    }}
                  />
                </ListItemIcon>
                {sub[0]} is expiring in: {sub[1]} day(s) | Upcoming monthly fee:
                $ {sub[2]}
              </ListItem>
            );
          })} */}
      </List>
      {/* <ul>
        {subsExpiring.length > 0 &&
          subsExpiring.map((sub: (string | number)[], idx) => {
            return (
              <li key={idx}>
                {sub[0]} is expiring in {sub[1]} day(s) | Upcoming monthly fee:
                $ {sub[2]}
              </li>
            );
          })}
      </ul> */}
    </ThemeProvider>
  );
};

export default ExpiringSoon;
