import { useEffect, useState, type ReactNode } from "react";
import { X } from "lucide-react";
import { Button } from "./Button";

type ModalProps = {
  children: ReactNode;
  closeLabel: string;
  isOpen: boolean;
  onClose: () => void;
  title: string;
};

export function Modal({ children, closeLabel, isOpen, onClose, title }: ModalProps) {
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      return undefined;
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        handleClose();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [isOpen]);

  const handleClose = () => {
    setIsClosing(true);
    window.setTimeout(() => {
      setIsClosing(false);
      onClose();
    }, 240);
  };

  if (!isOpen && !isClosing) {
    return null;
  }

  const hasWindowClass = typeof children === "object" && children !== null &&
    "type" in children && children.type === "div" &&
    ("props" in children && children.props?.className?.includes("window"));

  return (
    <div className={`modal${isClosing ? " modal--closing" : ""}`} role="presentation" onMouseDown={handleClose}>
      <section
        aria-modal="true"
        className={hasWindowClass ? "modal__panel modal__panel--window" : "modal__panel"}
        data-testid="matrix-modal"
        onMouseDown={(event) => event.stopPropagation()}
        role="dialog"
      >
        {!hasWindowClass && (
          <div className="modal__header">
            <h2>{title}</h2>
            <Button
              aria-label={closeLabel}
              icon={<X size={18} />}
              onClick={handleClose}
              size="sm"
              variant="ghost"
            >
              {closeLabel}
            </Button>
          </div>
        )}
        <div className={hasWindowClass ? "modal__body modal__body--window" : "modal__body"}>{children}</div>
      </section>
    </div>
  );
}
