import React, { useState } from 'react';
import PropTypes from 'prop-types';
// Material-UI components
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import TablePagination from '@mui/material/TablePagination';
import Button from '@mui/material/Button';
import car7 from '../../assets/images/users/car7.jpg'; // Ensure the path is correct
import carimg from '../../assets/images/users/carimg.jpg'; // Ensure the path is correct
import { Grid } from '@mui/material';

// Mock data
const headCells = [
  { id: 'image', label: 'Image', align: 'center' },
  { id: 'tracking_no', label: 'Tracking No.', align: 'center' },
  { id: 'plate', label: 'License Plate', align: 'center' },
  { id: 'speed', label: 'Speed', align: 'center' },
  { id: 'status', label: 'Status', align: 'center' },
  { id: 'actions', label: 'Actions', align: 'center' }
];

const createData = (tracking_no, plate, speed, status, cost, image) => {
  return { tracking_no, plate, speed, status, cost, image };
};

const rows = [
  createData(84564564, 'MH12AB1234', '60 km/h', 0, 40000, carimg),
  createData(98764564, 'DL5CN5678', '80 km/h', 1, 150000, carimg),
  createData(98756325, 'KA03MN9999', '70 km/h', 0, 50000, carimg),
  createData(98652366, 'TN22ZZ4321', '65 km/h', 1, 30000, carimg),
  createData(13286564, 'MH14GH8765', '90 km/h', 0, 120000, carimg)
];

const OrderStatus = ({ status }) => (
  <Typography color={status ? 'green' : 'red'} sx={{ fontWeight: 'bold' }}>
    {status ? 'Completed' : 'Pending'}
  </Typography>
);

OrderStatus.propTypes = {
  status: PropTypes.number.isRequired
};

const SpeedDetection = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleView = (tracking_no) => {
    console.log(`Viewing details for vehicle with ID: ${tracking_no}`);
  };

  return (
    <Box>
      <Grid item xs={12} mb={3}>
        <Typography variant="h5" sx={{ textAlign: 'start' }}>
          Speed Detection
        </Typography>
      </Grid>
      <TableContainer
        sx={{
          width: '100%',
          backgroundColor: '#fff',
          overflowX: 'auto',
          boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)', // Add shadow
          borderRadius: '8px', // Optional: Add rounded corners
          '& td, & th': { whiteSpace: 'nowrap', textAlign: 'center' }
        }}
      >
        <Table aria-labelledby="tableTitle">
          <TableHead>
            <TableRow>
              {headCells.map((headCell) => (
                <TableCell key={headCell.id} align={headCell.align}>
                  {headCell.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => (
              <TableRow key={row.tracking_no} hover>
                <TableCell align="center">
                  <Box
                    component="img"
                    src={carimg}
                    alt="Vehicle"
                    sx={{
                      width: 40,
                      height: 40,
                      borderRadius: '5%',
                      objectFit: 'cover'
                    }}
                  />
                </TableCell>
                <TableCell align="center">
                  <Link color="secondary">{row.tracking_no}</Link>
                </TableCell>
                <TableCell align="center">{row.plate}</TableCell>
                <TableCell align="center">{row.speed}</TableCell>
                <TableCell align="center">
                  <OrderStatus status={row.status} />
                </TableCell>
                <TableCell align="center">
                  <Button
                    variant="outlined"
                    color="primary"
                    onClick={() => handleView(row.tracking_no)}
                    sx={{
                      color: '#3a186e',
                      px: 0,
                      py: 0.3,
                      borderColor: '#3a186e',
                      '&:hover': {
                        borderColor: '#614788',
                        color: '#614788'
                      }
                    }}
                  >
                    View
                  </Button>
                  <Button
                    variant="outlined"
                    color="error"
                    onClick={() => console.log(`Delete vehicle with ID: ${row.tracking_no}`)}
                    sx={{
                      ml: 2,
                      px: 0,
                      py: 0.3,
                      color: 'red',
                      borderColor: 'red',
                      '&:hover': {
                        borderColor: '#db3737',
                        color: '#db3737'
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
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={rows.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Box>
  );
};

export default SpeedDetection;
