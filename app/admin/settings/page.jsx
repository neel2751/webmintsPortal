import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Home, IdCard, PlusCircle } from "lucide-react";

const SettingsPage = () => {
  return (
    <div className=" w-full overflow-y-scroll p-1 pr-4 md:overflow-y-hidden">
      <div className="flex flex-1 flex-col">
        <div className="flex-none">
          <h3 className="text-lg font-medium">General</h3>
          <p className="text-muted-foreground text-sm">
            Settings and options for your application.
          </p>
        </div>
        <div
          data-orientation="horizontal"
          role="none"
          className="bg-border h-[1px] w-full mt-4 flex-none shadow-sm"
        ></div>
        <div
          dir="ltr"
          className="relative overflow-hidden faded-bottom -mx-4 flex-1 scroll-smooth px-4 md:pb-16"
        >
          <div
            data-radix-scroll-area-viewport=""
            className="h-full w-full rounded-[inherit]"
          >
            <div>
              <div className="-mx-1 px-1.5 pt-4 w-full lg:max-w-full">
                <div className="flex w-full flex-col items-start justify-between gap-4 rounded-lg border p-4 md:flex-row md:items-center">
                  <div className="flex flex-col items-start text-sm">
                    <p className=" font-medium">
                      Your application is currently on the free plan
                    </p>
                    <p className="text-muted-foreground font-medium">
                      Paid plans offer higher usage limits, additional
                      branches,and much more.Learn more{" "}
                      <a className="underline" href="">
                        here
                      </a>
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&amp;_svg]:pointer-events-none [&amp;_svg]:size-4 [&amp;_svg]:shrink-0 bg-secondary text-secondary-foreground shadow-xs hover:bg-secondary/80 h-9 px-4 py-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="tabler-icon tabler-icon-message-2-question "
                      >
                        <path d="M8 9h8"></path>
                        <path d="M8 13h6"></path>
                        <path d="M14.5 18.5l-2.5 2.5l-3 -3h-3a3 3 0 0 1 -3 -3v-8a3 3 0 0 1 3 -3h12a3 3 0 0 1 3 3v4.5"></path>
                        <path d="M19 22v.01"></path>
                        <path d="M19 19a2.003 2.003 0 0 0 .914 -3.782a1.98 1.98 0 0 0 -2.414 .483"></path>
                      </svg>
                      Chat to us
                    </button>
                    <button className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&amp;_svg]:pointer-events-none [&amp;_svg]:size-4 [&amp;_svg]:shrink-0 border border-input bg-background shadow-xs hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2">
                      Upgrade
                    </button>
                  </div>
                </div>
                <form className="space-y-6 py-8">
                  <div className="space-y-2 flex flex-col items-start justify-between md:flex-row md:items-center">
                    <div>
                      <Label htmlFor="company_logo">Company Logo</Label>
                      <p className="text-muted-foreground text-[0.8rem] mt-1">
                        Update your company logo.
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Input
                        id="company_logo"
                        placeholder="Company Logo"
                        accept="image/webp,image/jpeg,image/png/image/svg+xml"
                        type="file"
                        name="company_logo"
                      />
                    </div>
                  </div>
                  <div
                    data-orientation="horizontal"
                    role="none"
                    className="bg-border shrink-0 h-[1px] w-full"
                  ></div>
                  <div className="space-y-2 flex flex-col items-start justify-between md:flex-row md:items-center">
                    <div>
                      <Label htmlFor=":r16c:-form-item">System Font</Label>
                      <p className="text-muted-foreground text-[0.8rem] mt-1">
                        Set the font you want to use in the dashboard.
                      </p>
                    </div>
                    <div>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a Font" />
                        </SelectTrigger>
                        <SelectContent>
                          {["Inter", "Manrope", "system"].map((item) => (
                            <SelectItem key={item} value={item}>
                              {item}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div
                    data-orientation="horizontal"
                    role="none"
                    className="bg-border shrink-0 h-[1px] w-full"
                  ></div>
                  <div className="space-y-2 flex flex-col items-start justify-between md:flex-row md:items-center">
                    <div>
                      <Label htmlFor="company_tax_id">Business Tax ID</Label>
                      <p className="text-muted-foreground text-[0.8rem] mt-1">
                        Tax ID of the company.
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <div>
                        <Input
                          placeholder="Business Tax ID"
                          id="company_tax_id"
                          name="company_tax_id"
                        />
                      </div>
                      <Button type="button" size={"icon"} variant={"outline"}>
                        <IdCard />
                      </Button>
                    </div>
                  </div>
                  <div
                    data-orientation="horizontal"
                    role="none"
                    className="bg-border shrink-0 h-[1px] w-full"
                  ></div>
                  <div className="space-y-2 flex flex-col items-start justify-between md:flex-row md:items-center">
                    <div>
                      <Label htmlFor="company_address">Business Address</Label>
                      <p className="text-muted-foreground text-[0.8rem] mt-1">
                        Address of the company.
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <div>
                        <Input
                          placeholder="Business Address"
                          id=":r16f:-form-item"
                          name="company_address"
                        />
                      </div>
                      <Button type="button" size={"icon"} variant={"outline"}>
                        <Home />
                      </Button>
                    </div>
                  </div>
                  <button className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&amp;_svg]:pointer-events-none [&amp;_svg]:size-4 [&amp;_svg]:shrink-0 bg-primary text-primary-foreground shadow-sm hover:bg-primary/90 h-9 px-4 py-2">
                    Save Changes
                  </button>
                </form>
                <div className="mt-10 mb-4 flex w-full flex-col items-start justify-between gap-4 rounded-lg border p-4 md:flex-row md:items-center">
                  <div className="flex flex-col items-start text-sm">
                    <p className="font-semibold">Remove Account</p>
                    <p className="text-muted-foreground font-medium">
                      You can do 'Disable account' to take a break from panel.
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      size={"sm"}
                      variant={"outline"}
                      type="button"
                      className={"text-red-600 border-red-600"}
                    >
                      Deactivate Account
                    </Button>
                    <Button size={"sm"} type="button" className={"bg-red-600"}>
                      Delete Account
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex w-full overflow-y-scroll p-1 pr-4 md:overflow-y-hidden">
        <div className="flex flex-1 flex-col">
          <div className="flex-none">
            <h3 className="text-lg font-medium">Plans</h3>
            <p className="text-muted-foreground text-sm">
              Your subscriptions will beigin today with a free 14-day trial.
            </p>
          </div>
          <div
            data-orientation="horizontal"
            role="none"
            className="bg-border h-[1px] w-full mt-4 flex-none shadow-sm"
          ></div>
          <div className="-mx-1 px-1.5 pt-4 lg:max-w-3xl">
            <div className="mb-4 flex flex-col space-y-8 py-3">
              <RadioGroup className="grid gap-2 grid-cols-3" defaultValue="1">
                <div className="flex flex-wrap items-center gap-5">
                  <div className="flex min-w-fit shrink-0 grow basis-0 items-center transition-colors">
                    <label
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 outline-muted w-full cursor-pointer rounded-md border outline has-[[data-state=checked]]:border-blue-500"
                      htmlFor="1"
                    >
                      <div className="bg-card text-card-foreground rounded-md shadow-sm w-full border-none">
                        <div className="flex flex-col space-y-1.5 p-6 py-3">
                          <div className="flex items-center justify-between gap-6">
                            <div className="flex items-center gap-3">
                              <RadioGroupItem
                                value="1"
                                id="1"
                                className={
                                  "has-[[data-state=checked]]:border-blue-500 h-4.5 w-4.5"
                                }
                                circleClassName={
                                  "fill-blue-700 h-3 w-3 text-blue-700"
                                }
                              />
                              <div className="font-semibold tracking-tight text-sm">
                                Monthly
                              </div>
                            </div>
                          </div>
                        </div>
                        <div
                          data-orientation="horizontal"
                          role="none"
                          className="bg-border shrink-0 h-[1px] w-full"
                        ></div>
                        <div className="p-6 py-3">
                          <div className="flex flex-col items-start gap-1">
                            <p className="text-sm">$49.99 / month</p>
                            <p className="text-muted-foreground text-xs">
                              Billed monthly
                            </p>
                          </div>
                        </div>
                      </div>
                    </label>
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-5">
                  <div className="flex min-w-fit shrink-0 grow basis-0 items-center transition-colors">
                    <label
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 outline-muted w-full cursor-pointer rounded-md border outline has-[[data-state=checked]]:border-blue-500"
                      htmlFor="2"
                    >
                      <div className="bg-card text-card-foreground rounded-md shadow-sm w-full border-none">
                        <div className="flex flex-col space-y-1.5 p-6 py-3">
                          <div className="flex items-center justify-between gap-6">
                            <div className="flex items-center gap-3">
                              <RadioGroupItem
                                value="2"
                                id="2"
                                className={
                                  "has-[[data-state=checked]]:border-blue-500 h-4.5 w-4.5"
                                }
                                circleClassName={
                                  "fill-blue-700 w-3 h-3 text-blue-700"
                                }
                              />
                              <div className="font-semibold tracking-tight text-sm">
                                Monthly
                              </div>
                            </div>
                          </div>
                        </div>
                        <div
                          data-orientation="horizontal"
                          role="none"
                          className="bg-border shrink-0 h-[1px] w-full"
                        ></div>
                        <div className="p-6 py-3">
                          <div className="flex flex-col items-start gap-1">
                            <p className="text-sm">$49.99 / month</p>
                            <p className="text-muted-foreground text-xs">
                              Billed monthly
                            </p>
                          </div>
                        </div>
                      </div>
                    </label>
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-5">
                  <div className="flex min-w-fit shrink-0 grow basis-0 items-center transition-colors">
                    <label
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 outline-muted w-full cursor-pointer rounded-md border outline has-[[data-state=checked]]:border-blue-500"
                      htmlFor="3"
                    >
                      <div className="bg-card text-card-foreground rounded-md shadow-sm w-full border-none">
                        <div className="flex flex-col space-y-1.5 p-6 py-3">
                          <div className="flex items-center justify-between gap-6">
                            <div className="flex items-center gap-3">
                              <RadioGroupItem
                                value="3"
                                id="3"
                                className={
                                  "has-[[data-state=checked]]:border-blue-500 h-4.5 w-4.5"
                                }
                                circleClassName={
                                  "fill-blue-700 w-3 h-3 text-blue-700"
                                }
                              />
                              <div className="font-semibold tracking-tight text-sm">
                                Monthly
                              </div>
                            </div>
                          </div>
                        </div>
                        <div
                          data-orientation="horizontal"
                          role="none"
                          className="bg-border shrink-0 h-[1px] w-full"
                        ></div>
                        <div className="p-6 py-3">
                          <div className="flex flex-col items-start gap-1">
                            <p className="text-sm">$49.99 / month</p>
                            <p className="text-muted-foreground text-xs">
                              Billed monthly
                            </p>
                          </div>
                        </div>
                      </div>
                    </label>
                  </div>
                </div>
              </RadioGroup>

              <div className="space-y-3">
                <h2 className="font-bold">Overview</h2>
                <p className="text-muted-foreground text-sm leading-5">
                  Experience all the core features with the flexibility of a
                  monthly subscription. Stay up-to-date with the latest tools,
                  receive ongoing support, and enjoy uninterrupted access to key
                  functionalities designed to enhance your productivity.
                </p>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h2 className="font-bold">Features</h2>
                  <button className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md transition-colors focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&amp;_svg]:pointer-events-none [&amp;_svg]:size-4 [&amp;_svg]:shrink-0 underline-offset-4 hover:underline h-9 px-4 py-2 text-xs font-semibold text-blue-600">
                    Learn More
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="tabler-icon tabler-icon-arrow-up-right "
                    >
                      <path d="M17 7l-10 10"></path>
                      <path d="M8 7l9 0l0 9"></path>
                    </svg>
                  </button>
                </div>
                <div className="border-muted-foreground grid grid-cols-6 gap-4 rounded-md border-[1px] p-4">
                  <div className="col-span-3 flex items-center gap-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="tabler-icon tabler-icon-check "
                    >
                      <path d="M5 12l5 5l10 -10"></path>
                    </svg>
                    <p className="text-sm">Dedicated Account Manager</p>
                  </div>
                  <div className="col-span-3 flex items-center gap-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="tabler-icon tabler-icon-check "
                    >
                      <path d="M5 12l5 5l10 -10"></path>
                    </svg>
                    <p className="text-sm">
                      Community Access &amp; Forum Participation
                    </p>
                  </div>
                  <div className="col-span-3 flex items-center gap-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="tabler-icon tabler-icon-check "
                    >
                      <path d="M5 12l5 5l10 -10"></path>
                    </svg>
                    <p className="text-sm">
                      Customizable Settings &amp; Preferences
                    </p>
                  </div>
                  <div className="col-span-3 flex items-center gap-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="tabler-icon tabler-icon-check "
                    >
                      <path d="M5 12l5 5l10 -10"></path>
                    </svg>
                    <p className="text-sm">Regular Performance Reports</p>
                  </div>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h2 className="font-bold">Additional Resources</h2>
                  <button className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md transition-colors focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&amp;_svg]:pointer-events-none [&amp;_svg]:size-4 [&amp;_svg]:shrink-0 underline-offset-4 hover:underline h-9 px-4 py-2 text-xs font-semibold text-blue-600">
                    Learn More
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="tabler-icon tabler-icon-arrow-up-right "
                    >
                      <path d="M17 7l-10 10"></path>
                      <path d="M8 7l9 0l0 9"></path>
                    </svg>
                  </button>
                </div>
                <div className="border-muted-foreground grid grid-cols-6 gap-4 rounded-md border-[1px] p-4">
                  <div className="col-span-3 flex items-center gap-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="tabler-icon tabler-icon-check "
                    >
                      <path d="M5 12l5 5l10 -10"></path>
                    </svg>
                    <p className="text-sm">Mentorship Program</p>
                  </div>
                  <div className="col-span-3 flex items-center gap-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="tabler-icon tabler-icon-check "
                    >
                      <path d="M5 12l5 5l10 -10"></path>
                    </svg>
                    <p className="text-sm">Community Tutorials</p>
                  </div>
                  <div className="col-span-3 flex items-center gap-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="tabler-icon tabler-icon-check "
                    >
                      <path d="M5 12l5 5l10 -10"></path>
                    </svg>
                    <p className="text-sm">Access to Knowledge Base</p>
                  </div>
                </div>
              </div>
              <button
                className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&amp;_svg]:pointer-events-none [&amp;_svg]:size-4 [&amp;_svg]:shrink-0 bg-primary text-primary-foreground shadow-sm hover:bg-primary/90 h-9 px-4 py-2 ml-auto w-fit"
                type="button"
                aria-haspopup="dialog"
                aria-expanded="false"
                aria-controls="radix-:r1c6:"
                data-state="closed"
              >
                Start Subscribe
              </button>
            </div>
          </div>
        </div>
      </div>
      <BillingPage />
    </div>
  );
};

