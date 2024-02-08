import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@mui/material/styles';
import theme from './MaterialUITheme';
import OrangeButton from './OrangeButton';
import type Subscription from '../models/subscriptionInterface';

const SubscriptionTable = ({ setCurrentSub, subs, setSubs }): JSX.Element => {
  const navigate = useNavigate();

  const handleEdit = (subId: number) => {
    const current: Subscription = subs.filter(
      (sub: Subscription) => sub.subId === subId
    )[0];
    setCurrentSub(current);
    navigate('/update');
  };

  const handleDelete = async (subId: number) => {
    try {
      const response = await fetch('/subs/deletesub', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subId })
      });
      if (!response.ok) throw response;
      const newSubs = subs.filter((sub: Subscription) => sub.subId !== subId);
      setSubs(newSubs);
    } catch (error) {
      console.log('Error deleting subscription');
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {/* <OrangeButton type={'button'} handleOnClick={() => navigate('/add')}>
        Add New Subscription
      </OrangeButton> */}
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Subscription</TableCell>
            <TableCell>Monthly Fee</TableCell>
            <TableCell>Start Date</TableCell>
            <TableCell>Free Trial</TableCell>
            <TableCell>End Date</TableCell>
            <TableCell>Website</TableCell>
            <TableCell>Total Spent</TableCell>
            <TableCell>Edit</TableCell>
            <TableCell>Delete</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {subs.map((subscription: any) => (
            <TableRow key={subscription.subId} hover>
              <TableCell>{subscription.name}</TableCell>
              <TableCell>{subscription.monthlyFee}</TableCell>
              <TableCell>{subscription.signupDate.slice(0, 10)}</TableCell>
              <TableCell>{subscription.freeTrial ? 'Yes' : 'No'}</TableCell>
              <TableCell>
                {subscription.dateFreeTrialEnds
                  ? subscription.dateFreeTrialEnds.slice(0, 10)
                  : 'N/A'}
              </TableCell>
              <TableCell>
                {subscription.website ? subscription.website : 'N/A'}
              </TableCell>
              <TableCell>{subscription.totalSpent}</TableCell>
              <TableCell>
                <Button
                  type="submit"
                  onClick={() => handleEdit(subscription.subId)}
                  variant="contained"
                  sx={{
                    mt: 1,
                    mb: 1,
                    '&:active': {
                      transform: 'translateY(4px)'
                    }
                  }}
                >
                  Edit
                </Button>
              </TableCell>
              <TableCell>
                <Button
                  type="submit"
                  onClick={() => handleDelete(subscription.subId)}
                  variant="contained"
                  sx={{
                    mt: 1,
                    mb: 1,
                    '&:active': {
                      transform: 'translateY(4px)'
                    }
                  }}
                >
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </ThemeProvider>
  );
};

export default SubscriptionTable;
