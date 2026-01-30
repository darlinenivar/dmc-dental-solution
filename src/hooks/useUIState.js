import { useEffect, useState } from "react";

export function useUIState() {
  const [sidebarOpen, setSidebarOpen] = useState(() => {
    const saved = localStorage.getItem("sidebarOpen");
    return saved ? JSON.parse(saved) : true;
  });

  useEffect(() => {
    localStorage.setItem("sidebarOpen", JSON.stringify(sidebarOpen));
  }, [sidebarOpen]);

  return {
    sidebarOpen,
    toggleSidebar: () => setSidebarOpen(prev => !prev),
  };
}
