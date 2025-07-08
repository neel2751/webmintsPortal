"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { useFetchQuery } from "@/hooks/useFetch";
import { useSubmitMutation } from "@/hooks/useSubmit";
import { generateDownloadUrl } from "@/server/aws/awsUpload";
import {
  getAllJobApplicantData,
  updateJobStatus,
} from "@/server/jobServer/jobServer";
import { Check, CircleX, ScrollText, X } from "lucide-react";
import Link from "next/link";
import React from "react";
import { toast } from "sonner";

export default function JobView() {
  const queryKey = ["getAllJobApplicantData"];

  const { data } = useFetchQuery({
    queryKey,
    fetchFn: getAllJobApplicantData,
  });
  const { newData } = data || {};
  const handleDownload = async (key) => {
    if (!key) {
      toast.error("No file key provided for download");
      return;
    }
    const fileName = key.split("/").pop();

    const res = await generateDownloadUrl({ key, expiresIn: 60 });
    if (!res.success) {
      toast.error("Failed to generate download link");
      return;
    }
    const link = document.createElement("a");
    link.href = res.url;
    // we have to download any file not pdf
    link.setAttribute("download", fileName || "downloaded_file");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Download started successfully");
  };

  const { mutate: handleJobStatus } = useSubmitMutation({
    mutationFn: async (data) => await updateJobStatus(data),
    invalidateKey: queryKey,
    onSuccessMessage: (message) => message || "Job status updated successfully",
    onClose: () => {},
  });

  return (
    <div className="mt-4">
      <Card>
        <CardHeader>
          <CardTitle>All Job Inquiry List</CardTitle>
          <CardDescription>
            Manage all the job inquiry list with track and update the status of
            the Job Applications
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                {[
                  "Id",
                  "JobId",
                  "First Name",
                  "LastName",
                  "Email",
                  "Phone",
                  "createdAt",
                  "Status",
                  "Resume Link",
                  "Access",
                  "Cover Letter",
                  "Actions",
                ].map((key) => (
                  <TableHead key={key} className=" capitalize text-neutral-500">
                    {key}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {newData &&
                newData?.map((item, i) => (
                  <TableRow key={i}>
                    <TableCell className={"font-medium"}>{i + 1}</TableCell>
                    <TableCell className={"font-medium capitalize"}>
                      {item?.jobId}
                    </TableCell>
                    <TableCell className={"font-medium"}>
                      {item?.others?.firstName || "N/A"}
                    </TableCell>
                    <TableCell className={"font-medium"}>
                      {item?.others?.lastName || "N/A"}
                    </TableCell>
                    <TableCell className={"font-medium text-indigo-600"}>
                      <Link href={`mailto:${item?.others?.email || "N/A"}`}>
                        {item?.others?.email || "N/A"}
                      </Link>
                    </TableCell>
                    <TableCell className={"font-medium"}>
                      {item?.others?.phone || "N/A"}
                    </TableCell>
                    <TableCell className={"font-medium"}>
                      {item?.createdAt
                        ? new Date(item.createdAt).toLocaleDateString()
                        : "N/A"}
                    </TableCell>
                    <TableCell className={"font-medium capitalize"}>
                      {item?.status || "N/A"}
                    </TableCell>
                    <TableCell className={"font-medium"}>
                      {item?.resumeLink ? (
                        item.access === "public" ? (
                          <Link
                            href={`${
                              item.resumeLink.startsWith("https")
                                ? item.resumeLink
                                : `https://cdcneel.s3.eu-west-2.amazonaws.com/${item.resumeLink}`
                            }`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-indigo-600 hover:underline"
                          >
                            View Resume
                          </Link>
                        ) : (
                          <Button
                            variant="ghost"
                            className="text-indigo-600 hover:text-indigo-600 hover:underline hover:bg-transparent cursor-pointer"
                            onClick={() => handleDownload(item?.resumeLink)}
                          >
                            View Resume
                          </Button>
                        )
                      ) : (
                        "N/A"
                      )}
                    </TableCell>
                    <TableCell className={"font-medium capitalize"}>
                      {item?.access || "N/A"}
                    </TableCell>
                    <TableCell className={"font-medium"}>
                      {item?.coverLetter ? (
                        <a
                          href={item.coverLetter}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-indigo-600 hover:underline"
                        >
                          View Cover Letter
                        </a>
                      ) : (
                        "N/A"
                      )}
                    </TableCell>
                    <TableCell className={"font-medium"}>
                      {/* Action Approve & Reject */}
                      {item.status === "applied" ? (
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size={"icon"}
                            className="text-green-600 hover:text-green-600 hover:underline hover:bg-transparent cursor-pointer"
                            onClick={() =>
                              handleJobStatus({
                                id: item?._id,
                                status: "interviewing",
                              })
                            }
                          >
                            <Check />
                          </Button>
                          <Button
                            variant="outline"
                            size={"icon"}
                            className="text-red-600 hover:text-red-600 hover:underline hover:bg-transparent cursor-pointer"
                            onClick={() =>
                              handleJobStatus({
                                id: item._id,
                                status: "rejected",
                              })
                            }
                          >
                            <X />
                          </Button>
                        </div>
                      ) : item.status === "interviewing" ? (
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size={"icon"}
                            className="text-green-600 hover:text-green-600 hover:underline hover:bg-transparent cursor-pointer"
                            onClick={() =>
                              handleJobStatus({
                                id: item?._id,
                                status: "offered",
                              })
                            }
                          >
                            <ScrollText />
                          </Button>
                          <Button
                            variant="outline"
                            size={"icon"}
                            className="text-red-600 hover:text-red-600 hover:underline hover:bg-transparent cursor-pointer"
                            onClick={() =>
                              handleJobStatus({
                                id: item._id,
                                status: "rejected",
                              })
                            }
                          >
                            <CircleX />
                          </Button>
                        </div>
                      ) : (
                        <span className="text-gray-500">
                          {item.status === "offered"
                            ? "Offered"
                            : item.status === "rejected"
                            ? "Rejected"
                            : "N/A"}
                        </span>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
