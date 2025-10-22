import React from "react";
import DeviceTable from "../../components/DeviceTable.tsx";
import { useToast } from "../../hooks/useToast.ts";

/**
 * PUBLIC_INTERFACE
 * DeviceListPage
 * Renders the device table used on home route.
 */
export default function DeviceListPage() {
  const { addToast } = useToast();
  return (
    <DeviceTable
      onAdd={() => {}}
      onEdit={() => {}}
      onView={() => {}}
      addToast={addToast}
    />
  );
}
