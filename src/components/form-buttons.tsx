import RouteButton from "./route-button";
import { SubmitButton } from "./submit-button";

export default function FormButtons({ cancelRoute, submitText, pendingText, formAction }: {
  cancelRoute: string;
  submitText: string;
  pendingText: string;
  formAction: string | ((formData: FormData) => void | Promise<void>) | undefined
}) {
  return (
    <div className="flex justify-end gap-3">
      <RouteButton variant="outline" route={cancelRoute}>
        Cancel
      </RouteButton>
      <SubmitButton pendingText={pendingText} formAction={formAction}>
        {submitText}
      </SubmitButton>
    </div>
  );
}