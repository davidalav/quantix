import LoginForm from "./LoginForm";

import Modal from "../ui/Modal";
import LinkButton from "../ui/LinkButton";

export default function LoginModal({ isOpen, onClose, onRegister }){

  if(!isOpen) return null;

  return(
    <Modal onClose={onClose}>
      <h2>
        Sign in
      </h2>
      <LoginForm
        onSuccess={onClose}
      />
      <LinkButton
        href="#"
        onClick={(e)=>{
          e.preventDefault();
          onRegister();
        }}
      >
        Registration
      </LinkButton>
    </Modal>
  )
}

