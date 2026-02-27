"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { authClient } from "@/lib/auth/auth-client";
import { useMutation, useQuery } from "@tanstack/react-query";
import { ChevronLeft, ChevronRight, Loader2, Trash } from "lucide-react";
import { useState } from "react";

const PAGE_SIZE = 10;
type RoleFilter =
  | "all"
  | "superadmin"
  | "admin"
  | "teacher"
  | "student"
  | "parent";

export const ListOrganizationMembers = () => {
  const [page, setPage] = useState(1);
  const [roleFilter, setRoleFilter] = useState<RoleFilter>("all");
  const { data: role } = authClient.useActiveMemberRole();
  const { data: session } = authClient.useSession();

  const {
    data = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["organization-members", page, roleFilter],
    initialData: [],
    refetchOnWindowFocus: false,
    queryFn: async () => {
      const { data, error } = await authClient.organization.listMembers({
        query: {
          limit: PAGE_SIZE,
          offset: (page - 1) * PAGE_SIZE,
          ...(roleFilter !== "all"
            ? {
                filterField: "role",
                filterOperator: "eq",
                filterValue: roleFilter,
              }
            : {}),
        },
      });
      if (error) {
        throw new Error(error.message);
      }
      return data.members ?? [];
    },
  });

  const { mutate, isPending } = useMutation({
    mutationKey: ["delete-member"],
    mutationFn: async (memberId: string) => {
      const { error } = await authClient.organization.removeMember({
        memberIdOrEmail: memberId,
      });
      if (error) {
        throw new Error(error.message);
      }
    },
    onSuccess: async (_, __, ___, ctx) => {
      await ctx.client.invalidateQueries({
        queryKey: ["organization-members"],
      });
    },
  });

  const hasPreviousPage = page > 1;
  const hasNextPage = data.length === PAGE_SIZE;

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Members</CardTitle>
        </CardHeader>
        <CardContent className="flex justify-center">
          <Loader2 className="animate-spin" />
        </CardContent>
      </Card>
    );
  }

  if (isError) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Members</CardTitle>
        </CardHeader>
        <CardContent className="text-red-500">
          {error instanceof Error ? error.message : "An error occurred."}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Members</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4 flex items-center justify-end">
          <Select
            value={roleFilter}
            onValueChange={(value) => {
              setRoleFilter(value as RoleFilter);
              setPage(1);
            }}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by role" />
            </SelectTrigger>
            <SelectContent align="end">
              <SelectItem value="all">All roles</SelectItem>
              <SelectItem value="superadmin">Superadmin</SelectItem>
              <SelectItem value="admin">Admin</SelectItem>
              <SelectItem value="teacher">Teacher</SelectItem>
              <SelectItem value="student">Student</SelectItem>
              <SelectItem value="parent">Parent</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={4}
                  className="text-center text-muted-foreground"
                >
                  No members found.
                </TableCell>
              </TableRow>
            ) : (
              data.map((member) => {
                return (
                  <TableRow key={member.id}>
                    <TableCell className="font-medium">
                      {member.user.name}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {member.user.email}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {member.role}
                    </TableCell>
                    <TableCell>
                      {role?.role == "admin" &&
                        session?.user.id !== member.userId && (
                          <Button
                            variant="destructive"
                            size="icon"
                            disabled={isPending}
                            onClick={() => mutate(member.id!)}
                          >
                            <Trash className="size-4" />
                          </Button>
                        )}
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
        <div className="mt-4 flex items-center justify-end gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={!hasPreviousPage}
            onClick={() =>
              setPage((previousPage) => Math.max(previousPage - 1, 1))
            }
          >
            <ChevronLeft className="size-4" />
            Prev
          </Button>
          <span className="text-sm text-muted-foreground">Page {page}</span>
          <Button
            variant="outline"
            size="sm"
            disabled={!hasNextPage}
            onClick={() => setPage((previousPage) => previousPage + 1)}
          >
            Next
            <ChevronRight className="size-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

