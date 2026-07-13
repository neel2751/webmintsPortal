// Auth-gated page — must not be statically prerendered at build time.
export const dynamic = "force-dynamic";

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
import { getMyMaintenance } from "@/server/portalServer/portalServer";
import { STATUS_BADGE } from "@/lib/portal-constants";

export const metadata = {
  title: "Maintenance | Webmints Portal",
};

export default async function MaintenancePage() {
  const res = await getMyMaintenance();
  const tasks = res.success ? JSON.parse(res.data) : [];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight font-grotesk">
          Maintenance
        </h1>
        <p className="text-gray-500">
          Maintenance activity across your projects
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Maintenance & Support</CardTitle>
          <CardDescription>
            Scheduled, in-progress and completed maintenance tasks
          </CardDescription>
        </CardHeader>
        <CardContent>
          {tasks.length === 0 ? (
            <p className="text-center text-gray-500 py-8">
              No maintenance tasks yet.
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-neutral-500">Task</TableHead>
                  <TableHead className="text-neutral-500">Project</TableHead>
                  <TableHead className="text-neutral-500">Status</TableHead>
                  <TableHead className="text-neutral-500">Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tasks.map((task) => (
                  <TableRow key={task._id}>
                    <TableCell className="font-medium">{task.title}</TableCell>
                    <TableCell className="text-gray-500">
                      {task.project?.name}
                    </TableCell>
                    <TableCell>
                      <Badge className={STATUS_BADGE[task.status] || ""}>
                        {task.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-gray-500">
                      {format(new Date(task.date), "PPP")}
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
