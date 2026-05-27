import { auth } from "@/auth";
import { redirect, notFound } from "next/navigation";
import mongoose from "mongoose";
import { connectDB } from "@/lib/db";
import Shipment from "@/models/Shipment";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "@/components/shared/status-badge";
import { ShipmentTimeline } from "@/components/shared/shipment-timeline";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft, Phone, Mail, MapPin } from "lucide-react";
import { formatDateShort } from "@/lib/utils";
import { DriverDeliveryActions } from "@/components/driver/delivery-actions";
import type { ShipmentStatus } from "@/models/Shipment";

export default async function DriverDeliveryDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth();
  if (!session?.user || session.user.role !== "driver") redirect("/login");

  const { id } = await params;

  if (!mongoose.isValidObjectId(id)) notFound();

  await connectDB();

  const shipment = await Shipment.findOne({
    _id: id,
    driverId: session.user.id,
  }).lean();

  if (!shipment) notFound();

  return (
    <DashboardShell
      role="driver"
      userName={session.user.name ?? ""}
      userEmail={session.user.email ?? ""}
    >
      <div className="mb-6">
        <Button variant="ghost" size="sm" asChild className="mb-4">
          <Link href="/driver/deliveries">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Deliveries
          </Link>
        </Button>
        <div className="flex items-start justify-between gap-3 flex-wrap">
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
              Tracking ID
            </p>
            <h1 className="text-2xl font-bold font-mono">{shipment.trackingId}</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Created {formatDateShort(shipment.createdAt)}
            </p>
          </div>
          <StatusBadge status={shipment.status as ShipmentStatus} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recipient Info */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              Delivery Address
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0 space-y-3">
            <p className="font-semibold">{shipment.recipientDetails.name}</p>
            <p className="text-sm text-muted-foreground">
              {shipment.recipientDetails.address}
              <br />
              {shipment.recipientDetails.city}, {shipment.recipientDetails.state}
              <br />
              {shipment.recipientDetails.country}
            </p>
            <div className="flex flex-col gap-2 pt-2">
              <a
                href={`tel:${shipment.recipientDetails.phone}`}
                className="flex items-center gap-2 text-sm text-primary hover:underline"
              >
                <Phone className="h-4 w-4" />
                {shipment.recipientDetails.phone}
              </a>
              <a
                href={`mailto:${shipment.recipientDetails.email}`}
                className="flex items-center gap-2 text-sm text-primary hover:underline"
              >
                <Mail className="h-4 w-4" />
                {shipment.recipientDetails.email}
              </a>
            </div>
          </CardContent>
        </Card>

        {/* Package Info */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Package</CardTitle>
          </CardHeader>
          <CardContent className="pt-0 space-y-3">
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-muted-foreground mb-0.5">Weight</p>
                <p className="font-semibold">{shipment.packageInfo.weightKg} kg</p>
              </div>
              <div>
                <p className="text-muted-foreground mb-0.5">Category</p>
                <Badge variant="outline" className="capitalize">
                  {shipment.packageInfo.category}
                </Badge>
              </div>
            </div>
            <div>
              <p className="text-muted-foreground text-sm mb-0.5">Description</p>
              <p className="text-sm">{shipment.packageInfo.description}</p>
            </div>
          </CardContent>
        </Card>

        {/* Driver Actions */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">Update Delivery</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <DriverDeliveryActions
              shipmentId={shipment._id.toString()}
              trackingId={shipment.trackingId}
              currentStatus={shipment.status as ShipmentStatus}
              proofOfDeliveryUrl={shipment.proofOfDeliveryUrl}
            />
          </CardContent>
        </Card>

        {/* Timeline */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">Tracking Timeline</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <ShipmentTimeline timeline={shipment.timeline} />
          </CardContent>
        </Card>
      </div>
    </DashboardShell>
  );
}
