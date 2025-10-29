# Reglas de Estilo y Desarrollo para el Proyecto

Este documento define las reglas y convenciones a seguir para mantener la consistencia, calidad y predictibilidad del código en todo el proyecto.

## 1. Estilo Unificado de Formularios

**Regla:** Todos los formularios de la aplicación deben seguir la estructura y el estilo visual del componente `RequestForm.jsx`. Este componente sirve como el estándar de referencia.

### Características Clave del Estilo `RequestForm`:

-   **Contenedor Principal:** El formulario debe estar envuelto en un componente `<Paper elevation={24}>` para darle una apariencia de tarjeta elevada y consistente.
-   **Encabezado:** Cada formulario debe tener un título claro usando `<Typography variant="h5" fontWeight={700}>`, precedido por un icono relevante de `@mui/icons-material`.
-   **Disposición de Campos:** Los campos del formulario deben organizarse utilizando un `<Grid container spacing={2}>`. Esto asegura un espaciado uniforme y una alineación correcta.
-   **Campos de Texto:** Utilizar el componente `<TextField>` estándar de Material-UI, empleando la prop `label` para el texto descriptivo en lugar de etiquetas `<Typography>` separadas.
-   **Botones de Acción:** Todos los botones de acción (Enviar, Cancelar, etc.) deben agruparse al final del formulario dentro de un componente `<Stack>`.

### Ejemplo de Estructura Base:

```jsx
import { Paper, Typography, Grid, TextField, Stack, Button } from '@mui/material';
import TuIcono from '@mui/icons-material/TuIcono';

export default function TuFormulario() {
  return (
    <Paper component="form" elevation={24} noValidate sx={{ p: 3 }}>
      <Typography variant="h5" fontWeight={700} gutterBottom sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <TuIcono sx={{ mr: 1 }} />
        Título del Formulario
      </Typography>
      <Grid container spacing={2}>
        {/* ... Tus componentes TextField van aquí ... */}
        <Grid item xs={12} md={6}>
          <TextField fullWidth label="Etiqueta del Campo" />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField fullWidth label="Otro Campo" />
        </Grid>
      </Grid>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mt: 3 }}>
        {/* ... Tus componentes Button van aquí ... */}
      </Stack>
    </Paper>
  );
}
```

## 2. Estilo de Botones en Formularios

**Regla:** Los botones dentro de los formularios deben reutilizar los estilos definidos en `RequestForm.jsx` para mantener una experiencia de usuario coherente.

-   **Botón Principal (Enviar/Guardar):**
    ```jsx
    <Button type="submit" variant="contained" sx={{ background: 'linear-gradient(135deg, #2a9d8f 0%, #264653 100%)', border: 'none', color: 'white', fontWeight: 600, px: 4 }} startIcon={<SendIcon />}>
      Enviar Solicitud
    </Button>
    ```
-   **Botón Secundario (Ver/Listar):**
    ```jsx
    <Button variant="outlined" sx={{ fontWeight: 500, color: '#6c757d', borderColor: '#6c757d', '&:hover': { color: '#fff', backgroundColor: '#6c757d', borderColor: '#6c757d' } }} startIcon={<ListAltIcon />}>
      Ver mis solicitudes
    </Button>
    ```
-   **Botón de Cancelar:**
    ```jsx
    <Button variant="outlined" sx={{ fontWeight: 500, color: '#dc3545', borderColor: '#dc3545', '&:hover': { color: '#fff', backgroundColor: '#dc3545', borderColor: '#dc3545' } }} startIcon={<CancelIcon />}>
      Cancelar
    </Button>
    ```
-   **Botón de Navegación (Regresar):**
    ```jsx
    <Button variant="outlined" sx={{ fontWeight: 500, color: '#0d6efd', borderColor: '#0d6efd', '&:hover': { color: '#fff', backgroundColor: '#0d6efd', borderColor: '#0d6efd' } }} startIcon={<HomeIcon />}>
      Regresar
    </Button>
    ```

## 3. Principio de Mínima Modificación

**Regla:** Al responder a una solicitud de cambio, modifica **únicamente** el código necesario para cumplir con lo que se ha pedido. No se deben realizar cambios, refactorizaciones o mejoras adicionales que no hayan sido solicitadas explícitamente. Esto asegura que el alcance de cada cambio sea predecible y fácil de revisar.
