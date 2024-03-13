import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { TableContainer } from '@mui/material';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import {
  TablePagination,
  tablePaginationClasses as classes
} from '@mui/base/TablePagination';
import PriorityHighIcon from '@mui/icons-material/PriorityHigh';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@mui/material/styles';
import theme from './MaterialUITheme';
import type Subscription from '../models/subscriptionInterface';
import EditIcon from '@mui/icons-material/Edit';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import IconButton from '@mui/material/IconButton';
import ExpiringSoon from './ExpiringSoon';
import ServerErrors from '../../server/models/ServerErrors';

const SubscriptionTable = ({
  setCurrentSub,
  subs,
  setIsLoggedIn,
  loadPage
}): JSX.Element => {
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [columnToSortBy, setColumnToSortBy] = useState('name');
  const [subsExpiringData, setSubsExpiringData] = useState<
    (string | number)[][]
  >([]);
  const [listOfExpiring, setListOfExpiring] = useState<string[]>([]);

  useEffect(() => {
    loadExpiringSoon(subs);
  }, [subs]);

  const currentTime = new Date().getTime();

  const loadExpiringSoon = (subs: Subscription[]) => {
    const freeTrialEnds: (string | number)[][] = [];

    subs.forEach((sub: Subscription) => {
      if (sub.freeTrial) {
        const endDate = new Date(sub.dateFreeTrialEnds!);
        const timeDifference = endDate.getTime() - currentTime;
        const dayDifference = Math.round(
          timeDifference / (1000 * 60 * 60 * 24)
        );

        if (dayDifference >= 0 && dayDifference <= 60) {
          const endingSoon: (string | number)[] = [
            sub.name,
            dayDifference,
            sub.monthlyFee!
          ];
          freeTrialEnds.push(endingSoon);
          setListOfExpiring(() => [...listOfExpiring, sub.name]);
        }
      }

      setSubsExpiringData(freeTrialEnds);
    });
  };

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

      const data = await response.json();

      if (data.message === ServerErrors.USER_NOT_AUTHENTICATED) {
        setIsLoggedIn(false);
        navigate('/');
      } else {
        loadPage();
      }
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
    'Free Trial End Date',
    'Total Spent',
    'Website',
    'Edit',
    'Delete'
  ];

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <TableContainer
        sx={{
          width: { xs: 400, sm: 500, md: 600, lg: 1100, xl: 1400 },
          mb: 10,
          maxHeight: 620
        }}
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
                  case 'Free Trial End Date':
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
                <TableCell>
                  {listOfExpiring.includes(subscription.name) && (
                    <PriorityHighIcon
                      style={{
                        color: 'red',
                        fontSize: 'medium'
                      }}
                    />
                  )}
                  {subscription.name}
                </TableCell>
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
                    <EditIcon
                      color="primary"
                      style={{
                        fontSize: 'large'
                      }}
                    />
                  </IconButton>
                </TableCell>
                <TableCell>
                  <IconButton onClick={() => handleDelete(subscription.subId)}>
                    <DeleteForeverIcon
                      style={{
                        color: 'red'
                      }}
                    />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <ExpiringSoon expiringSoon={subsExpiringData} />
    </ThemeProvider>
  );
};

export default SubscriptionTable;

// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { TableContainer } from '@mui/material';

// import Table from '@mui/material/Table';
// import TableBody from '@mui/material/TableBody';
// import TableCell from '@mui/material/TableCell';
// import TableHead from '@mui/material/TableHead';
// import TableRow from '@mui/material/TableRow';
// import TableSortLabel from '@mui/material/TableSortLabel';
// import TablePagination from '@mui/material/TablePagination';
// import PriorityHighIcon from '@mui/icons-material/PriorityHigh';
// import CssBaseline from '@mui/material/CssBaseline';
// import { ThemeProvider } from '@mui/material/styles';
// import theme from './MaterialUITheme';
// import type Subscription from '../models/subscriptionInterface';
// import EditIcon from '@mui/icons-material/Edit';
// import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
// import IconButton from '@mui/material/IconButton';
// import ExpiringSoon from './ExpiringSoon';
// import ServerErrors from '../../server/models/ServerErrors';

