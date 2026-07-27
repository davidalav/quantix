import Modal from "../ui/Modal";
import RegisterForm from "./RegisterForm";

export default function RegisterModal({
  isOpen,
  onClose
}) {
  if (!isOpen) return null;

  return (
    <Modal onClose={onClose}>
      <h2>
        Registration
      </h2>

      <RegisterForm
        onSuccess={onClose}
      />
    </Modal>
  );
}