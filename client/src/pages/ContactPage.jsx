import ContactForm from '../components/ContactForm';
import ContactHero from '../components/ContactHero';
import ContactInfo from '../components/ContactInfo';
import '../styles/contact.css';

export default function ContactPage() {
  return (
    <main className="contact-page">
      <ContactHero />

      <section className="contact-section" aria-label="Formulario e informacion de contacto">
        <div className="container contact-layout">
          <ContactForm />
          <ContactInfo />
        </div>
      </section>
    </main>
  );
}
