"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, type FieldValues, type UseFormRegister, type UseFormSetValue } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { calculatePricing } from "@/lib/pricing";
import { cn } from "@/lib/utils";
import { CheckCircle2, Loader2, ArrowRight, ArrowLeft } from "lucide-react";

const addressSchema = z.object({
  name: z.string().min(2, "Name required"),
  email: z.string().email("Valid email required"),
  phone: z.string().min(10, "Valid phone required"),
  address: z.string().min(5, "Address required"),
  city: z.string().min(2, "City required"),
  state: z.string().min(2, "State required"),
  country: z.string().min(2, "Country required"),
  postalCode: z.string().optional(),
});

const step1Schema = z.object({ senderDetails: addressSchema });
const step2Schema = z.object({ recipientDetails: addressSchema });
const step3Schema = z.object({
  packageInfo: z.object({
    weightKg: z.coerce.number().positive("Weight must be positive").max(500),
    dimensions: z.object({
      length: z.coerce.number().positive(),
      width: z.coerce.number().positive(),
      height: z.coerce.number().positive(),
    }),
    category: z.enum(["standard", "fragile", "perishable"]),
    description: z.string().min(5, "Description required"),
  }),
  zone: z.enum(["local", "interstate", "international"]),
});

type Step1 = z.infer<typeof step1Schema>;
type Step2 = z.infer<typeof step2Schema>;
type Step3 = z.infer<typeof step3Schema>;

const STEPS = ["Sender", "Recipient", "Package", "Payment"];

const NIGERIAN_STATES = [
  "Abia", "Adamawa", "Akwa Ibom", "Anambra", "Bauchi", "Bayelsa", "Benue",
  "Borno", "Cross River", "Delta", "Ebonyi", "Edo", "Ekiti", "Enugu", "FCT",
  "Gombe", "Imo", "Jigawa", "Kaduna", "Kano", "Katsina", "Kebbi", "Kogi",
  "Kwara", "Lagos", "Nasarawa", "Niger", "Ogun", "Ondo", "Osun", "Oyo",
  "Plateau", "Rivers", "Sokoto", "Taraba", "Yobe", "Zamfara",
];

function AddressForm({
  prefix,
  register,
  errors,
  setValue,
}: {
  prefix: "senderDetails" | "recipientDetails";
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  register: UseFormRegister<any>;
  errors: Record<string, { message?: string }>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setValue: UseFormSetValue<any>;
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {[
        { id: "name", label: "Full Name", placeholder: "John Doe" },
        { id: "email", label: "Email", type: "email", placeholder: "john@example.com" },
        { id: "phone", label: "Phone", placeholder: "+234 800 000 0000" },
        { id: "address", label: "Street Address", placeholder: "12 Lagos Street", col: 2 },
        { id: "city", label: "City", placeholder: "Lagos" },
        { id: "state", label: "State", placeholder: "Lagos" },
        { id: "country", label: "Country", placeholder: "Nigeria" },
        { id: "postalCode", label: "Postal Code (optional)", placeholder: "100001" },
      ].map(({ id, label, type, placeholder, col }) => (
        <div key={id} className={cn("space-y-1.5", col === 2 && "md:col-span-2")}>
          <Label>{label}</Label>
          <Input
            type={type ?? "text"}
            placeholder={placeholder}
            {...register(`${prefix}.${id}`)}
          />
          {errors[`${prefix}.${id}`] && (
            <p className="text-xs text-destructive">
              {(errors[`${prefix}.${id}`] as { message?: string }).message}
            </p>
          )}
        </div>
      ))}
    </div>
  );
}

