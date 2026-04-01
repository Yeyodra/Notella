"use server";

import { db } from "@/lib/db";
import { organizations, members, invitations } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
import { auth } from "@clerk/nextjs/server";
import { randomBytes } from "crypto";

export async function createOrganization(name: string) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const [org] = await db
    .insert(organizations)
    .values({ name, ownerId: userId })
    .returning();

  await db.insert(members).values({
    organizationId: org.id,
    userId,
    role: "owner",
  });

  return org;
}

export async function getUserOrganizations() {
  const { userId } = await auth();
  if (!userId) return [];

  const userMembers = await db
    .select({
      orgId: organizations.id,
      orgName: organizations.name,
      role: members.role,
      ownerId: organizations.ownerId,
    })
    .from(members)
    .innerJoin(organizations, eq(members.organizationId, organizations.id))
    .where(eq(members.userId, userId));

  return userMembers;
}

export async function getOrgMembers(organizationId: string) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const orgMembers = await db
    .select()
    .from(members)
    .where(eq(members.organizationId, organizationId));

  return orgMembers;
}

export async function createInvite(organizationId: string, email: string, role: string = "member") {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const token = randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

  const [invite] = await db
    .insert(invitations)
    .values({ organizationId, email, role, token, expiresAt })
    .returning();

  return invite;
}

export async function acceptInvite(token: string) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const [invite] = await db
    .select()
    .from(invitations)
    .where(eq(invitations.token, token));

  if (!invite) throw new Error("Invalid invite");
  if (invite.expiresAt < new Date()) throw new Error("Invite expired");

  await db.insert(members).values({
    organizationId: invite.organizationId,
    userId,
    role: invite.role,
  });

  await db.delete(invitations).where(eq(invitations.id, invite.id));

  return { organizationId: invite.organizationId };
}

export async function updateMemberRole(organizationId: string, memberId: string, role: string) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  await db
    .update(members)
    .set({ role })
    .where(and(eq(members.id, memberId), eq(members.organizationId, organizationId)));
}

export async function removeMember(organizationId: string, memberId: string) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  await db
    .delete(members)
    .where(and(eq(members.id, memberId), eq(members.organizationId, organizationId)));
}

export async function deleteOrganization(organizationId: string) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const [org] = await db
    .select()
    .from(organizations)
    .where(eq(organizations.id, organizationId));

  if (!org || org.ownerId !== userId) throw new Error("Unauthorized");

  await db.delete(organizations).where(eq(organizations.id, organizationId));
}
