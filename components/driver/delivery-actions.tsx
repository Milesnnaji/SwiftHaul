"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Upload, CheckCircle2 } from "lucide-react";
import type { ShipmentStatus } from "@/models/Shipment";

const STATUS_OPTIONS: { value: ShipmentStatus; label: string }[] = [
  { value: "picked_up", label: "Picked Up" },
  { value: "in_transit", label: "In Transit" },
  { value: "out_for_delivery", label: "Out for Delivery" },
  { value: "delivered", label: "Delivered" },
  { value: "failed", label: "Failed Delivery" },
];

interface DriverDeliveryActionsProps {
  shipmentId: string;
  trackingId: string;
  currentStatus: ShipmentStatus;
  proofOfDeliveryUrl?: string;
}

export function DriverDeliveryActions({
  shipmentId,
  trackingId,
  currentStatus,
  proofOfDeliveryUrl,
}: DriverDeliveryActionsProps) {
  const router = useRouter();
  const [status, setStatus] = useState<ShipmentStatus>(currentStatus);
  const [note, setNote] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [uploadedUrl, setUploadedUrl] = useState(proofOfDeliveryUrl ?? "");

  async function handleUpdate() {
    setLoading(true);
    try {
      // Upload proof if provided
      let proofUrl = uploadedUrl;
      if (file && status === "delivered") {
        const form = new FormData();
        form.append("file", file);
        form.append("trackingId", trackingId);
        const uploadRes = await fetch("/api/upload/proof", {
          method: "POST",
          body: form,
        });
        const uploadData = await uploadRes.json();
        if (!uploadRes.ok) {
          toast.error(uploadData.error ?? "Upload failed.");
          setLoading(false);
          return;
        }
        proofUrl = uploadData.url;
        setUploadedUrl(proofUrl);

        // Save proof to shipment
        await fetch(`/api/shipments/${shipmentId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ proofOfDeliveryUrl: proofUrl }),
        });
      }

      const res = await fetch(`/api/shipments/${shipmentId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, note: note.trim() || undefined }),
      });

      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error ?? "Update failed.");
        return;
      }

      toast.success(`Status updated to: ${status.replace(/_/g, " ")}`);
      router.refresh();
    } catch {
      toast.error("Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  const isTerminal = currentStatus === "delivered" || currentStatus === "failed";

  if (isTerminal) {
    return (
      <div className="flex items-center gap-2 text-green-600">
        <CheckCircle2 className="h-5 w-5" />
        <span className="font-medium">
          This delivery is {currentStatus === "delivered" ? "completed" : "closed"}.
        </span>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label>Update Status</Label>
          <Select
            value={status}
            onValueChange={(v) => setStatus(v as ShipmentStatus)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {STATUS_OPTIONS.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {status === "delivered" && (
          <div className="space-y-1.5">
            <Label>Proof of Delivery Photo</Label>
            <Input
              type="file"
              accept="image/*"
              onChange={(e) => setFile(e.target.files?.[0] ?? null)}
              className="cursor-pointer"
            />
            {uploadedUrl && (
              <p className="text-xs text-green-600">Photo uploaded ✓</p>
            )}
          </div>
        )}
      </div>

      <div className="space-y-1.5">
        <Label>Note (optional)</Label>
        <Textarea
          placeholder="Add a note about this status update..."
          value={note}
          onChange={(e) => setNote(e.target.value)}
          rows={2}
        />
      </div>

      <Button onClick={handleUpdate} disabled={loading}>
        {loading ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <Upload className="mr-2 h-4 w-4" />
        )}
        Update Status
      </Button>
    </div>
  );
}
