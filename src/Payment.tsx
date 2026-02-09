import { useState, useMemo } from 'react'
import { useParams, Link } from 'react-router-dom'
import './Payment.css'

const PLANS: Record<string, { name: string; price: number; sessions: number; perSession: number; description: string }> = {
  'sesion-individual': {
    name: 'Sesión Individual',
    price: 30000,
    sessions: 1,
    perSession: 30000,
    description: '1 sesión de 1 hora · Online o presencial',
  },
  'pack-4': {
    name: 'Pack 4 Sesiones',
    price: 108000,
    sessions: 4,
    perSession: 27000,
    description: '4 sesiones de 1 hora · Ahorra 10%',
  },
  'pack-8': {
    name: 'Pack 8 Sesiones',
    price: 204000,
    sessions: 8,
    perSession: 25500,
    description: '8 sesiones de 1 hora · Ahorra 15%',
  },
}

type PaymentMethod = 'transferencia' | 'whatsapp' | null

// Available time slots (configurable)
const AVAILABLE_HOURS = ['09:00', '10:00', '11:00', '12:00', '15:00', '16:00', '17:00', '18:00']
// Available days: Mon-Fri (1-5)
const AVAILABLE_DAYS = [1, 2, 3, 4, 5]

const DAY_NAMES = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb']
const MONTH_NAMES = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']

function formatCLP(amount: number) {
  return '$' + amount.toLocaleString('es-CL')
}

function isSameDay(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate()
}

function getCalendarWeeks(year: number, month: number): (Date | null)[][] {
  const first = new Date(year, month, 1)
  const last = new Date(year, month + 1, 0)
  const weeks: (Date | null)[][] = []
  let week: (Date | null)[] = []

  // Fill leading nulls
  for (let i = 0; i < first.getDay(); i++) week.push(null)

  for (let d = 1; d <= last.getDate(); d++) {
    week.push(new Date(year, month, d))
    if (week.length === 7) {
      weeks.push(week)
      week = []
    }
  }
  if (week.length > 0) {
    while (week.length < 7) week.push(null)
    weeks.push(week)
  }
  return weeks
}

