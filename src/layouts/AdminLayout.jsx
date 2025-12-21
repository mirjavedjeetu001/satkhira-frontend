import { Outlet } from 'react-router-dom';
import AdminSidebar from '../components/admin/AdminSidebar';
import AdminNavbar from '../components/admin/AdminNavbar';

export default function AdminLayout() {
  return (
    <div className="min-h-screen bg-gray-100">
      <AdminNavbar />
      <div className="flex">
        <AdminSidebar />
        <main className="flex-1 p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
