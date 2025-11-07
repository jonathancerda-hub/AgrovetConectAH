
import React, { useState } from 'react';
import { Typography, Paper, Box, Button, Card, CardContent, LinearProgress, Chip, Divider } from '@mui/material';
import BeachAccessIcon from '@mui/icons-material/BeachAccess';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import EventBusyIcon from '@mui/icons-material/EventBusy';
import PendingActionsIcon from '@mui/icons-material/PendingActions';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import {
  LineChart,
  BarChart,
  PieChart,
  pieArcLabelClasses,
} from '@mui/x-charts';

// Componente KPI Card mejorado
const KPICard = ({ title, value, subtitle, icon: Icon, color, trend }) => (
  <Card sx={{ 
    height: '100%',
    background: `linear-gradient(135deg, ${color}15 0%, ${color}05 100%)`,
    border: `1px solid ${color}30`,
    transition: 'transform 0.2s, box-shadow 0.2s',
    '&:hover': {
      transform: 'translateY(-4px)',
      boxShadow: 4
    }
  }}>
    <CardContent>
      <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 2 }}>
        <Box>
          <Typography variant="caption" color="text.secondary" fontWeight={600}>
            {title}
          </Typography>
          <Typography variant="h3" fontWeight={700} color={color} sx={{ my: 1 }}>
            {value}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {subtitle}
          </Typography>
        </Box>
        <Box sx={{ 
          bgcolor: `${color}20`, 
          borderRadius: 2, 
          p: 1.5,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <Icon sx={{ fontSize: 32, color }} />
        </Box>
      </Box>
      {trend && (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 1 }}>
          <TrendingUpIcon sx={{ fontSize: 16, color: trend > 0 ? '#4caf50' : '#f44336' }} />
          <Typography variant="caption" color={trend > 0 ? '#4caf50' : '#f44336'} fontWeight={600}>
            {trend > 0 ? '+' : ''}{trend}% vs mes anterior
          </Typography>
        </Box>
      )}
    </CardContent>
  </Card>
);

