import ClinicBrand from "./ClinicBrand";

export default function Sidebar() {
  return (
    <aside className="w-[280px] border-r bg-white/60 backdrop-blur p-3">
      {/* 🔥 BRAND INTERNO = CLÍNICA DEL CLIENTE */}
      <div className="px-2 py-2">
        <ClinicBrand />
      </div>

      <nav className="mt-4 space-y-1">
        <a href="/dashboard" className="block rounded-xl px-3 py-2 hover:bg-black/5">
          Dashboard
        </a>

        <a href="/appointments" className="block rounded-xl px-3 py-2 hover:bg-black/5">
          Citas
        </a>

        <a href="/patients" className="block rounded-xl px-3 py-2 hover:bg-black/5">
          Pacientes
        </a>

        <a href="/settings/app" className="block rounded-xl px-3 py-2 hover:bg-black/5">
          App configuration
        </a>
      </nav>
    </aside>
  );
}