// const SubscriptionTable = ({
//   setCurrentSub,
//   subs,
//   setIsLoggedIn,
//   loadPage
// }): JSX.Element => {
//   const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
//   const [columnToSortBy, setColumnToSortBy] = useState('name');
//   const [subsExpiringData, setSubsExpiringData] = useState<
//     (string | number)[][]
//   >([]);
//   const [listOfExpiring, setListOfExpiring] = useState<string[]>([]);
//   const [currentPage, setCurrentPage] = useState(0);
//   const [rowsPerPage, setRowsPerPage] = useState(10);

//   useEffect(() => {
//     loadExpiringSoon(subs);
//   }, [subs]);

//   const currentTime = new Date().getTime();

//   const loadExpiringSoon = (subs: Subscription[]) => {
//     const freeTrialEnds: (string | number)[][] = [];

//     subs.forEach((sub: Subscription) => {
//       if (sub.freeTrial) {
//         const endDate = new Date(sub.dateFreeTrialEnds!);
//         const timeDifference = endDate.getTime() - currentTime;
//         const dayDifference = Math.round(
//           timeDifference / (1000 * 60 * 60 * 24)
//         );

//         if (dayDifference >= 0 && dayDifference <= 60) {
//           const endingSoon: (string | number)[] = [
//             sub.name,
//             dayDifference,
//             sub.monthlyFee!
//           ];
//           freeTrialEnds.push(endingSoon);
//           setListOfExpiring(() => [...listOfExpiring, sub.name]);
//         }
//       }

//       setSubsExpiringData(freeTrialEnds);
//     });
//   };

//   const navigate = useNavigate();

//   const handleEdit = (subId: number) => {
//     const current: Subscription = subs.filter(
//       (sub: Subscription) => sub.subId === subId
//     )[0];
//     setCurrentSub(current);
//     navigate('/update');
//   };

//   const handleDelete = async (subId: number) => {
//     try {
//       const response = await fetch('/subs/deletesub', {
//         method: 'DELETE',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ subId })
//       });
//       if (!response.ok) throw response;

//       const data = await response.json();

//       if (data.message === ServerErrors.USER_NOT_AUTHENTICATED) {
//         setIsLoggedIn(false);
//         navigate('/');
//       } else {
//         loadPage();
//       }
//     } catch (error) {
//       console.log('Error deleting subscription');
//     }
//   };

//   const handleSort = (columnName: string) => {
//     const isAscending =
//       columnToSortBy === columnName && sortDirection === 'asc';

//     setColumnToSortBy(columnName);
//     setSortDirection(isAscending ? 'desc' : 'asc');
//   };

//   const descendingComparator = (a, b, orderBy: string) => {
//     if (b[orderBy] < a[orderBy]) return -1;
//     if (b[orderBy] > a[orderBy]) return 1;
//     return 0;
//   };

//   const getComparator = (order: string, orderBy: string) => {
//     return order === 'desc'
//       ? (a, b) => descendingComparator(a, b, orderBy)
//       : (a, b) => -descendingComparator(a, b, orderBy);
//   };

//   const sortedRowData = (rowArray, comparator) => {
//     const stabilizedRowArray = rowArray.map((element, idx) => [element, idx]);

//     stabilizedRowArray.sort((a, b) => {
//       const order = comparator(a[0], b[0]);
//       if (order !== 0) return order;
//       return a[1] - b[1];
//     });

//     return stabilizedRowArray.map((element) => element[0]);
//   };

//   const handleChangePage = (e, newPage) => {
//     setCurrentPage(newPage);
//   };

//   const handleChangeRowsPerPage = (e) => {
//     setRowsPerPage(parseInt(e.target.value, 10));
//     setCurrentPage(0);
//   };

//   const headers: string[] = [
//     'Subscription',
//     'Monthly Fee',
//     'Start Date',
//     'Free Trial',
//     'Free Trial End Date',
//     'Total Spent',
//     'Website',
//     'Edit',
//     'Delete'
//   ];
//   return (
//     <ThemeProvider theme={theme}>
//       <CssBaseline />
//       <TableContainer
//         sx={{
//           width: { xs: 400, sm: 500, md: 600, lg: 1100, xl: 1400 },
//           maxHeight: 600,
//           mb: 5
//         }}
//       >
//         <Table stickyHeader sx={{ width: 'max-content' }}>
//           <TableHead>
//             <TableRow>
//               {headers.map((column: string) => {
//                 let keyName = 'tbd';

