import { useClinic } from "../context/ClinicContext";

function initials(name = "") {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return "CL";
  return parts.slice(0, 2).map(p => p[0].toUpperCase()).join("");
}

export default function ClinicBrand() {
  const { clinic, loading } = useClinic();

  const displayName = clinic?.name || (loading ? "Cargando..." : "Mi clínica");
  const logo = clinic?.logo_url || null;

  return (
    <div className="flex items-center gap-2">
      {logo ? (
        <img
          src={logo}
          alt="logo"
          className="h-9 w-9 rounded-xl object-cover border"
        />
      ) : (
        <div className="h-9 w-9 rounded-xl border flex items-center justify-center text-xs font-bold">
          {initials(displayName)}
        </div>
      )}

      <div className="min-w-0">
        <div className="font-semibold truncate">{displayName}</div>
        <div className="text-xs opacity-60 truncate">Panel de gestión</div>
      </div>
    </div>
  );
}
