import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import Swal from 'sweetalert2';
import { Send } from 'lucide-react';
import { createContactMessageRequest } from '../routes/contactService';

const initialValues = {
  name: '',
  email: '',
  phone: '',
  subject: '',
  message: '',
};

const limits = {
  name: { min: 2, max: 50 },
  email: { min: 6, max: 80 },
  phone: { min: 0, max: 20 },
  subject: { min: 4, max: 80 },
  message: { min: 12, max: 500 },
};

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;

const sanitizeValue = (value) =>
  value
    .replace(/[<>]/g, '')
    .replace(/\s+/g, ' ')
    .trim();

const validateField = (name, rawValue) => {
  const value = sanitizeValue(rawValue);
  const fieldLimits = limits[name];

  if (name !== 'phone' && !value) {
    return 'Este campo es obligatorio.';
  }

  if (!value && name === 'phone') {
    return '';
  }

  if (fieldLimits.min && value.length < fieldLimits.min) {
    return `Debe tener al menos ${fieldLimits.min} caracteres.`;
  }

  if (value.length > fieldLimits.max) {
    return `No puede superar ${fieldLimits.max} caracteres.`;
  }

  if (name === 'email' && !emailPattern.test(value)) {
    return 'Ingresa un email valido.';
  }

  if (name === 'phone' && value && !/^[\d\s()+-]+$/.test(value)) {
    return 'Usa solo numeros, espacios, +, - o parentesis.';
  }

  return '';
};

const validateForm = (values) =>
  Object.keys(values).reduce((errors, field) => {
    const error = validateField(field, values[field]);

    return error ? { ...errors, [field]: error } : errors;
  }, {});

