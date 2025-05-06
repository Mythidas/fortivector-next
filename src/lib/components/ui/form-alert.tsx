import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/lib/components/ui/alert-dialog";
import { useEffect, useState } from "react";

type Props = {
  open?: boolean;
  errors?: Record<string, string[]>;
}

export default function FormAlert({ errors }: Props) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (errors) {
      setOpen(true);
    }
  }, [errors])

  return (
    <AlertDialog open={open}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Errors</AlertDialogTitle>
          <AlertDialogDescription>
            {errors && Object.entries(errors).map(([field, error]) => (
              <div key={field}>{`${field}: ${error}`}</div>
            ))}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction onClick={() => setOpen(false)}>Acknowledge</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}