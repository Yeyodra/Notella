"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createOrganization, getUserOrganizations } from "@/lib/actions/org";

export function OrgSection() {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [orgs, setOrgs] = useState<Awaited<ReturnType<typeof getUserOrganizations>>>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    getUserOrganizations().then((data) => {
      setOrgs(data);
      setLoaded(true);
    });
  }, []);

  async function handleCreate() {
    if (!name.trim()) return;
    setLoading(true);
    try {
      await createOrganization(name.trim());
      setName("");
      const data = await getUserOrganizations();
      setOrgs(data);
    } finally {
      setLoading(false);
    }
  }

  if (!loaded) {
    return <p className="text-sm text-muted-foreground">Loading organizations...</p>;
  }

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Organizations</h2>

      {orgs.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          No organizations yet. Create one to get started.
        </p>
      ) : (
        <ul className="space-y-2">
          {orgs.map((org) => (
            <li
              key={org.orgId}
              className="flex items-center justify-between rounded-md border border-border p-3"
            >
              <span className="font-medium">{org.orgName}</span>
              <span className="rounded-full bg-secondary px-2 py-0.5 text-xs text-secondary-foreground">
                {org.role}
              </span>
            </li>
          ))}
        </ul>
      )}

      <div className="flex gap-2">
        <Input
          placeholder="Organization name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleCreate()}
        />
        <Button onClick={handleCreate} disabled={loading || !name.trim()}>
          {loading ? "Creating..." : "Create Organization"}
        </Button>
      </div>
    </div>
  );
}
