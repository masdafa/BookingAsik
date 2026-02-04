import SidebarAdmin from "../components/SidebarAdmin";
import "../styles/layout.css";
import { Outlet } from "react-router-dom";

export default function AdminLayout() {
  return (
    <div className="admin-layout">
      <SidebarAdmin />

      <main className="admin-content">
        <Outlet />
      </main>
    </div>
  );
}
