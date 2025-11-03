import React from "react";
import DeviceDetails from "../../components/DeviceDetails.tsx";
import { useToast } from "../../hooks/useToast.ts";

/**
 * PUBLIC_INTERFACE
 * DeviceDetailsPage
 * Wrapper to render device details from the hash route name.
 */
export default function DeviceDetailsPage() {
  const { addToast } = useToast();
  const name = (window.location.hash.replace(/^#/, "") || "/").split("/").filter(Boolean)[1];

  return (
    <DeviceDetails
      deviceName={name}
      onBack={() => (window.location.hash = "/")}
      addToast={addToast}
    />
  );
}
