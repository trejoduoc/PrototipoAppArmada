# 🏟️ Sistema de Gestión de Instalaciones Deportivas — Escuela Militar de Chile

![Figma Prototype](https://img.shields.io/badge/Figma-Prototype-F24E1E?style=for-the-badge&logo=figma&logoColor=white)
![Status](https://img.shields.io/badge/Status-Complete-brightgreen?style=for-the-badge)
![Platform](https://img.shields.io/badge/Platform-iOS%20%2F%20Android-blue?style=for-the-badge)

Prototipo interactivo diseñado en **Figma** para la modernización y optimización de la gestión, programación y reserva de los 14 recintos deportivos especializados de la **Escuela Militar del Ejército de Chile**.

---

## 📌 Contexto del Proyecto

La Escuela Militar cuenta con una infraestructura de alto rendimiento destinada al desarrollo académico, militar, cultural y deportivo de sus alumnos. Sus recintos deportivos son utilizados diariamente por una amplia variedad de usuarios institucionales y externos:

* **Comunidad Interna:** Alumnos de la Escuela Militar y Ramas Deportivas Institucionales.
* **Exalumnos:** Corporación de Exalumnos y Promociones.
* **Deporte Nacional:** Federación Deportiva Nacional de Rugby de Chile y Selecciones Nacionales (*Los Cóndores XV* y *Los Cóndores Seven*).
* **Entidades Externas:** Colegios (ej. Colegio Alcázar de Las Condes), Fundaciones y Programas de Vinculación con el Medio (*Miradas Compartidas*).

La convivencia de múltiples actividades genera semanalmente una alta demanda por los espacios (canchas de pasto natural, gimnasios, pista atlética, etc.), haciendo indispensable una planificación centralizada que optimice recursos y evite conflictos de horario.

---

## 🚀 Características Principales del Prototipo

El prototipo móvil diseñado para iPhone incluye **5 pantallas totalmente navegables e interactivas**:

### 1. 🏠 Dashboard / Inicio
* **Encabezado Personalizado:** Avatar de usuario y contador de notificaciones activas.
* **Búsqueda Rápida & Filtros:** Carrusel por categorías (*Atletismo, Rugby, Fútbol, Básquetbol, Combate, etc.*).
* **Estado de Reservas:** Widget con reservas agendadas y solicitudes activas.
* **Disponibilidad en Tiempo Real:** Tarjetas con metadatos (*iluminación, tipo de superficie, capacidad*) y matriz 2x2 de disponibilidad en vivo.

### 2. 📅 Detalle de Recinto y Reserva
* **Información del Espacio:** Banner en alta resolución y ficha técnica en grilla de 3 columnas.
* **Calendario e Intervalos Horarios:** Selector de fecha (5 días) y selector interactivo de bloques horarios (12 slots) con distinción visual de horas ocupadas/disponibles (integrado con Google Calendar).
* **Formulario de Solicitud:** Selector de grupo de usuario (*Cadetes, Los Cóndores, Externo, Alumni*), campo de motivo de uso y zona para adjuntar documentación/permisos oficiales.

### 3. 🗓️ Calendario Semanal y Mensual
* **Vista Semanal / Mensual (Toggle Switch):**
  * **Vista Semanal:** Grilla de eventos por días con código de color por tipo de usuario.
  * **Vista Mensual:** Cuadrícula de 30/31 días con indicadores de ocupación y desglose de eventos al seleccionar un día.
* **Código de Colores Oficial:**
  * 🔵 **Azul:** Cadetes
  * 🟡 **Dorado:** Selecciones Nacionales (*Los Cóndores*)
  * 🟢 **Verde:** Entidades Externas
  * 🟣 **Púrpura:** Alumni / Exalumnos

### 4. 📑 Mis Reservas
* **Vista por Pestañas:** *Todas*, *Activas*, *Historial*.
* **Tarjetas de Estado:** Indicadores claros de estado (*Aprobado*, *Pendiente*, *En Revisión*, *Cancelado*).

### 5. 🛠️ Panel de Administración (Vista Staff / Admin)
* **Widget de Alertas de Conflicto:** Detección automática de traslapes en recintos críticos.
* **Gestión de Solicitudes Pendientes:**
  * Acciones rápidas: *Aprobar*, *Solicitar Revisión*, *Rechazar* o *Eliminar*.
  * **Modal de Respuesta Personalizada:** Ventana emergente para redactar un mensaje/observación al usuario solicitante.
* **Analítica de Uso:** Gráfico de barras semanal codificado por porcentaje de ocupación (*Verde → Ámbar → Rojo*).

### 🔔 Centro de Notificaciones
* Acceso directo desde el icono de campana en la barra superior.
* Historial de alertas en tiempo real sobre aprobaciones, cambios de estado o solicitudes de revisión.
* Filtros por *Todas*, *Solicitudes* y *Alertas del Sistema*.

---

## 🎨 Sistema de Diseño & Identidad Visual

| Elemento | Descripción |
| :--- | :--- |
| **Estilo Visual** | Limpio, estructurado, de alto contraste e institucional. |
| **Paleta de Colores** | Azul Marino Institucional, Verde Oliva/Ejército, Gris Pizarra, Blanco Puro y Dorado/Naranja para CTAs y estados. |
| **Tipografía** | San-serif limpia y legible (SF Pro / Inter). |
| **Navegación** | Bottom Navigation Bar fija de 5 pestañas (*Inicio, Recintos, Calendario, Mis Reservas, Perfil*). |

---

## 🛠️ Tecnologías y Herramientas Utilizadas

* **Figma & Figma AI:** Diseño de interfaz (UI), componentes interactivos y prototipado de flujos (UX).
* **Prompt Engineering:** Generación e iteración modular de prototipos con inteligencia artificial.

---

## 🔗 Enlace al Prototipo

Puedes interactuar con el prototipo navegable directamente en Figma:
👉 **[Ver Prototipo Interactivo en Figma](https://figma.com)** *(Reemplaza este enlace con la URL de tu archivo en Figma)*
