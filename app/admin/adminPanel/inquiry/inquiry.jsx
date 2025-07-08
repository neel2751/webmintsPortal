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
import { getAllInquiry } from "@/server/inquiryServer/inquieryServer";
import { format } from "date-fns";
import React from "react";

export default async function Inquiry() {
  const res = await getAllInquiry();
  const submissions = res.data;

  const uniqueKeys = Array.from(
    new Set(
      submissions.flatMap((item) =>
        item.customFields ? Object.keys(item.customFields) : []
      )
    )
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>All Inquiry List</CardTitle>
        <CardDescription>
          Manage all the inquiry list with track and update the status of the
          Inquiry
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-neutral-500">Id</TableHead>
              <TableHead className="text-neutral-500">Inquiry Page</TableHead>
              <TableHead className="text-neutral-500">Date</TableHead>
              {uniqueKeys.map((key) => (
                <TableHead key={key} className=" capitalize text-neutral-500">
                  {key}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {submissions?.map((item, i) => (
              <TableRow key={i}>
                <TableCell className={"font-medium"}>{i + 1}</TableCell>
                <TableCell className={"font-medium capitalize"}>
                  {item?.formType}
                </TableCell>
                <TableCell className={"font-medium"}>
                  {format(item?.submittedAt, "PPP, HH:mm")}
                </TableCell>
                {item.customFields &&
                  Object.entries(item.customFields).map(
                    ([key, value], index) => (
                      <TableCell key={index} className="font-medium capitalize">
                        <div key={index}> {String(value)}</div>
                      </TableCell>
                    )
                  )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
