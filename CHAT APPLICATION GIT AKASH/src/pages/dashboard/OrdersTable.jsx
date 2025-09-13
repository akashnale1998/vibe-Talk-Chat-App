import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';

// MUI Components
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
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import { useNavigate } from 'react-router-dom';

// Assets
import car7 from '../../assets/images/users/car7.jpg';
import Dot from 'components/@extended/Dot';
import { Grid, TextField } from '@mui/material';

// Table columns
const headCells = [
  { id: 'img', align: 'center', label: 'Vehicle Image' },
  { id: 'name', align: 'center', label: 'Vehicle Number' },
  { id: 'date', align: 'center', label: 'Date' },
  { id: 'time', align: 'center', label: 'Time' },
  // { id: 'fat', align: 'center', label: 'Vehicle Speed' },
  { id: 'carbs', align: 'center', label: 'Vehicle Status' }
];

// Vehicle Status Component
function OrderStatus({ status }) {
  let color = 'success';
  let title = 'Vehicle In';

  if (status === 1) {
    color = 'error';
    title = 'Vehicle Out';
  }

  return (
    <Stack direction="row" spacing={1} alignItems="center" justifyContent="center">
      <Dot color={color} />
      <Typography>{title}</Typography>
    </Stack>
  );
}

OrderStatus.propTypes = {
  status: PropTypes.number
};

function OrderTable() {
  const navigate = useNavigate();
  const [searchText, setSearchText] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const [parkingData, setParkingData] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [openImage, setOpenImage] = useState(false);
  const [selectedImage, setSelectedImage] = useState('');


  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.post(
          'http://parking.parkmont.co.in:8086/AnprParkingProject-0.0.1/api/anpr/parking/list',
          {}
        );
        setParkingData(res.data.data || []);
      } catch (err) {
        console.error('API Error:', err);
      }
    };
    fetchData();
  }, []);

  const filteredData = parkingData.filter((row) => {
    const vehicleMatch = row.Vehicle_Number?.toLowerCase().includes(searchText.toLowerCase());

    const date = row.In_Datetime ? new Date(row.In_Datetime).toISOString().split('T')[0] : null;

    const startMatch = startDate ? date >= startDate : true;
    const endMatch = endDate ? date <= endDate : true;

    return vehicleMatch && startMatch && endMatch;
  });
  // Pagination
  const handleChangePage = (event, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleImageClick = (imgUrl) => {
    setSelectedImage(imgUrl);
    setOpenImage(true);
  };

  const handleCloseImage = () => {
    setOpenImage(false);
    setSelectedImage('');
  };

  return (
    <>

      <Grid container spacing={2} alignItems="center" mb={2}>
        <Grid item xs={12} sm={4} md={3} mt={2}>
          <TextField
            fullWidth
            label="Search Vehicle Number"
            variant="outlined"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
        </Grid>
        <Grid item xs={12} sm={4} md={3} mt={2}>
          <TextField
            fullWidth
            label="Start Date"
            type="date"
            InputLabelProps={{ shrink: true }}
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </Grid>
        <Grid item xs={12} sm={4} md={3} mt={2}>
          <TextField
            fullWidth
            label="End Date"
            type="date"
            InputLabelProps={{ shrink: true }}
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </Grid>
      </Grid>
      <Box>


        <TableContainer
          sx={{
            width: '100%',
            overflowX: 'auto',
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
              {filteredData
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) => {
                  const inDateObj = row.In_Datetime ? new Date(row.In_Datetime) : null;
                  const formattedDate = inDateObj
                    ? inDateObj.toLocaleDateString('en-IN', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric'
                    })
                    : '--';
                  const formattedTime = inDateObj
                    ? inDateObj.toLocaleTimeString('en-IN', {
                      hour: '2-digit',
                      minute: '2-digit',
                      second: '2-digit'
                    })
                    : '--';

                  return (
                    <TableRow key={row.Entry_Id || index} hover>
                      <TableCell align="center">
                        <Box
                          component="img"
                          src={row.Vehicle_Image || car7}
                          alt="Vehicle"
                          onClick={() => handleImageClick(row.Vehicle_Image || car7)}
                          sx={{
                            width: 40,
                            height: 40,
                            borderRadius: '5%',
                            objectFit: 'cover',
                            cursor: 'pointer',
                            transition: '0.2s',
                            '&:hover': {
                              transform: 'scale(1.05)'
                            }
                          }}
                        />
                      </TableCell>
                      <TableCell align="center">{row.Vehicle_Number}</TableCell>
                      <TableCell align="center">{formattedDate}</TableCell>
                      <TableCell align="center">{formattedTime}</TableCell>
                      {/* <TableCell align="center">{row.Vehicle_Speed || '--'}</TableCell> */}
                      <TableCell align="center">
                        <OrderStatus status={row.Inout_type === 'OUT' ? 1 : 0} />
                      </TableCell>
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
        </TableContainer>

        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={parkingData.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />

        {/* Image Modal */}
        <Dialog open={openImage} onClose={handleCloseImage} maxWidth="md" fullWidth>
          <DialogTitle>
            Vehicle Image
            <IconButton
              aria-label="close"
              onClick={handleCloseImage}
              sx={{
                position: 'absolute',
                right: 8,
                top: 8,
                color: (theme) => theme.palette.grey[500]
              }}
            >
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent dividers>
            <Box
              component="img"
              src={selectedImage}
              alt="Vehicle Full"
              sx={{ width: '100%', maxHeight: '80vh', objectFit: 'contain' }}
            />
          </DialogContent>
        </Dialog>
      </Box>
    </>

  );
}

export default OrderTable;