function Payment() {
  const { planId } = useParams<{ planId: string }>()
  const plan = planId ? PLANS[planId] : null

  const [step, setStep] = useState<'calendar' | 'payment'>('calendar')
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [selectedTime, setSelectedTime] = useState<string | null>(null)
  const [calMonth, setCalMonth] = useState(() => { const n = new Date(); return { year: n.getFullYear(), month: n.getMonth() } })

  const [method, setMethod] = useState<PaymentMethod>(null)
  const [formData, setFormData] = useState({ name: '', email: '', phone: '' })
  const [submitted, setSubmitted] = useState(false)

  const today = useMemo(() => { const d = new Date(); d.setHours(0, 0, 0, 0); return d }, [])
  const weeks = useMemo(() => getCalendarWeeks(calMonth.year, calMonth.month), [calMonth])

  const canGoPrev = calMonth.year > today.getFullYear() || (calMonth.year === today.getFullYear() && calMonth.month > today.getMonth())

  if (!plan) {
    return (
      <div className="pay-page">
        <div className="pay-container">
          <h1>Plan no encontrado</h1>
          <Link to="/" className="pay-back">← Volver al inicio</Link>
        </div>
      </div>
    )
  }

  const dateLabel = selectedDate
    ? `${DAY_NAMES[selectedDate.getDay()]} ${selectedDate.getDate()} de ${MONTH_NAMES[selectedDate.getMonth()]}`
    : ''

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (method === 'whatsapp') {
      const msg = encodeURIComponent(
        `Hola Javiera, me gustaría agendar el plan "${plan.name}" (${formatCLP(plan.price)}) para el ${dateLabel} a las ${selectedTime}. Mi nombre es ${formData.name}.`
      )
      window.open(`https://wa.me/569XXXXXXXX?text=${msg}`, '_blank')
    }
    setSubmitted(true)
  }

  // ── Success: Transferencia ──
  if (submitted && method === 'transferencia') {
    return (
      <div className="pay-page">
        <div className="pay-container">
          <div className="pay-success">
            <div className="pay-success-icon">✓</div>
            <h2>¡Reserva confirmada!</h2>
            <p>Tu sesión: <strong>{dateLabel} a las {selectedTime}</strong></p>
            <p>Realiza la transferencia y envía el comprobante por WhatsApp o email:</p>
            <div className="pay-bank-details">
              <div className="pay-bank-row"><span>Banco</span><strong>Banco Estado</strong></div>
              <div className="pay-bank-row"><span>Tipo de cuenta</span><strong>Cuenta Vista / RUT</strong></div>
              <div className="pay-bank-row"><span>RUT</span><strong>XX.XXX.XXX-X</strong></div>
              <div className="pay-bank-row"><span>Nombre</span><strong>Javiera [Apellido]</strong></div>
              <div className="pay-bank-row"><span>Email</span><strong>contacto@javiera-psicologa.cl</strong></div>
              <div className="pay-bank-row"><span>Monto</span><strong>{formatCLP(plan.price)}</strong></div>
            </div>
            <p className="pay-bank-note">Una vez confirmado el pago, recibirás un email de confirmación.</p>
            <Link to="/" className="pay-back">← Volver al inicio</Link>
          </div>
        </div>
      </div>
    )
  }

  // ── Success: WhatsApp ──
  if (submitted && method === 'whatsapp') {
    return (
      <div className="pay-page">
        <div className="pay-container">
          <div className="pay-success">
            <div className="pay-success-icon">💬</div>
            <h2>¡Te redirigimos a WhatsApp!</h2>
            <p>Tu sesión: <strong>{dateLabel} a las {selectedTime}</strong></p>
            <p>Coordina directamente con Javiera el pago.</p>
            <a
              href={`https://wa.me/569XXXXXXXX?text=${encodeURIComponent(`Hola Javiera, me gustaría agendar el plan "${plan.name}" (${formatCLP(plan.price)}) para el ${dateLabel} a las ${selectedTime}. Mi nombre es ${formData.name}.`)}`}
              target="_blank" rel="noopener noreferrer" className="pay-wa-btn"
            >Abrir WhatsApp</a>
            <Link to="/" className="pay-back">← Volver al inicio</Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="pay-page">
      <div className="pay-container">
        <Link to="/" className="pay-back">← Volver al inicio</Link>

        {/* Plan summary */}
        <div className="pay-summary">
          <div className="pay-summary-left">
            <span className="pay-label">Tu selección</span>
            <h1>{plan.name}</h1>
            <p>{plan.description}</p>
            {plan.sessions > 1 && (
              <span className="pay-per-session">{formatCLP(plan.perSession)} por sesión</span>
            )}
          </div>
          <div className="pay-summary-right">
            <span className="pay-total-label">Total</span>
            <span className="pay-total">{formatCLP(plan.price)}</span>
            <span className="pay-currency-label">CLP</span>
          </div>
        </div>

        {/* Steps indicator */}
        <div className="pay-steps">
          <div className={`pay-step ${step === 'calendar' ? 'pay-step--active' : ''} ${step === 'payment' ? 'pay-step--done' : ''}`}>
            <span className="pay-step-num">1</span>
            <span>Elige fecha y hora</span>
          </div>
          <div className="pay-step-line" />
          <div className={`pay-step ${step === 'payment' ? 'pay-step--active' : ''}`}>
            <span className="pay-step-num">2</span>
            <span>Datos y pago</span>
          </div>
        </div>

        {/* ── STEP 1: Calendar ── */}
        {step === 'calendar' && (
          <div className="pay-calendar-section">
            <h2>Elige una fecha{plan.sessions > 1 ? ' para tu primera sesión' : ''}</h2>

            <div className="cal">
              <div className="cal-header">
                <button type="button" className="cal-nav" onClick={() => setCalMonth(p => {
                  const d = new Date(p.year, p.month - 1, 1)
                  return { year: d.getFullYear(), month: d.getMonth() }
                })} disabled={!canGoPrev} aria-label="Mes anterior">‹</button>
                <span className="cal-title">{MONTH_NAMES[calMonth.month]} {calMonth.year}</span>
                <button type="button" className="cal-nav" onClick={() => setCalMonth(p => {
                  const d = new Date(p.year, p.month + 1, 1)
                  return { year: d.getFullYear(), month: d.getMonth() }
                })} aria-label="Mes siguiente">›</button>
              </div>

              <div className="cal-grid">
                {DAY_NAMES.map(d => <div key={d} className="cal-day-name">{d}</div>)}
                {weeks.flat().map((date, i) => {
                  if (!date) return <div key={`empty-${i}`} className="cal-cell cal-cell--empty" />
                  const isPast = date < today
                  const isAvailable = AVAILABLE_DAYS.includes(date.getDay()) && !isPast
                  const isSelected = selectedDate && isSameDay(date, selectedDate)
                  const isToday = isSameDay(date, today)
                  return (
                    <button
                      key={date.toISOString()}
                      type="button"
                      className={`cal-cell ${isAvailable ? 'cal-cell--available' : 'cal-cell--disabled'} ${isSelected ? 'cal-cell--selected' : ''} ${isToday ? 'cal-cell--today' : ''}`}
                      disabled={!isAvailable}
                      onClick={() => { setSelectedDate(date); setSelectedTime(null) }}
                    >
                      {date.getDate()}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Time slots */}
            {selectedDate && (
              <div className="cal-times">
                <h3>Horarios disponibles — {dateLabel}</h3>
                <div className="cal-times-grid">
                  {AVAILABLE_HOURS.map(h => (
                    <button
                      key={h}
                      type="button"
                      className={`cal-time ${selectedTime === h ? 'cal-time--selected' : ''}`}
                      onClick={() => setSelectedTime(h)}
                    >
                      {h}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {selectedDate && selectedTime && (
              <button type="button" className="pay-submit" onClick={() => setStep('payment')}>
                Continuar al pago →
              </button>
            )}
          </div>
        )}

        {/* ── STEP 2: Payment ── */}
        {step === 'payment' && (
          <>
            <div className="pay-selected-slot">
              <span>📅 {dateLabel} a las {selectedTime}</span>
              <button type="button" className="pay-change" onClick={() => setStep('calendar')}>Cambiar</button>
            </div>

            <div className="pay-section">
              <h2>¿Cómo prefieres pagar?</h2>
              <div className="pay-methods">
                <button
                  className={`pay-method ${method === 'transferencia' ? 'pay-method--active' : ''}`}
                  onClick={() => setMethod('transferencia')}
                  type="button"
                >
                  <span className="pay-method-icon">🏦</span>
                  <div>
                    <strong>Transferencia Bancaria</strong>
                    <span>Transfiere directamente y envía el comprobante</span>
                  </div>
                </button>
                <button
                  className={`pay-method ${method === 'whatsapp' ? 'pay-method--active' : ''}`}
                  onClick={() => setMethod('whatsapp')}
                  type="button"
                >
                  <span className="pay-method-icon">💬</span>
                  <div>
                    <strong>Coordinar por WhatsApp</strong>
                    <span>Habla directo con Javiera para coordinar el pago</span>
                  </div>
                </button>
              </div>
            </div>

            {method && (
              <form className="pay-form" onSubmit={handleSubmit}>
                <h2>Tus datos</h2>
                <div className="pay-field">
                  <label htmlFor="name">Nombre completo</label>
                  <input id="name" type="text" required value={formData.name}
                    onChange={e => setFormData(p => ({ ...p, name: e.target.value }))} placeholder="Tu nombre" />
                </div>
                <div className="pay-field">
                  <label htmlFor="email">Email</label>
                  <input id="email" type="email" required value={formData.email}
                    onChange={e => setFormData(p => ({ ...p, email: e.target.value }))} placeholder="tu@email.com" />
                </div>
                <div className="pay-field">
                  <label htmlFor="phone">Teléfono</label>
                  <input id="phone" type="tel" required value={formData.phone}
                    onChange={e => setFormData(p => ({ ...p, phone: e.target.value }))} placeholder="+56 9 1234 5678" />
                </div>
                <button type="submit" className="pay-submit">
                  {method === 'transferencia' ? 'Ver datos de transferencia' : 'Ir a WhatsApp'}
                </button>
              </form>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default Payment
