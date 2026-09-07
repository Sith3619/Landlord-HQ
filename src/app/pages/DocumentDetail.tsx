import { useParams, useNavigate } from "react-router";
import { MainLayout } from "../components/layout/MainLayout";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { ArrowLeft, Download, FileText, Building2, DoorOpen, User, Calendar } from "lucide-react";
import { useApp } from "../context/AppContext";

const DOC_TYPE_COLORS: Record<string, string> = {
  "Lease Agreement": "bg-blue-50 text-blue-700 border border-blue-100",
  "Inspection Report": "bg-purple-50 text-purple-700 border border-purple-100",
  "Invoice": "bg-amber-50 text-amber-700 border border-amber-100",
  "Receipt": "bg-green-50 text-green-700 border border-green-100",
  "Notice": "bg-orange-50 text-orange-700 border border-orange-100",
  "Insurance": "bg-indigo-50 text-indigo-700 border border-indigo-100",
  "Other": "bg-muted text-muted-foreground border border-border",
};

export function DocumentDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { documents, properties, units, tenants } = useApp();

  const doc = documents.find((d) => d.id === Number(id));

  if (!doc) {
    return (
      <MainLayout title="Document Not Found">
        <div className="text-center py-16">
          <p className="text-muted-foreground mb-4">This document could not be found.</p>
          <Button onClick={() => navigate("/documents")} variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Documents
          </Button>
        </div>
      </MainLayout>
    );
  }

  const property = doc.propertyId ? properties.find((p) => p.id === doc.propertyId) : null;
  const unit = doc.unitId ? units.find((u) => u.id === doc.unitId) : null;
  const tenant = doc.tenantId ? tenants.find((t) => t.id === doc.tenantId) : null;

  const badgeClass = DOC_TYPE_COLORS[doc.documentType] || DOC_TYPE_COLORS["Other"];

  return (
    <MainLayout title={doc.name}>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <button
            onClick={() => navigate("/documents")}
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-4"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Documents
          </button>
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div className="flex items-start gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-muted flex-shrink-0 mt-0.5">
                <FileText className="h-5 w-5 text-muted-foreground" />
              </div>
              <div>
                <h2 className="text-2xl font-semibold text-foreground">{doc.name}</h2>
                <div className="flex items-center gap-1.5 mt-1 text-xs text-muted-foreground">
                  <Calendar className="h-3.5 w-3.5" />
                  Uploaded {doc.uploadDate}
                </div>
              </div>
            </div>
            <Badge className={`text-xs font-medium ${badgeClass}`}>
              {doc.documentType}
            </Badge>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Document Info */}
          <Card className="border border-border shadow-none">
            <CardHeader>
              <CardTitle className="text-base">Document Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { label: "Document Name", value: doc.name },
                { label: "Type", value: doc.documentType },
                { label: "Upload Date", value: doc.uploadDate },
              ].map(({ label, value }) => (
                <div key={label} className="flex flex-col gap-0.5">
                  <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium">{label}</p>
                  <p className="text-sm text-foreground">{value}</p>
                </div>
              ))}
              {doc.notes && (
                <div className="flex flex-col gap-0.5">
                  <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium">Notes</p>
                  <p className="text-sm text-muted-foreground italic">{doc.notes}</p>
                </div>
              )}
              <div className="pt-2">
                <Button
                  className="w-full bg-green-600 hover:bg-green-700"
                  onClick={() => {}}
                >
                  <Download className="mr-2 h-4 w-4" />
                  Download Document
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Associated Entities */}
          <Card className="border border-border shadow-none">
            <CardHeader>
              <CardTitle className="text-base">Associated With</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {property ? (
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium mb-2">Property</p>
                  <button
                    onClick={() => navigate(`/properties/${property.id}`)}
                    className="flex items-center gap-3 p-3 rounded-lg border border-border bg-muted/50 hover:bg-accent transition-colors w-full text-left"
                  >
                    <Building2 className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-foreground">{property.name}</p>
                      <p className="text-xs text-muted-foreground">{property.address}</p>
                    </div>
                  </button>
                </div>
              ) : (
                <div className="flex flex-col gap-0.5">
                  <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium">Property</p>
                  <p className="text-sm text-muted-foreground">No property associated</p>
                </div>
              )}

              {unit ? (
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium mb-2">Unit</p>
                  <button
                    onClick={() => navigate(`/units/${unit.id}`)}
                    className="flex items-center gap-3 p-3 rounded-lg border border-border bg-muted/50 hover:bg-accent transition-colors w-full text-left"
                  >
                    <DoorOpen className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-foreground">Unit {unit.unitNumber}</p>
                      <p className="text-xs text-muted-foreground">${unit.rent.toLocaleString()}/month</p>
                    </div>
                  </button>
                </div>
              ) : (
                <div className="flex flex-col gap-0.5">
                  <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium">Unit</p>
                  <p className="text-sm text-muted-foreground">No unit associated</p>
                </div>
              )}

              {tenant ? (
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium mb-2">Tenant</p>
                  <button
                    onClick={() => navigate(`/tenants/${tenant.id}`)}
                    className="flex items-center gap-3 p-3 rounded-lg border border-border bg-muted/50 hover:bg-accent transition-colors w-full text-left"
                  >
                    <User className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-foreground">{tenant.fullName}</p>
                      <p className="text-xs text-muted-foreground">{tenant.email}</p>
                    </div>
                  </button>
                </div>
              ) : (
                <div className="flex flex-col gap-0.5">
                  <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium">Tenant</p>
                  <p className="text-sm text-muted-foreground">No tenant associated</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
}
