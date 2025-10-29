
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
        <Button 
          variant="contained" 
          size="small" 
          sx={{ 
            mr: 1,
            background: 'linear-gradient(135deg, #2a9d8f 0%, #264653 100%) !important',
            color: 'white !important',
          }}>
          Aprobar
        </Button>
        <Button 
          variant="outlined" 
          size="small"
          sx={{
            color: '#dc3545', borderColor: '#dc3545',
            '&:hover': { color: '#fff', backgroundColor: '#dc3545', borderColor: '#dc3545' }
          }}>
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
