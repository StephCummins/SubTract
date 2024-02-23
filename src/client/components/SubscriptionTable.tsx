import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TableContainer } from '@mui/material';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@mui/material/styles';
import theme from './MaterialUITheme';
import type Subscription from '../models/subscriptionInterface';
import EditIcon from '@mui/icons-material/Edit';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import IconButton from '@mui/material/IconButton';

const SubscriptionTable = ({ setCurrentSub, subs, loadPage }): JSX.Element => {
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [columnToSortBy, setColumnToSortBy] = useState('name');

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
      loadPage();
    } catch (error) {
      console.log('Error deleting subscription');
    }
  };

  const handleSort = (columnName: string) => {
    const isAscending =
      columnToSortBy === columnName && sortDirection === 'asc';

    setColumnToSortBy(columnName);
    setSortDirection(isAscending ? 'desc' : 'asc');
  };

  const descendingComparator = (a, b, orderBy: string) => {
    if (b[orderBy] < a[orderBy]) return -1;
    if (b[orderBy] > a[orderBy]) return 1;
    return 0;
  };

  const getComparator = (order: string, orderBy: string) => {
    return order === 'desc'
      ? (a, b) => descendingComparator(a, b, orderBy)
      : (a, b) => -descendingComparator(a, b, orderBy);
  };

  const sortedRowData = (rowArray, comparator) => {
    const stabilizedRowArray = rowArray.map((element, idx) => [element, idx]);

    stabilizedRowArray.sort((a, b) => {
      const order = comparator(a[0], b[0]);
      if (order !== 0) return order;
      return a[1] - b[1];
    });

    return stabilizedRowArray.map((element) => element[0]);
  };

  const headers: string[] = [
    'Subscription',
    'Monthly Fee',
    'Start Date',
    'Free Trial',
    'End Date',
    'Total Spent',
    'Website',
    'Edit',
    'Delete'
  ];

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <TableContainer
        sx={{ width: { xs: 400, sm: 500, md: 600, lg: 1000, xl: 1200 } }}
      >
        <Table stickyHeader sx={{ width: 'max-content' }}>
          <TableHead>
            <TableRow>
              {headers.map((column: string) => {
                let keyName = 'tbd';

                switch (column) {
                  case 'Subscription':
                    keyName = 'name';
                    break;
                  case 'Monthly Fee':
                    keyName = 'monthlyFee';
                    break;
                  case 'Start Date':
                    keyName = 'signupDate';
                    break;
                  case 'Free Trial':
                    keyName = 'freeTrial';
                    break;
                  case 'End Date':
                    keyName = 'dateFreeTrialEnds';
                    break;
                  case 'Website':
                    keyName = 'website';
                    break;
                  case 'Total Spent':
                    keyName = 'totalSpent';
                    break;
                  case 'Delete':
                    keyName = 'delete';
                    break;
                  case 'Edit':
                    keyName = 'edit';
                }

                if (keyName === 'delete' || keyName === 'edit')
                  return <TableCell key={keyName} />;

                if (keyName === 'website') {
                  return <TableCell key={keyName}>{column}</TableCell>;
                }

                return (
                  <TableCell key={keyName}>
                    <TableSortLabel
                      active={columnToSortBy === keyName}
                      direction={
                        columnToSortBy === keyName ? sortDirection : 'asc'
                      }
                      onClick={() => handleSort(keyName)}
                    >
                      {column}
                    </TableSortLabel>
                  </TableCell>
                );
              })}
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedRowData(
              subs,
              getComparator(sortDirection, columnToSortBy)
            ).map((subscription: any) => (
              <TableRow key={subscription.subId} hover>
                <TableCell>{subscription.name}</TableCell>
                <TableCell>{`$${subscription.monthlyFee}`}</TableCell>
                <TableCell>{subscription.signupDate.slice(0, 10)}</TableCell>
                <TableCell>{subscription.freeTrial ? 'Yes' : 'No'}</TableCell>
                <TableCell>
                  {subscription.dateFreeTrialEnds
                    ? subscription.dateFreeTrialEnds.slice(0, 10)
                    : 'N/A'}
                </TableCell>
                <TableCell>{`$${subscription.totalSpent}`}</TableCell>
                <TableCell>
                  {subscription.website ? subscription.website : 'N/A'}
                </TableCell>
                <TableCell>
                  <IconButton onClick={() => handleEdit(subscription.subId)}>
                    <EditIcon />
                  </IconButton>
                </TableCell>
                <TableCell>
                  <IconButton onClick={() => handleDelete(subscription.subId)}>
                    <DeleteForeverIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </ThemeProvider>
  );
};

export default SubscriptionTable;
