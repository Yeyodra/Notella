import { UserProfile } from "@clerk/nextjs";
import { OrgSection } from "./_components/org-section";
import { Separator } from "@/components/ui/separator";

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Settings</h1>
      <UserProfile
        appearance={{
          elements: {
            rootBox: "w-full",
            cardBox: "w-full shadow-none",
          },
        }}
      />
      <Separator />
      <OrgSection />
    </div>
  );
}
