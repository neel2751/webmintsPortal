import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { auth } from "@/auth";
import { AlertTriangle, Eye, Plus } from "lucide-react";
import { Label } from "@/components/ui/label";

export const metadata = {
  title: "Dashboard | SaaS Solutions",
  description: "Manage your SaaS Solutions projects and services",
};

export default async function ClientDashboardPage() {
  const session = await auth();

  // Dummy data
  const projects = [
    {
      id: "proj-001",
      name: "E-commerce Platform",
      status: "In Progress",
      progress: 65,
      startDate: "2023-10-15",
      endDate: "2024-03-30",
      maintenanceEndDate: "2024-06-30",
    },
    {
      id: "proj-002",
      name: "CRM Integration",
      status: "Planning",
      progress: 20,
      startDate: "2024-01-10",
      endDate: "2024-07-15",
      maintenanceEndDate: "2024-10-15",
    },
  ];

  const requests = [
    {
      id: "req-001",
      title: "Add payment gateway integration",
      status: "In Progress",
      priority: "High",
      dateSubmitted: "2024-02-15",
      project: "E-commerce Platform",
    },
    {
      id: "req-002",
      title: "Fix mobile responsiveness issues",
      status: "Pending",
      priority: "Medium",
      dateSubmitted: "2024-02-20",
      project: "E-commerce Platform",
    },
    {
      id: "req-003",
      title: "Setup user roles and permissions",
      status: "Completed",
      priority: "High",
      dateSubmitted: "2024-01-25",
      project: "CRM Integration",
    },
  ];

  const maintenanceTasks = [
    {
      id: "maint-001",
      title: "Weekly database backup",
      status: "Completed",
      date: "2024-02-22",
      project: "E-commerce Platform",
    },
    {
      id: "maint-002",
      title: "Security patch deployment",
      status: "Scheduled",
      date: "2024-03-01",
      project: "E-commerce Platform",
    },
    {
      id: "maint-003",
      title: "Performance optimization",
      status: "In Progress",
      date: "2024-02-25",
      project: "CRM Integration",
    },
  ];

  // Check if maintenance is ending soon (for demo purposes)
  const maintenanceEndingSoon = true;

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
          <Button variant="outline">
            <Plus />
            New Request
          </Button>
          <Button className="bg-indigo-600 hover:bg-indigo-700">
            <Eye />
            View Projects
          </Button>
        </div>
      </div>

      {maintenanceEndingSoon && (
        <Alert className="mb-6 border-amber-500 bg-amber-50">
          <AlertTriangle className="h-5 w-5 text-amber-600" />
          <AlertTitle className="text-amber-800">
            Maintenance Period Ending Soon
          </AlertTitle>
          <AlertDescription className="text-amber-700 flex">
            Your free maintenance period for E-commerce Platform will end on
            June 30, 2024.
            <Dialog>
              <DialogTrigger asChild>
                <button className="font-medium underline ml-1 text-indigo-700">
                  Upgrade your plan
                </button>
              </DialogTrigger>
              <DialogContent className="w-full max-w-2xl max-h-screen overflow-y-auto bg-white rounded-lg shadow-lg p-6 sm:max-w-md md:max-w-lg lg:max-w-4xl">
                <DialogHeader>
                  <DialogTitle className="text-xl">
                    Select a Maintenance Plan
                  </DialogTitle>
                  <DialogDescription>
                    Choose the maintenance plan that best fits your project
                    needs.
                  </DialogDescription>
                </DialogHeader>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 py-4">
                  {/* Basic Plan */}
                  <div className="border rounded-lg p-4 hover:border-indigo-600 hover:shadow-md transition-all cursor-pointer relative group">
                    <div className="absolute top-0 right-0 bg-gray-100 text-gray-700 px-2 py-1 text-xs rounded-bl-lg rounded-tr-lg">
                      Popular
                    </div>
                    <h3 className="font-bold text-lg font-grotesk">Basic</h3>
                    <div className="mt-2 mb-4">
                      <span className="text-2xl font-bold">$199</span>
                      <span className="text-gray-500">/month</span>
                    </div>
                    <ul className="space-y-2 mb-4 text-sm">
                      <li className="flex items-center">
                        <svg
                          className="h-4 w-4 text-green-500 mr-2"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                        8 hours of support monthly
                      </li>
                      <li className="flex items-center">
                        <svg
                          className="h-4 w-4 text-green-500 mr-2"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                        48-hour response time
                      </li>
                      <li className="flex items-center">
                        <svg
                          className="h-4 w-4 text-green-500 mr-2"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                        Monthly backups
                      </li>
                    </ul>
                    <Button
                      variant="outline"
                      className="w-full group-hover:bg-indigo-600 group-hover:text-white"
                    >
                      Select Plan
                    </Button>
                  </div>

                  {/* Standard Plan */}
                  <div className="border rounded-lg p-4 border-indigo-600 shadow-md transition-all cursor-pointer relative">
                    <div className="absolute top-0 right-0 bg-indigo-600 text-white px-2 py-1 text-xs rounded-bl-lg rounded-tr-lg">
                      Recommended
                    </div>
                    <h3 className="font-bold text-lg">Standard</h3>
                    <div className="mt-2 mb-4">
                      <span className="text-2xl font-bold">$399</span>
                      <span className="text-gray-500">/month</span>
                    </div>
                    <ul className="space-y-2 mb-4 text-sm">
                      <li className="flex items-center">
                        <svg
                          className="h-4 w-4 text-green-500 mr-2"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                        20 hours of support monthly
                      </li>
                      <li className="flex items-center">
                        <svg
                          className="h-4 w-4 text-green-500 mr-2"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                        24-hour response time
                      </li>
                      <li className="flex items-center">
                        <svg
                          className="h-4 w-4 text-green-500 mr-2"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                        Weekly backups
                      </li>
                      <li className="flex items-center">
                        <svg
                          className="h-4 w-4 text-green-500 mr-2"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                        Security monitoring
                      </li>
                    </ul>
                    <Button className="w-full bg-indigo-600 hover:bg-indigo-700">
                      Select Plan
                    </Button>
                  </div>

                  {/* Premium Plan */}
                  <div className="border rounded-lg p-4 hover:border-indigo-600 hover:shadow-md transition-all cursor-pointer group">
                    <h3 className="font-bold text-lg">Premium</h3>
                    <div className="mt-2 mb-4">
                      <span className="text-2xl font-bold">$799</span>
                      <span className="text-gray-500">/month</span>
                    </div>
                    <ul className="space-y-2 mb-4 text-sm">
                      <li className="flex items-center">
                        <svg
                          className="h-4 w-4 text-green-500 mr-2"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                        40 hours of support monthly
                      </li>
                      <li className="flex items-center">
                        <svg
                          className="h-4 w-4 text-green-500 mr-2"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                        4-hour response time
                      </li>
                      <li className="flex items-center">
                        <svg
                          className="h-4 w-4 text-green-500 mr-2"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                        Daily backups
                      </li>
                      <li className="flex items-center">
                        <svg
                          className="h-4 w-4 text-green-500 mr-2"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                        24/7 security monitoring
                      </li>
                      <li className="flex items-center">
                        <svg
                          className="h-4 w-4 text-green-500 mr-2"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                        Performance optimization
                      </li>
                    </ul>
                    <Button
                      variant="outline"
                      className="w-full group-hover:bg-indigo-600 group-hover:text-white"
                    >
                      Select Plan
                    </Button>
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg mb-4">
                  <h4 className="font-medium mb-2">
                    Recommendations for E-commerce Platform:
                  </h4>
                  <p className="text-sm text-gray-600 mb-2">
                    Based on your project size and complexity, we recommend the{" "}
                    <span className="font-medium">Standard Plan</span> which
                    provides:
                  </p>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>
                      • Sufficient support hours for regular maintenance needs
                    </li>
                    <li>
                      • Faster response times for critical e-commerce issues
                    </li>
                    <li>• Weekly backups to protect your sales data</li>
                    <li>
                      • Security monitoring to protect customer information
                    </li>
                  </ul>
                </div>

                <DialogFooter>
                  <Button variant="outline" className="mr-2">
                    Cancel
                  </Button>
                  <Button className="bg-indigo-600 hover:bg-indigo-700">
                    Proceed to Checkout
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>{" "}
            to continue receiving support.
          </AlertDescription>
        </Alert>
      )}

      <Tabs
        defaultValue="overview"
        className="w-full flex-col justify-start gap-6"
      >
        <div className="flex items-center justify-between px-4 lg:px-6">
          <Label htmlFor="view-selector" className="sr-only">
            View
          </Label>
          <TabsList className="**:data-[slot=badge]:bg-muted-foreground/30 **:data-[slot=badge]:size-5 **:data-[slot=badge]:rounded-full **:data-[slot=badge]:px-1 @4xl/main:flex w-full">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="requests">
              Requests
              <Badge variant="secondary">3</Badge>
            </TabsTrigger>
            <TabsTrigger value="maintenance">
              Maintenance
              <Badge variant="secondary">2</Badge>
            </TabsTrigger>
            <TabsTrigger value="projects">Projects</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                <CardTitle className="text-sm font-medium">
                  Open Requests
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {requests.filter((r) => r.status !== "Completed").length}
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {
                    requests.filter(
                      (r) => r.priority === "High" && r.status !== "Completed"
                    ).length
                  }{" "}
                  high priority
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
                <div className="text-2xl font-bold">
                  {maintenanceTasks.length}
                </div>
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
            <Card className="col-span-1">
              <CardHeader>
                <CardTitle>Recent Requests</CardTitle>
                <CardDescription>
                  Your most recent service requests
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {requests.slice(0, 3).map((request) => (
                    <div
                      key={request.id}
                      className="flex items-center justify-between"
                    >
                      <div className="space-y-1">
                        <p className="text-sm font-medium leading-none">
                          {request.title}
                        </p>
                        <p className="text-sm text-gray-500">
                          {request.project}
                        </p>
                      </div>
                      <Badge
                        className={
                          request.status === "Completed"
                            ? "bg-green-100 text-green-800"
                            : request.status === "In Progress"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-gray-100 text-gray-800"
                        }
                      >
                        {request.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full" asChild>
                  <Link href="/dashboard/requests">View All Requests</Link>
                </Button>
              </CardFooter>
            </Card>

            <Card className="col-span-1">
              <CardHeader>
                <CardTitle>Project Progress</CardTitle>
                <CardDescription>
                  Current status of your active projects
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {projects.map((project) => (
                    <div key={project.id} className="space-y-2">
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
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full" asChild>
                  <Link href="/dashboard/projects">View All Projects</Link>
                </Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="requests" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Service Requests</CardTitle>
                  <CardDescription>
                    Manage and track your service requests
                  </CardDescription>
                </div>
                <Button className="bg-indigo-600 hover:bg-indigo-700">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                    />
                  </svg>
                  New Request
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <div className="grid grid-cols-12 p-4 bg-gray-50 text-sm font-medium text-gray-500">
                  <div className="col-span-5">Request</div>
                  <div className="col-span-2">Status</div>
                  <div className="col-span-2">Priority</div>
                  <div className="col-span-2">Date</div>
                  <div className="col-span-1"></div>
                </div>
                {requests.map((request, index) => (
                  <div
                    key={request.id}
                    className={`grid grid-cols-12 p-4 text-sm ${
                      index !== requests.length - 1 ? "border-b" : ""
                    }`}
                  >
                    <div className="col-span-5">
                      <p className="font-medium">{request.title}</p>
                      <p className="text-gray-500">{request.project}</p>
                    </div>
                    <div className="col-span-2">
                      <Badge
                        className={
                          request.status === "Completed"
                            ? "bg-green-100 text-green-800"
                            : request.status === "In Progress"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-gray-100 text-gray-800"
                        }
                      >
                        {request.status}
                      </Badge>
                    </div>
                    <div className="col-span-2">
                      <Badge
                        variant="outline"
                        className={
                          request.priority === "High"
                            ? "border-red-500 text-red-500"
                            : request.priority === "Medium"
                            ? "border-amber-500 text-amber-500"
                            : "border-green-500 text-green-500"
                        }
                      >
                        {request.priority}
                      </Badge>
                    </div>
                    <div className="col-span-2 text-gray-500">
                      {new Date(request.dateSubmitted).toLocaleDateString()}
                    </div>
                    <div className="col-span-1 text-right">
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="maintenance" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Maintenance & Support</CardTitle>
                  <CardDescription>
                    Track maintenance activities for your projects
                  </CardDescription>
                </div>
                <Button variant="outline">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12"
                    />
                  </svg>
                  Filter
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <div className="grid grid-cols-12 p-4 bg-gray-50 text-sm font-medium text-gray-500">
                  <div className="col-span-5">Task</div>
                  <div className="col-span-3">Project</div>
                  <div className="col-span-2">Status</div>
                  <div className="col-span-2">Date</div>
                </div>
                {maintenanceTasks.map((task, index) => (
                  <div
                    key={task.id}
                    className={`grid grid-cols-12 p-4 text-sm ${
                      index !== maintenanceTasks.length - 1 ? "border-b" : ""
                    }`}
                  >
                    <div className="col-span-5 font-medium">{task.title}</div>
                    <div className="col-span-3 text-gray-500">
                      {task.project}
                    </div>
                    <div className="col-span-2">
                      <Badge
                        className={
                          task.status === "Completed"
                            ? "bg-green-100 text-green-800"
                            : task.status === "In Progress"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-amber-100 text-amber-800"
                        }
                      >
                        {task.status}
                      </Badge>
                    </div>
                    <div className="col-span-2 text-gray-500">
                      {new Date(task.date).toLocaleDateString()}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <div className="text-sm text-gray-500">
                Showing {maintenanceTasks.length} of {maintenanceTasks.length}{" "}
                tasks
              </div>
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm" disabled>
                  Previous
                </Button>
                <Button variant="outline" size="sm" disabled>
                  Next
                </Button>
              </div>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Maintenance Plans</CardTitle>
              <CardDescription>
                Current maintenance status and available plans
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {projects.map((project) => (
                  <div key={project.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium">{project.name}</h3>
                        <p className="text-sm text-gray-500">
                          Maintenance ends:{" "}
                          {new Date(
                            project.maintenanceEndDate
                          ).toLocaleDateString()}
                        </p>
                      </div>
                      <Badge
                        className={
                          new Date(project.maintenanceEndDate) >
                          new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
                            ? "bg-green-100 text-green-800"
                            : "bg-amber-100 text-amber-800"
                        }
                      >
                        {new Date(project.maintenanceEndDate) >
                        new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
                          ? "Active"
                          : "Ending Soon"}
                      </Badge>
                    </div>

                    {new Date(project.maintenanceEndDate) <
                      new Date(Date.now() + 60 * 24 * 60 * 60 * 1000) && (
                      <div className="mt-4">
                        <Button className="bg-indigo-600 hover:bg-indigo-700 w-full">
                          View Upgrade Options
                        </Button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="projects" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Your Projects</CardTitle>
                  <CardDescription>
                    Track and manage your SaaS projects
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 mr-2"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12"
                      />
                    </svg>
                    Filter
                  </Button>
                  <Button className="bg-indigo-600 hover:bg-indigo-700">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 mr-2"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                      />
                    </svg>
                    New Project
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {projects.map((project) => (
                  <Card key={project.id}>
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <CardTitle>{project.name}</CardTitle>
                        <Badge
                          className={
                            project.status === "In Progress"
                              ? "bg-blue-100 text-blue-800"
                              : project.status === "Planning"
                              ? "bg-purple-100 text-purple-800"
                              : project.status === "Completed"
                              ? "bg-green-100 text-green-800"
                              : "bg-gray-100 text-gray-800"
                          }
                        >
                          {project.status}
                        </Badge>
                      </div>
                      <CardDescription>
                        {new Date(project.startDate).toLocaleDateString()} -{" "}
                        {new Date(project.endDate).toLocaleDateString()}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pb-2">
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Progress</span>
                          <span className="font-medium">
                            {project.progress}%
                          </span>
                        </div>
                        <Progress value={project.progress} className="h-2" />
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button variant="outline" className="w-full" asChild>
                        <Link href={`/dashboard/projects/${project.id}`}>
                          View Details
                        </Link>
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
