import { useEffect, useRef } from 'react'
import './App.css'

function useScrollReveal() {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) el.classList.add('visible') },
      { threshold: 0.15 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])
  return ref
}

function Section({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  const ref = useScrollReveal()
  return <div ref={ref} className={`fade-section ${className}`}>{children}</div>
}

function App() {
  return (
    <div className="page">
      {/* ── NAV ── */}
      <nav className="nav">
        <a href="#inicio" className="nav-brand">J<span>.</span></a>
        <div className="nav-links">
          <a href="#sobre-mi">Sobre mí</a>
          <a href="#servicios">Servicios</a>
          <a href="#enfoque">Enfoque</a>
          <a href="#contacto" className="nav-cta">Conversemos</a>
        </div>
      </nav>

      {/* ── HERO ── */}
      <header className="hero" id="inicio">
        <div className="hero-blob hero-blob--1" />
        <div className="hero-blob hero-blob--2" />
        <div className="hero-inner">
          <div className="hero-text">
            <span className="hero-tag">Psicóloga Clínica · Universidad Mayor</span>
            <h1>
              Hola, soy<br />
              <em>Javiera</em> <span className="hero-aside">(la de la izq)</span>
            </h1>
            <p>
              Te acompaño a descubrir nuevas formas de relacionarte contigo
              y con quienes te rodean. Con calidez, sin juicios.
            </p>
            <div className="hero-actions">
              <a href="#contacto" className="btn btn--primary">Agenda tu primera sesión</a>
              <a href="#sobre-mi" className="btn btn--ghost">Conóceme →</a>
            </div>
          </div>
          <div className="hero-visual">
            <div className="hero-card">
              <div className="hero-card-inner">
                <img src="/images/javi.jpeg" alt="Javiera, Psicóloga Clínica" className="hero-card-img" />
                <div className="hero-card-detail">
                  <span>Magíster en Terapia Familiar</span>
                  <span>Enfoque Sistémico Constructivista</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="hero-scroll">
          <span>scroll</span>
          <div className="hero-scroll-line" />
        </div>
      </header>

      {/* ── ABOUT ── */}
      <section className="about" id="sobre-mi">
        <Section className="about-inner">
          <div className="about-col about-col--img">
            <div className="about-portrait">
              <img src="/images/javi.jpeg" alt="Javiera, Psicóloga Clínica" />
              <span className="about-portrait-caption">Hola, soy Javiera (la de la izq)</span>
            </div>
            <div className="about-accent" />
          </div>
          <div className="about-col about-col--text">
            <span className="label">Sobre mí</span>
            <h2>Creo en el poder de las <em>relaciones</em> para transformar vidas</h2>
            <p>
              Psicóloga titulada con distinción máxima y Magíster en Terapia Familiar
              de Pareja e Individual en la Universidad Mayor. Me apasiona seguir
              creciendo profesionalmente en el área de la salud mental.
            </p>
            <p>
              He trabajado en distintos centros de atención psicológica, acumulando
              experiencia clínica con pacientes adultos e infanto juveniles a través
              de un enfoque sistémico constructivista.
            </p>
            <div className="about-traits">
              <span className="trait">Orientada a soluciones</span>
              <span className="trait">Flexible</span>
              <span className="trait">Comprometida</span>
              <span className="trait">Empática</span>
              <span className="trait">Responsable</span>
            </div>
          </div>
        </Section>
      </section>

      {/* ── QUOTE ── */}
      <section className="quote-section">
        <Section>
          <blockquote className="quote">
            <span className="quote-mark">"</span>
            <p>
              Nuestras dificultades se construyen y se resuelven en la
              interacción con otros. La terapia es un espacio para
              co-construir nuevas narrativas.
            </p>
            <cite>— Javiera</cite>
          </blockquote>
        </Section>
      </section>

      {/* ── SERVICES ── */}
      <section className="services" id="servicios">
        <Section className="services-inner">
          <span className="label">Servicios</span>
          <h2>¿Cómo puedo <em>ayudarte</em>?</h2>
          <div className="services-grid">
            <article className="svc">
              <div className="svc-number">01</div>
              <h3>Terapia Individual</h3>
              <p>
                Un espacio seguro para explorar tus emociones, entender tus
                patrones y encontrar nuevas formas de estar en el mundo.
                Atención a adultos e infanto juveniles.
              </p>
              <div className="svc-line" />
            </article>
            <article className="svc">
              <div className="svc-number">02</div>
              <h3>Terapia de Pareja</h3>
              <p>
                Fortalece la comunicación y reconecta con tu pareja.
                Juntos exploraremos herramientas para resolver conflictos
                de manera constructiva y profundizar el vínculo.
              </p>
              <div className="svc-line" />
            </article>
            <article className="svc">
              <div className="svc-number">03</div>
              <h3>Terapia Familiar</h3>
              <p>
                Mejora la dinámica familiar, fortalece los lazos y descubre
                nuevas formas de relacionarse dentro del sistema familiar.
              </p>
              <div className="svc-line" />
            </article>
          </div>
        </Section>
      </section>

      {/* ── APPROACH ── */}
      <section className="approach" id="enfoque">
        <Section className="approach-inner">
          <div className="approach-left">
            <span className="label">Enfoque</span>
            <h2>Sistémico <em>Constructivista</em></h2>
            <p>
              Este enfoque comprende que somos parte de sistemas relacionales
              — familia, pareja, trabajo — y que nuestras dificultades nacen
              y se transforman en la interacción con otros.
            </p>
            <p>
              La terapia se orienta a comprender patrones, ampliar posibilidades
              y co-construir narrativas que permitan el bienestar.
            </p>
          </div>
          <div className="approach-right">
            <div className="approach-pill">
              <span className="approach-pill-icon">◐</span>
              <div>
                <strong>Relacional</strong>
                <span>Entendemos los problemas en contexto</span>
              </div>
            </div>
            <div className="approach-pill">
              <span className="approach-pill-icon">◑</span>
              <div>
                <strong>Constructivo</strong>
                <span>Co-creamos nuevas posibilidades</span>
              </div>
            </div>
            <div className="approach-pill">
              <span className="approach-pill-icon">○</span>
              <div>
                <strong>Flexible</strong>
                <span>Cada proceso es único y respetado</span>
              </div>
            </div>
            <div className="approach-pill">
              <span className="approach-pill-icon">●</span>
              <div>
                <strong>Confidencial</strong>
                <span>Espacio seguro y sin juicios</span>
              </div>
            </div>
          </div>
        </Section>
      </section>

      {/* ── CONTACT ── */}
      <section className="contact" id="contacto">
        <Section className="contact-inner">
          <div className="contact-left">
            <span className="label label--light">Contacto</span>
            <h2>¿Damos el <em>primer paso</em>?</h2>
            <p>
              Escríbeme sin compromiso. La primera conversación es para
              conocernos y ver si podemos trabajar juntas.
            </p>
          </div>
          <div className="contact-right">
            <a href="mailto:contacto@javiera-psicologa.cl" className="contact-card">
              <span className="contact-card-icon">✉</span>
              <div>
                <strong>Email</strong>
                <span>contacto@javiera-psicologa.cl</span>
              </div>
            </a>
            <a href="https://wa.me/569XXXXXXXX" target="_blank" rel="noopener noreferrer" className="contact-card">
              <span className="contact-card-icon">💬</span>
              <div>
                <strong>WhatsApp</strong>
                <span>+56 9 XXXX XXXX</span>
              </div>
            </a>
            <a href="https://www.instagram.com/" target="_blank" rel="noopener noreferrer" className="contact-card">
              <span className="contact-card-icon">✦</span>
              <div>
                <strong>Instagram</strong>
                <span>@javiera.psicologa</span>
              </div>
            </a>
          </div>
        </Section>
      </section>

      {/* ── FOOTER ── */}
      <footer className="footer">
        <div className="footer-inner">
          <span className="footer-brand">Javiera<span>.</span></span>
          <p>Psicóloga Clínica · Terapia Familiar, de Pareja e Individual</p>
          <small>© 2026 — Todos los derechos reservados</small>
        </div>
      </footer>
    </div>
  )
}

export default App
