import React, { useState, useEffect } from 'react';
import Link from '@mui/material/Link';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';

interface Subscription {
  subscription_id: number;
  user_id: number;
  name: string;
  website?: string;
  signup_date: string;
  monthly_fee: number;
  free_trial: boolean;
  date_free_trial_ends?: string;
  total_spent: number;
}

const DashboardPage = ({ user, setUser }): JSX.Element => {
  const [subs, setSubs] = useState([]);
  console.log('In Dashboard Page!', user);

  const getSubscriptions = async () => {
    try {
      const response = await fetch(
        `/subs/retrieveallsubs?userId=${user.userId}`
      );
      if (!response.ok) throw response;
      const data = await response.json();
      if (data[0]) setSubs(data);
    } catch (error) {
      console.log('Error retrieving all user subscriptions');
    }
  };

  useEffect(() => {
    getSubscriptions();
  }, []);

  function createData(
    id: number,
    date: string,
    name: string,
    shipTo: string,
    paymentMethod: string,
    amount: number
  ) {
    return { id, date, name, shipTo, paymentMethod, amount };
  }

  function preventDefault(event: React.MouseEvent) {
    event.preventDefault();
  }

  const rows = [
    createData(
      0,
      '16 Mar, 2019',
      'Elvis Presley',
      'Tupelo, MS',
      'VISA ⠀•••• 3719',
      312.44
    )
  ];

  return (
    <React.Fragment>
      <Typography component="h2" variant="h6" color="primary" gutterBottom>
        Subscriptions
      </Typography>
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
          </TableRow>
        </TableHead>
        <TableBody>
          {subs.map((subscription: Subscription) => (
            <TableRow key={subscription.subscription_id}>
              <TableCell>{subscription.name}</TableCell>
              <TableCell>{subscription.monthly_fee}</TableCell>
              <TableCell>{subscription.signup_date}</TableCell>
              <TableCell>{subscription.free_trial}</TableCell>
              <TableCell>{subscription.date_free_trial_ends}</TableCell>
              <TableCell>{subscription.website}</TableCell>
              <TableCell>0</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Link color="primary" href="#" onClick={preventDefault} sx={{ mt: 3 }}>
        See more orders
      </Link>
    </React.Fragment>
  );
};

export default DashboardPage;
