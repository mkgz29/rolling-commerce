import { motion } from 'framer-motion';

const heroVariants = {
  hidden: { opacity: 0, y: 22 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.62, ease: 'easeOut' },
  },
};

export default function ContactHero() {
  return (
    <section className="contact-hero">
      <div className="container">
        <motion.div
          className="contact-hero-copy"
          initial="hidden"
          animate="visible"
          variants={heroVariants}
        >
          <span className="contact-kicker">Rolling Commerce / Tech Core</span>
          <h1>Contactanos</h1>
          <p className="contact-hero-lead">Estamos para ayudarte a elegir, comprar y resolver tus consultas.</p>
          <p>
            Tech Core es un ecommerce de hardware premium pensado para una experiencia clara, segura y moderna:
            catalogo tecnologico, carrito, checkout y soporte para cada etapa de tu compra.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
