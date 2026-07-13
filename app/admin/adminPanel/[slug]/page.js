import ClientDashboardPage from "@/app/portal/dashboard/clientDashboard";
import { MenuBarWrapper } from "@/components/menu/menuWarpper";
import { Earth, FileText, FolderKanban, Globe, Inbox, Users } from "lucide-react";
import React from "react";
import { notFound } from "next/navigation";
import Inquiry from "../inquiry/inquiry";
import JobView from "../job/job";
import UserManagement from "../users/users";
import ProjectManagement from "../projects/projects";
import RequestManagement from "../requests/requests";
import WebsiteManagement from "../websites/websites";

export default async function page({ params }) {
  const { slug } = await params;
  const menu = [
    { name: "Overview", link: "overview", icon: Earth },
    { name: "Users", link: "users", icon: Users },
    { name: "Projects", link: "projects", icon: FolderKanban },
    { name: "Requests", link: "requests", icon: Inbox },
    { name: "Inquiry", link: "inquiry", icon: FileText },
    { name: "Job", link: "job", icon: FileText },
    { name: "Websites", link: "websites", icon: Globe },
  ];
  const renderContent = () => {
    switch (slug) {
      case "overview":
        return <ClientDashboardPage />;
      case "users":
        return <UserManagement />;
      case "projects":
        return <ProjectManagement />;
      case "requests":
        return <RequestManagement />;
      case "inquiry":
        return <Inquiry />;
      case "job":
        return <JobView />;
      case "websites":
        return <WebsiteManagement />;
      default:
        notFound();
    }
  };
  return (
    <>
      <MenuBarWrapper slug={slug} menu={menu} basePath={"/admin/adminPanel"} />
      <main>{renderContent()}</main>
    </>
  );
}
