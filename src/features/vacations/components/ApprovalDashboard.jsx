
import React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Button, Box } from '@mui/material';

const columns = [
  { field: 'id', headerName: 'ID', width: 90 },
  { field: 'employee', headerName: 'Empleado', width: 150 },
  { field: 'startDate', headerName: 'Fecha de Inicio', width: 150 },
  { field: 'endDate', headerName: 'Fecha de Fin', width: 150 },
  {
    field: 'actions',
    headerName: 'Acciones',
    width: 150,
    renderCell: (params) => (
      <>
        <Button variant="contained" color="primary" size="small" style={{ marginRight: 8 }}>
          Aprobar
        </Button>
        <Button variant="contained" color="secondary" size="small">
          Rechazar
        </Button>
      </>
    ),
  },
];

const ApprovalDashboard = ({ pendingRequests }) => {
  return (
    <Box sx={{ height: 400, width: '100%', mt: 4 }}>
      <h2>Panel de Aprobación</h2>
      <DataGrid
        rows={pendingRequests}
        columns={columns}
        pageSize={5}
        rowsPerPageOptions={[5]}
      />
    </Box>
  );
};

export default ApprovalDashboard;
