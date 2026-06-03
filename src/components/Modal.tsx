import { useEffect, useState, useRef, useCallback, type ReactNode } from "react";
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
  const panelRef = useRef<HTMLElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  const handleClose = useCallback(() => {
    setIsClosing(true);
    window.setTimeout(() => {
      setIsClosing(false);
      onClose();
    }, 240);
  }, [onClose]);

  useEffect(() => {
    if (!isOpen) {
      return undefined;
    }

    previousFocusRef.current = document.activeElement as HTMLElement;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        handleClose();
        return;
      }

      if (event.key === "Tab" && panelRef.current) {
        const focusable = panelRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (focusable.length === 0) return;

        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (event.shiftKey) {
          if (document.activeElement === first) {
            event.preventDefault();
            last.focus();
          }
        } else {
          if (document.activeElement === last) {
            event.preventDefault();
            first.focus();
          }
        }
      }
    };

    document.addEventListener("keydown", onKeyDown);

    const timer = window.setTimeout(() => {
      if (panelRef.current) {
        const firstFocusable = panelRef.current.querySelector<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        firstFocusable?.focus();
      }
    }, 50);

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      window.clearTimeout(timer);
      previousFocusRef.current?.focus();
    };
  }, [isOpen, handleClose]);

  if (!isOpen && !isClosing) {
    return null;
  }

  const titleId = `modal-title-${title.replace(/\s+/g, "-").toLowerCase()}`;
  const hasWindowClass =
    typeof children === "object" &&
    children !== null &&
    "type" in children &&
    (children as { type?: unknown }).type === "div" &&
    "props" in children &&
    (children as { props?: { className?: string } }).props?.className?.includes("window");

  return (
    <div
      className={`modal${isClosing ? " modal--closing" : ""}`}
      role="presentation"
      onMouseDown={handleClose}
    >
      <section
        aria-modal="true"
        aria-labelledby={titleId}
        className={hasWindowClass ? "modal__panel modal__panel--window" : "modal__panel"}
        data-testid="matrix-modal"
        onMouseDown={(event) => event.stopPropagation()}
        ref={panelRef}
        role="dialog"
      >
        {!hasWindowClass && (
          <div className="modal__header">
            <h2 id={titleId}>{title}</h2>
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
        <div className={hasWindowClass ? "modal__body modal__body--window" : "modal__body"}>
          {children}
        </div>
      </section>
    </div>
  );
}
