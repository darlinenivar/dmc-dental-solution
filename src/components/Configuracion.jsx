import { useEffect, useState } from "react";
import { supabase } from "../config/supabaseClient";

const BUCKET = "clinic-logos";

export default function Configuracion() {
  const [loading, setLoading] = useState(false);

  const [clinic_name, setClinicName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [stateVal, setStateVal] = useState("");
  const [zip, setZip] = useState("");
  const [country, setCountry] = useState("US");
  const [primary_color, setPrimaryColor] = useState("#2563eb");
  const [logo_url, setLogoUrl] = useState("");

  const ensureRow = async () => {
    const { data: auth } = await supabase.auth.getUser();
    const user = auth?.user;
    if (!user) throw new Error("No hay usuario autenticado.");

    const { data: row, error } = await supabase
      .from("clinic_settings")
      .select("*")
      .eq("owner_id", user.id)
      .maybeSingle();

    if (error) throw error;

    if (!row) {
      const { error: insErr } = await supabase.from("clinic_settings").insert([
        {
          owner_id: user.id,
          clinic_name: "DMC Dental Solution",
          country: "US",
          primary_color: "#2563eb",
        },
      ]);
      if (insErr) throw insErr;
    }
  };

  const load = async () => {
    setLoading(true);
    try {
      await ensureRow();

      const { data: auth } = await supabase.auth.getUser();
      const user = auth?.user;

      const { data: row, error } = await supabase
        .from("clinic_settings")
        .select("*")
        .eq("owner_id", user.id)
        .single();

      if (error) throw error;

      setClinicName(row.clinic_name || "");
      setPhone(row.phone || "");
      setAddress(row.address || "");
      setCity(row.city || "");
      setStateVal(row.state || "");
      setZip(row.zip || "");
      setCountry(row.country || "US");
      setPrimaryColor(row.primary_color || "#2563eb");
      setLogoUrl(row.logo_url || "");
    } catch (e) {
      console.error("Config load error:", e);
      alert(e.message || "Error cargando Configuración.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const save = async () => {
    setLoading(true);
    try {
      const { data: auth } = await supabase.auth.getUser();
      const user = auth?.user;

      const { error } = await supabase
        .from("clinic_settings")
        .update({
          clinic_name: clinic_name?.trim() || "DMC Dental Solution",
          phone: phone?.trim() || "",
          address: address?.trim() || "",
          city: city?.trim() || "",
          state: stateVal?.trim() || "",
          zip: zip?.trim() || "",
          country: country?.trim() || "US",
          primary_color: primary_color || "#2563eb",
          logo_url: logo_url || "",
        })
        .eq("owner_id", user.id);

      if (error) throw error;

      window.dispatchEvent(new Event("clinic-updated"));
      alert("Cambios guardados ✅");
    } catch (e) {
      console.error("Save error:", e);
      alert(e.message || "Error guardando.");
    } finally {
      setLoading(false);
    }
  };

  const uploadLogo = async (file) => {
    const { data: auth } = await supabase.auth.getUser();
    const user = auth?.user;
    if (!user) throw new Error("No hay usuario autenticado.");

    const ext = (file.name.split(".").pop() || "png").toLowerCase();
    const path = `${user.id}/${Date.now()}.${ext}`;

    const { error: upErr } = await supabase.storage
      .from(BUCKET)
      .upload(path, file, { upsert: true });

    if (upErr) {
      // Si aquí sale bucket not found -> bucket no existe o estás en otro proyecto Supabase
      throw upErr;
    }

    const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
    return data.publicUrl;
  };

  const onLogoChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    try {
      const url = await uploadLogo(file);
      setLogoUrl(url);

      // guardar inmediatamente
      const { data: auth } = await supabase.auth.getUser();
      const user = auth?.user;

      const { error } = await supabase
        .from("clinic_settings")
        .update({ logo_url: url })
        .eq("owner_id", user.id);

      if (error) throw error;

      window.dispatchEvent(new Event("clinic-updated"));
    } catch (e2) {
      console.error("Upload error:", e2);
      alert(
        `Error subiendo logo: ${e2.message}\n\nVerifica:\n1) Bucket existe: ${BUCKET}\n2) Tus env VITE_SUPABASE_URL/KEY apuntan al proyecto correcto`
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-2">Configuración</h1>
      <p className="text-gray-600 mb-4">
        Datos guardados en Supabase (protegidos por RLS).
      </p>

      <div className="bg-white border rounded-lg p-5 max-w-4xl">
        <h2 className="text-xl font-semibold mb-4">Clínica</h2>

        <div className="flex items-center gap-4 mb-5">
          <div className="w-14 h-14 border rounded flex items-center justify-center overflow-hidden bg-gray-50">
            {logo_url ? (
              <img src={logo_url} alt="logo" className="w-full h-full object-contain" />
            ) : (
              <span className="text-xs text-gray-400">Logo</span>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Logo de la clínica (PNG/JPG)
            </label>
            <input type="file" accept="image/*" onChange={onLogoChange} />
            <div className="text-xs text-gray-500 mt-1">
              Bucket: <b>{BUCKET}</b>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="Nombre de la clínica" value={clinic_name} setValue={setClinicName} />
          <Field label="Teléfono" value={phone} setValue={setPhone} />
          <Field label="Dirección" value={address} setValue={setAddress} />
          <Field label="Ciudad" value={city} setValue={setCity} />
          <Field label="Estado" value={stateVal} setValue={setStateVal} />
          <Field label="Zip" value={zip} setValue={setZip} />
          <Field label="País" value={country} setValue={setCountry} />
          <div>
            <label className="block text-sm font-medium mb-1">Color principal</label>
            <input
              type="color"
              value={primary_color}
              onChange={(e) => setPrimaryColor(e.target.value)}
              className="h-10 w-16"
            />
          </div>
        </div>

        <div className="mt-6 flex items-center gap-3">
          <button
            onClick={save}
            disabled={loading}
            className="px-4 py-2 rounded bg-blue-600 text-white disabled:opacity-50"
          >
            {loading ? "Guardando..." : "Guardar cambios"}
          </button>

          <button
            onClick={load}
            disabled={loading}
            className="px-4 py-2 rounded border disabled:opacity-50"
          >
            Recargar
          </button>
        </div>
      </div>
    </div>
  );
}

function Field({ label, value, setValue }) {
  return (
    <div>
      <label className="block text-sm font-medium mb-1">{label}</label>
      <input
        className="w-full border rounded px-3 py-2"
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
    </div>
  );
}