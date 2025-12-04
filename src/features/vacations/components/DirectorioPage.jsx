import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Button,
  Grid,
  Card,
  CardContent,
  Avatar,
  Collapse,
  IconButton,
  Paper
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import WorkIcon from '@mui/icons-material/Work';
import BusinessIcon from '@mui/icons-material/Business';
import { empleadosService } from '../../../services/empleados.service';

const DirectorioPage = () => {
  const [empleados, setEmpleados] = useState([]);
  const [empleadosFiltrados, setEmpleadosFiltrados] = useState([]);
  const [filtros, setFiltros] = useState({
    nombre: '',
    puesto: '',
    area: ''
  });
  const [puestos, setPuestos] = useState([]);
  const [areas, setAreas] = useState([]);
  const [expandedCard, setExpandedCard] = useState(null);
  const [showFilters, setShowFilters] = useState(true);

  useEffect(() => {
    cargarEmpleados();
  }, []);

  const cargarEmpleados = async () => {
    try {
      const data = await empleadosService.getAll();
      setEmpleados(data);
      setEmpleadosFiltrados(data);
      
      // Extraer puestos y áreas únicos
      const puestosUnicos = [...new Set(data.map(e => e.puesto).filter(Boolean))];
      const areasUnicas = [...new Set(data.map(e => e.area).filter(Boolean))];
      
      setPuestos(puestosUnicos.sort());
      setAreas(areasUnicas.sort());
    } catch (error) {
      console.error('Error al cargar empleados:', error);
    }
  };

  const handleFiltroChange = (campo, valor) => {
    const nuevosFiltros = { ...filtros, [campo]: valor };
    setFiltros(nuevosFiltros);
    aplicarFiltros(nuevosFiltros);
  };

  const aplicarFiltros = (filtrosActuales) => {
    let resultados = [...empleados];

    if (filtrosActuales.nombre) {
      const busqueda = filtrosActuales.nombre.toLowerCase();
      resultados = resultados.filter(emp =>
        emp.nombre?.toLowerCase().includes(busqueda) ||
        emp.apellidoPaterno?.toLowerCase().includes(busqueda) ||
        emp.apellidoMaterno?.toLowerCase().includes(busqueda) ||
        emp.email?.toLowerCase().includes(busqueda)
      );
    }

    if (filtrosActuales.puesto) {
      resultados = resultados.filter(emp => emp.puesto === filtrosActuales.puesto);
    }

    if (filtrosActuales.area) {
      resultados = resultados.filter(emp => emp.area === filtrosActuales.area);
    }

    setEmpleadosFiltrados(resultados);
  };

  const limpiarFiltros = () => {
    setFiltros({ nombre: '', puesto: '', area: '' });
    setEmpleadosFiltrados(empleados);
  };

  const handleExpandClick = (id) => {
    setExpandedCard(expandedCard === id ? null : id);
  };

  const getNombreCompleto = (empleado) => {
    return `${empleado.nombre || ''} ${empleado.apellidoPaterno || ''} ${empleado.apellidoMaterno || ''}`.trim();
  };

  const getIniciales = (empleado) => {
    const nombre = empleado.nombre || '';
    const apellido = empleado.apellidoPaterno || '';
    return `${nombre.charAt(0)}${apellido.charAt(0)}`.toUpperCase();
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Filtros */}
      <Paper elevation={0} sx={{ p: 3, mb: 4, bgcolor: '#ffffff', borderRadius: 2, border: '1px solid #dee2e6' }}>
        <Grid container spacing={3} alignItems="flex-end">
          <Grid item xs={12} md={4}>
            <Typography variant="subtitle2" sx={{ mb: 1, color: '#495057', fontWeight: 500 }}>
              Nombre del Empleado
            </Typography>
            <TextField
              fullWidth
              placeholder="Buscar por nombre..."
              value={filtros.nombre}
              onChange={(e) => {
                const valor = e.target.value;
                setFiltros(prev => ({ ...prev, nombre: valor }));
                handleFiltroChange('nombre', valor);
              }}
              variant="outlined"
              size="medium"
              sx={{
                '& .MuiOutlinedInput-root': {
                  bgcolor: '#fff'
                }
              }}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <Typography variant="subtitle2" sx={{ mb: 1, color: '#495057', fontWeight: 500 }}>
              Título del Puesto
            </Typography>
            <FormControl fullWidth size="medium">
              <Select
                value={filtros.puesto}
                onChange={(e) => handleFiltroChange('puesto', e.target.value)}
                displayEmpty
                sx={{
                  bgcolor: '#f8f9fa',
                  '& .MuiSelect-select': {
                    color: filtros.puesto ? '#212529' : '#6c757d'
                  }
                }}
              >
                <MenuItem value="">-- Seleccionar --</MenuItem>
                {puestos.map((puesto) => (
                  <MenuItem key={puesto} value={puesto}>
                    {puesto}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={3}>
            <Typography variant="subtitle2" sx={{ mb: 1, color: '#495057', fontWeight: 500 }}>
              Ubicación
            </Typography>
            <FormControl fullWidth size="medium">
              <Select
                value={filtros.area}
                onChange={(e) => handleFiltroChange('area', e.target.value)}
                displayEmpty
                sx={{
                  bgcolor: '#f8f9fa',
                  '& .MuiSelect-select': {
                    color: filtros.area ? '#212529' : '#6c757d'
                  }
                }}
              >
                <MenuItem value="">-- Seleccionar --</MenuItem>
                {areas.map((area) => (
                  <MenuItem key={area} value={area}>
                    {area}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={2}>
            <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
              <Button
                variant="outlined"
                fullWidth
                onClick={limpiarFiltros}
                size="large"
                sx={{ 
                  borderColor: '#6c757d',
                  color: '#6c757d',
                  height: '56px',
                  textTransform: 'none',
                  fontWeight: 500,
                  '&:hover': {
                    borderColor: '#5a6268',
                    bgcolor: 'rgba(108, 117, 125, 0.04)'
                  }
                }}
              >
                Reiniciar
              </Button>
              <Button
                variant="contained"
                fullWidth
                size="large"
                onClick={() => aplicarFiltros(filtros)}
                sx={{ 
                  bgcolor: '#5cb85c',
                  height: '56px',
                  textTransform: 'none',
                  fontWeight: 500,
                  '&:hover': { bgcolor: '#4cae4c' }
                }}
              >
                Buscar
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {/* Resultados */}
      <Typography variant="h6" sx={{ mb: 3, color: '#6c757d', fontWeight: 400 }}>
        ({empleadosFiltrados.length}) Registros Encontrados
      </Typography>

      <Grid container spacing={3}>
        {empleadosFiltrados.map((empleado) => (
          <Grid item xs={12} sm={12} md={3} lg={3} key={empleado.id}>
            <Card 
              sx={{ 
                height: '400px',
                display: 'flex',
                flexDirection: 'column',
                transition: 'all 0.3s',
                border: '1px solid #e0e0e0',
                borderRadius: 2,
                '&:hover': {
                  boxShadow: 6,
                  transform: 'translateY(-4px)',
                  borderColor: '#2a9d8f'
                }
              }}
            >
              <CardContent sx={{ 
                textAlign: 'center', 
                p: 3,
                display: 'flex', 
                flexDirection: 'column',
                height: '100%',
                overflow: 'hidden'
              }}>
                <Avatar
                  sx={{
                    width: 100,
                    height: 100,
                    margin: '0 auto 16px',
                    bgcolor: '#264653',
                    fontSize: '2.5rem',
                    fontWeight: 600,
                    flexShrink: 0
                  }}
                >
                  {getIniciales(empleado)}
                </Avatar>
                
                <Typography 
                  variant="h6" 
                  sx={{ 
                    fontWeight: 600, 
                    color: '#264653',
                    fontSize: '1.05rem',
                    lineHeight: 1.3,
                    height: '54px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    overflow: 'hidden',
                    mb: 1,
                    flexShrink: 0
                  }}
                >
                  {getNombreCompleto(empleado)}
                </Typography>

                <Typography 
                  variant="body2" 
                  sx={{ 
                    color: '#6c757d',
                    fontSize: '0.875rem',
                    height: '24px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    mb: 2,
                    flexShrink: 0
                  }}
                >
                  {empleado.puesto || '—'}
                </Typography>

                <Box sx={{ 
                  textAlign: 'left', 
                  borderTop: '1px solid #e0e0e0', 
                  pt: 2,
                  pb: 1,
                  mt: 'auto',
                  flexShrink: 0
                }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5, height: '24px' }}>
                    <EmailIcon sx={{ mr: 1.5, color: '#2a9d8f', fontSize: 20, flexShrink: 0 }} />
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        color: '#495057', 
                        fontSize: '0.85rem',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        flex: 1
                      }}
                    >
                      {empleado.email || '—'}
                    </Typography>
                  </Box>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5, height: '24px' }}>
                    <PhoneIcon sx={{ mr: 1.5, color: '#2a9d8f', fontSize: 20, flexShrink: 0 }} />
                    <Typography variant="body2" sx={{ color: '#495057', fontSize: '0.85rem' }}>
                      {empleado.telefono || '—'}
                    </Typography>
                  </Box>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', height: '24px' }}>
                    <BusinessIcon sx={{ mr: 1.5, color: '#2a9d8f', fontSize: 20, flexShrink: 0 }} />
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        color: '#495057', 
                        fontSize: '0.85rem',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        flex: 1
                      }}
                    >
                      {empleado.area || '—'}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {empleadosFiltrados.length === 0 && (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <PersonIcon sx={{ fontSize: 80, color: '#dee2e6', mb: 2 }} />
          <Typography variant="h6" color="textSecondary">
            No se encontraron empleados con los filtros aplicados
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default DirectorioPage;
