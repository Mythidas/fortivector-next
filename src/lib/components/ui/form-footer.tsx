'use client'

import { FormFooterProps } from "@/lib/types";
import RouteButton from "./protected/route-button";
import { SubmitButton } from "../submit-button";
import { useState } from "react";

type Props = {
  pending?: boolean;
} & FormFooterProps;

export default function FormFooter({ cancel_route, submit_text, pending_text, pending }: Props) {
  return (
    <div className="flex justify-end gap-3">
      {cancel_route &&
        <RouteButton variant="outline" route={cancel_route}>
          Cancel
        </RouteButton>
      }
      <SubmitButton variant="default" pendingText={pending_text} pending={pending}>
        {submit_text}
      </SubmitButton>
    </div>
  );
}