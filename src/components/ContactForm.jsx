import React, { useState } from "react";
import emailjs from "emailjs-com";
import "./ContactForm.css";
import Toast from "./Toast";

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: "",
    message: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Bitte gib deinen Namen ein.";
    if (formData.message.trim().length < 10)
      newErrors.message = "Die Nachricht muss mindestens 10 Zeichen enthalten.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);

    try {
      await emailjs.send(
  import.meta.env.VITE_EMAILJS_SERVICE_ID,
  import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
  {
    name: formData.name,
    message: formData.message,
    time: new Date().toLocaleString(),
  },
  import.meta.env.VITE_EMAILJS_PUBLIC_KEY
);
      setToast({
        type: "success",
        message: "✅ Nachricht erfolgreich gesendet!",
      });
      setFormData({ name: "", message: "" });
    } catch (error) {
      console.error("❌ EmailJS Fehler:", error);
      setToast({
        type: "error",
        message: "❌ Fehler beim Senden der Nachricht.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <form className="contact-form" onSubmit={handleSubmit} noValidate>
        <h2 className="contact-form__title">Kontaktformular</h2>

        <div className="contact-form__group">
          <label htmlFor="name" className="contact-form__label">
            Name
          </label>
          <input
            className="contact-form__input"
            name="name"
            id="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Dein Name"
            required
          />
          {errors.name && (
            <small className="contact-form__error">{errors.name}</small>
          )}
        </div>

        <div className="contact-form__group">
          <label htmlFor="message" className="contact-form__label">
            Nachricht
          </label>
          <textarea
            className="contact-form__textarea"
            name="message"
            id="message"
            rows="6"
            value={formData.message}
            onChange={handleChange}
            placeholder="Schreib mir etwas ..."
            required
          />
          {errors.message && (
            <small className="contact-form__error">{errors.message}</small>
          )}
        </div>

        <button
          type="submit"
          className="contact-form__button"
          disabled={loading}
        >
          {loading ? "Sende..." : "Nachricht senden"}
        </button>
      </form>

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </>
  );
}
