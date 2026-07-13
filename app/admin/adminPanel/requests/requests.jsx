"use client";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useFetchQuery } from "@/hooks/useFetch";
import { useSubmitMutation } from "@/hooks/useSubmit";
import {
  getMyRequests,
  updateRequestStatus,
} from "@/server/portalServer/portalServer";
import {
  PRIORITY_BADGE,
  REQUEST_STATUSES,
} from "@/lib/portal-constants";

export default function RequestManagement() {
  const queryKey = ["adminRequests"];
  const { data } = useFetchQuery({ queryKey, fetchFn: getMyRequests });
  const requests = data?.newData || [];

  const { mutate: handleStatus } = useSubmitMutation({
    mutationFn: async (payload) => await updateRequestStatus(payload),
    invalidateKey: queryKey,
    onSuccessMessage: (message) => message || "Request updated",
    onClose: () => {},
  });

  return (
    <div className="mt-4">
      <Card>
        <CardHeader>
          <CardTitle>Client Requests</CardTitle>
          <CardDescription>
            All service requests from clients — update the status as work
            progresses.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {requests.length === 0 ? (
            <p className="text-center text-gray-500 py-8">No requests yet.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-neutral-500">Request</TableHead>
                  <TableHead className="text-neutral-500">Client</TableHead>
                  <TableHead className="text-neutral-500">Project</TableHead>
                  <TableHead className="text-neutral-500">Priority</TableHead>
                  <TableHead className="text-neutral-500">Submitted</TableHead>
                  <TableHead className="text-neutral-500">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {requests.map((request) => (
                  <TableRow key={request._id}>
                    <TableCell>
                      <p className="font-medium">{request.title}</p>
                      {request.description && (
                        <p className="text-gray-500 text-xs mt-1">
                          {request.description}
                        </p>
                      )}
                    </TableCell>
                    <TableCell className="text-gray-500">
                      {request.client?.name}
                    </TableCell>
                    <TableCell className="text-gray-500">
                      {request.project?.name}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={PRIORITY_BADGE[request.priority] || ""}
                      >
                        {request.priority}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-gray-500">
                      {format(new Date(request.createdAt), "PP")}
                    </TableCell>
                    <TableCell>
                      <Select
                        value={request.status}
                        onValueChange={(status) =>
                          handleStatus({ id: request._id, status })
                        }
                      >
                        <SelectTrigger className="w-36 h-8">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {REQUEST_STATUSES.map((s) => (
                            <SelectItem key={s} value={s}>
                              {s}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
