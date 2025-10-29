
import React, { useState } from 'react';
import { Typography, Paper, Box, Button } from '@mui/material';
import {
  LineChart,
  BarChart,
  PieChart,
  pieArcLabelClasses,
  ResponsiveChartContainer,
  ChartsXAxis,
  ChartsYAxis,
  ChartsLegend,
  ChartsTooltip,
  BarPlot,
  LinePlot,
  PiePlot,
} from '@mui/x-charts';

// Componente de ejemplo para rellenar el grid
const PlaceholderCard = ({ title, sx, children }) => (
  <Paper elevation={3} sx={{ p: 2, display: 'flex', flexDirection: 'column', ...sx }}>
    <Typography variant="h6" gutterBottom>{title}</Typography>
    {children}
  </Paper>
);

// Datos de ejemplo para los gráficos
const pData = [2400, 1398, 9800, 3908, 4800, 3800, 4300];
const uData = [4000, 3000, 2000, 2780, 1890, 2390, 3490];
const xLabels = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio'
];

const AvailableDays = ({ available, taken }) => {
  const [rerenderKey, setRerenderKey] = useState(0);

  const pieChartData = [
    { name: 'Disponibles', value: available },
    { name: 'Tomados', value: taken },
  ];

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: 'repeat(5, 1fr)',
        gridTemplateRows: 'repeat(5, 1fr)',
        gap: '8px', // theme.spacing(1)
        height: 'calc(100vh - 100px)', // Ajusta la altura para ocupar la pantalla
      }}
    >
      <Box sx={{ gridColumn: { xs: 'span 5', md: '1 / span 4' }, gridRow: '1' }}>
        <Typography variant="h4" fontWeight={700}>Dashboard de Vacaciones</Typography>
      </Box>

      {/* .div5 */}
      <PlaceholderCard
        title="Resumen Gráfico"
        sx={{
          gridColumn: { xs: 'span 5', md: '1 / span 4' },
          gridRow: { xs: 'auto', md: '2 / span 2' },
          justifyContent: 'center',
          alignItems: 'center'
        }}
      >
        <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 250 }}>
          <PieChart
            key={rerenderKey} // Key to force animation restart
            series={[{
              data: pieChartData.map((entry, index) => ({
                ...entry,
                color: index === 0 ? '#667eea' : '#ff6384', // Colores para Disponibles y Tomados
              })),
              arcLabel: (item) => `${item.value}`,
              outerRadius: 100,
              innerRadius: 60,
              paddingAngle: 5,
              cornerRadius: 5,
              startAngle: -90,
              endAngle: 270,
              highlightScope: { faded: 'global', highlighted: 'item' },
              faded: { innerRadius: 30, additionalRadius: -30, color: 'grey' },
            }]}
            width={300}
            height={300}
            slotProps={{
              legend: { hidden: true }, // hideLegend
            }}
            sx={{
              [`& .${pieArcLabelClasses.root}.${pieArcLabelClasses.animate}`]: {
                animationDuration: '2s',
              },
            }}
          />
          <Button onClick={() => setRerenderKey(prev => prev + 1)} sx={{ mt: 2 }}>Restart Animation</Button>
        </Box>
      </PlaceholderCard>

      {/* .div6 */}
      <PlaceholderCard
        title="Estado Actual"
        sx={{
          gridColumn: { xs: 'span 5', md: '5 / 6' },
          gridRow: { xs: 'auto', md: '1 / span 3' },
        }}
      >
        <Typography variant="h4" color="primary">Disponibles: {available}</Typography>
        <Typography variant="h4" color="error">Tomados: {taken}</Typography>
      </PlaceholderCard>

      {/* .div7 */}
      <PlaceholderCard
        title="Actividad Mensual"
        sx={{
          gridColumn: { xs: 'span 5', md: '1 / span 2' },
          gridRow: { xs: 'auto', md: '4 / span 2' },
        }}
      >
        <Box sx={{ height: 300, width: '100%' }}>
          <ResponsiveChartContainer
            series={[
              { type: 'bar', data: pData, label: 'Solicitudes', id: 'pvId', color: '#667eea' },
              { type: 'bar', data: uData, label: 'Aprobaciones', id: 'uvId', color: '#20c997' },
            ]}
            xAxis={[{ scaleType: 'band', data: xLabels }]}
            yAxis={[{ id: 'leftAxis', scaleType: 'linear' }]}
            margin={{ left: 50 }}
          >
            <BarPlot />
            <ChartsXAxis />
            <ChartsYAxis axisId="leftAxis" />
            <ChartsTooltip />
            <ChartsLegend />
          </ResponsiveChartContainer>
        </Box>
      </PlaceholderCard>

      {/* .div8 */}
      <PlaceholderCard
        title="Tendencia Anual"
        sx={{
          gridColumn: { xs: 'span 5', md: '3 / span 3' },
          gridRow: { xs: 'auto', md: '4 / span 2' },
        }}
      >
        <Box sx={{ height: 300, width: '100%' }}>
          <LineChart
            series={[
              { data: pData, label: 'Empleados', color: '#667eea' },
              { data: uData, label: 'Proyectos', color: '#ff6384' },
            ]}
            xAxis={[{ scaleType: 'point', data: xLabels }]}
            yAxis={[{ width: 50 }]}
            margin={{ left: 50 }}
          />
        </Box>
      </PlaceholderCard>
    </Box>
  );
};

export default AvailableDays;
