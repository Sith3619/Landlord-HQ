import { useParams, useNavigate } from "react-router";
import { MainLayout } from "../components/layout/MainLayout";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { ArrowLeft, Mail, Phone, Building2, DoorOpen, Calendar, Wrench, FileText } from "lucide-react";
import { useApp } from "../context/AppContext";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";

export function TenantDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { tenants, properties, units, maintenanceTickets, documents } = useApp();

  const tenant = tenants.find((t) => t.id === Number(id));

  if (!tenant) {
    return (
      <MainLayout title="Tenant Not Found">
        <div className="text-center py-16">
          <p className="text-muted-foreground mb-4">This tenant could not be found.</p>
          <Button onClick={() => navigate("/tenants")} variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Tenants
          </Button>
        </div>
      </MainLayout>
    );
  }

  const property = tenant.propertyId ? properties.find((p) => p.id === tenant.propertyId) : null;
  const unit = tenant.unitId ? units.find((u) => u.id === tenant.unitId) : null;
  const tenantTickets = maintenanceTickets.filter((t) => t.tenantId === tenant.id);
  const tenantDocuments = documents.filter((d) => d.tenantId === tenant.id);
  const openTickets = tenantTickets.filter((t) => t.status !== "Completed").length;

  return (
    <MainLayout title={tenant.fullName}>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <button
            onClick={() => navigate("/tenants")}
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-4"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Tenants
          </button>
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <h2 className="text-2xl font-semibold text-foreground">{tenant.fullName}</h2>
              <p className="text-sm text-muted-foreground mt-0.5">
                {property && unit
                  ? `${property.name} · Unit ${unit.unitNumber}`
                  : "No unit assigned"}
              </p>
            </div>
            <Badge
              className={
                tenant.leaseStatus === "Active"
                  ? "bg-green-50 text-green-700 border border-green-100 font-medium"
                  : "bg-muted text-muted-foreground border border-border font-medium"
              }
            >
              {tenant.leaseStatus}
            </Badge>
          </div>
        </div>

        {/* Metrics */}
        <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
          <Card className="border border-border shadow-none">
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Property</p>
                <Building2 className="h-4 w-4 text-muted-foreground" />
              </div>
              <p className="text-sm font-semibold text-foreground truncate">{property?.name || "—"}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{property ? "assigned" : "no property"}</p>
            </CardContent>
          </Card>
          <Card className="border border-border shadow-none">
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Unit</p>
                <DoorOpen className="h-4 w-4 text-muted-foreground" />
              </div>
              <p className="text-2xl font-semibold text-foreground">{unit?.unitNumber || "—"}</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                {unit ? `$${unit.rent.toLocaleString()}/mo` : "no unit"}
              </p>
            </CardContent>
          </Card>
          <Card className="border border-border shadow-none">
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Open Tickets</p>
                <Wrench className="h-4 w-4 text-muted-foreground" />
              </div>
              <p className={`text-2xl font-semibold ${openTickets > 0 ? "text-orange-600" : "text-foreground"}`}>
                {openTickets}
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">maintenance</p>
            </CardContent>
          </Card>
          <Card className="border border-border shadow-none">
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Documents</p>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </div>
              <p className="text-2xl font-semibold text-foreground">{tenantDocuments.length}</p>
              <p className="text-xs text-muted-foreground mt-0.5">files stored</p>
            </CardContent>
          </Card>
        </div>

        {/* Contact + Lease */}
        <div className="grid gap-6 md:grid-cols-2">
          <Card className="border border-border shadow-none">
            <CardHeader>
              <CardTitle className="text-base">Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { label: "Full Name", value: tenant.fullName },
              ].map(({ label, value }) => (
                <div key={label} className="flex flex-col gap-0.5">
                  <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium">{label}</p>
                  <p className="text-sm text-foreground">{value}</p>
                </div>
              ))}
              <div className="flex flex-col gap-0.5">
                <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium">Email</p>
                <a
                  href={`mailto:${tenant.email}`}
                  className="text-sm text-green-600 hover:underline flex items-center gap-1.5"
                >
                  <Mail className="h-3.5 w-3.5" />
                  {tenant.email}
                </a>
              </div>
              <div className="flex flex-col gap-0.5">
                <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium">Phone</p>
                <div className="flex items-center gap-1.5 text-sm text-foreground">
                  <Phone className="h-3.5 w-3.5 text-muted-foreground" />
                  {tenant.phone}
                </div>
              </div>
              {tenant.notes && (
                <div className="flex flex-col gap-0.5">
                  <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium">Notes</p>
                  <p className="text-sm text-muted-foreground italic">{tenant.notes}</p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="border border-border shadow-none">
            <CardHeader>
              <CardTitle className="text-base">Lease Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col gap-0.5">
                <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium">Status</p>
                <p className="text-sm text-foreground">{tenant.leaseStatus}</p>
              </div>
              {property && (
                <div className="flex flex-col gap-0.5">
                  <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium">Property</p>
                  <button
                    onClick={() => navigate(`/properties/${property.id}`)}
                    className="text-sm text-green-600 hover:underline text-left font-medium"
                  >
                    {property.name}
                  </button>
                </div>
              )}
              {unit && (
                <div className="flex flex-col gap-0.5">
                  <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium">Unit</p>
                  <button
                    onClick={() => navigate(`/units/${unit.id}`)}
                    className="text-sm text-green-600 hover:underline text-left font-medium"
                  >
                    Unit {unit.unitNumber} — ${unit.rent.toLocaleString()}/mo
                  </button>
                </div>
              )}
              {(tenant.leaseStart || tenant.leaseEnd) && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-0.5">
                    <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium">Lease Start</p>
                    <div className="flex items-center gap-1.5 text-sm text-foreground">
                      <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                      {tenant.leaseStart || "—"}
                    </div>
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium">Lease End</p>
                    <div className="flex items-center gap-1.5 text-sm text-foreground">
                      <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                      {tenant.leaseEnd || "—"}
                    </div>
                  </div>
                </div>
              )}
              {!property && !unit && (
                <div className="text-center py-4">
                  <p className="text-sm text-muted-foreground">No unit assigned yet.</p>
                  <button
                    onClick={() => navigate("/units")}
                    className="mt-1.5 text-sm text-green-600 hover:underline"
                  >
                    Assign a unit →
                  </button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {tenantTickets.length > 0 && (
          <Card className="border border-border shadow-none">
            <CardHeader>
              <CardTitle className="text-base">Maintenance Tickets</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50 hover:bg-accent/50">
                    <TableHead className="font-medium text-xs uppercase tracking-wide text-muted-foreground pl-6">Issue</TableHead>
                    <TableHead className="font-medium text-xs uppercase tracking-wide text-muted-foreground">Category</TableHead>
                    <TableHead className="font-medium text-xs uppercase tracking-wide text-muted-foreground">Priority</TableHead>
                    <TableHead className="font-medium text-xs uppercase tracking-wide text-muted-foreground">Status</TableHead>
                    <TableHead className="font-medium text-xs uppercase tracking-wide text-muted-foreground pr-6">Created</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tenantTickets.map((ticket) => (
                    <TableRow
                      key={ticket.id}
                      className="hover:bg-accent/50 cursor-pointer"
                      onClick={() => navigate(`/maintenance/${ticket.id}`)}
                    >
                      <TableCell className="font-medium text-foreground pl-6">{ticket.title}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="font-normal text-xs">{ticket.category}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={`text-xs font-medium ${
                            ticket.priority === "Urgent" || ticket.priority === "High"
                              ? "bg-red-50 text-red-700 border border-red-100"
                              : ticket.priority === "Medium"
                              ? "bg-amber-50 text-amber-700 border border-amber-100"
                              : "bg-muted text-muted-foreground border border-border"
                          }`}
                        >
                          {ticket.priority}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={`text-xs font-medium ${
                            ticket.status === "Completed"
                              ? "bg-green-50 text-green-700 border border-green-100"
                              : ticket.status === "In Progress"
                              ? "bg-blue-50 text-blue-700 border border-blue-100"
                              : "bg-muted text-muted-foreground border border-border"
                          }`}
                        >
                          {ticket.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground pr-6">{ticket.createdDate}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}

        {tenantDocuments.length > 0 && (
          <Card className="border border-border shadow-none">
            <CardHeader>
              <CardTitle className="text-base">Documents</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50 hover:bg-accent/50">
                    <TableHead className="font-medium text-xs uppercase tracking-wide text-muted-foreground pl-6">Document</TableHead>
                    <TableHead className="font-medium text-xs uppercase tracking-wide text-muted-foreground">Type</TableHead>
                    <TableHead className="font-medium text-xs uppercase tracking-wide text-muted-foreground pr-6">Uploaded</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tenantDocuments.map((doc) => (
                    <TableRow
                      key={doc.id}
                      className="hover:bg-accent/50 cursor-pointer"
                      onClick={() => navigate(`/documents/${doc.id}`)}
                    >
                      <TableCell className="font-medium text-foreground pl-6">{doc.name}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="font-normal text-xs">{doc.documentType}</Badge>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground pr-6">{doc.uploadDate}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}
      </div>
    </MainLayout>
  );
}
