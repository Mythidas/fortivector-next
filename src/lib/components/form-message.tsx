import { Alert, AlertDescription, AlertTitle } from "@/lib/components/ui/alert"

export type Message =
  | { success: string }
  | { error: string }
  | { message: string };

export function FormMessage({ message }: { message: Message }) {
  return (
    <>
      {"success" in message && (
        <Alert>
          <AlertTitle>Success</AlertTitle>
          <AlertDescription>
            {message.success}
          </AlertDescription>
        </Alert>
      )}
      {"error" in message && (
        <Alert>
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            {message.error}
          </AlertDescription>
        </Alert>
      )}
      {"message" in message && (
        <Alert>
          <AlertTitle>Message</AlertTitle>
          <AlertDescription>
            {message.message}
          </AlertDescription>
        </Alert>
      )}
    </>
  );
}
