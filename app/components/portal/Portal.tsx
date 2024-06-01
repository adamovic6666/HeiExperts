import { useRef, useEffect, useState, ReactNode } from "react";
import { createPortal } from "react-dom";

interface PortalProps {
  children: ReactNode;
}

const Portal = ({ children }: PortalProps) => {
  const ref = useRef<Element | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    ref.current = document.querySelector<HTMLElement>("#portal");
    setMounted(true);
    document.body.classList.toggle("stopScroll");
  }, []);

  return mounted && ref.current ? createPortal(children, ref.current) : null;
};

export default Portal;
