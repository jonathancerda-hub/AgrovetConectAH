import React from 'react';
import { Card, CardContent, Typography, Button, Avatar, Box, Chip, Tabs, Tab, Paper, Table, TableBody, TableCell, TableContainer, TableRow } from '@mui/material';

const user = {
  name: 'Jorge Luis Jonathan Cerda Piaca',
  position: 'Coordinador de Proyectos de Mejora de TI',
  initials: 'F1',
  status: 'Activo',
  area: 'TI (SISTEMAS)',
  division: 'FINANZAS Y TI',
  company: 'AGROVET MARKET S.A.',
  costCenter: 'GOL-GOL01',
  supervisor: 'Mondragon, Perci',
  substitute: 'Sin Suplencia',
  contractType: 'Contrato a Plazo Indeterminado',
  entryDate: '23 de noviembre de 2010 (casi 15 años)',
};

function InfoTable() {
  return (
    <Paper sx={{ p: 2, mt: 2 }}>
      <Tabs value={0} sx={{ mb: 2 }}>
        <Tab label="Resumen" />
        <Tab label="Boletas de Pago" />
        <Tab label="Documentos" />
        <Tab label="Bitácora" />
        <Tab label="Talento" />
      </Tabs>
      <TableContainer>
        <Table>
          <TableBody>
            <TableRow>
              <TableCell variant="head"><b>Cargo</b></TableCell>
              <TableCell>{user.position}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell variant="head"><b>Área</b></TableCell>
              <TableCell>{user.area}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell variant="head"><b>División</b></TableCell>
              <TableCell>{user.division}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell variant="head"><b>Empresa</b></TableCell>
              <TableCell>{user.company}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell variant="head"><b>Centro de Costos</b></TableCell>
              <TableCell>{user.costCenter}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell variant="head"><b>Supervisor</b></TableCell>
              <TableCell>{user.supervisor}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell variant="head"><b>Suplente</b></TableCell>
              <TableCell>{user.substitute}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell variant="head"><b>Tipo Contrato</b></TableCell>
              <TableCell>{user.contractType}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell variant="head"><b>Fecha Ingreso Compañía</b></TableCell>
              <TableCell>{user.entryDate}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
}

export default function MiFicha() {
  return (
    <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3 }}>
      <Card sx={{ minWidth: 280, maxWidth: 320, m: 1, boxShadow: 3 }}>
        <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Avatar sx={{ width: 80, height: 80, mb: 2 }}>
            {user.initials}
          </Avatar>
          <Typography variant="h6" align="center" gutterBottom>
            {user.name}
          </Typography>
          <Typography variant="body2" color="text.secondary" align="center" gutterBottom>
            {user.position}
          </Typography>
          <Chip label={user.status} color="secondary" sx={{ mt: 1, mb: 2 }} />
          <Button variant="outlined" fullWidth sx={{ mt: 1 }}>
            <span style={{ display: 'flex', alignItems: 'center' }}>
              <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: 6 }}><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19.5 2 20l.5-5L16.5 3.5z"/></svg>
              Actualizar Datos
            </span>
          </Button>
        </CardContent>
      </Card>
      <Box sx={{ flex: 1 }}>
        <InfoTable />
      </Box>
    </Box>
  );
}
