import { useState } from 'react';

import ScrollReveal from '../components/Reveal.jsx';
import { apiRequest } from '../config.js';
import { siteCopy } from '../content/siteCopy.js';

const validateContactForm = (values) => {
  const details = {};

  if (!values.name.trim()) {
    details.name = 'Name is required.';
  }

  if (!values.email.trim()) {
    details.email = 'Email is required.';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim())) {
    details.email = 'Please enter a valid email address.';
  }

  if (!values.message.trim()) {
    details.message = 'Message is required.';
  }

  return details;
};

const Contact = () => {
  const copy = siteCopy.contact;
  const { contact } = siteCopy.global;

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });
  const [fieldErrors, setFieldErrors] = useState({});
  const [status, setStatus] = useState({ type: '', text: '' });

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((prev) => ({ ...prev, [name]: value }));
    setFieldErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setStatus({ type: '', text: '' });

    const validationErrors = validateContactForm(form);

    if (Object.keys(validationErrors).length > 0) {
      setFieldErrors(validationErrors);
      return;
    }

    setFieldErrors({});

    try {
      await apiRequest('/contact', {
        method: 'POST',
        body: JSON.stringify(form),
      });

      setStatus({ type: 'success', text: copy.successMessage });
      setForm({ name: '', email: '', phone: '', message: '' });
    } catch (error) {
      setStatus({ type: 'error', text: error.message });

      if (error.details && typeof error.details === 'object') {
        setFieldErrors(error.details);
      }
    }
  };

  return (
    <div className="page page-premium">
      <section className="section section--tight">
        <div className="container-wide">
          <ScrollReveal direction="up" distance={16} threshold={0.2}>
            <p className="kicker">{copy.kicker}</p>
            <h1 className="headline-lg">{copy.title}</h1>
            <p className="lead">{copy.description}</p>
            <p className="lead">Email: {contact.email} | Phone: {contact.phoneDisplay}</p>
          </ScrollReveal>
        </div>
      </section>

      <section className="section">
        <div className="container-wide">
          <ScrollReveal className="card form-card" delay={80} threshold={0.12}>
            {status.text && (
              <p className={`status ${status.type === 'success' ? 'success' : 'error'}`}>{status.text}</p>
            )}

            <form onSubmit={handleSubmit}>
              <div className="form-field">
                <label htmlFor="name">{copy.nameLabel}</label>
                <input
                  id="name"
                  name="name"
                  placeholder={copy.placeholders.name}
                  value={form.name}
                  onChange={handleChange}
                  required
                />
                {fieldErrors.name && <p className="field-error">{fieldErrors.name}</p>}
              </div>

              <div className="form-field">
                <label htmlFor="email">{copy.emailLabel}</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder={copy.placeholders.email}
                  value={form.email}
                  onChange={handleChange}
                  required
                />
                {fieldErrors.email && <p className="field-error">{fieldErrors.email}</p>}
              </div>

              <div className="form-field">
                <label htmlFor="phone">{copy.phoneLabel}</label>
                <input
                  id="phone"
                  name="phone"
                  placeholder={copy.placeholders.phone}
                  value={form.phone}
                  onChange={handleChange}
                />
                {fieldErrors.phone && <p className="field-error">{fieldErrors.phone}</p>}
              </div>

              <div className="form-field">
                <label htmlFor="message">{copy.messageLabel}</label>
                <textarea
                  id="message"
                  name="message"
                  placeholder={copy.placeholders.message}
                  value={form.message}
                  onChange={handleChange}
                  required
                />
                {fieldErrors.message && <p className="field-error">{fieldErrors.message}</p>}
              </div>

              <button type="submit" className="pill-btn btn-primary">{copy.submitButton}</button>
            </form>
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
};

export default Contact;
