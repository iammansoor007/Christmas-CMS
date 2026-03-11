import AdminShell from './components/AdminShell';
import DashboardHome from './components/DashboardHome';

export default function AdminPage() {
    return (
        <AdminShell>
            <DashboardHome />
        </AdminShell>
    );
}
