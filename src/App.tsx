import { useState } from 'react'

// ─── Types ────────────────────────────────────────────────────────────────────
type Screen = 'home' | 'facilities' | 'calendar' | 'bookings' | 'profile' | 'detail' | 'admin' | 'notifications'
type BookingStatus = 'Aprobado' | 'Pendiente' | 'Cancelado' | 'Mantenimiento'
type UserGroup = 'Cadetes' | 'Los Cóndores' | 'Externo' | 'Alumni'
type AdminAction = 'Aprobar' | 'Revisión' | 'Rechazar'

interface Facility {
  id: string; name: string; nameEn: string; category: string; capacity: number
  surface: string; lighting: boolean; status: 'Disponible' | 'Ocupado' | 'Mantenimiento'
  nextAvailable?: string; image: string; location: string; description: string
}

interface Booking {
  id: string; facility: string; date: string; time: string
  status: BookingStatus; group: UserGroup; purpose: string
}

interface PendingRequest {
  id: string; user: string; facility: string; date: string
  time: string; group: UserGroup; purpose: string; conflict: boolean
}

interface Notification {
  id: string; type: 'request' | 'system' | 'alert'
  title: string; body: string; time: string; read: boolean
  actionLabel?: string; actionTarget?: string
}

interface AdminModal {
  request: PendingRequest; action: AdminAction
}

