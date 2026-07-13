import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getMyProjects } from "@/server/portalServer/portalServer";
import { STATUS_BADGE } from "@/lib/portal-constants";

export const metadata = {
  title: "Projects | Webmints Portal",
};

export default async function ProjectsPage() {
  const res = await getMyProjects();
  const projects = res.success ? JSON.parse(res.data) : [];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight font-grotesk">
          Projects
        </h1>
        <p className="text-gray-500">Track and manage your projects</p>
      </div>

      {projects.length === 0 ? (
        <Card>
          <CardContent className="py-10 text-center text-gray-500">
            No projects yet. Your projects will appear here once they are set
            up.
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {projects.map((project) => (
            <Card key={project._id}>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <CardTitle>{project.name}</CardTitle>
                  <Badge className={STATUS_BADGE[project.status] || ""}>
                    {project.status}
                  </Badge>
                </div>
                <CardDescription>
                  {project.startDate
                    ? format(new Date(project.startDate), "PP")
                    : "TBD"}{" "}
                  —{" "}
                  {project.endDate
                    ? format(new Date(project.endDate), "PP")
                    : "TBD"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Progress</span>
                    <span className="font-medium">{project.progress}%</span>
                  </div>
                  <Progress value={project.progress} className="h-2" />
                </div>
                {project.description && (
                  <p className="text-sm text-gray-500 mt-4">
                    {project.description}
                  </p>
                )}
                {project.maintenanceEndDate && (
                  <p className="text-xs text-gray-500 mt-4">
                    Maintenance until{" "}
                    {format(new Date(project.maintenanceEndDate), "PPP")}
                  </p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