//                 switch (column) {
//                   case 'Subscription':
//                     keyName = 'name';
//                     break;
//                   case 'Monthly Fee':
//                     keyName = 'monthlyFee';
//                     break;
//                   case 'Start Date':
//                     keyName = 'signupDate';
//                     break;
//                   case 'Free Trial End Date':
//                     keyName = 'freeTrial';
//                     break;
//                   case 'End Date':
//                     keyName = 'dateFreeTrialEnds';
//                     break;
//                   case 'Website':
//                     keyName = 'website';
//                     break;
//                   case 'Total Spent':
//                     keyName = 'totalSpent';
//                     break;
//                   case 'Delete':
//                     keyName = 'delete';
//                     break;
//                   case 'Edit':
//                     keyName = 'edit';
//                 }

//                 if (keyName === 'delete' || keyName === 'edit')
//                   return <TableCell key={keyName} />;

//                 if (keyName === 'website') {
//                   return <TableCell key={keyName}>{column}</TableCell>;
//                 }

//                 return (
//                   <TableCell key={keyName}>
//                     <TableSortLabel
//                       active={columnToSortBy === keyName}
//                       direction={
//                         columnToSortBy === keyName ? sortDirection : 'asc'
//                       }
//                       onClick={() => handleSort(keyName)}
//                     >
//                       {column}
//                     </TableSortLabel>
//                   </TableCell>
//                 );
//               })}
//             </TableRow>
//           </TableHead>
//           <TableBody>
//             {sortedRowData(subs, getComparator(sortDirection, columnToSortBy))
//               .slice(
//                 currentPage * rowsPerPage,
//                 currentPage * rowsPerPage + rowsPerPage
//               )
//               .map((subscription: any) => (
//                 <TableRow key={subscription.subId} hover>
//                   <TableCell>
//                     {listOfExpiring.includes(subscription.name) && (
//                       <PriorityHighIcon
//                         style={{
//                           color: 'red',
//                           fontSize: 'medium'
//                         }}
//                       />
//                     )}
//                     {subscription.name}
//                   </TableCell>
//                   {/* <TableCell>{subscription.name}</TableCell> */}
//                   <TableCell>{`$${subscription.monthlyFee}`}</TableCell>
//                   <TableCell>{subscription.signupDate.slice(0, 10)}</TableCell>
//                   <TableCell>{subscription.freeTrial ? 'Yes' : 'No'}</TableCell>
//                   <TableCell>
//                     {subscription.dateFreeTrialEnds
//                       ? subscription.dateFreeTrialEnds.slice(0, 10)
//                       : 'N/A'}
//                   </TableCell>
//                   <TableCell>{`$${subscription.totalSpent}`}</TableCell>
//                   <TableCell>
//                     {subscription.website ? subscription.website : 'N/A'}
//                   </TableCell>
//                   <TableCell>
//                     <IconButton onClick={() => handleEdit(subscription.subId)}>
//                       <EditIcon
//                         color="primary"
//                         style={{
//                           fontSize: 'large'
//                         }}
//                       />
//                     </IconButton>
//                   </TableCell>
//                   <TableCell>
//                     <IconButton
//                       onClick={() => handleDelete(subscription.subId)}
//                     >
//                       <DeleteForeverIcon
//                         style={{
//                           color: 'red'
//                         }}
//                       />
//                     </IconButton>
//                   </TableCell>
//                 </TableRow>
//               ))}
//           </TableBody>
//         </Table>
//         <TablePagination
//           component="div"
//           rowsPerPageOptions={[10, 20, 30]}
//           rowsPerPage={rowsPerPage}
//           count={subs.length}
//           page={currentPage}
//           onPageChange={handleChangePage}
//           onRowsPerPageChange={handleChangeRowsPerPage}
//         />
//       </TableContainer>

//       <ExpiringSoon expiringSoon={subsExpiringData} />
//     </ThemeProvider>
//   );
// };

// export default SubscriptionTable;