const AvailableDays = ({ available, taken }) => {
  const [rerenderKey, setRerenderKey] = useState(0);

  // Calcular métricas
  const totalDays = available + taken;
  const usagePercentage = totalDays > 0 ? ((taken / totalDays) * 100).toFixed(1) : 0;
  const pendingRequests = 2; // Esto debería venir de props o API
  const approvedRequests = 5; // Esto debería venir de props o API

  // Datos para el gráfico de pastel
  const pieChartData = [
    { name: 'Disponibles', value: available, label: `${available} días` },
    { name: 'Tomados', value: taken, label: `${taken} días` },
  ];

  // Datos de ejemplo para gráficos de tendencia (deberían venir de la API)
  const monthlyData = [3, 5, 2, 4, 6, 3, 4, 5, 2, 3, 4, taken];
  const monthLabels = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];

  const requestsData = [
    { month: 'Ene', solicitudes: 8, aprobadas: 7 },
    { month: 'Feb', solicitudes: 12, aprobadas: 10 },
    { month: 'Mar', solicitudes: 6, aprobadas: 6 },
    { month: 'Abr', solicitudes: 10, aprobadas: 9 },
    { month: 'May', solicitudes: 15, aprobadas: 12 },
    { month: 'Jun', solicitudes: 18, aprobadas: 16 },
  ];

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight={700} gutterBottom>
          Dashboard de Vacaciones
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Visualiza y gestiona tu tiempo de descanso
        </Typography>
      </Box>

      {/* KPIs Row */}
      <Box sx={{ 
        display: 'grid', 
        gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', lg: 'repeat(4, 1fr)' },
        gap: 2,
        mb: 3
      }}>
        <KPICard
          title="Días Disponibles"
          value={available}
          subtitle="Para solicitar"
          icon={BeachAccessIcon}
          color="#1976d2"
          trend={0}
        />
        <KPICard
          title="Días Tomados"
          value={taken}
          subtitle={`${usagePercentage}% utilizado`}
          icon={EventBusyIcon}
          color="#f57c00"
          trend={-15}
        />
        <KPICard
          title="Solicitudes Pendientes"
          value={pendingRequests}
          subtitle="En revisión"
          icon={PendingActionsIcon}
          color="#9c27b0"
          trend={null}
        />
        <KPICard
          title="Solicitudes Aprobadas"
          value={approvedRequests}
          subtitle="Este año"
          icon={EventAvailableIcon}
          color="#4caf50"
          trend={25}
        />
      </Box>

      {/* Charts Row */}
      <Box sx={{ 
        display: 'grid', 
        gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' },
        gap: 3,
        mb: 3
      }}>
        {/* Balance de Vacaciones */}
        <Card>
          <CardContent>
            <Typography variant="h6" fontWeight={700} gutterBottom>
              Balance de Vacaciones
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 2 }}>
              <PieChart
                key={rerenderKey}
                series={[{
                  data: pieChartData.map((entry, index) => ({
                    ...entry,
                    color: index === 0 ? '#1976d2' : '#f57c00',
                  })),
                  arcLabel: (item) => `${item.value}`,
                  outerRadius: 100,
                  innerRadius: 60,
                  paddingAngle: 3,
                  cornerRadius: 5,
                  highlightScope: { faded: 'global', highlighted: 'item' },
                }]}
                width={350}
                height={250}
                slotProps={{
                  legend: { 
                    direction: 'row',
                    position: { vertical: 'bottom', horizontal: 'middle' },
                    padding: 0,
                  },
                }}
              />
              <Box sx={{ mt: 2, textAlign: 'center' }}>
                <Typography variant="h4" fontWeight={700} color="primary">
                  {totalDays}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Total de días al año
                </Typography>
              </Box>
            </Box>
            
            {/* Progress Bar */}
            <Box sx={{ mt: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2" color="text.secondary">Uso de vacaciones</Typography>
                <Typography variant="body2" fontWeight={600}>{usagePercentage}%</Typography>
              </Box>
              <LinearProgress 
                variant="determinate" 
                value={parseFloat(usagePercentage)} 
                sx={{ 
                  height: 8, 
                  borderRadius: 4,
                  bgcolor: '#e0e0e0',
                  '& .MuiLinearProgress-bar': {
                    borderRadius: 4,
                    background: 'linear-gradient(90deg, #1976d2 0%, #f57c00 100%)'
                  }
                }}
              />
            </Box>
          </CardContent>
        </Card>

        {/* Tendencia Mensual */}
        <Card>
          <CardContent>
            <Typography variant="h6" fontWeight={700} gutterBottom>
              Días Tomados por Mes
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Box sx={{ height: 300, width: '100%' }}>
              <LineChart
                series={[
                  { 
                    data: monthlyData, 
                    label: 'Días de vacaciones',
                    color: '#1976d2',
                    curve: 'linear',
                    showMark: true,
                    area: true,
                  },
                ]}
                xAxis={[{ 
                  scaleType: 'point', 
                  data: monthLabels,
                }]}
                yAxis={[{ 
                  min: 0,
                }]}
                height={270}
                margin={{ left: 40, right: 20, top: 20, bottom: 30 }}
                slotProps={{
                  legend: { hidden: true }
                }}
              />
            </Box>
          </CardContent>
        </Card>
      </Box>

      {/* Solicitudes Chart */}
      <Card>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Box>
              <Typography variant="h6" fontWeight={700}>
                Historial de Solicitudes
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Comparación de solicitudes vs aprobaciones
              </Typography>
            </Box>
            <Chip label="Últimos 6 meses" size="small" color="primary" variant="outlined" />
          </Box>
          <Divider sx={{ mb: 2 }} />
          <Box sx={{ height: 300, width: '100%' }}>
            <BarChart
              series={[
                { 
                  data: requestsData.map(d => d.solicitudes), 
                  label: 'Solicitudes', 
                  color: '#1976d2',
                  stack: 'total',
                },
                { 
                  data: requestsData.map(d => d.aprobadas), 
                  label: 'Aprobadas', 
                  color: '#4caf50',
                  stack: 'total',
                },
              ]}
              xAxis={[{ 
                scaleType: 'band', 
                data: requestsData.map(d => d.month),
              }]}
              height={270}
              margin={{ left: 50, right: 20, top: 20, bottom: 30 }}
            />
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default AvailableDays;
