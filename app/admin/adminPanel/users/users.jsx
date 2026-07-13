"use client";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { format } from "date-fns";
import { UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
  DialogDescription,
  DialogFooter,
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
import { useFetchQuery } from "@/hooks/useFetch";
import { useSubmitMutation } from "@/hooks/useSubmit";
import {
  createUser,
  getAllUsers,
  setUserStatus,
  updateUserRole,
} from "@/server/userServer/userServer";
import { ROLES } from "@/lib/permissions";

const EMPTY_FORM = { name: "", email: "", password: "", role: ROLES.CLIENT };

const ROLE_BADGE = {
  admin: "bg-indigo-100 text-indigo-800",
  team: "bg-blue-100 text-blue-800",
  client: "bg-green-100 text-green-800",
};

export default function UserManagement() {
  const queryKey = ["getAllUsers"];
  const { data: session } = useSession();
  const { data } = useFetchQuery({ queryKey, fetchFn: getAllUsers });
  const users = data?.newData || [];

  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);

  const { mutate: handleCreate, isPending: isCreating } = useSubmitMutation({
    mutationFn: async (payload) => await createUser(payload),
    invalidateKey: queryKey,
    onSuccessMessage: (message) => message || "User created",
    onClose: () => {
      setOpen(false);
      setForm(EMPTY_FORM);
    },
  });

  const { mutate: handleRoleChange } = useSubmitMutation({
    mutationFn: async (payload) => await updateUserRole(payload),
    invalidateKey: queryKey,
    onSuccessMessage: (message) => message || "Role updated",
    onClose: () => {},
  });

  const { mutate: handleStatusChange } = useSubmitMutation({
    mutationFn: async (payload) => await setUserStatus(payload),
    invalidateKey: queryKey,
    onSuccessMessage: (message) => message || "Status updated",
    onClose: () => {},
  });

  return (
    <div className="mt-4">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>User Management</CardTitle>
              <CardDescription>
                Create team and client accounts and control who can access the
                portal.
              </CardDescription>
            </div>
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button className="bg-indigo-600 hover:bg-indigo-700">
                  <UserPlus className="h-4 w-4 mr-2" />
                  Add User
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md bg-white">
                <DialogHeader>
                  <DialogTitle>Create a new account</DialogTitle>
                  <DialogDescription>
                    The user logs in with this email and password. Pick the
                    role carefully — it controls what they can see.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-2">
                  <div className="space-y-2">
                    <Label htmlFor="new-user-name">Name</Label>
                    <Input
                      id="new-user-name"
                      placeholder="Full name"
                      value={form.name}
                      onChange={(e) =>
                        setForm({ ...form, name: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="new-user-email">Email</Label>
                    <Input
                      id="new-user-email"
                      type="email"
                      placeholder="name@company.com"
                      value={form.email}
                      onChange={(e) =>
                        setForm({ ...form, email: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="new-user-password">Password</Label>
                    <Input
                      id="new-user-password"
                      type="password"
                      placeholder="At least 8 characters"
                      value={form.password}
                      onChange={(e) =>
                        setForm({ ...form, password: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Role</Label>
                    <Select
                      value={form.role}
                      onValueChange={(role) => setForm({ ...form, role })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value={ROLES.CLIENT}>
                          Client — their own projects and requests
                        </SelectItem>
                        <SelectItem value={ROLES.TEAM}>
                          Team — blog and subscribers
                        </SelectItem>
                        <SelectItem value={ROLES.ADMIN}>
                          Admin — full access
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setOpen(false)}>
                    Cancel
                  </Button>
                  <Button
                    className="bg-indigo-600 hover:bg-indigo-700"
                    disabled={isCreating}
                    onClick={() => handleCreate(form)}
                  >
                    {isCreating ? "Creating..." : "Create User"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-neutral-500">Name</TableHead>
                <TableHead className="text-neutral-500">Email</TableHead>
                <TableHead className="text-neutral-500">Role</TableHead>
                <TableHead className="text-neutral-500">Status</TableHead>
                <TableHead className="text-neutral-500">Created</TableHead>
                <TableHead className="text-neutral-500">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => {
                const isSelf = user._id === session?.user?.id;
                const isActive = user.isActive !== false;
                return (
                  <TableRow key={user._id}>
                    <TableCell className="font-medium">
                      {user.name}
                      {isSelf && (
                        <span className="ml-2 text-xs text-neutral-400">
                          (you)
                        </span>
                      )}
                    </TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      {isSelf ? (
                        <Badge className={ROLE_BADGE[user.role] || ""}>
                          {user.role}
                        </Badge>
                      ) : (
                        <Select
                          value={user.role}
                          onValueChange={(role) =>
                            handleRoleChange({ id: user._id, role })
                          }
                        >
                          <SelectTrigger className="w-28 h-8">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value={ROLES.CLIENT}>client</SelectItem>
                            <SelectItem value={ROLES.TEAM}>team</SelectItem>
                            <SelectItem value={ROLES.ADMIN}>admin</SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={
                          isActive
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }
                      >
                        {isActive ? "Active" : "Deactivated"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-neutral-500">
                      {user.createdAt ? format(user.createdAt, "PPP") : "—"}
                    </TableCell>
                    <TableCell>
                      {!isSelf && (
                        <Button
                          variant="outline"
                          size="sm"
                          className={
                            isActive
                              ? "text-red-600 hover:text-red-700"
                              : "text-green-600 hover:text-green-700"
                          }
                          onClick={() =>
                            handleStatusChange({
                              id: user._id,
                              isActive: !isActive,
                            })
                          }
                        >
                          {isActive ? "Deactivate" : "Activate"}
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
              {users.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="text-center text-neutral-500 py-8"
                  >
                    Loading users...
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
