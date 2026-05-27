"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { Navbar } from "@/components/layout/navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ShipmentTimeline } from "@/components/shared/shipment-timeline";
import { StatusBadge } from "@/components/shared/status-badge";
import { Search, Package, Loader2 } from "lucide-react";
import type { IShipment } from "@/models/Shipment";
import { formatDateShort } from "@/lib/utils";

export default function TrackContent() {
  const searchParams = useSearchParams();
  const [trackingId, setTrackingId] = useState(
    searchParams.get("id")?.toUpperCase() ?? ""
  );
  const [shipment, setShipment] = useState<IShipment | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleTrack(e: React.FormEvent) {
    e.preventDefault();
    if (!trackingId.trim()) return;

    setLoading(true);
    setError("");
    setShipment(null);

    try {
      const res = await fetch(`/api/track/${trackingId.trim().toUpperCase()}`);
      const data = await res.json();

      if (!res.ok) {
        setError("Tracking ID not found. Please check and try again.");
        return;
      }

      setShipment(data.shipment);
    } catch {
      setError("Failed to fetch tracking info. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="container max-w-2xl py-16 px-4">
        <div className="text-center mb-10">
          <Package className="h-12 w-12 text-primary mx-auto mb-4" />
          <h1 className="text-3xl font-bold mb-2">Track Your Shipment</h1>
          <p className="text-muted-foreground">
            Enter your tracking ID to get real-time delivery updates.
          </p>
        </div>

        <form onSubmit={handleTrack} className="flex gap-3 mb-8">
          <Input
            placeholder="e.g. SH-20240601-ABCD1"
            value={trackingId}
            onChange={(e) => setTrackingId(e.target.value.toUpperCase())}
            className="font-mono uppercase"
          />
          <Button type="submit" disabled={loading}>
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Search className="h-4 w-4" />
            )}
          </Button>
        </form>

        {error && (
          <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-destructive text-sm mb-6">
            {error}
          </div>
        )}

        {shipment && (
          <Card className="animate-fade-in">
            <CardHeader>
              <div className="flex items-center justify-between flex-wrap gap-3">
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
                    Tracking ID
                  </p>
                  <CardTitle className="font-mono text-xl">
                    {shipment.trackingId}
                  </CardTitle>
                </div>
                <StatusBadge status={shipment.status} />
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground mb-0.5">From</p>
                  <p className="font-medium">
                    {(shipment.senderDetails as { city?: string })?.city},{" "}
                    {(shipment.senderDetails as { country?: string })?.country}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground mb-0.5">To</p>
                  <p className="font-medium">
                    {(shipment.recipientDetails as { city?: string })?.city},{" "}
                    {(shipment.recipientDetails as { country?: string })?.country}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground mb-0.5">Zone</p>
                  <Badge variant="outline" className="capitalize">
                    {shipment.zone}
                  </Badge>
                </div>
                <div>
                  <p className="text-muted-foreground mb-0.5">Booked</p>
                  <p className="font-medium">{formatDateShort(shipment.createdAt)}</p>
                </div>
              </div>

              {shipment.proofOfDeliveryUrl && (
                <div>
                  <p className="text-sm text-muted-foreground mb-2">
                    Proof of Delivery
                  </p>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={shipment.proofOfDeliveryUrl}
                    alt="Proof of delivery"
                    className="rounded-lg border max-h-48 object-cover w-full"
                  />
                </div>
              )}

              <div>
                <p className="font-semibold mb-4">Tracking History</p>
                <ShipmentTimeline timeline={shipment.timeline} />
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
