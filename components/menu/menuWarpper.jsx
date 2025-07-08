import { cn } from "@/lib/utils";
import Link from "next/link";

export const MenuBarWrapper = ({ slug, menu, basePath }) => {
  return (
    <nav className="bg-white border-b border-stone-200 -mt-1">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
        <div className="flex gap-2 overflow-x-auto">
          {menu.map((item, index) => (
            <Link
              key={index}
              href={`${basePath}/${item.link}`}
              className={cn(
                "text-sm px-3 py-2 rounded-md flex items-center whitespace-nowrap",
                slug === item.link
                  ? "bg-indigo-100 text-indigo-600 font-medium"
                  : "hover:bg-stone-100 text-neutral-700 border border-gray-100"
              )}
            >
              <item.icon className="w-4 h-4 mr-2" />
              {item.name}
              {item.isNew && (
                <span
                  className={cn(
                    "ml-2 text-xs font-medium px-2 py-0.5 rounded-md",
                    slug === item.link
                      ? "bg-primary text-indigo-100"
                      : "bg-indigo-100 text-primary"
                  )}
                >
                  {item.isNew}
                </span>
              )}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
};
