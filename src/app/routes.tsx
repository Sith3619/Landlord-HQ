import { createBrowserRouter, Navigate } from "react-router";
import { Login } from "./pages/Login";
import { Signup } from "./pages/Signup";
import { Dashboard } from "./pages/Dashboard";
import { Properties } from "./pages/Properties";
import { PropertyDetail } from "./pages/PropertyDetail";
import { Units } from "./pages/Units";
import { UnitDetail } from "./pages/UnitDetail";
import { Tenants } from "./pages/Tenants";
import { TenantDetail } from "./pages/TenantDetail";
import { Maintenance } from "./pages/Maintenance";
import { MaintenanceDetail } from "./pages/MaintenanceDetail";
import { Documents } from "./pages/Documents";
import { DocumentDetail } from "./pages/DocumentDetail";
import { Leases } from "./pages/Leases";
import { LeaseDetail } from "./pages/LeaseDetail";
import { Inspections } from "./pages/Inspections";
import { InspectionDetail } from "./pages/InspectionDetail";
import { Calendar } from "./pages/Calendar";
import { Settings } from "./pages/Settings";
import { NotFound } from "./pages/NotFound";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/login" replace />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/signup",
    element: <Signup />,
  },
  {
    path: "/dashboard",
    element: <Dashboard />,
  },
  {
    path: "/properties",
    element: <Properties />,
  },
  {
    path: "/properties/:id",
    element: <PropertyDetail />,
  },
  {
    path: "/units",
    element: <Units />,
  },
  {
    path: "/units/:id",
    element: <UnitDetail />,
  },
  {
    path: "/tenants",
    element: <Tenants />,
  },
  {
    path: "/tenants/:id",
    element: <TenantDetail />,
  },
  {
    path: "/maintenance",
    element: <Maintenance />,
  },
  {
    path: "/maintenance/:id",
    element: <MaintenanceDetail />,
  },
  {
    path: "/documents",
    element: <Documents />,
  },
  {
    path: "/documents/:id",
    element: <DocumentDetail />,
  },
  {
    path: "/leases",
    element: <Leases />,
  },
  {
    path: "/leases/:id",
    element: <LeaseDetail />,
  },
  {
    path: "/inspections",
    element: <Inspections />,
  },
  {
    path: "/inspections/:id",
    element: <InspectionDetail />,
  },
  {
    path: "/calendar",
    element: <Calendar />,
  },
  {
    path: "/settings",
    element: <Settings />,
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);
