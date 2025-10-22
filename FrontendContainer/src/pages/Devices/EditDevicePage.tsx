import React from "react";
import DeviceForm from "../../components/DeviceForm.tsx";
import { useToast } from "../../hooks/useToast.ts";
import { getDevice } from "../../api/devices.ts";

/**
 * PUBLIC_INTERFACE
 * EditDevicePage
 * Loads existing device and renders prefilled form.
 */
export default function EditDevicePage() {
  const { addToast } = useToast();
  const id = (window.location.hash.replace(/^#/, "") || "/").split("/").filter(Boolean)[1];
  const [device, setDevice] = React.useState<any>(null);
  const [loading, setLoading] = React.useState<boolean>(true);
  const [err, setErr] = React.useState<string | null>(null);

  React.useEffect(() => {
    async function load() {
      setLoading(true);
      setErr(null);
      try {
        const d = await getDevice(id);
        setDevice(d);
      } catch (e: any) {
        setErr(e?.message || "Failed to load device.");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  if (loading) return <div className="panel">Loading…</div>;
  if (err) return <div className="panel"><div className="alert" role="alert">{err}</div></div>;

  return (
    <div className="panel">
      <DeviceForm
        initialValues={device}
        onSuccess={() => addToast("Device updated.", "success")}
        onCancel={() => (window.location.hash = "/")}
        addToast={addToast}
      />
    </div>
  );
}
