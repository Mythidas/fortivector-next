'use client'

import { FormFooterProps } from "@/lib/types";
import RouteButton from "@/lib/components/ux/route-button";
import { SubmitButton } from "@/lib/components/ux/submit-button";
import { Separator } from "@/lib/components/ui/separator";
import { useFormState } from "react-hook-form";

type Props = {
  pending?: boolean;
} & FormFooterProps;

export default function FormFooter({ cancel_route, submit_text, pending_text, pending }: Props) {
  return (
    <>
      <Separator />
      <div className="flex justify-end gap-3">
        {cancel_route &&
          <RouteButton variant="outline" type="button" route={cancel_route} disabled={pending}>
            Cancel
          </RouteButton>
        }
        <SubmitButton variant="default" pendingText={pending_text} pending={pending}>
          {submit_text}
        </SubmitButton>
      </div>
    </>
  );
}