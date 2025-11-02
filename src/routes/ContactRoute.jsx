import ContactForm from "../components/ContactForm";
import { useAuth } from "../context/AuthContext.jsx";

export default function ContactRoute() {
  const { user } = useAuth();

  return (
    <div>
      <h1>Feel free to leave your feedback!</h1>
      <ContactForm />
    </div>
  );
}