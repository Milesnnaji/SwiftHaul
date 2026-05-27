import { auth } from "@/auth";
import { redirect, notFound } from "next/navigation";
import { connectDB } from "@/lib/db";
import Shipment from "@/models/Shipment";
import mongoose from "mongoose";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { StatusBadge } from "@/components/shared/status-badge";
import { ShipmentTimeline } from "@/components/shared/shipment-timeline";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Package } from "lucide-react";
import { formatDate, formatDateShort } from "@/lib/utils";
import type { ShipmentStatus } from "@/models/Shipment";

export default async function ShipmentDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const { id } = await params;

  if (!mongoose.isValidObjectId(id)) notFound();

  await connectDB();

  const shipment = await Shipment.findById(id)
    .populate("driverId", "name phone")
    .lean();

  if (!shipment) notFound();

  if (
    session.user.role === "customer" &&
    shipment.customerId.toString() !== session.user.id
  ) {
    redirect("/shipments");
  }

  const driver = shipment.driverId as { name?: string; phone?: string } | null;

  return (
    <DashboardShell
      role={session.user.role}
      userName={session.user.name ?? ""}
      userEmail={session.user.email ?? ""}
    >
      <div className="mb-6">
        <Button variant="ghost" size="sm" asChild className="mb-4">
          <Link href="/shipments">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Shipments
          </Link>
        </Button>
        <div className="flex items-start justify-between flex-wrap gap-3">
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Sender & Recipient */}
          <Card>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider mb-3">
                    Sender
                  </p>
                  <p className="font-semibold">{shipment.senderDetails.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {shipment.senderDetails.email}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {shipment.senderDetails.phone}
                  </p>
                  <p className="text-sm mt-2">
                    {shipment.senderDetails.address}
                    <br />
                    {shipment.senderDetails.city}, {shipment.senderDetails.state}
                    <br />
                    {shipment.senderDetails.country}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider mb-3">
                    Recipient
                  </p>
                  <p className="font-semibold">{shipment.recipientDetails.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {shipment.recipientDetails.email}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {shipment.recipientDetails.phone}
                  </p>
                  <p className="text-sm mt-2">
                    {shipment.recipientDetails.address}
                    <br />
                    {shipment.recipientDetails.city},{" "}
                    {shipment.recipientDetails.state}
                    <br />
                    {shipment.recipientDetails.country}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Package Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Package className="h-4 w-4" />
                Package Information
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-0">
              <div>
                <p className="text-xs text-muted-foreground mb-1">Weight</p>
                <p className="font-semibold">{shipment.packageInfo.weightKg} kg</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Category</p>
                <Badge variant="outline" className="capitalize">
                  {shipment.packageInfo.category}
                </Badge>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Zone</p>
                <Badge variant="outline" className="capitalize">
                  {shipment.zone}
                </Badge>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Dimensions (cm)</p>
                <p className="font-semibold text-sm">
                  {shipment.packageInfo.dimensions.length} ×{" "}
                  {shipment.packageInfo.dimensions.width} ×{" "}
                  {shipment.packageInfo.dimensions.height}
                </p>
              </div>
              <div className="col-span-2 md:col-span-4">
                <p className="text-xs text-muted-foreground mb-1">Description</p>
                <p className="text-sm">{shipment.packageInfo.description}</p>
              </div>
            </CardContent>
          </Card>

          {/* Proof of Delivery */}
          {shipment.proofOfDeliveryUrl && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Proof of Delivery</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={shipment.proofOfDeliveryUrl}
                  alt="Proof of delivery"
                  className="rounded-lg border max-h-64 object-cover w-full"
                />
              </CardContent>
            </Card>
          )}
        </div>

        <div className="space-y-6">
          {/* Pricing */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Payment Summary</CardTitle>
            </CardHeader>
            <CardContent className="pt-0 space-y-3">
              {[
                ["Base Rate", shipment.pricing.baseRate],
                ["Weight Charge", shipment.pricing.weightCharge],
                ["Category Surcharge", shipment.pricing.categorySurcharge],
                ["VAT (7.5%)", shipment.pricing.tax],
              ].map(([label, value]) => (
                <div key={label as string} className="flex justify-between text-sm">
                  <span className="text-muted-foreground">{label}</span>
                  <span>
                    ₦
                    {((value as number) / 100).toLocaleString("en-NG", {
                      minimumFractionDigits: 2,
                    })}
                  </span>
                </div>
              ))}
              <Separator />
              <div className="flex justify-between font-bold">
                <span>Total</span>
                <span className="text-primary">
                  ₦
                  {(shipment.pricing.total / 100).toLocaleString("en-NG", {
                    minimumFractionDigits: 2,
                  })}
                </span>
              </div>
              <Badge
                variant={shipment.paymentStatus === "paid" ? "success" : "warning"}
                className="w-full justify-center capitalize"
              >
                {shipment.paymentStatus}
              </Badge>
            </CardContent>
          </Card>

          {/* Driver info */}
          {driver && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Driver</CardTitle>
              </CardHeader>
              <CardContent className="pt-0 text-sm">
                <p className="font-semibold">{driver.name}</p>
                {driver.phone && (
                  <p className="text-muted-foreground">{driver.phone}</p>
                )}
              </CardContent>
            </Card>
          )}

          {/* Timeline */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Tracking Timeline</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <ShipmentTimeline timeline={shipment.timeline} />
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardShell>
  );
}