export default SettingsPage;

const BillingPage = () => {
  return (
    <div className="flex flex-col rounded-xl border border-gray-200">
      {/* <!-- Body --> */}
      <div className=" p-6 h-full">
        <h2 className="text-gray-800 font-semibold text-lg">Payment methods</h2>

        <p className="text-gray-500 text-sm mt-2">
          Add and manage your payment methods using our secure payment system.
        </p>

        {/* <!-- List Group --> */}
        <ul className="flex bg-white border-gray-200 border rounded-xl flex-col mt-4 -space-y-px">
          {/* <!-- List Item --> */}
          <li className=" border-t-0 p-3 border-gray-200">
            {/* <!-- Media --> */}
            <div className="flex gap-x-3">
              {/* <!-- Logo --> */}
              <div>
                <div className=" px-3 py-[0.65rem] border rounded-lg">
                  <svg
                    className="flex-shrink-0 w-8 h-auto"
                    width="35"
                    height="22"
                    viewBox="0 0 35 22"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <mask
                      id="mask0_666_270977"
                      maskUnits="userSpaceOnUse"
                      x="0"
                      y="5"
                      width="35"
                      height="12"
                    >
                      <path
                        d="M34.5 5.4751H0.5V16.5081H34.5V5.4751Z"
                        fill="white"
                      ></path>
                    </mask>
                    <g mask="url(#mask0_666_270977)">
                      <path
                        d="M15.239 16.3211H12.468L14.202 5.6621H16.973L15.239 16.3211ZM10.139 5.6621L7.487 12.9891L7.181 11.4081L6.246 6.6311C6.246 6.6311 6.127 5.6791 4.937 5.6791H0.551L0.5 5.8491C0.5 5.8491 1.843 6.1211 3.407 7.0731L5.821 16.3381H8.711L13.131 5.6791L10.139 5.6621ZM31.95 16.3211H34.5L32.273 5.6621H30.046C29.009 5.6621 28.771 6.4611 28.771 6.4611L24.64 16.3211H27.53L28.108 14.7401H31.627L31.95 16.3211ZM28.907 12.5471L30.369 8.5521L31.185 12.5471H28.907ZM24.844 8.2291L25.235 5.9341C25.235 5.9341 24.011 5.4751 22.736 5.4751C21.359 5.4751 18.095 6.0701 18.095 9.0111C18.095 11.7651 21.937 11.7991 21.937 13.2441C21.937 14.6891 18.503 14.4341 17.364 13.5161L16.956 15.9131C16.956 15.9131 18.197 16.5081 20.084 16.5081C21.971 16.5081 24.827 15.5221 24.827 12.8531C24.827 10.0821 20.951 9.8271 20.951 8.6201C20.951 7.4131 23.654 7.5661 24.844 8.2291Z"
                        fill="#2566AF"
                      ></path>
                      <path
                        d="M7.181 11.4252L6.246 6.6312C6.246 6.6312 6.127 5.6792 4.937 5.6792H0.551L0.5 5.8492C0.5 5.8492 2.608 6.2912 4.614 7.9232C6.552 9.4702 7.181 11.4252 7.181 11.4252Z"
                        fill="#E6A540"
                      ></path>
                    </g>
                  </svg>
                </div>
              </div>
              {/* <!-- End Logo --> */}

              {/* <!-- Body --> */}
              <div className=" sm:gap-x-3 sm:justify-between sm:flex gap-y-2 flex-grow">
                <div>
                  <p className="text-gray-800 font-medium text-sm">
                    Visa •••• 9016
                  </p>
                  <p className="text-gray-500 text-xs">Debit - Expires 12/25</p>
                </div>

                {/* <!-- Button Group --> */}
                <div className="flex gap-x-2">
                  <div>
                    <button
                      type="button"
                      className=" opacity-50 pointer-events-none shadow-sm text-gray-800 font-medium text-xs py-2 px-[0.625rem] bg-white border-gray-200 border rounded-lg gap-x-2 items-center inline-flex"
                      disabled=""
                    >
                      Default
                    </button>
                  </div>
                  <div>
                    <button
                      type="button"
                      className="text-gray-800 font-semibold text-xs py-2 px-[0.625rem] bg-gray-200 border-transparent border rounded-lg items-center inline-flex"
                      data-hs-overlay="#hs-pro-deacm"
                    >
                      Edit
                    </button>
                  </div>
                </div>
                {/* <!-- End Button Group --> */}
              </div>
              {/* <!-- End Body --> */}
            </div>
            {/* <!-- End Media --> */}
          </li>
          {/* <!-- End List Item --> */}

          {/* <!-- List Item --> */}
          <li className="-space-y-px p-3 border-gray-200 border-t">
            {/* <!-- Media --> */}
            <div className="flex gap-x-3">
              {/* <!-- Logo --> */}
              <div>
                <div className=" px-3 py-[0.65rem] border rounded-lg">
                  <svg
                    className="flex-shrink-0 w-8 h-auto"
                    width="35"
                    height="22"
                    viewBox="0 0 35 22"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <mask
                      id="mask0_666_271011"
                      maskUnits="userSpaceOnUse"
                      x="0"
                      y="0"
                      width="35"
                      height="22"
                    >
                      <path
                        d="M34.5 0.375H0.5V21.387H34.5V0.375Z"
                        fill="white"
                      ></path>
                    </mask>
                    <g mask="url(#mask0_666_271011)">
                      <path
                        d="M22.0899 19.1431H12.9099V2.61914H22.0899V19.1431Z"
                        fill="#FF5F00"
                      ></path>
                      <path
                        d="M13.488 10.881C13.488 7.532 15.052 4.54 17.5 2.619C15.647 1.157 13.369 0.375 11.006 0.375C5.209 0.375 0.5 5.084 0.5 10.881C0.5 16.678 5.209 21.387 11.006 21.387C13.369 21.387 15.647 20.605 17.5 19.143C15.052 17.222 13.488 14.23 13.488 10.881Z"
                        fill="#EB001B"
                      ></path>
                      <path
                        d="M34.5 10.881C34.5 16.678 29.791 21.387 23.994 21.387C21.631 21.387 19.353 20.605 17.5 19.143C19.948 17.222 21.512 14.23 21.512 10.881C21.512 7.532 19.948 4.54 17.5 2.619C19.353 1.157 21.631 0.375 23.994 0.375C29.791 0.375 34.5 5.084 34.5 10.881Z"
                        fill="#F79E1B"
                      ></path>
                    </g>
                  </svg>
                </div>
              </div>
              {/* <!-- End Logo --> */}

              {/* <!-- Body --> */}
              <div className=" sm:gap-x-3 sm:justify-between sm:flex gap-y-2 flex-grow">
                <div>
                  <p className="text-gray-800 font-medium text-sm">
                    MasterCard •••• 4242
                  </p>
                  <p className="text-gray-500 text-xs">Debit - Expires 04/24</p>
                </div>

                {/* <!-- Button Group --> */}
                <div className="flex gap-x-2">
                  <div>
                    <button
                      type="button"
                      className="shadow-sm text-gray-800 font-medium text-xs py-2 px-[0.625rem] bg-white border-gray-200 border rounded-lg gap-x-2 items-center inline-flex"
                    >
                      Set as default
                    </button>
                  </div>
                  <div>
                    <button
                      type="button"
                      className="text-gray-800 font-semibold text-xs py-2 px-[0.625rem] bg-gray-200 border-transparent border rounded-lg items-center inline-flex"
                      data-hs-overlay="#hs-pro-deacm"
                    >
                      Edit
                    </button>
                  </div>
                </div>
                {/* <!-- End Button Group --> */}
              </div>
              {/* <!-- End Body --> */}
            </div>
            {/* <!-- End Media --> */}
          </li>
          {/* <!-- End List Item --> */}
        </ul>
        {/* <!-- End List Group --> */}
      </div>
      {/* <!-- End Body --> */}

      {/* <!-- Footer --> */}
      <div className="flex border-t divide-x border-gray-200">
        <button
          type="button"
          className=" shadow-sm rounded-es-xl gap-x-2 divide-gray-200 divide-x justify-center w-full inline-flex items-center cursor-pointer text-gray-800 font-medium text-sm py-3 px-4 bg-white "
          data-hs-overlay="#hs-pro-dlcsam"
        >
          Manage cards
        </button>
        <button
          type="button"
          className=" shadow-sm rounded-ee-xl gap-x-2 divide-gray-200 divide-x justify-center w-full inline-flex items-center cursor-pointer text-gray-800 font-medium text-sm py-3 px-4 bg-white "
          data-hs-overlay="#hs-pro-dlcsam"
        >
          <PlusCircle className="size-4 shrink-0" />
          Add new card
        </button>
      </div>
      {/* <!-- End Footer --> */}
    </div>
  );
};