export function NewShipmentWizard() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState<Partial<Step1 & Step2 & Step3>>({});
  const [pricing, setPricing] = useState<ReturnType<typeof calculatePricing> | null>(null);
  const [loading, setLoading] = useState(false);
  const [payRef, setPayRef] = useState<string>("");

  const form1 = useForm<Step1>({ resolver: zodResolver(step1Schema), defaultValues: formData });
  const form2 = useForm<Step2>({ resolver: zodResolver(step2Schema), defaultValues: formData });
  const form3 = useForm<Step3>({ resolver: zodResolver(step3Schema), defaultValues: formData });

  function handleStep1(data: Step1) {
    setFormData((prev) => ({ ...prev, ...data }));
    setStep(1);
  }

  function handleStep2(data: Step2) {
    setFormData((prev) => ({ ...prev, ...data }));
    setStep(2);
  }

  function handleStep3(data: Step3) {
    const computed = calculatePricing({
      weightKg: data.packageInfo.weightKg,
      zone: data.zone,
      category: data.packageInfo.category,
    });
    setPricing(computed);
    setFormData((prev) => ({ ...prev, ...data }));
    setStep(3);
  }

  async function handlePayment() {
    const PAYSTACK_PK = process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY;
    if (!PAYSTACK_PK || !pricing) {
      toast.error("Payment not configured.");
      return;
    }

    const handler = (window as typeof window & { PaystackPop?: { setup: (config: object) => { openIframe: () => void } } }).PaystackPop?.setup({
      key: PAYSTACK_PK,
      amount: pricing.total,
      currency: "NGN",
      callback: async (response: { reference: string }) => {
        setPayRef(response.reference);
        await submitShipment(response.reference);
      },
      onClose: () => toast.info("Payment cancelled."),
    });

    handler?.openIframe();
  }

  async function submitShipment(ref: string) {
    setLoading(true);
    try {
      const payload = {
        ...formData,
        paymentRef: ref,
      };

      const res = await fetch("/api/shipments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error ?? "Failed to create shipment.");
        return;
      }

      toast.success(`Shipment created! Tracking ID: ${data.trackingId}`);
      router.push(`/shipments/${data.shipment._id}`);
    } catch {
      toast.error("Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-2xl">
      {/* Step indicator */}
      <div className="flex items-center gap-2 mb-8">
        {STEPS.map((label, i) => (
          <div key={label} className="flex items-center gap-2 flex-1">
            <div
              className={cn(
                "flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-semibold",
                i < step
                  ? "bg-primary text-primary-foreground"
                  : i === step
                  ? "bg-primary text-primary-foreground ring-2 ring-primary ring-offset-2"
                  : "bg-muted text-muted-foreground"
              )}
            >
              {i < step ? <CheckCircle2 className="h-4 w-4" /> : i + 1}
            </div>
            <span
              className={cn(
                "text-sm hidden sm:block",
                i === step ? "font-semibold" : "text-muted-foreground"
              )}
            >
              {label}
            </span>
            {i < STEPS.length - 1 && (
              <div className={cn("flex-1 h-px", i < step ? "bg-primary" : "bg-border")} />
            )}
          </div>
        ))}
      </div>

      <Card>
        <CardContent className="p-6">
          {/* Step 1: Sender */}
          {step === 0 && (
            <form onSubmit={form1.handleSubmit(handleStep1)} className="space-y-6">
              <h2 className="font-semibold text-lg">Sender Details</h2>
              <AddressForm
                prefix="senderDetails"
                register={form1.register}
                errors={form1.formState.errors as Record<string, { message?: string }>}
                setValue={form1.setValue}
              />
              <div className="flex justify-end">
                <Button type="submit">
                  Next <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </form>
          )}

          {/* Step 2: Recipient */}
          {step === 1 && (
            <form onSubmit={form2.handleSubmit(handleStep2)} className="space-y-6">
              <h2 className="font-semibold text-lg">Recipient Details</h2>
              <AddressForm
                prefix="recipientDetails"
                register={form2.register}
                errors={form2.formState.errors as Record<string, { message?: string }>}
                setValue={form2.setValue}
              />
              <div className="flex justify-between">
                <Button type="button" variant="outline" onClick={() => setStep(0)}>
                  <ArrowLeft className="mr-2 h-4 w-4" /> Back
                </Button>
                <Button type="submit">
                  Next <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </form>
          )}

          {/* Step 3: Package */}
          {step === 2 && (
            <form onSubmit={form3.handleSubmit(handleStep3)} className="space-y-6">
              <h2 className="font-semibold text-lg">Package Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label>Weight (kg)</Label>
                  <Input
                    type="number"
                    step="0.1"
                    placeholder="e.g. 2.5"
                    {...form3.register("packageInfo.weightKg")}
                  />
                  {form3.formState.errors.packageInfo?.weightKg && (
                    <p className="text-xs text-destructive">
                      {form3.formState.errors.packageInfo.weightKg.message}
                    </p>
                  )}
                </div>
                <div className="space-y-1.5">
                  <Label>Category</Label>
                  <Select
                    onValueChange={(v) =>
                      form3.setValue("packageInfo.category", v as "standard" | "fragile" | "perishable")
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="standard">Standard</SelectItem>
                      <SelectItem value="fragile">Fragile (+₦500)</SelectItem>
                      <SelectItem value="perishable">Perishable (+₦800)</SelectItem>
                    </SelectContent>
                  </Select>
                  {form3.formState.errors.packageInfo?.category && (
                    <p className="text-xs text-destructive">Category required</p>
                  )}
                </div>
                <div className="space-y-1.5">
                  <Label>Length (cm)</Label>
                  <Input type="number" step="0.1" placeholder="30" {...form3.register("packageInfo.dimensions.length")} />
                </div>
                <div className="space-y-1.5">
                  <Label>Width (cm)</Label>
                  <Input type="number" step="0.1" placeholder="20" {...form3.register("packageInfo.dimensions.width")} />
                </div>
                <div className="space-y-1.5">
                  <Label>Height (cm)</Label>
                  <Input type="number" step="0.1" placeholder="10" {...form3.register("packageInfo.dimensions.height")} />
                </div>
                <div className="space-y-1.5">
                  <Label>Delivery Zone</Label>
                  <Select
                    onValueChange={(v) =>
                      form3.setValue("zone", v as "local" | "interstate" | "international")
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select zone" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="local">Local (same state)</SelectItem>
                      <SelectItem value="interstate">Interstate</SelectItem>
                      <SelectItem value="international">International</SelectItem>
                    </SelectContent>
                  </Select>
                  {form3.formState.errors.zone && (
                    <p className="text-xs text-destructive">Zone required</p>
                  )}
                </div>
                <div className="space-y-1.5 md:col-span-2">
                  <Label>Package Description</Label>
                  <Textarea
                    placeholder="Describe the contents of your package..."
                    {...form3.register("packageInfo.description")}
                  />
                  {form3.formState.errors.packageInfo?.description && (
                    <p className="text-xs text-destructive">
                      {form3.formState.errors.packageInfo.description.message}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex justify-between">
                <Button type="button" variant="outline" onClick={() => setStep(1)}>
                  <ArrowLeft className="mr-2 h-4 w-4" /> Back
                </Button>
                <Button type="submit">
                  Review & Pay <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </form>
          )}

          {/* Step 4: Payment */}
          {step === 3 && pricing && (
            <div className="space-y-6">
              <h2 className="font-semibold text-lg">Payment Summary</h2>
              <div className="rounded-lg bg-muted/50 p-4 space-y-3">
                {[
                  ["Base Rate", pricing.baseRate],
                  ["Weight Charge", pricing.weightCharge],
                  ["Category Surcharge", pricing.categorySurcharge],
                  ["VAT (7.5%)", pricing.tax],
                ].map(([label, value]) => (
                  <div key={label as string} className="flex justify-between text-sm">
                    <span className="text-muted-foreground">{label}</span>
                    <span>
                      ₦{((value as number) / 100).toLocaleString("en-NG", { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                ))}
                <Separator />
                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span className="text-primary">
                    ₦{(pricing.total / 100).toLocaleString("en-NG", { minimumFractionDigits: 2 })}
                  </span>
                </div>
              </div>

              <div className="rounded-lg border p-4 text-sm space-y-2">
                <p className="font-semibold">Order Summary</p>
                <p className="text-muted-foreground">
                  From: {(formData as Step1).senderDetails?.city},{" "}
                  {(formData as Step1).senderDetails?.country}
                </p>
                <p className="text-muted-foreground">
                  To: {(formData as Step2).recipientDetails?.name} •{" "}
                  {(formData as Step2).recipientDetails?.city},{" "}
                  {(formData as Step2).recipientDetails?.country}
                </p>
                <p className="text-muted-foreground capitalize">
                  Zone: {(formData as Step3).zone} • Category:{" "}
                  {(formData as Step3).packageInfo?.category}
                </p>
              </div>

              {/* Paystack script */}
              <script src="https://js.paystack.co/v1/inline.js" async />

              <div className="flex justify-between">
                <Button type="button" variant="outline" onClick={() => setStep(2)}>
                  <ArrowLeft className="mr-2 h-4 w-4" /> Back
                </Button>
                <Button onClick={handlePayment} disabled={loading} size="lg">
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Pay ₦{(pricing.total / 100).toLocaleString("en-NG", { minimumFractionDigits: 2 })}
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
