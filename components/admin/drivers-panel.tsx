"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createDriverSchema, type CreateDriverInput } from "@/lib/validators/driver";
import { Plus, Loader2, UserCheck, UserX } from "lucide-react";
import { formatDateShort } from "@/lib/utils";

interface Driver {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  licenseNumber?: string;
  isActive: boolean;
  createdAt: string;
  vehicleInfo?: { type: string; plateNumber: string; model: string };
}

interface Props {
  drivers: Driver[];
}

export function AdminDriversPanel({ drivers: initialDrivers }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<CreateDriverInput>({ resolver: zodResolver(createDriverSchema) });

  async function onSubmit(data: CreateDriverInput) {
    setLoading(true);
    try {
      const res = await fetch("/api/drivers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const json = await res.json();
      if (!res.ok) {
        toast.error(json.error ?? "Failed to create driver.");
        return;
      }

      toast.success(`Driver account created. Welcome email sent to ${data.email}`);
      reset();
      setOpen(false);
      startTransition(() => router.refresh());
    } catch {
      toast.error("Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  async function toggleActive(driverId: string, isActive: boolean) {
    const res = await fetch(`/api/drivers/${driverId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isActive: !isActive }),
    });

    if (!res.ok) {
      toast.error("Failed to update driver status.");
      return;
    }

    toast.success(`Driver ${isActive ? "suspended" : "reactivated"}.`);
    startTransition(() => router.refresh());
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Driver
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Create Driver Account</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-2">
              {[
                { id: "name", label: "Full Name", placeholder: "John Driver" },
                { id: "email", label: "Email", type: "email", placeholder: "driver@example.com" },
                { id: "phone", label: "Phone", placeholder: "+234 800 000 0000" },
                { id: "licenseNumber", label: "License Number", placeholder: "ABC123456" },
              ].map(({ id, label, type, placeholder }) => (
                <div key={id} className="space-y-1.5">
                  <Label>{label}</Label>
                  <Input
                    type={type ?? "text"}
                    placeholder={placeholder}
                    {...register(id as keyof CreateDriverInput)}
                  />
                  {errors[id as keyof typeof errors] && (
                    <p className="text-xs text-destructive">
                      {(errors[id as keyof typeof errors] as { message?: string })?.message}
                    </p>
                  )}
                </div>
              ))}
              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1.5">
                  <Label>Vehicle Type</Label>
                  <Select
                    onValueChange={(v) =>
                      setValue("vehicleInfo.type", v as "motorcycle" | "car" | "van" | "truck")
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="motorcycle">Motorcycle</SelectItem>
                      <SelectItem value="car">Car</SelectItem>
                      <SelectItem value="van">Van</SelectItem>
                      <SelectItem value="truck">Truck</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label>Plate</Label>
                  <Input placeholder="ABC-123-XY" {...register("vehicleInfo.plateNumber")} />
                </div>
                <div className="space-y-1.5">
                  <Label>Model</Label>
                  <Input placeholder="Toyota Camry" {...register("vehicleInfo.model")} />
                </div>
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Create Driver Account
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Vehicle</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Joined</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {initialDrivers.map((d) => (
                <TableRow key={d._id}>
                  <TableCell className="font-medium text-sm">{d.name}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{d.email}</TableCell>
                  <TableCell className="text-sm">{d.phone ?? "—"}</TableCell>
                  <TableCell className="text-sm">
                    {d.vehicleInfo ? (
                      <div>
                        <p className="capitalize">{d.vehicleInfo.type}</p>
                        <p className="text-xs text-muted-foreground">
                          {d.vehicleInfo.plateNumber}
                        </p>
                      </div>
                    ) : "—"}
                  </TableCell>
                  <TableCell>
                    <Badge variant={d.isActive ? "success" : "destructive"}>
                      {d.isActive ? "Active" : "Suspended"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">
                    {formatDateShort(d.createdAt)}
                  </TableCell>
                  <TableCell>
                    <Button
                      size="sm"
                      variant={d.isActive ? "destructive" : "outline"}
                      onClick={() => toggleActive(d._id, d.isActive)}
                      className="text-xs h-7"
                    >
                      {d.isActive ? (
                        <>
                          <UserX className="mr-1 h-3 w-3" /> Suspend
                        </>
                      ) : (
                        <>
                          <UserCheck className="mr-1 h-3 w-3" /> Activate
                        </>
                      )}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {initialDrivers.length === 0 && (
            <div className="text-center py-8 text-muted-foreground text-sm">
              No drivers yet. Add your first driver.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