// ─── Data ─────────────────────────────────────────────────────────────────────
const facilities: Facility[] = [
  { id: 'f1', name: 'Pista Atlética', nameEn: 'Athletics Track', category: 'Atletismo', capacity: 200, surface: 'Sintética (Tartan)', lighting: true, status: 'Disponible', nextAvailable: '14:00', image: 'https://images.unsplash.com/photo-1547347298-4074fc3086f0?w=800&h=400&fit=crop&auto=format', location: 'Sector Norte, Campus Principal', description: 'Pista reglamentaria de 400m con 8 carriles. Homologada para competencias internacionales de atletismo.' },
  { id: 'f2', name: 'Cancha de Rugby N.° 2', nameEn: 'Rugby Pitch No. 2', category: 'Rugby', capacity: 500, surface: 'Césped Natural', lighting: true, status: 'Ocupado', nextAvailable: '17:00', image: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800&h=400&fit=crop&auto=format', location: 'Sector Sur, Área Deportiva', description: 'Cancha oficial de rugby union, césped natural premium. Campo de los Cóndores para entrenamientos de la selección nacional.' },
  { id: 'f3', name: 'Estadio Principal', nameEn: 'Main Stadium', category: 'Fútbol', capacity: 2500, surface: 'Sintética (FIFA Pro)', lighting: true, status: 'Disponible', nextAvailable: '10:00', image: 'https://images.unsplash.com/photo-1521537634581-0dced2fee2ef?w=800&h=400&fit=crop&auto=format', location: 'Centro, Campus Principal', description: 'Estadio multideportivo con tribunas cubiertas. Principal recinto para competencias oficiales y eventos institucionales.' },
  { id: 'f4', name: 'Gimnasio Central', nameEn: 'Central Gymnasium', category: 'Gimnasio', capacity: 120, surface: 'Parquet', lighting: true, status: 'Ocupado', nextAvailable: '18:30', image: 'https://images.unsplash.com/photo-1593079831268-3381b0db4a77?w=800&h=400&fit=crop&auto=format', location: 'Edificio Deportivo, Piso 1', description: 'Gimnasio cubierto para básquetbol, voleibol e indoor. Sistema de piso flotante profesional.' },
  { id: 'f5', name: 'Cancha de Tenis N.° 1', nameEn: 'Tennis Court No. 1', category: 'Tenis', capacity: 4, surface: 'Arcilla', lighting: false, status: 'Disponible', nextAvailable: '09:00', image: 'https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?w=800&h=400&fit=crop&auto=format', location: 'Sector Oriente', description: 'Cancha profesional de arcilla roja. Superficie de competencia para torneos de tenis institucionales.' },
  { id: 'f6', name: 'Tatami Dojo', nameEn: 'Tatami Dojo', category: 'Especializado', capacity: 60, surface: 'Tatami EVA', lighting: true, status: 'Mantenimiento', nextAvailable: 'Lun 07:00', image: 'https://images.unsplash.com/photo-1555597673-b21d5c935865?w=800&h=400&fit=crop&auto=format', location: 'Edificio Especializado, Piso 2', description: 'Dojo con tatami homologado para artes marciales. Espejo de pared completa, sistema de ventilación.' },
]

const myBookings: Booking[] = [
  { id: 'b1', facility: 'Pista Atlética', date: 'Hoy', time: '15:00 – 17:00', status: 'Aprobado', group: 'Cadetes', purpose: 'Entrenamiento tropa' },
  { id: 'b2', facility: 'Cancha de Rugby N.° 2', date: 'Mañana', time: '09:00 – 11:00', status: 'Pendiente', group: 'Los Cóndores', purpose: 'Práctica selección' },
  { id: 'b3', facility: 'Estadio Principal', date: 'Vie 10 Oct', time: '18:00 – 21:00', status: 'Aprobado', group: 'Externo', purpose: 'Torneo interescuelas' },
  { id: 'b4', facility: 'Gimnasio Central', date: 'Sáb 11 Oct', time: '08:00 – 10:00', status: 'Cancelado', group: 'Alumni', purpose: 'Encuentro egresados' },
]

const initialPendingRequests: PendingRequest[] = [
  { id: 'r1', user: 'Ten. Rodrigo Salinas', facility: 'Cancha de Rugby N.° 2', date: 'Mié 8 Oct', time: '09:00–11:00', group: 'Los Cóndores', purpose: 'Práctica selección nacional', conflict: false },
  { id: 'r2', user: 'Cdt. Valentina Mora', facility: 'Pista Atlética', date: 'Jue 9 Oct', time: '14:00–16:00', group: 'Cadetes', purpose: 'Entrenamiento atletismo', conflict: false },
  { id: 'r3', user: 'Club Deportivo Providencia', facility: 'Estadio Principal', date: 'Sáb 11 Oct', time: '10:00–13:00', group: 'Externo', purpose: 'Partido amistoso', conflict: true },
  { id: 'r4', user: 'Asoc. Alumni EMCH', facility: 'Gimnasio Central', date: 'Dom 12 Oct', time: '08:00–10:00', group: 'Alumni', purpose: 'Torneo interno', conflict: false },
]

const initialNotifications: Notification[] = [
  { id: 'n1', type: 'request', title: 'Reserva Aprobada', body: 'Tu solicitud para Pista Atlética el Hoy 15:00–17:00 fue aprobada por el administrador.', time: 'Hace 10 min', read: false, actionLabel: 'Ver Reserva', actionTarget: 'bookings' },
  { id: 'n2', type: 'alert', title: 'Revisión Solicitada', body: 'El administrador solicitó una revisión para tu reserva en Gimnasio Central. Agrega documentación adicional.', time: 'Hace 1 h', read: false, actionLabel: 'Ver Detalle', actionTarget: 'bookings' },
  { id: 'n3', type: 'system', title: 'Nueva Solicitud Pendiente', body: 'Club Deportivo Providencia solicitó el Estadio Principal para Sáb 11 Oct. Requiere aprobación.', time: 'Hace 2 h', read: true, actionLabel: 'Revisar', actionTarget: 'admin' },
  { id: 'n4', type: 'request', title: 'Solicitud Rechazada', body: 'Tu solicitud para Cancha de Tenis N.° 1 el Dom 12 Oct fue rechazada por superposición de horarios.', time: 'Ayer', read: true, actionLabel: 'Ver Reservas', actionTarget: 'bookings' },
  { id: 'n5', type: 'system', title: 'Mantenimiento Programado', body: 'Tatami Dojo estará en mantenimiento desde el Lun 14 Oct hasta el Mié 16 Oct. Reservas afectadas serán reprogramadas.', time: 'Ayer', read: true },
  { id: 'n6', type: 'alert', title: 'Conflicto de Horario', body: 'Se detectó superposición en Estadio Principal — Sáb 11 Oct 10:00–13:00. Revisa antes de aprobar.', time: 'Hace 3 h', read: false, actionLabel: 'Ver Admin', actionTarget: 'admin' },
]

const calendarEvents = [
  { day: 'Lun', facility: 'Pista Atlética', time: '07:00', group: 'Cadetes' as UserGroup, label: 'Ent. Tropa' },
  { day: 'Lun', facility: 'Estadio Principal', time: '14:00', group: 'Externo' as UserGroup, label: 'Liga Estudiantil' },
  { day: 'Mar', facility: 'Cancha Rugby N.°2', time: '09:00', group: 'Los Cóndores' as UserGroup, label: 'Selección Nacional' },
  { day: 'Mar', facility: 'Gimnasio Central', time: '17:00', group: 'Cadetes' as UserGroup, label: 'Básquetbol' },
  { day: 'Mié', facility: 'Pista Atlética', time: '10:00', group: 'Alumni' as UserGroup, label: 'Egresados' },
  { day: 'Mié', facility: 'Tenis N.°1', time: '15:00', group: 'Cadetes' as UserGroup, label: 'Tenis Cadetes' },
  { day: 'Jue', facility: 'Estadio Principal', time: '08:00', group: 'Los Cóndores' as UserGroup, label: 'Selección Fútbol' },
  { day: 'Jue', facility: 'Cancha Rugby N.°2', time: '16:00', group: 'Externo' as UserGroup, label: 'Club USACH' },
  { day: 'Vie', facility: 'Pista Atlética', time: '07:00', group: 'Cadetes' as UserGroup, label: 'Atletismo' },
  { day: 'Vie', facility: 'Estadio Principal', time: '19:00', group: 'Externo' as UserGroup, label: 'Torneo Copa' },
  { day: 'Sáb', facility: 'Estadio Principal', time: '10:00', group: 'Externo' as UserGroup, label: 'Partido Amist.' },
  { day: 'Sáb', facility: 'Gimnasio Central', time: '14:00', group: 'Alumni' as UserGroup, label: 'Encuentro' },
]

// Monthly calendar data — events per day number (Oct 2025)
const monthlyEvents: Record<number, Array<{ group: UserGroup; label: string; facility: string; time: string }>> = {
  1: [{ group: 'Cadetes', label: 'Atletismo', facility: 'Pista Atlética', time: '07:00' }],
  3: [{ group: 'Los Cóndores', label: 'Selección', facility: 'Rugby N.°2', time: '09:00' }, { group: 'Cadetes', label: 'Básquetbol', facility: 'Gimnasio', time: '17:00' }],
  6: [{ group: 'Alumni', label: 'Egresados', facility: 'Pista Atlética', time: '10:00' }, { group: 'Cadetes', label: 'Tenis', facility: 'Tenis N.°1', time: '15:00' }],
  7: [{ group: 'Cadetes', label: 'Ent. Tropa', facility: 'Pista Atlética', time: '07:00' }, { group: 'Externo', label: 'Liga', facility: 'Estadio', time: '14:00' }],
  8: [{ group: 'Los Cóndores', label: 'Selección', facility: 'Rugby N.°2', time: '09:00' }],
  9: [{ group: 'Los Cóndores', label: 'Fútbol', facility: 'Estadio', time: '08:00' }, { group: 'Externo', label: 'USACH', facility: 'Rugby N.°2', time: '16:00' }],
  10: [{ group: 'Cadetes', label: 'Atletismo', facility: 'Pista Atlética', time: '07:00' }, { group: 'Externo', label: 'Torneo', facility: 'Estadio', time: '19:00' }],
  11: [{ group: 'Externo', label: 'Amistoso', facility: 'Estadio', time: '10:00' }, { group: 'Alumni', label: 'Encuentro', facility: 'Gimnasio', time: '14:00' }],
  13: [{ group: 'Cadetes', label: 'Básquetbol', facility: 'Gimnasio', time: '17:00' }],
  14: [{ group: 'Los Cóndores', label: 'Selección', facility: 'Rugby N.°2', time: '09:00' }],
  15: [{ group: 'Externo', label: 'Providencia', facility: 'Estadio', time: '10:00' }, { group: 'Cadetes', label: 'Atletismo', facility: 'Pista', time: '14:00' }],
  17: [{ group: 'Alumni', label: 'Egresados', facility: 'Pista Atlética', time: '10:00' }],
  18: [{ group: 'Los Cóndores', label: 'Fútbol', facility: 'Estadio', time: '08:00' }],
  20: [{ group: 'Cadetes', label: 'Tenis', facility: 'Tenis N.°1', time: '15:00' }],
  21: [{ group: 'Externo', label: 'Torneo', facility: 'Estadio', time: '19:00' }, { group: 'Alumni', label: 'Encuentro', facility: 'Gimnasio', time: '14:00' }],
  22: [{ group: 'Los Cóndores', label: 'Selección', facility: 'Rugby N.°2', time: '09:00' }],
  24: [{ group: 'Cadetes', label: 'Ent. Tropa', facility: 'Pista Atlética', time: '07:00' }],
  25: [{ group: 'Externo', label: 'Liga', facility: 'Estadio', time: '14:00' }],
  27: [{ group: 'Los Cóndores', label: 'Fútbol', facility: 'Estadio', time: '08:00' }, { group: 'Cadetes', label: 'Atletismo', facility: 'Pista', time: '14:00' }],
  28: [{ group: 'Alumni', label: 'Egresados', facility: 'Pista Atlética', time: '10:00' }],
  30: [{ group: 'Externo', label: 'Copa', facility: 'Estadio', time: '19:00' }],
  31: [{ group: 'Cadetes', label: 'Básquetbol', facility: 'Gimnasio', time: '17:00' }, { group: 'Los Cóndores', label: 'Selección', facility: 'Rugby N.°2', time: '09:00' }],
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
function statusColor(status: BookingStatus | string) {
  switch (status) {
    case 'Aprobado': case 'Disponible': return 'bg-emerald-900/30 text-emerald-400 border-emerald-800'
    case 'Pendiente': case 'Ocupado': return 'bg-amber-900/30 text-amber-400 border-amber-800'
    case 'Cancelado': return 'bg-red-900/30 text-red-400 border-red-800'
    case 'Mantenimiento': return 'bg-purple-900/30 text-purple-400 border-purple-800'
    default: return 'bg-slate-800 text-slate-400 border-slate-700'
  }
}

function groupColor(group: UserGroup) {
  switch (group) {
    case 'Cadetes': return 'bg-blue-600'
    case 'Los Cóndores': return 'bg-amber-600'
    case 'Externo': return 'bg-emerald-600'
    case 'Alumni': return 'bg-purple-600'
  }
}

function groupDot(group: UserGroup) {
  switch (group) {
    case 'Cadetes': return 'bg-blue-500'
    case 'Los Cóndores': return 'bg-amber-500'
    case 'Externo': return 'bg-emerald-500'
    case 'Alumni': return 'bg-purple-500'
  }
}

function groupBadge(group: UserGroup) {
  switch (group) {
    case 'Cadetes': return 'bg-blue-900/40 text-blue-300 border-blue-800'
    case 'Los Cóndores': return 'bg-amber-900/40 text-amber-300 border-amber-800'
    case 'Externo': return 'bg-emerald-900/40 text-emerald-300 border-emerald-800'
    case 'Alumni': return 'bg-purple-900/40 text-purple-300 border-purple-800'
  }
}

function actionColor(action: AdminAction) {
  switch (action) {
    case 'Aprobar': return { bg: 'bg-emerald-600 hover:bg-emerald-500', text: 'text-white', border: 'border-emerald-600' }
    case 'Revisión': return { bg: 'bg-amber-600 hover:bg-amber-500', text: 'text-white', border: 'border-amber-600' }
    case 'Rechazar': return { bg: 'bg-red-700 hover:bg-red-600', text: 'text-white', border: 'border-red-700' }
  }
}

// ─── Icons ────────────────────────────────────────────────────────────────────
const HomeIcon = ({ active }: { active: boolean }) => (
  <svg viewBox="0 0 24 24" fill={active ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth={active ? 0 : 1.8} className="w-6 h-6">
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
  </svg>
)
const FacilityIcon = ({ active }: { active: boolean }) => (
  <svg viewBox="0 0 24 24" fill={active ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth={active ? 0 : 1.8} className="w-6 h-6">
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 7.125C2.25 6.504 2.754 6 3.375 6h6c.621 0 1.125.504 1.125 1.125v3.75c0 .621-.504 1.125-1.125 1.125h-6a1.125 1.125 0 01-1.125-1.125v-3.75zM14.25 8.625c0-.621.504-1.125 1.125-1.125h5.25c.621 0 1.125.504 1.125 1.125v8.25c0 .621-.504 1.125-1.125 1.125h-5.25a1.125 1.125 0 01-1.125-1.125v-8.25zM3.75 16.125c0-.621.504-1.125 1.125-1.125h5.25c.621 0 1.125.504 1.125 1.125v2.25c0 .621-.504 1.125-1.125 1.125h-5.25a1.125 1.125 0 01-1.125-1.125v-2.25z" />
  </svg>
)
const CalendarIcon = ({ active }: { active: boolean }) => (
  <svg viewBox="0 0 24 24" fill={active ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth={active ? 0 : 1.8} className="w-6 h-6">
    <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
  </svg>
)
const BookingIcon = ({ active }: { active: boolean }) => (
  <svg viewBox="0 0 24 24" fill={active ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth={active ? 0 : 1.8} className="w-6 h-6">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25z" />
  </svg>
)
const ProfileIcon = ({ active }: { active: boolean }) => (
  <svg viewBox="0 0 24 24" fill={active ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth={active ? 0 : 1.8} className="w-6 h-6">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
  </svg>
)

// ─── Admin Action Modal ────────────────────────────────────────────────────────
function AdminActionModal({
  modal, onConfirm, onCancel,
}: {
  modal: AdminModal
  onConfirm: (message: string) => void
  onCancel: () => void
}) {
  const [message, setMessage] = useState('')
  const colors = actionColor(modal.action)
  const actionLabels: Record<AdminAction, string> = {
    'Aprobar': 'Confirmar Aprobación',
    'Revisión': 'Solicitar Revisión',
    'Rechazar': 'Confirmar Rechazo',
  }
  const placeholders: Record<AdminAction, string> = {
    'Aprobar': 'Ej: Reserva aprobada. Recuerda traer permiso el día del evento.',
    'Revisión': 'Ej: Adjunta el formulario F-23 firmado por el oficial de turno.',
    'Rechazar': 'Ej: Superposición con mantenimiento programado. Reagenda para semana siguiente.',
  }

  return (
    <div className="absolute inset-0 z-50 flex items-end" style={{ borderRadius: 44 }}>
      {/* Backdrop */}
      <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" onClick={onCancel} style={{ borderRadius: 44 }} />

      {/* Sheet */}
      <div className="relative w-full bg-slate-900 border-t border-slate-700/60 rounded-t-3xl px-5 pt-3 pb-8 z-10">
        {/* Handle */}
        <div className="w-10 h-1 bg-slate-700 rounded-full mx-auto mb-5" />

        {/* Action badge */}
        <div className="flex items-center gap-2 mb-4">
          <div className={`w-2 h-2 rounded-full ${modal.action === 'Aprobar' ? 'bg-emerald-400' : modal.action === 'Revisión' ? 'bg-amber-400' : 'bg-red-400'}`} />
          <span className={`text-xs font-semibold tracking-widest uppercase ${modal.action === 'Aprobar' ? 'text-emerald-400' : modal.action === 'Revisión' ? 'text-amber-400' : 'text-red-400'}`}>
            {modal.action}
          </span>
        </div>

        {/* Request summary */}
        <div className="bg-slate-800/60 border border-slate-700/50 rounded-xl p-3.5 mb-4">
          <p className="text-white text-sm font-semibold">{modal.request.user}</p>
          <p className="text-slate-400 text-xs mt-1">{modal.request.facility}</p>
          <p className="text-slate-500 text-xs mt-0.5">{modal.request.date} · {modal.request.time}</p>
          <div className="flex items-center gap-2 mt-2">
            <span className={`px-2 py-0.5 rounded-full border text-xs font-medium ${groupBadge(modal.request.group)}`}>{modal.request.group}</span>
            <span className="text-slate-500 text-xs">{modal.request.purpose}</span>
          </div>
        </div>

        {/* Message field */}
        <div className="mb-4">
          <label className="text-slate-400 text-xs font-semibold tracking-widest uppercase block mb-2">
            Mensaje para el solicitante <span className="text-red-400">*</span>
          </label>
          <textarea
            value={message}
            onChange={e => setMessage(e.target.value)}
            rows={3}
            placeholder={placeholders[modal.action]}
            className="w-full bg-slate-800/60 border border-slate-700/60 rounded-xl px-3.5 py-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-amber-500/60 resize-none"
          />
          {message.trim().length === 0 && (
            <p className="text-slate-600 text-xs mt-1">Campo obligatorio antes de confirmar.</p>
          )}
        </div>

        {/* Buttons */}
        <div className="flex gap-2.5">
          <button
            onClick={onCancel}
            className="flex-1 py-3 rounded-xl border border-slate-700 text-slate-400 text-sm font-semibold"
          >
            Cancelar
          </button>
          <button
            disabled={message.trim().length === 0}
            onClick={() => message.trim().length > 0 && onConfirm(message)}
            className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all ${colors.bg} ${colors.text} disabled:opacity-40 disabled:cursor-not-allowed`}
          >
            {actionLabels[modal.action]}
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Delete Confirmation Modal ────────────────────────────────────────────────
function DeleteModal({ request, onConfirm, onCancel }: {
  request: PendingRequest; onConfirm: () => void; onCancel: () => void
}) {
  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center px-6" style={{ borderRadius: 44 }}>
      <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" onClick={onCancel} style={{ borderRadius: 44 }} />
      <div className="relative w-full bg-slate-900 border border-slate-700/60 rounded-2xl p-5 z-10">
        <div className="flex items-center gap-2.5 mb-3">
          <div className="w-8 h-8 rounded-full bg-red-900/40 flex items-center justify-center">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4 text-red-400">
              <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
            </svg>
          </div>
          <div>
            <p className="text-white text-sm font-bold">Eliminar Solicitud</p>
            <p className="text-slate-400 text-xs">Esta acción no se puede deshacer.</p>
          </div>
        </div>
        <div className="bg-slate-800/60 border border-slate-700/50 rounded-xl p-3 mb-4">
          <p className="text-white text-xs font-semibold">{request.user}</p>
          <p className="text-slate-500 text-xs mt-0.5">{request.facility} · {request.date}</p>
        </div>
        <div className="flex gap-2.5">
          <button onClick={onCancel} className="flex-1 py-3 rounded-xl border border-slate-700 text-slate-400 text-sm font-semibold">Cancelar</button>
          <button onClick={onConfirm} className="flex-1 py-3 rounded-xl bg-red-700 hover:bg-red-600 text-white text-sm font-bold transition-colors">Eliminar</button>
        </div>
      </div>
    </div>
  )
}

// ─── Notifications Screen ─────────────────────────────────────────────────────
function NotificationsScreen({
  notifications, onBack, onMarkAllRead, onNavigate,
}: {
  notifications: Notification[]
  onBack: () => void
  onMarkAllRead: () => void
  onNavigate: (target: string) => void
}) {
  const [filter, setFilter] = useState<'all' | 'request' | 'system'>('all')

  const filtered = notifications.filter(n => {
    if (filter === 'all') return true
    if (filter === 'request') return n.type === 'request' || n.type === 'alert'
    return n.type === 'system'
  })

  const unreadCount = notifications.filter(n => !n.read).length

  function notifIcon(type: Notification['type']) {
    if (type === 'request') return (
      <div className="w-9 h-9 rounded-full bg-blue-900/40 border border-blue-800/60 flex items-center justify-center flex-shrink-0">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-4 h-4 text-blue-400">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25z" />
        </svg>
      </div>
    )
    if (type === 'alert') return (
      <div className="w-9 h-9 rounded-full bg-amber-900/40 border border-amber-800/60 flex items-center justify-center flex-shrink-0">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-4 h-4 text-amber-400">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
        </svg>
      </div>
    )
    return (
      <div className="w-9 h-9 rounded-full bg-slate-800/60 border border-slate-700/60 flex items-center justify-center flex-shrink-0">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-4 h-4 text-slate-400">
          <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
        </svg>
      </div>
    )
  }

  return (
    <div className="flex-1 overflow-y-auto bg-slate-950">
      {/* Header */}
      <div className="bg-gradient-to-b from-[#0D1B3E] to-slate-950 px-5 pt-14 pb-5">
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-3">
            <button onClick={onBack} className="w-8 h-8 rounded-full bg-slate-800/60 border border-slate-700/50 flex items-center justify-center">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4 text-white">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
              </svg>
            </button>
            <div>
              <h2 className="text-white text-xl font-bold">Notificaciones</h2>
              {unreadCount > 0 && <p className="text-slate-500 text-xs">{unreadCount} sin leer</p>}
            </div>
          </div>
          {unreadCount > 0 && (
            <button onClick={onMarkAllRead} className="text-amber-400 text-xs font-semibold">
              Marcar todas leídas
            </button>
          )}
        </div>
      </div>

      <div className="px-5 pb-6 space-y-4">
        {/* Filter tabs */}
        <div className="flex bg-slate-900/80 border border-slate-800/60 rounded-xl p-1">
          {([['all', 'Todas'], ['request', 'Solicitudes'], ['system', 'Sistema']] as const).map(([val, label]) => (
            <button
              key={val}
              onClick={() => setFilter(val)}
              className={`flex-1 py-2 rounded-lg text-xs font-semibold transition-all ${filter === val ? 'bg-amber-500 text-slate-900' : 'text-slate-500'}`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Notification cards */}
        <div className="space-y-2.5">
          {filtered.map(notif => (
            <div
              key={notif.id}
              className={`bg-slate-900/80 border rounded-2xl p-4 transition-all ${
                !notif.read ? 'border-[#1A2F6E]/80 bg-[#0D1B3E]/40' : 'border-slate-800/60'
              }`}
            >
              <div className="flex items-start gap-3">
                {notifIcon(notif.type)}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <p className={`text-sm font-semibold leading-tight ${!notif.read ? 'text-white' : 'text-slate-300'}`}>
                      {notif.title}
                    </p>
                    <div className="flex items-center gap-1.5 flex-shrink-0">
                      {!notif.read && <div className="w-2 h-2 rounded-full bg-amber-400" />}
                      <span className="text-slate-600 text-xs">{notif.time}</span>
                    </div>
                  </div>
                  <p className="text-slate-500 text-xs mt-1 leading-relaxed">{notif.body}</p>
                  {notif.actionLabel && notif.actionTarget && (
                    <button
                      onClick={() => onNavigate(notif.actionTarget!)}
                      className="mt-2.5 flex items-center gap-1.5 text-amber-400 text-xs font-semibold"
                    >
                      {notif.actionLabel}
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} className="w-3 h-3">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                      </svg>
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}

          {filtered.length === 0 && (
            <div className="text-center py-12">
              <div className="w-12 h-12 rounded-full bg-slate-800/60 flex items-center justify-center mx-auto mb-3">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-6 h-6 text-slate-600">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
                </svg>
              </div>
              <p className="text-slate-600 text-sm">Sin notificaciones</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// ─── Home Screen ──────────────────────────────────────────────────────────────
function HomeScreen({
  onSelectFacility, onAdmin, onNotifications, unreadCount,
}: {
  onSelectFacility: (f: Facility) => void
  onAdmin: () => void
  onNotifications: () => void
  unreadCount: number
}) {
  const [activeCategory, setActiveCategory] = useState('Todos')
  const categories = ['Todos', 'Atletismo', 'Rugby', 'Fútbol', 'Gimnasio', 'Tenis', 'Especializado']
  const liveStatus = [
    { name: 'Estadio Principal', status: 'Disponible', until: '10:00 – 12:00' },
    { name: 'Rugby Pitch N.° 2', status: 'Ocupado', until: 'Libre a las 17:00' },
    { name: 'Pista Atlética', status: 'Disponible', until: 'Desde 14:00' },
    { name: 'Gym Central', status: 'Ocupado', until: 'Libre a las 18:30' },
  ]

  return (
    <div className="flex-1 overflow-y-auto bg-slate-950 pb-4">
      <div className="bg-gradient-to-b from-[#0D1B3E] to-slate-950 px-5 pt-14 pb-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-amber-500/20 border border-amber-500/40 flex items-center justify-center">
              <span className="text-amber-400 text-sm font-bold">CR</span>
            </div>
            <div>
              <p className="text-slate-400 text-xs font-medium tracking-widest uppercase">Bienvenido</p>
              <p className="text-white text-sm font-semibold">Cdt. Carlos Ramírez</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={onAdmin} className="w-9 h-9 rounded-full bg-slate-800/60 border border-slate-700/50 flex items-center justify-center">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-4 h-4 text-slate-300">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 010 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 010-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </button>
            <button onClick={onNotifications} className="w-9 h-9 rounded-full bg-slate-800/60 border border-slate-700/50 flex items-center justify-center relative">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-4 h-4 text-slate-300">
                <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
              </svg>
              {unreadCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-amber-500 rounded-full flex items-center justify-center">
                  <span className="text-slate-900 text-xs font-bold" style={{ fontSize: 9 }}>{unreadCount}</span>
                </span>
              )}
            </button>
          </div>
        </div>
        <div className="relative">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 15.803 7.5 7.5 0 0015.803 15.803z" />
          </svg>
          <input className="w-full bg-slate-800/60 border border-slate-700/60 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500/50" placeholder="Buscar instalación, deporte…" />
        </div>
      </div>

      <div className="px-5 space-y-6 mt-2">
        <div>
          <p className="text-slate-400 text-xs font-semibold tracking-widest uppercase mb-3">Próximas Reservas</p>
          <div className="bg-gradient-to-r from-[#0D1B3E] to-[#122152] border border-[#1A2F6E]/60 rounded-2xl p-4">
            <div className="flex items-center justify-between mb-3">
              <div><p className="text-white font-semibold text-sm">Pista Atlética</p><p className="text-slate-400 text-xs mt-0.5">Hoy · 15:00 – 17:00</p></div>
              <span className="px-2.5 py-1 rounded-full bg-emerald-900/40 text-emerald-400 border border-emerald-800 text-xs font-medium">Aprobado</span>
            </div>
            <div className="h-px bg-slate-700/50 mb-3" />
            <div className="flex items-center justify-between">
              <div><p className="text-white font-semibold text-sm">Cancha Rugby N.° 2</p><p className="text-slate-400 text-xs mt-0.5">Mañana · 09:00 – 11:00</p></div>
              <span className="px-2.5 py-1 rounded-full bg-amber-900/40 text-amber-400 border border-amber-800 text-xs font-medium">Pendiente</span>
            </div>
          </div>
        </div>

        <div>
          <p className="text-slate-400 text-xs font-semibold tracking-widest uppercase mb-3">Instalaciones</p>
          <div className="flex gap-2 overflow-x-auto pb-1">
            {categories.map(cat => (
              <button key={cat} onClick={() => setActiveCategory(cat)} className={`flex-shrink-0 px-3.5 py-1.5 rounded-full text-xs font-semibold border transition-all ${activeCategory === cat ? 'bg-amber-500 text-slate-900 border-amber-500' : 'bg-slate-800/60 text-slate-400 border-slate-700/60'}`}>{cat}</button>
            ))}
          </div>
          <div className="mt-4 space-y-3">
            {facilities.filter(f => activeCategory === 'Todos' || f.category === activeCategory).map(f => (
              <button key={f.id} onClick={() => onSelectFacility(f)} className="w-full text-left bg-slate-900/80 border border-slate-800/60 rounded-2xl overflow-hidden flex">
                <div className="w-24 h-20 flex-shrink-0 bg-slate-800"><img src={f.image} alt={f.name} className="w-full h-full object-cover" /></div>
                <div className="flex-1 p-3.5">
                  <div className="flex items-start justify-between gap-2">
                    <div><p className="text-white font-semibold text-sm leading-tight">{f.name}</p><p className="text-slate-500 text-xs mt-0.5">{f.category} · {f.surface}</p></div>
                    <span className={`flex-shrink-0 px-2 py-0.5 rounded-full border text-xs font-medium ${statusColor(f.status)}`}>{f.status}</span>
                  </div>
                  <div className="flex items-center gap-3 mt-2">
                    <div className="flex items-center gap-1">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-3 h-3 text-slate-500"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" /></svg>
                      <span className="text-slate-500 text-xs">{f.capacity}</span>
                    </div>
                    {f.lighting && <div className="flex items-center gap-1"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-3 h-3 text-amber-500"><path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.383a14.406 14.406 0 01-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 10-7.517 0c.85.493 1.509 1.333 1.509 2.316V18" /></svg><span className="text-amber-500 text-xs">Iluminada</span></div>}
                    {f.nextAvailable && <span className="text-slate-500 text-xs">Libre: {f.nextAvailable}</span>}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div>
          <p className="text-slate-400 text-xs font-semibold tracking-widest uppercase mb-3">Estado en Tiempo Real</p>
          <div className="grid grid-cols-2 gap-2.5">
            {liveStatus.map(item => (
              <div key={item.name} className="bg-slate-900/80 border border-slate-800/60 rounded-xl p-3.5">
                <div className="flex items-center gap-1.5 mb-2"><div className={`w-2 h-2 rounded-full ${item.status === 'Disponible' ? 'bg-emerald-400' : 'bg-amber-400'}`} /><span className={`text-xs font-medium ${item.status === 'Disponible' ? 'text-emerald-400' : 'text-amber-400'}`}>{item.status}</span></div>
                <p className="text-white text-xs font-semibold leading-tight">{item.name}</p>
                <p className="text-slate-500 text-xs mt-1">{item.until}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Detail Screen ────────────────────────────────────────────────────────────
function DetailScreen({ facility, onBack }: { facility: Facility; onBack: () => void }) {
  const [selectedDate, setSelectedDate] = useState(0)
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [selectedGroup, setSelectedGroup] = useState<UserGroup>('Cadetes')
  const dates = [{ label: 'Hoy', sub: '7 Oct' }, { label: 'Mar', sub: '8 Oct' }, { label: 'Mié', sub: '9 Oct' }, { label: 'Jue', sub: '10 Oct' }, { label: 'Vie', sub: '11 Oct' }]
  const slots = [
    { time: '07:00', available: true }, { time: '08:00', available: true }, { time: '09:00', available: false }, { time: '10:00', available: false },
    { time: '11:00', available: true }, { time: '12:00', available: true }, { time: '13:00', available: true }, { time: '14:00', available: true },
    { time: '15:00', available: false }, { time: '16:00', available: false }, { time: '17:00', available: true }, { time: '18:00', available: true },
  ]
  const groups: UserGroup[] = ['Cadetes', 'Los Cóndores', 'Externo', 'Alumni']

  return (
    <div className="flex-1 overflow-y-auto bg-slate-950">
      <div className="relative h-56 bg-slate-800">
        <img src={facility.image} alt={facility.name} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
        <button onClick={onBack} className="absolute top-12 left-4 w-9 h-9 rounded-full bg-slate-900/80 border border-slate-700/60 flex items-center justify-center backdrop-blur-sm">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4 text-white"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" /></svg>
        </button>
        <span className={`absolute top-12 right-4 px-2.5 py-1 rounded-full border text-xs font-semibold ${statusColor(facility.status)}`}>{facility.status}</span>
        <div className="absolute bottom-4 left-5">
          <p className="text-slate-400 text-xs font-medium tracking-widest uppercase">{facility.category}</p>
          <h1 className="text-white text-xl font-bold leading-tight mt-0.5">{facility.name}</h1>
          <p className="text-slate-400 text-xs mt-1">{facility.location}</p>
        </div>
      </div>
      <div className="px-5 pt-4 pb-6 space-y-5">
        <div className="grid grid-cols-3 gap-2.5">
          {[{ label: 'Capacidad', value: `${facility.capacity} pers.` }, { label: 'Superficie', value: facility.surface }, { label: 'Iluminación', value: facility.lighting ? 'Disponible' : 'No disponible' }].map(spec => (
            <div key={spec.label} className="bg-slate-900/80 border border-slate-800/60 rounded-xl p-3 text-center"><p className="text-slate-500 text-xs font-medium">{spec.label}</p><p className="text-white text-xs font-semibold mt-1 leading-tight">{spec.value}</p></div>
          ))}
        </div>
        <p className="text-slate-400 text-sm leading-relaxed">{facility.description}</p>
        <div>
          <p className="text-slate-400 text-xs font-semibold tracking-widest uppercase mb-3">Seleccionar Fecha</p>
          <div className="flex gap-2 overflow-x-auto pb-1">
            {dates.map((d, i) => (
              <button key={i} onClick={() => setSelectedDate(i)} className={`flex-shrink-0 flex flex-col items-center px-4 py-2.5 rounded-xl border text-xs transition-all ${selectedDate === i ? 'bg-amber-500 border-amber-500 text-slate-900' : 'bg-slate-900/80 border-slate-800/60 text-slate-400'}`}>
                <span className="font-bold">{d.label}</span><span className="mt-0.5 opacity-70">{d.sub}</span>
              </button>
            ))}
          </div>
        </div>
        <div>
          <p className="text-slate-400 text-xs font-semibold tracking-widest uppercase mb-3">Horarios Disponibles</p>
          <div className="grid grid-cols-4 gap-2">
            {slots.map(slot => (
              <button key={slot.time} disabled={!slot.available} onClick={() => setSelectedSlot(slot.time)} className={`py-2.5 rounded-xl border text-xs font-semibold transition-all ${!slot.available ? 'bg-slate-900/30 border-slate-800/30 text-slate-700 cursor-not-allowed' : selectedSlot === slot.time ? 'bg-amber-500 border-amber-500 text-slate-900' : 'bg-slate-900/80 border-slate-800/60 text-slate-300'}`}>{slot.time}</button>
            ))}
          </div>
        </div>
        {!showForm ? (
          <button onClick={() => setShowForm(true)} disabled={!selectedSlot} className={`w-full py-3.5 rounded-xl font-semibold text-sm transition-all ${selectedSlot ? 'bg-amber-500 text-slate-900 hover:bg-amber-400' : 'bg-slate-800 text-slate-600 cursor-not-allowed'}`}>
            {selectedSlot ? `Solicitar Reserva — ${selectedSlot}` : 'Selecciona un horario'}
          </button>
        ) : (
          <div className="bg-slate-900/80 border border-slate-800/60 rounded-2xl p-4 space-y-4">
            <p className="text-white font-semibold text-sm">Formulario de Reserva</p>
            <div>
              <p className="text-slate-500 text-xs font-medium mb-2">Categoría de Usuario</p>
              <div className="grid grid-cols-2 gap-2">
                {groups.map(g => (
                  <button key={g} onClick={() => setSelectedGroup(g)} className={`py-2 rounded-xl border text-xs font-semibold transition-all ${selectedGroup === g ? groupBadge(g) + ' border-current' : 'bg-slate-800/60 border-slate-700/60 text-slate-400'}`}>{g}</button>
                ))}
              </div>
            </div>
            <div>
              <p className="text-slate-500 text-xs font-medium mb-2">Propósito del Evento</p>
              <textarea className="w-full bg-slate-800/60 border border-slate-700/60 rounded-xl px-3.5 py-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-amber-500/50 resize-none" rows={3} placeholder="Describe el propósito del evento o entrenamiento…" />
            </div>
            <div>
              <p className="text-slate-500 text-xs font-medium mb-2">Adjuntar Permiso Oficial</p>
              <div className="border-2 border-dashed border-slate-700/60 rounded-xl py-4 text-center">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-6 h-6 text-slate-600 mx-auto mb-1"><path strokeLinecap="round" strokeLinejoin="round" d="M18.375 12.739l-7.693 7.693a4.5 4.5 0 01-6.364-6.364l10.94-10.94A3 3 0 1119.5 7.372L8.552 18.32m.009-.01l-.01.01m5.699-9.941l-7.81 7.81a1.5 1.5 0 002.112 2.13" /></svg>
                <p className="text-slate-600 text-xs">Adjuntar documento PDF</p>
              </div>
            </div>
            <button className="w-full py-3.5 rounded-xl bg-amber-500 text-slate-900 font-bold text-sm hover:bg-amber-400 transition-colors">Enviar Solicitud</button>
          </div>
        )}
      </div>
    </div>
  )
}

// ─── Calendar Screen ──────────────────────────────────────────────────────────
function CalendarScreen() {
  const [calView, setCalView] = useState<'weekly' | 'monthly'>('weekly')
  const [filter, setFilter] = useState<'Todos' | UserGroup>('Todos')
  const [selectedDay, setSelectedDay] = useState<number | null>(null)

  const days = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb']
  const weekDayHeaders = ['D', 'L', 'M', 'X', 'J', 'V', 'S']
  const filters: Array<'Todos' | UserGroup> = ['Todos', 'Cadetes', 'Los Cóndores', 'Externo', 'Alumni']

  // Oct 2025 starts on Wednesday (index 3)
  const firstDayOfMonth = 3
  const daysInMonth = 31

  const filtered = filter === 'Todos' ? calendarEvents : calendarEvents.filter(e => e.group === filter)
  const selectedDayEvents = selectedDay ? (monthlyEvents[selectedDay] || []) : []
  const filteredDayEvents = filter === 'Todos' ? selectedDayEvents : selectedDayEvents.filter(e => e.group === filter)

  return (
    <div className="flex-1 overflow-y-auto bg-slate-950">
      <div className="bg-gradient-to-b from-[#0D1B3E] to-slate-950 px-5 pt-14 pb-5">
        <div className="flex items-center justify-between mb-1">
          <div>
            <h2 className="text-white text-xl font-bold">Calendario</h2>
            <p className="text-slate-500 text-xs mt-0.5">{calView === 'weekly' ? 'Semana del 7 al 12 de Oct 2025' : 'Octubre 2025'}</p>
          </div>
          {/* Toggle */}
          <div className="flex bg-slate-800/80 border border-slate-700/60 rounded-xl p-0.5">
            <button onClick={() => setCalView('weekly')} className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${calView === 'weekly' ? 'bg-amber-500 text-slate-900' : 'text-slate-500'}`}>Semana</button>
            <button onClick={() => setCalView('monthly')} className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${calView === 'monthly' ? 'bg-amber-500 text-slate-900' : 'text-slate-500'}`}>Mes</button>
          </div>
        </div>
      </div>

      <div className="px-5 pb-6 space-y-4">
        {/* Filters */}
        <div className="flex gap-2 overflow-x-auto pb-1">
          {filters.map(f => (
            <button key={f} onClick={() => setFilter(f)} className={`flex-shrink-0 px-3.5 py-1.5 rounded-full text-xs font-semibold border transition-all ${
              filter === f
                ? f === 'Todos' ? 'bg-amber-500 text-slate-900 border-amber-500'
                  : f === 'Cadetes' ? 'bg-blue-600 text-white border-blue-600'
                  : f === 'Los Cóndores' ? 'bg-amber-600 text-white border-amber-600'
                  : f === 'Externo' ? 'bg-emerald-600 text-white border-emerald-600'
                  : 'bg-purple-600 text-white border-purple-600'
                : 'bg-slate-800/60 text-slate-400 border-slate-700/60'
            }`}>{f}</button>
          ))}
        </div>

        {calView === 'monthly' ? (
          <>
            {/* Month grid */}
            <div className="bg-slate-900/80 border border-slate-800/60 rounded-2xl p-4">
              {/* Day headers */}
              <div className="grid grid-cols-7 mb-2">
                {weekDayHeaders.map(d => (
                  <div key={d} className="text-center text-slate-600 text-xs font-semibold py-1">{d}</div>
                ))}
              </div>
              {/* Day cells */}
              <div className="grid grid-cols-7 gap-y-1">
                {/* Empty offset */}
                {Array.from({ length: firstDayOfMonth }).map((_, i) => <div key={`empty-${i}`} />)}
                {Array.from({ length: daysInMonth }).map((_, i) => {
                  const day = i + 1
                  const events = monthlyEvents[day] || []
                  const filteredEvs = filter === 'Todos' ? events : events.filter(e => e.group === filter)
                  const isSelected = selectedDay === day
                  const isToday = day === 7

                  return (
                    <button
                      key={day}
                      onClick={() => setSelectedDay(isSelected ? null : day)}
                      className={`flex flex-col items-center py-1 rounded-lg transition-all ${isSelected ? 'bg-amber-500/20 border border-amber-500/60' : isToday ? 'border border-slate-700/60' : ''}`}
                    >
                      <span className={`text-xs font-semibold w-6 h-6 flex items-center justify-center rounded-full ${isToday ? 'bg-amber-500 text-slate-900' : isSelected ? 'text-amber-400' : 'text-slate-400'}`}>
                        {day}
                      </span>
                      {/* Event dots */}
                      {filteredEvs.length > 0 && (
                        <div className="flex gap-0.5 mt-0.5 flex-wrap justify-center">
                          {filteredEvs.slice(0, 3).map((ev, ei) => (
                            <div key={ei} className={`w-1.5 h-1.5 rounded-full ${groupDot(ev.group)}`} />
                          ))}
                        </div>
                      )}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Legend */}
            <div className="flex flex-wrap gap-3">
              {([['Cadetes', 'bg-blue-500'], ['Los Cóndores', 'bg-amber-500'], ['Externo', 'bg-emerald-500'], ['Alumni', 'bg-purple-500']] as const).map(([label, color]) => (
                <div key={label} className="flex items-center gap-1.5">
                  <div className={`w-2.5 h-2.5 rounded-full ${color}`} />
                  <span className="text-slate-500 text-xs">{label}</span>
                </div>
              ))}
            </div>

            {/* Day agenda */}
            {selectedDay !== null && (
              <div>
                <div className="flex items-center justify-between mb-3">
                  <p className="text-slate-400 text-xs font-semibold tracking-widest uppercase">
                    {selectedDay} de Octubre 2025
                  </p>
                  <button onClick={() => setSelectedDay(null)}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4 text-slate-600">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                {filteredDayEvents.length > 0 ? (
                  <div className="space-y-2">
                    {filteredDayEvents.map((e, i) => (
                      <div key={i} className="flex items-center gap-3 bg-slate-900/80 border border-slate-800/60 rounded-xl px-4 py-3">
                        <div className={`w-1 h-10 rounded-full ${groupColor(e.group)}`} />
                        <div className="flex-1">
                          <p className="text-white text-sm font-semibold">{e.facility}</p>
                          <p className="text-slate-500 text-xs mt-0.5">{e.time} · {e.label}</p>
                        </div>
                        <span className={`px-2 py-0.5 rounded-full border text-xs font-medium ${groupBadge(e.group)}`}>{e.group}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-slate-900/60 border border-slate-800/40 rounded-xl py-6 text-center">
                    <p className="text-slate-600 text-sm">Sin eventos para este día</p>
                  </div>
                )}
              </div>
            )}
          </>
        ) : (
          <>
            {/* Weekly grid */}
            <div className="flex flex-wrap gap-3">
              {([['Cadetes', 'bg-blue-600'], ['Los Cóndores', 'bg-amber-600'], ['Externo', 'bg-emerald-600'], ['Alumni', 'bg-purple-600']] as const).map(([label, color]) => (
                <div key={label} className="flex items-center gap-1.5">
                  <div className={`w-2.5 h-2.5 rounded-sm ${color}`} />
                  <span className="text-slate-500 text-xs">{label}</span>
                </div>
              ))}
            </div>
            <div className="overflow-x-auto">
              <div className="min-w-[500px]">
                <div className="grid grid-cols-6 gap-1.5 mb-2">
                  {days.map(d => <div key={d} className="text-center text-slate-500 text-xs font-semibold py-1.5">{d}</div>)}
                </div>
                <div className="grid grid-cols-6 gap-1.5">
                  {days.map(day => (
                    <div key={day} className="flex flex-col gap-1.5">
                      {filtered.filter(e => e.day === day).map((e, i) => (
                        <div key={i} className={`${groupColor(e.group)} rounded-lg p-2`}>
                          <p className="text-white text-xs font-bold">{e.time}</p>
                          <p className="text-white/80 text-xs leading-tight mt-0.5">{e.label}</p>
                          <p className="text-white/60 text-xs leading-tight">{e.facility}</p>
                        </div>
                      ))}
                      {filtered.filter(e => e.day === day).length === 0 && (
                        <div className="h-16 rounded-lg border border-slate-800/40 border-dashed" />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div>
              <p className="text-slate-400 text-xs font-semibold tracking-widest uppercase mb-3">Todos los Eventos</p>
              <div className="space-y-2">
                {filtered.map((e, i) => (
                  <div key={i} className="flex items-center gap-3 bg-slate-900/80 border border-slate-800/60 rounded-xl px-4 py-3">
                    <div className={`w-1 h-10 rounded-full ${groupColor(e.group)}`} />
                    <div className="flex-1"><p className="text-white text-sm font-semibold">{e.facility}</p><p className="text-slate-500 text-xs mt-0.5">{e.day} · {e.time} · {e.label}</p></div>
                    <span className={`px-2 py-0.5 rounded-full border text-xs font-medium ${groupBadge(e.group)}`}>{e.group}</span>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

// ─── Bookings Screen ──────────────────────────────────────────────────────────
function BookingsScreen() {
  const [activeTab, setActiveTab] = useState<'all' | 'upcoming' | 'past'>('all')
  const filtered = myBookings.filter(b => {
    if (activeTab === 'upcoming') return b.status === 'Aprobado' || b.status === 'Pendiente'
    if (activeTab === 'past') return b.status === 'Cancelado'
    return true
  })

  return (
    <div className="flex-1 overflow-y-auto bg-slate-950">
      <div className="bg-gradient-to-b from-[#0D1B3E] to-slate-950 px-5 pt-14 pb-5">
        <h2 className="text-white text-xl font-bold">Mis Reservas</h2>
        <p className="text-slate-500 text-xs mt-1">Historial y estado de solicitudes</p>
      </div>
      <div className="px-5 pb-6 space-y-4">
        <div className="flex bg-slate-900/80 border border-slate-800/60 rounded-xl p-1">
          {[['all', 'Todas'], ['upcoming', 'Activas'], ['past', 'Historial']].map(([val, label]) => (
            <button key={val} onClick={() => setActiveTab(val as typeof activeTab)} className={`flex-1 py-2 rounded-lg text-xs font-semibold transition-all ${activeTab === val ? 'bg-amber-500 text-slate-900' : 'text-slate-500'}`}>{label}</button>
          ))}
        </div>
        <div className="space-y-3">
          {filtered.map(b => (
            <div key={b.id} className="bg-slate-900/80 border border-slate-800/60 rounded-2xl p-4">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1"><p className="text-white font-semibold text-sm">{b.facility}</p><p className="text-slate-400 text-xs mt-0.5">{b.date} · {b.time}</p></div>
                <span className={`px-2.5 py-1 rounded-full border text-xs font-semibold flex-shrink-0 ${statusColor(b.status)}`}>{b.status}</span>
              </div>
              <div className="h-px bg-slate-800/60 mt-3 mb-3" />
              <div className="flex items-center justify-between">
                <span className={`px-2 py-0.5 rounded-full border text-xs font-medium ${groupBadge(b.group)}`}>{b.group}</span>
                <p className="text-slate-500 text-xs">{b.purpose}</p>
              </div>
              {b.status === 'Pendiente' && (
                <div className="mt-3 flex items-center gap-1.5 text-amber-400">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-3.5 h-3.5"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  <span className="text-xs">En revisión por el administrador</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ─── Profile Screen ───────────────────────────────────────────────────────────
function ProfileScreen() {
  return (
    <div className="flex-1 overflow-y-auto bg-slate-950">
      <div className="bg-gradient-to-b from-[#0D1B3E] to-slate-950 px-5 pt-14 pb-8">
        <div className="flex flex-col items-center">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-slate-900 text-2xl font-bold mb-3">CR</div>
          <h2 className="text-white text-lg font-bold">Cdt. Carlos Ramírez</h2>
          <p className="text-slate-400 text-sm mt-0.5">Cadete · 3.er Año</p>
          <span className="mt-2 px-3 py-1 rounded-full bg-blue-900/40 text-blue-300 border border-blue-800 text-xs font-semibold">Cadetes EMCH</span>
        </div>
      </div>
      <div className="px-5 pb-6 space-y-4">
        <div className="grid grid-cols-3 gap-2.5">
          {[['12', 'Reservas'], ['8', 'Aprobadas'], ['2', 'Pendientes']].map(([val, label]) => (
            <div key={label} className="bg-slate-900/80 border border-slate-800/60 rounded-xl p-3 text-center"><p className="text-amber-400 text-xl font-bold">{val}</p><p className="text-slate-500 text-xs mt-0.5">{label}</p></div>
          ))}
        </div>
        {[{ title: 'Cuenta', items: ['Información personal', 'Unidad / Compañía', 'Notificaciones', 'Privacidad'] }, { title: 'Preferencias', items: ['Instalaciones favoritas', 'Deporte principal', 'Idioma', 'Apariencia'] }, { title: 'Soporte', items: ['Centro de ayuda', 'Reportar problema', 'Términos de uso'] }].map(section => (
          <div key={section.title}>
            <p className="text-slate-400 text-xs font-semibold tracking-widest uppercase mb-2">{section.title}</p>
            <div className="bg-slate-900/80 border border-slate-800/60 rounded-2xl overflow-hidden">
              {section.items.map((item, i) => (
                <button key={item} className={`w-full flex items-center justify-between px-4 py-3.5 text-left ${i > 0 ? 'border-t border-slate-800/60' : ''}`}>
                  <span className="text-white text-sm">{item}</span>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4 text-slate-600"><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" /></svg>
                </button>
              ))}
            </div>
          </div>
        ))}
        <button className="w-full py-3.5 rounded-xl border border-red-900/60 text-red-400 text-sm font-semibold">Cerrar Sesión</button>
      </div>
    </div>
  )
}

// ─── Admin Screen ─────────────────────────────────────────────────────────────
function AdminScreen({ onBack }: { onBack: () => void }) {
  const [requests, setRequests] = useState<PendingRequest[]>(initialPendingRequests)
  const [activeReq, setActiveReq] = useState<string | null>(null)
  const [adminModal, setAdminModal] = useState<AdminModal | null>(null)
  const [deleteModal, setDeleteModal] = useState<PendingRequest | null>(null)
  const [resolvedIds, setResolvedIds] = useState<Record<string, { action: AdminAction; message: string }>>({})

  const analytics = [
    { name: 'Estadio Principal', pct: 78 }, { name: 'Pista Atlética', pct: 65 },
    { name: 'Rugby Pitch N.°2', pct: 91 }, { name: 'Gimnasio Central', pct: 54 },
    { name: 'Tenis N.°1', pct: 38 }, { name: 'Tatami Dojo', pct: 22 },
  ]

  function handleAction(req: PendingRequest, action: AdminAction) {
    setActiveReq(null)
    setAdminModal({ request: req, action })
  }

  function handleConfirm(message: string) {
    if (!adminModal) return
    setResolvedIds(prev => ({ ...prev, [adminModal.request.id]: { action: adminModal.action, message } }))
    setAdminModal(null)
  }

  function handleDelete(req: PendingRequest) {
    setDeleteModal(req)
    setActiveReq(null)
  }

  function confirmDelete() {
    if (!deleteModal) return
    setRequests(prev => prev.filter(r => r.id !== deleteModal.id))
    setDeleteModal(null)
  }

  const pendingOnly = requests.filter(r => !resolvedIds[r.id])
  const resolvedList = requests.filter(r => resolvedIds[r.id])

  return (
    <div className="flex-1 overflow-y-auto bg-slate-950 relative">
      <div className="bg-gradient-to-b from-[#0D1B3E] to-slate-950 px-5 pt-14 pb-5">
        <button onClick={onBack} className="flex items-center gap-2 text-slate-400 text-sm mb-4">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" /></svg>
          Volver
        </button>
        <h2 className="text-white text-xl font-bold">Panel de Administración</h2>
        <p className="text-slate-500 text-xs mt-1">Gestión y aprobación de solicitudes</p>
      </div>

      <div className="px-5 pb-6 space-y-5">
        {/* Conflict alert */}
        <div className="bg-red-950/40 border border-red-900/60 rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4 text-red-400"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" /></svg>
            <span className="text-red-400 text-sm font-semibold">Conflicto de Horario Detectado</span>
          </div>
          <p className="text-red-300/70 text-xs">Estadio Principal — Sáb 11 Oct 10:00–13:00 tiene superposición con mantenimiento programado.</p>
        </div>

        {/* Pending requests */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <p className="text-slate-400 text-xs font-semibold tracking-widest uppercase">Solicitudes Pendientes</p>
            <span className="px-2 py-0.5 rounded-full bg-amber-900/40 text-amber-400 border border-amber-800 text-xs font-semibold">{pendingOnly.length}</span>
          </div>
          <div className="space-y-3">
            {pendingOnly.map(req => (
              <div key={req.id} className="bg-slate-900/80 border border-slate-800/60 rounded-2xl overflow-hidden">
                <div className="p-4">
                  <div className="flex items-start justify-between gap-2">
                    <button className="flex-1 text-left" onClick={() => setActiveReq(activeReq === req.id ? null : req.id)}>
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="text-white font-semibold text-sm">{req.user}</p>
                        {req.conflict && <span className="px-1.5 py-0.5 rounded bg-red-900/50 text-red-400 text-xs font-semibold">⚠ Conflicto</span>}
                      </div>
                      <p className="text-slate-400 text-xs mt-0.5">{req.facility} · {req.date} · {req.time}</p>
                      <div className="flex items-center gap-2 mt-1.5">
                        <span className={`px-2 py-0.5 rounded-full border text-xs font-medium ${groupBadge(req.group)}`}>{req.group}</span>
                        <span className="text-slate-500 text-xs">{req.purpose}</span>
                      </div>
                    </button>
                    {/* Trash icon */}
                    <button onClick={() => handleDelete(req)} className="w-8 h-8 rounded-lg bg-red-900/20 border border-red-900/40 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-3.5 h-3.5 text-red-400">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                      </svg>
                    </button>
                  </div>
                </div>
                {activeReq === req.id && (
                  <div className="flex border-t border-slate-800/60">
                    <button onClick={() => handleAction(req, 'Aprobar')} className="flex-1 py-3 text-emerald-400 text-xs font-bold border-r border-slate-800/60 hover:bg-emerald-900/20 transition-colors">✓ Aprobar</button>
                    <button onClick={() => handleAction(req, 'Revisión')} className="flex-1 py-3 text-amber-400 text-xs font-bold border-r border-slate-800/60 hover:bg-amber-900/20 transition-colors">↩ Revisión</button>
                    <button onClick={() => handleAction(req, 'Rechazar')} className="flex-1 py-3 text-red-400 text-xs font-bold hover:bg-red-900/20 transition-colors">✕ Rechazar</button>
                  </div>
                )}
              </div>
            ))}
            {pendingOnly.length === 0 && (
              <div className="bg-slate-900/60 border border-slate-800/40 rounded-xl py-6 text-center">
                <p className="text-slate-600 text-sm">Sin solicitudes pendientes</p>
              </div>
            )}
          </div>
        </div>

        {/* Resolved requests */}
        {resolvedList.length > 0 && (
          <div>
            <p className="text-slate-400 text-xs font-semibold tracking-widest uppercase mb-3">Gestionadas</p>
            <div className="space-y-2">
              {resolvedList.map(req => {
                const res = resolvedIds[req.id]
                return (
                  <div key={req.id} className="bg-slate-900/50 border border-slate-800/40 rounded-xl p-3.5">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="text-slate-400 text-xs font-semibold">{req.user} · {req.facility}</p>
                        <p className="text-slate-600 text-xs mt-0.5 italic">"{res.message}"</p>
                      </div>
                      <span className={`px-2 py-0.5 rounded-full border text-xs font-semibold flex-shrink-0 ${res.action === 'Aprobar' ? 'bg-emerald-900/30 text-emerald-400 border-emerald-800' : res.action === 'Revisión' ? 'bg-amber-900/30 text-amber-400 border-amber-800' : 'bg-red-900/30 text-red-400 border-red-800'}`}>
                        {res.action === 'Aprobar' ? 'Aprobado' : res.action === 'Revisión' ? 'En Revisión' : 'Rechazado'}
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Analytics */}
        <div>
          <p className="text-slate-400 text-xs font-semibold tracking-widest uppercase mb-3">Uso Semanal por Instalación</p>
          <div className="bg-slate-900/80 border border-slate-800/60 rounded-2xl p-4 space-y-3.5">
            {analytics.map(item => (
              <div key={item.name}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-slate-300 text-xs font-medium">{item.name}</span>
                  <span className={`text-xs font-bold ${item.pct >= 80 ? 'text-red-400' : item.pct >= 60 ? 'text-amber-400' : 'text-emerald-400'}`}>{item.pct}%</span>
                </div>
                <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full ${item.pct >= 80 ? 'bg-red-500' : item.pct >= 60 ? 'bg-amber-500' : 'bg-emerald-500'}`} style={{ width: `${item.pct}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Modals — rendered inside the phone frame */}
      {adminModal && (
        <AdminActionModal
          modal={adminModal}
          onConfirm={handleConfirm}
          onCancel={() => setAdminModal(null)}
        />
      )}
      {deleteModal && (
        <DeleteModal
          request={deleteModal}
          onConfirm={confirmDelete}
          onCancel={() => setDeleteModal(null)}
        />
      )}
    </div>
  )
}

// ─── Nav ──────────────────────────────────────────────────────────────────────
const navItems = [
  { id: 'home', label: 'Inicio', icon: HomeIcon },
  { id: 'facilities', label: 'Recintos', icon: FacilityIcon },
  { id: 'calendar', label: 'Calendario', icon: CalendarIcon },
  { id: 'bookings', label: 'Reservas', icon: BookingIcon },
  { id: 'profile', label: 'Perfil', icon: ProfileIcon },
] as const

// ─── App ──────────────────────────────────────────────────────────────────────
export default function App() {
  const [screen, setScreen] = useState<Screen>('home')
  const [selectedFacility, setSelectedFacility] = useState<Facility | null>(null)
  const [navTab, setNavTab] = useState<'home' | 'facilities' | 'calendar' | 'bookings' | 'profile'>('home')
  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications)

  const unreadCount = notifications.filter(n => !n.read).length

  function handleNav(tab: typeof navTab) {
    setNavTab(tab); setScreen(tab); setSelectedFacility(null)
  }

  function handleMarkAllRead() {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })))
  }

  function handleNotifNavigate(target: string) {
    if (target === 'admin') { setScreen('admin'); return }
    if (target === 'bookings') { setNavTab('bookings'); setScreen('bookings'); return }
    setNavTab('home'); setScreen('home')
  }

  const showNav = screen !== 'detail' && screen !== 'admin' && screen !== 'notifications'

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <div
        className="relative bg-slate-950 overflow-hidden flex flex-col shadow-2xl"
        style={{ width: 390, height: 844, borderRadius: 44, boxShadow: '0 0 0 10px #1e293b, 0 0 0 12px #0f172a, 0 40px 80px rgba(0,0,0,0.8)' }}
      >
        {/* Status bar */}
        <div className="flex-shrink-0 flex items-center justify-between px-8 pt-4 pb-2 bg-[#0D1B3E]">
          <span className="text-white text-xs font-semibold">9:41</span>
          <div className="w-28 h-7 bg-slate-950 rounded-full" />
          <div className="flex items-center gap-1">
            <div className="flex gap-0.5 items-end h-3">
              {[2, 3, 4, 5].map(h => <div key={h} className="w-1 bg-white rounded-sm" style={{ height: h * 2 + 2 }} />)}
            </div>
            <svg viewBox="0 0 24 24" fill="white" className="w-3.5 h-3.5">
              <path d="M1.371 8.143C5.135 4.65 10.316 3 12 3c1.684 0 6.865 1.65 10.629 5.143a.75.75 0 01.028 1.084l-1.06 1.06a.75.75 0 01-1.071-.018C17.974 7.09 14.81 5.75 12 5.75c-2.81 0-5.973 1.34-8.526 3.52a.75.75 0 01-1.07.017L1.343 9.226a.75.75 0 01.028-1.083z" />
              <path d="M5.157 11.697C7.06 9.98 9.33 9 12 9s4.939.98 6.843 2.697a.75.75 0 01.036 1.082l-1.05 1.05a.75.75 0 01-1.077-.01C15.355 12.587 13.78 12 12 12s-3.355.587-4.752 1.82a.75.75 0 01-1.077.01l-1.05-1.05a.75.75 0 01.036-1.083zM12 15a2 2 0 110 4 2 2 0 010-4z" />
            </svg>
            <svg viewBox="0 0 24 24" fill="white" className="w-4 h-4">
              <path fillRule="evenodd" d="M3.75 6.75a3 3 0 00-3 3v6a3 3 0 003 3h15a3 3 0 003-3v-6a3 3 0 00-3-3H3.75zm15 1.5a1.5 1.5 0 011.5 1.5v6a1.5 1.5 0 01-1.5 1.5h-15A1.5 1.5 0 012.25 15.75v-6a1.5 1.5 0 011.5-1.5h15zm-9.75 3.75a.75.75 0 000 1.5h5.25a.75.75 0 000-1.5H9z" clipRule="evenodd" />
            </svg>
          </div>
        </div>

        {/* Screen content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {screen === 'home' && (
            <HomeScreen
              onSelectFacility={f => { setSelectedFacility(f); setScreen('detail') }}
              onAdmin={() => setScreen('admin')}
              onNotifications={() => setScreen('notifications')}
              unreadCount={unreadCount}
            />
          )}
          {screen === 'facilities' && (
            <HomeScreen
              onSelectFacility={f => { setSelectedFacility(f); setScreen('detail') }}
              onAdmin={() => setScreen('admin')}
              onNotifications={() => setScreen('notifications')}
              unreadCount={unreadCount}
            />
          )}
          {screen === 'detail' && selectedFacility && (
            <DetailScreen facility={selectedFacility} onBack={() => setScreen(navTab)} />
          )}
          {screen === 'calendar' && <CalendarScreen />}
          {screen === 'bookings' && <BookingsScreen />}
          {screen === 'profile' && <ProfileScreen />}
          {screen === 'admin' && <AdminScreen onBack={() => setScreen('home')} />}
          {screen === 'notifications' && (
            <NotificationsScreen
              notifications={notifications}
              onBack={() => setScreen(navTab)}
              onMarkAllRead={handleMarkAllRead}
              onNavigate={handleNotifNavigate}
            />
          )}
        </div>

        {/* Bottom Nav */}
        {showNav && (
          <div className="flex-shrink-0 bg-slate-900/95 border-t border-slate-800/60 backdrop-blur-xl flex items-center" style={{ paddingBottom: 20, paddingTop: 10 }}>
            {navItems.map(item => {
              const active = navTab === item.id
              return (
                <button key={item.id} onClick={() => handleNav(item.id)} className="flex-1 flex flex-col items-center gap-1">
                  <div className={`transition-colors ${active ? 'text-amber-400' : 'text-slate-600'}`}>
                    <item.icon active={active} />
                  </div>
                  <span className={`text-xs font-medium transition-colors ${active ? 'text-amber-400' : 'text-slate-600'}`}>{item.label}</span>
                </button>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
