import ClientDashboardPage from "@/app/(client)/(dashboard)/clientDashboard";
import { MenuBarWrapper } from "@/components/menu/menuWarpper";
import { Earth, FileText } from "lucide-react";
import React from "react";
import Inquiry from "../inquiry/inquiry";
import JobView from "../job/job";

export default async function page({ params }) {
  const { slug } = await params;
  const menu = [
    { name: "Overview", link: "overview", icon: Earth },
    { name: "Inquiry", link: "inquiry", icon: FileText },
    { name: "Job", link: "job", icon: FileText },
  ];
  const renderContent = () => {
    switch (slug) {
      case "overview":
        return <ClientDashboardPage />;
      case "inquiry":
        return <Inquiry />;
      case "job":
        return <JobView />;
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
