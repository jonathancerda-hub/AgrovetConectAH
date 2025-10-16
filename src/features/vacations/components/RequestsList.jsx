
import React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Box } from '@mui/material';

const columns = [
  { field: 'id', headerName: 'ID', width: 90 },
  { field: 'requester', headerName: 'Solicitante', width: 150 },
  { field: 'startDate', headerName: 'Fecha de Inicio', width: 150 },
  { field: 'endDate', headerName: 'Fecha de Fin', width: 150 },
  { field: 'status', headerName: 'Estado', width: 120 },
];

const RequestsList = ({ requests }) => {
  return (
    <Box sx={{ height: 400, width: '100%' }}>
      <h2>Mis Solicitudes</h2>
      <DataGrid
        rows={requests}
        columns={columns}
        pageSize={5}
        rowsPerPageOptions={[5]}
        checkboxSelection
      />
    </Box>
  );
};

export default RequestsList;
