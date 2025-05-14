import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/lib/components/ui/alert-dialog";
import { useEffect, useState } from "react";

type Props = {
  open?: boolean;
  errors?: Record<string, string[]>;
  message?: string;
  onClose?: () => void;
}

export default function FormAlert({ errors, message, onClose }: Props) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (errors || message) {
      setOpen(true);
    }
  }, [errors, message])

  const handleClose = () => {
    setOpen(false);
    onClose && onClose();
  }

  return (
    <AlertDialog open={open}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{message ? "Message" : "Errors"}</AlertDialogTitle>
          <AlertDialogDescription>
            {message && message}
            {(errors && !message) && Object.entries(errors).map(([field, error]) => (
              <span key={field}>{`${field}: ${error}`}</span>
            ))}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction onClick={handleClose}>Acknowledge</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}