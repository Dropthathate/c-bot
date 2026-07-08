import { Outlet } from "react-router-dom";
import DashboardLayout from "@/components/layout/DashboardLayout";

const TherapistLayout = () => (
  <DashboardLayout requiredRole="therapist">
    <Outlet />
  </DashboardLayout>
);

export default TherapistLayout;
