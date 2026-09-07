import { useParams, useNavigate } from "react-router";
import { MainLayout } from "../components/layout/MainLayout";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { ArrowLeft, DoorOpen, Users, Wrench, FileText, MapPin } from "lucide-react";
import { useApp } from "../context/AppContext";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";

function priorityBadgeClass(priority: string) {
  switch (priority) {
    case "High":
    case "Urgent":
      return "bg-red-50 text-red-700 border border-red-100";
    case "Medium":
      return "bg-amber-50 text-amber-700 border border-amber-100";
    default:
      return "bg-muted text-muted-foreground border border-border";
  }
}

function statusBadgeClass(status: string) {
  switch (status) {
    case "Completed":
      return "bg-green-50 text-green-700 border border-green-100";
    case "In Progress":
      return "bg-blue-50 text-blue-700 border border-blue-100";
    default:
      return "bg-muted text-muted-foreground border border-border";
  }
}

export function PropertyDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { properties, units, tenants, maintenanceTickets, documents } = useApp();

  const property = properties.find((p) => p.id === Number(id));

  if (!property) {
    return (
      <MainLayout title="Property Not Found">
        <div className="text-center py-16">
          <p className="text-muted-foreground mb-4">This property could not be found.</p>
          <Button onClick={() => navigate("/properties")} variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Properties
          </Button>
        </div>
      </MainLayout>
    );
  }

  const propertyUnits = units.filter((u) => u.propertyId === property.id);
  const propertyTenants = tenants.filter((t) => t.propertyId === property.id);
  const propertyTickets = maintenanceTickets.filter((t) => t.propertyId === property.id);
  const propertyDocuments = documents.filter((d) => d.propertyId === property.id);
  const occupiedCount = propertyUnits.filter((u) => u.status === "Occupied").length;
  const occupancyRate = propertyUnits.length > 0 ? Math.round((occupiedCount / propertyUnits.length) * 100) : 0;
  const openTickets = propertyTickets.filter((t) => t.status !== "Completed").length;

  return (
    <MainLayout title={property.name}>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <button
            onClick={() => navigate("/properties")}
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-4"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Properties
          </button>
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <h2 className="text-2xl font-semibold text-foreground">{property.name}</h2>
              <div className="flex items-center gap-1.5 mt-1 text-sm text-muted-foreground">
                <MapPin className="h-3.5 w-3.5 flex-shrink-0" />
                {property.address}, {property.city}, {property.province} {property.postalCode}
              </div>
              <div className="flex items-center gap-2 mt-2">
                <Badge className="bg-green-50 text-green-700 border border-green-100 font-medium">
                  {property.status}
                </Badge>
                <Badge variant="outline" className="font-normal text-xs">
                  {property.propertyType}
                </Badge>
              </div>
            </div>
          </div>
        </div>

        {/* Metrics */}
        <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
          <Card className="border border-border shadow-none">
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Units</p>
                <DoorOpen className="h-4 w-4 text-muted-foreground" />
              </div>
              <p className="text-2xl font-semibold text-foreground">{propertyUnits.length}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{occupiedCount} occupied · {occupancyRate}%</p>
            </CardContent>
          </Card>
          <Card className="border border-border shadow-none">
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Tenants</p>
                <Users className="h-4 w-4 text-muted-foreground" />
              </div>
              <p className="text-2xl font-semibold text-foreground">{propertyTenants.length}</p>
              <p className="text-xs text-muted-foreground mt-0.5">active tenants</p>
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
              <p className="text-xs text-muted-foreground mt-0.5">maintenance requests</p>
            </CardContent>
          </Card>
          <Card className="border border-border shadow-none">
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Documents</p>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </div>
              <p className="text-2xl font-semibold text-foreground">{propertyDocuments.length}</p>
              <p className="text-xs text-muted-foreground mt-0.5">stored files</p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="units">
          <TabsList className="border-b border-border bg-transparent rounded-none h-auto p-0 gap-0 w-full justify-start">
            {["units", "tenants", "maintenance", "documents", "notes"].map((tab) => (
              <TabsTrigger
                key={tab}
                value={tab}
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-green-600 data-[state=active]:text-green-700 data-[state=active]:bg-transparent pb-3 pt-1 px-4 text-sm capitalize font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                {tab === "notes" ? "Notes" : tab.charAt(0).toUpperCase() + tab.slice(1)}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="units" className="mt-4">
            <Card className="border border-border shadow-none">
              <CardContent className="p-0">
                {propertyUnits.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground text-sm">
                    No units in this property yet.
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-muted/50 hover:bg-accent/50">
                        <TableHead className="font-medium text-xs uppercase tracking-wide text-muted-foreground pl-6">Unit</TableHead>
                        <TableHead className="font-medium text-xs uppercase tracking-wide text-muted-foreground">Tenant</TableHead>
                        <TableHead className="font-medium text-xs uppercase tracking-wide text-muted-foreground">Rent / mo</TableHead>
                        <TableHead className="font-medium text-xs uppercase tracking-wide text-muted-foreground">Status</TableHead>
                        <TableHead className="font-medium text-xs uppercase tracking-wide text-muted-foreground pr-6">Lease End</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {propertyUnits.map((unit) => (
                        <TableRow
                          key={unit.id}
                          className="hover:bg-accent/50 cursor-pointer"
                          onClick={() => navigate(`/units/${unit.id}`)}
                        >
                          <TableCell className="font-medium text-foreground pl-6">Unit {unit.unitNumber}</TableCell>
                          <TableCell className="text-sm text-muted-foreground">
                            {unit.tenantName ? (
                              <button
                                className="text-green-600 hover:underline font-medium text-sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  const tenant = tenants.find((t) => t.id === unit.tenantId);
                                  if (tenant) navigate(`/tenants/${tenant.id}`);
                                }}
                              >
                                {unit.tenantName}
                              </button>
                            ) : (
                              <span className="text-muted-foreground/50">Vacant</span>
                            )}
                          </TableCell>
                          <TableCell className="text-sm font-medium text-foreground">${unit.rent.toLocaleString()}</TableCell>
                          <TableCell>
                            <Badge
                              className={
                                unit.status === "Occupied"
                                  ? "bg-green-50 text-green-700 border border-green-100 font-medium"
                                  : "bg-amber-50 text-amber-700 border border-amber-100 font-medium"
                              }
                            >
                              {unit.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground pr-6">
                            {unit.leaseEnd || <span className="text-muted-foreground/50">—</span>}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="tenants" className="mt-4">
            <Card className="border border-border shadow-none">
              <CardContent className="p-0">
                {propertyTenants.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground text-sm">
                    No tenants in this property yet.
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-muted/50 hover:bg-accent/50">
                        <TableHead className="font-medium text-xs uppercase tracking-wide text-muted-foreground pl-6">Name</TableHead>
                        <TableHead className="font-medium text-xs uppercase tracking-wide text-muted-foreground">Email</TableHead>
                        <TableHead className="font-medium text-xs uppercase tracking-wide text-muted-foreground">Unit</TableHead>
                        <TableHead className="font-medium text-xs uppercase tracking-wide text-muted-foreground">Lease Ends</TableHead>
                        <TableHead className="font-medium text-xs uppercase tracking-wide text-muted-foreground pr-6">Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {propertyTenants.map((tenant) => (
                        <TableRow
                          key={tenant.id}
                          className="hover:bg-accent/50 cursor-pointer"
                          onClick={() => navigate(`/tenants/${tenant.id}`)}
                        >
                          <TableCell className="font-medium text-foreground pl-6">{tenant.fullName}</TableCell>
                          <TableCell className="text-sm text-muted-foreground">{tenant.email}</TableCell>
                          <TableCell className="text-sm text-muted-foreground">
                            {tenant.unitNumber ? `Unit ${tenant.unitNumber}` : <span className="text-muted-foreground/50">—</span>}
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground">
                            {tenant.leaseEnd || <span className="text-muted-foreground/50">—</span>}
                          </TableCell>
                          <TableCell className="pr-6">
                            <Badge
                              className={
                                tenant.leaseStatus === "Active"
                                  ? "bg-green-50 text-green-700 border border-green-100 font-medium"
                                  : "bg-muted text-muted-foreground border border-border font-medium"
                              }
                            >
                              {tenant.leaseStatus}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="maintenance" className="mt-4">
            <Card className="border border-border shadow-none">
              <CardContent className="p-0">
                {propertyTickets.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground text-sm">
                    No maintenance tickets for this property.
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-muted/50 hover:bg-accent/50">
                        <TableHead className="font-medium text-xs uppercase tracking-wide text-muted-foreground pl-6">Issue</TableHead>
                        <TableHead className="font-medium text-xs uppercase tracking-wide text-muted-foreground">Unit</TableHead>
                        <TableHead className="font-medium text-xs uppercase tracking-wide text-muted-foreground">Category</TableHead>
                        <TableHead className="font-medium text-xs uppercase tracking-wide text-muted-foreground">Priority</TableHead>
                        <TableHead className="font-medium text-xs uppercase tracking-wide text-muted-foreground">Status</TableHead>
                        <TableHead className="font-medium text-xs uppercase tracking-wide text-muted-foreground pr-6">Created</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {propertyTickets.map((ticket) => (
                        <TableRow
                          key={ticket.id}
                          className="hover:bg-accent/50 cursor-pointer"
                          onClick={() => navigate(`/maintenance/${ticket.id}`)}
                        >
                          <TableCell className="font-medium text-foreground pl-6">{ticket.title}</TableCell>
                          <TableCell className="text-sm text-muted-foreground">Unit {ticket.unitNumber}</TableCell>
                          <TableCell className="text-sm text-muted-foreground">{ticket.category}</TableCell>
                          <TableCell>
                            <Badge className={`font-medium text-xs ${priorityBadgeClass(ticket.priority)}`}>
                              {ticket.priority}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge className={`font-medium text-xs ${statusBadgeClass(ticket.status)}`}>
                              {ticket.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground pr-6">{ticket.createdDate}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="documents" className="mt-4">
            <Card className="border border-border shadow-none">
              <CardContent className="p-0">
                {propertyDocuments.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground text-sm">
                    No documents for this property yet.
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-muted/50 hover:bg-accent/50">
                        <TableHead className="font-medium text-xs uppercase tracking-wide text-muted-foreground pl-6">Document Name</TableHead>
                        <TableHead className="font-medium text-xs uppercase tracking-wide text-muted-foreground">Type</TableHead>
                        <TableHead className="font-medium text-xs uppercase tracking-wide text-muted-foreground">Unit</TableHead>
                        <TableHead className="font-medium text-xs uppercase tracking-wide text-muted-foreground pr-6">Uploaded</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {propertyDocuments.map((doc) => (
                        <TableRow
                          key={doc.id}
                          className="hover:bg-accent/50 cursor-pointer"
                          onClick={() => navigate(`/documents/${doc.id}`)}
                        >
                          <TableCell className="font-medium text-foreground pl-6">{doc.name}</TableCell>
                          <TableCell>
                            <Badge variant="outline" className="font-normal text-xs">{doc.documentType}</Badge>
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground">
                            {doc.unitNumber ? `Unit ${doc.unitNumber}` : <span className="text-muted-foreground/50">—</span>}
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground pr-6">{doc.uploadDate}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notes" className="mt-4">
            <Card className="border border-border shadow-none">
              <CardHeader>
                <CardTitle className="text-base">Property Notes</CardTitle>
              </CardHeader>
              <CardContent>
                {property.notes ? (
                  <p className="text-sm text-muted-foreground leading-relaxed">{property.notes}</p>
                ) : (
                  <p className="text-sm text-muted-foreground">No notes added for this property.</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
}
