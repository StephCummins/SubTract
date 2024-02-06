import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import type Subscription from '../models/subscriptionInterface';

const SubscriptionTable = ({
  user,
  setUser,
  currentSub,
  setCurrentSub,
  getSubscriptions,
  subs,
  setSubs
}): JSX.Element => {
  // const [subs, setSubs] = useState([]);

  const navigate = useNavigate();

  // const getSubscriptions = async () => {
  //   try {
  //     const response = await fetch(
  //       `/subs/retrieveallsubs?userId=${user.userId}`
  //     );
  //     if (!response.ok) throw response;
  //     const data = await response.json();
  //     if (data[0]) setSubs(data);
  //   } catch (error) {
  //     console.log('Error retrieving all user subscriptions');
  //   }
  // };

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

  // useEffect(() => {
  //   getSubscriptions();
  // }, []);

  return (
    <React.Fragment>
      <Typography component="h2" variant="h6" color="primary" gutterBottom>
        Subscription Dashboard
      </Typography>
      <Button
        type="button"
        onClick={() => navigate('/add')}
        variant="contained"
        sx={{ mt: 1, mb: 1 }}
      >
        Add New Subscription
      </Button>
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
              <TableCell>{subscription.freeTrial ? 'True' : 'False'}</TableCell>
              <TableCell>
                {subscription.dateFreeTrialEnds.slice(0, 10)}
              </TableCell>
              <TableCell>{subscription.website}</TableCell>
              <TableCell>{subscription.totalSpent}</TableCell>
              <TableCell>
                <Button
                  type="submit"
                  onClick={() => handleEdit(subscription.subId)}
                  variant="contained"
                  sx={{ mt: 1, mb: 1 }}
                >
                  Edit
                </Button>
              </TableCell>
              <TableCell>
                <Button
                  type="submit"
                  onClick={() => handleDelete(subscription.subId)}
                  variant="contained"
                  sx={{ mt: 1, mb: 1 }}
                >
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </React.Fragment>
  );
};

export default SubscriptionTable;
