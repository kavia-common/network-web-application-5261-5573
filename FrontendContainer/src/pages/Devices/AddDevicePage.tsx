import React from "react";
import DeviceForm from "../../components/DeviceForm.tsx";
import { useToast } from "../../hooks/useToast.ts";

/**
 * PUBLIC_INTERFACE
 * AddDevicePage
 * Standalone page hosting the add device form.
 */
export default function AddDevicePage() {
  const { addToast } = useToast();
  return (
    <div className="panel">
      <DeviceForm
        initialValues={null}
        onSuccess={() => addToast("Device created.", "success")}
        onCancel={() => (window.location.hash = "/")}
        addToast={addToast}
      />
    </div>
  );
}