export default function ContactForm() {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const sanitizedValues = useMemo(
    () =>
      Object.entries(values).reduce(
        (acc, [field, value]) => ({
          ...acc,
          [field]: sanitizeValue(value),
        }),
        {}
      ),
    [values]
  );

  const handleChange = (event) => {
    const { name, value } = event.target;
    const maxLength = limits[name].max;
    const nextValue = value.slice(0, maxLength);

    setValues((current) => ({ ...current, [name]: nextValue }));

    if (touched[name]) {
      setErrors((current) => ({
        ...current,
        [name]: validateField(name, nextValue),
      }));
    }
  };

  const handleBlur = (event) => {
    const { name, value } = event.target;

    setTouched((current) => ({ ...current, [name]: true }));
    setErrors((current) => ({
      ...current,
      [name]: validateField(name, value),
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const nextErrors = validateForm(values);
    setTouched({
      name: true,
      email: true,
      phone: true,
      subject: true,
      message: true,
    });
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      Swal.fire({
        icon: 'error',
        title: 'Revisa el formulario',
        text: 'Hay campos incompletos o con formato invalido.',
        background: '#081123',
        color: '#f4f7ff',
        confirmButtonColor: '#0d6efd',
      });
      return;
    }

    setIsSubmitting(true);

    Swal.fire({
      title: 'Enviando consulta',
      text: 'Estamos procesando tu mensaje.',
      allowOutsideClick: false,
      allowEscapeKey: false,
      background: '#081123',
      color: '#f4f7ff',
      didOpen: () => Swal.showLoading(),
    });

    try {
      await createContactMessageRequest(sanitizedValues);

      setValues(initialValues);
      setErrors({});
      setTouched({});

      Swal.fire({
        icon: 'success',
        title: 'Mensaje enviado',
        text: `${sanitizedValues.name}, recibimos tu consulta y te responderemos a la brevedad.`,
        background: '#081123',
        color: '#f4f7ff',
        confirmButtonColor: '#0d6efd',
      });
    } catch (requestError) {
      console.error('Error sending contact message:', requestError);
      Swal.fire({
        icon: 'error',
        title: 'No pudimos enviar tu consulta',
        text: requestError.message || 'Intentalo nuevamente en unos minutos.',
        background: '#081123',
        color: '#f4f7ff',
        confirmButtonColor: '#0d6efd',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const fieldClassName = (field) =>
    `contact-field form-control ${touched[field] && errors[field] ? 'is-invalid' : ''} ${
      touched[field] && !errors[field] && sanitizedValues[field] ? 'is-valid' : ''
    }`;

  return (
    <motion.article
      className="contact-form-panel"
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.55, ease: 'easeOut' }}
    >
      <div className="contact-panel-heading">
        <span className="contact-kicker">Formulario</span>
        <h2>Hablemos de tu proxima compra</h2>
        <p>Completa tus datos y nuestro equipo te contactara con una respuesta clara y personalizada.</p>
      </div>

      <form className="contact-form" onSubmit={handleSubmit} noValidate>
        <div className="contact-form-grid">
          <div className="contact-form-group">
            <label htmlFor="contact-name">Nombre</label>
            <input
              id="contact-name"
              className={fieldClassName('name')}
              name="name"
              type="text"
              value={values.name}
              maxLength={limits.name.max}
              placeholder="Tu nombre"
              autoComplete="name"
              onBlur={handleBlur}
              onChange={handleChange}
            />
            <div className="contact-field-meta">
              <span>{touched.name && errors.name ? errors.name : 'Requerido'}</span>
              <span>{values.name.length}/{limits.name.max}</span>
            </div>
          </div>

          <div className="contact-form-group">
            <label htmlFor="contact-email">Email</label>
            <input
              id="contact-email"
              className={fieldClassName('email')}
              name="email"
              type="email"
              value={values.email}
              maxLength={limits.email.max}
              placeholder="nombre@email.com"
              autoComplete="email"
              onBlur={handleBlur}
              onChange={handleChange}
            />
            <div className="contact-field-meta">
              <span>{touched.email && errors.email ? errors.email : 'Requerido'}</span>
              <span>{values.email.length}/{limits.email.max}</span>
            </div>
          </div>
        </div>

        <div className="contact-form-grid">
          <div className="contact-form-group">
            <label htmlFor="contact-phone">Telefono <span>opcional</span></label>
            <input
              id="contact-phone"
              className={fieldClassName('phone')}
              name="phone"
              type="tel"
              value={values.phone}
              maxLength={limits.phone.max}
              placeholder="+54 9 381 000 0000"
              autoComplete="tel"
              onBlur={handleBlur}
              onChange={handleChange}
            />
            <div className="contact-field-meta">
              <span>{touched.phone && errors.phone ? errors.phone : 'Opcional'}</span>
              <span>{values.phone.length}/{limits.phone.max}</span>
            </div>
          </div>

          <div className="contact-form-group">
            <label htmlFor="contact-subject">Asunto</label>
            <input
              id="contact-subject"
              className={fieldClassName('subject')}
              name="subject"
              type="text"
              value={values.subject}
              maxLength={limits.subject.max}
              placeholder="Consulta sobre productos"
              onBlur={handleBlur}
              onChange={handleChange}
            />
            <div className="contact-field-meta">
              <span>{touched.subject && errors.subject ? errors.subject : 'Requerido'}</span>
              <span>{values.subject.length}/{limits.subject.max}</span>
            </div>
          </div>
        </div>

        <div className="contact-form-group">
          <label htmlFor="contact-message">Mensaje</label>
          <textarea
            id="contact-message"
            className={fieldClassName('message')}
            name="message"
            value={values.message}
            maxLength={limits.message.max}
            rows="6"
            placeholder="Contanos que producto, pedido o consulta queres resolver."
            onBlur={handleBlur}
            onChange={handleChange}
          />
          <div className="contact-field-meta">
            <span>{touched.message && errors.message ? errors.message : 'Minimo 12 caracteres'}</span>
            <span>{values.message.length}/{limits.message.max}</span>
          </div>
        </div>

        <motion.button
          className="contact-submit"
          type="submit"
          disabled={isSubmitting}
          whileHover={{ y: -2, scale: 1.01 }}
          whileTap={{ scale: 0.98 }}
        >
          <Send size={18} strokeWidth={2.2} aria-hidden="true" />
          {isSubmitting ? 'Enviando...' : 'Enviar mensaje'}
        </motion.button>
      </form>
    </motion.article>
  );
}
