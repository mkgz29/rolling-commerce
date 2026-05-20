import { motion } from 'framer-motion';
import { BriefcaseBusiness, Camera, Clock, GitBranch, Mail, MapPin, ShieldCheck } from 'lucide-react';
import logo from '../assets/logo.png';

const contactItems = [
  {
    icon: Mail,
    title: 'Email soporte',
    text: 'support@techcore.com',
    href: 'mailto:support@techcore.com',
  },
  {
    icon: MapPin,
    title: 'Ubicacion',
    text: 'San Miguel de Tucuman, Argentina',
  },
  {
    icon: Clock,
    title: 'Horarios',
    text: 'Lunes a viernes, 09:00 a 18:00',
  },
];

const socialLinks = [
  { label: 'Instagram', href: 'https://instagram.com', icon: Camera },
  { label: 'LinkedIn', href: 'https://linkedin.com', icon: BriefcaseBusiness },
  { label: 'GitHub', href: 'https://github.com', icon: GitBranch },
];

export default function ContactInfo() {
  return (
    <motion.aside
      className="contact-info-panel"
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.55, ease: 'easeOut', delay: 0.08 }}
    >
      <div className="contact-brand-card">
        <div className="contact-brand-logo">
          <img src={logo} alt="Tech Core" />
        </div>
        <div>
          <span>Tech Core</span>
          <h2>Hardware premium con soporte cercano</h2>
        </div>
        <p>
          Acompanamos consultas sobre catalogo, armado de PC, pagos, pedidos y disponibilidad de productos.
        </p>
      </div>

      <div className="contact-info-list">
        {contactItems.map((item) => {
          const Icon = item.icon;
          const content = (
            <>
              <span className="contact-info-icon">
                <Icon size={20} strokeWidth={2.1} aria-hidden="true" />
              </span>
              <span>
                <strong>{item.title}</strong>
                <small>{item.text}</small>
              </span>
            </>
          );

          return item.href ? (
            <a className="contact-info-item" href={item.href} key={item.title}>
              {content}
            </a>
          ) : (
            <div className="contact-info-item" key={item.title}>
              {content}
            </div>
          );
        })}
      </div>

      <div className="contact-social-card">
        <div>
          <span className="contact-kicker">Redes sociales</span>
          <h3>Seguinos para novedades y lanzamientos</h3>
        </div>
        <div className="contact-socials">
          {socialLinks.map((link) => {
            const Icon = link.icon;

            return (
              <motion.a
                href={link.href}
                key={link.label}
                target="_blank"
                rel="noreferrer"
                aria-label={link.label}
                whileHover={{ y: -3, scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
              >
                <Icon size={20} strokeWidth={2.1} aria-hidden="true" />
              </motion.a>
            );
          })}
        </div>
      </div>

      <div className="contact-trust-note">
        <ShieldCheck size={20} strokeWidth={2.2} aria-hidden="true" />
        <span>Respuesta personalizada y datos tratados solo para gestionar tu consulta.</span>
      </div>
    </motion.aside>
  );
}
