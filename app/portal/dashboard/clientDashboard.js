import Link from "next/link";
import { format } from "date-fns";
import { AlertTriangle, Eye, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { auth } from "@/auth";
import {
  getMyProjects,
  getMyRequests,
  getMyMaintenance,
} from "@/server/portalServer/portalServer";
import { STATUS_BADGE } from "@/lib/portal-constants";

export const metadata = {
  title: "Dashboard | Webmints Portal",
  description: "Track your projects, requests and maintenance",
};

const THIRTY_DAYS = 30 * 24 * 60 * 60 * 1000;

export default async function ClientDashboardPage() {
  const session = await auth();

  const [projectsRes, requestsRes, maintenanceRes] = await Promise.all([
    getMyProjects(),
    getMyRequests(),
    getMyMaintenance(),
  ]);
  const projects = projectsRes.success ? JSON.parse(projectsRes.data) : [];
  const requests = requestsRes.success ? JSON.parse(requestsRes.data) : [];
  const maintenanceTasks = maintenanceRes.success
    ? JSON.parse(maintenanceRes.data)
    : [];

  const endingSoon = projects.filter(
    (p) =>
      p.maintenanceEndDate &&
      new Date(p.maintenanceEndDate) > new Date() &&
      new Date(p.maintenanceEndDate) < new Date(Date.now() + THIRTY_DAYS)
  );
  const openRequests = requests.filter((r) => r.status !== "Completed");

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight font-grotesk">
            Dashboard
          </h1>
          <p className="text-gray-500">Welcome back, {session?.user?.name}</p>
        </div>
        <div className="mt-4 md:mt-0 flex gap-2">
          <Button variant="outline" asChild>
            <Link href="/portal/requests">
              <Plus />
              New Request
            </Link>
          </Button>
          <Button className="bg-indigo-600 hover:bg-indigo-700" asChild>
            <Link href="/portal/projects">
              <Eye />
              View Projects
            </Link>
          </Button>
        </div>
      </div>

      {endingSoon.length > 0 && (
        <Alert className="mb-6 border-amber-500 bg-amber-50">
          <AlertTriangle className="h-5 w-5 text-amber-600" />
          <AlertTitle className="text-amber-800">
            Maintenance Period Ending Soon
          </AlertTitle>
          <AlertDescription className="text-amber-700">
            {endingSoon.map((p) => (
              <span key={p._id} className="block">
                {p.name} — maintenance ends{" "}
                {format(new Date(p.maintenanceEndDate), "PPP")}. Contact us to
                extend your plan.
              </span>
            ))}
          </AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Total Projects
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{projects.length}</div>
            <p className="text-xs text-gray-500 mt-1">
              {projects.filter((p) => p.status === "In Progress").length}{" "}
              active
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Open Requests</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{openRequests.length}</div>
            <p className="text-xs text-gray-500 mt-1">
              {openRequests.filter((r) => r.priority === "High").length} high
              priority
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Maintenance Tasks
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{maintenanceTasks.length}</div>
            <p className="text-xs text-gray-500 mt-1">
              {
                maintenanceTasks.filter((m) => m.status === "Scheduled")
                  .length
              }{" "}
              upcoming
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Recent Requests</CardTitle>
            <CardDescription>Your most recent service requests</CardDescription>
          </CardHeader>
          <CardContent>
            {requests.length === 0 ? (
              <p className="text-sm text-gray-500">No requests yet.</p>
            ) : (
              <div className="space-y-4">
                {requests.slice(0, 3).map((request) => (
                  <div
                    key={request._id}
                    className="flex items-center justify-between"
                  >
                    <div className="space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {request.title}
                      </p>
                      <p className="text-sm text-gray-500">
                        {request.project?.name}
                      </p>
                    </div>
                    <Badge className={STATUS_BADGE[request.status] || ""}>
                      {request.status}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full" asChild>
              <Link href="/portal/requests">View All Requests</Link>
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Project Progress</CardTitle>
            <CardDescription>
              Current status of your active projects
            </CardDescription>
          </CardHeader>
          <CardContent>
            {projects.length === 0 ? (
              <p className="text-sm text-gray-500">
                No projects yet. Your projects will appear here once they are
                set up.
              </p>
            ) : (
              <div className="space-y-4">
                {projects.slice(0, 4).map((project) => (
                  <div key={project._id} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium">{project.name}</p>
                      <span className="text-sm text-gray-500">
                        {project.progress}%
                      </span>
                    </div>
                    <Progress value={project.progress} className="h-2" />
                  </div>
                ))}
              </div>
            )}
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full" asChild>
              <Link href="/portal/projects">View All Projects</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
