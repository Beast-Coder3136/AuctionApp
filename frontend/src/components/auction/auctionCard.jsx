import { CalendarCheck2, Clock, Eye, Pencil, RadioTower } from "lucide-react";
import { Badge } from "../ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
const statusConfig = {
  Live: {
    color: "bg-green-100 text-green-800 hover:bg-green-100",
    dot: "bg-green-500",
    icon: <RadioTower className="w-3.5 h-3.5" />,
  },
  Upcoming: {
    color: "bg-slate-200 text-black hover:bg-[#8B5CF6]",
    dot: "bg-yellow-400",
    icon: <Clock className="w-3.5 h-3.5" />,
  },
  Ended: {
    color: "bg-slate-200 text-slate-600 hover:bg-[#CCFBF1]",
    dot: "bg-slate-400",
    icon: <CalendarCheck2 className="w-3.5 h-3.5" />,
  },
  Completed: {
    color: "bg-slate-200 text-slate-600 hover:bg-[#CCFBF1]",
    dot: "bg-slate-400",
    icon: <CalendarCheck2 className="w-3.5 h-3.5" />,
  },
};

export default function AuctionCard({ item, onView, onEdit }) {
  const sConfig = statusConfig[item?.status] || statusConfig["Ended"];
  const canEdit = item?.status === "Upcoming";

  return (
    <Card className=" hover:shadow-md transition-all duration-200  flex flex-col overflow-hidden group ">
      {/* Image */}
      <div className="relative  overflow-hidden flex-col gap-5">
        <div className="absolute  top-0 left-2">
          <Badge
            className={`flex items-center gap-1 border-none text-xs font-semibold px-2.5 py-1 ${sConfig.color}`}
          >
            {sConfig.icon}
            {item?.status?.toUpperCase()}
          </Badge>
        </div >
        <img
          src={item?.image || "https://placehold.co/600x340?text=No+Image"}
          alt={item?.title}
          className="object-contain   w-[90%] h-[90%] transition-transform duration-300 group-hover:scale-105 p-2"
        />
      </div>
      <CardHeader className="p-4 pb-2">
        <CardTitle className="text-base font-bold text-[#0A1628] line-clamp-1">
          {item?.title}
        </CardTitle>
      </CardHeader>

      <CardContent className="p-4 pt-0 flex flex-col gap-3 flex-grow">
        <div className="flex flex-col gap-1.5 text-xs text-slate-500 font-medium">
          <div className="flex items-center gap-2">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span>
              Start:{" "}
              {item?.startTime
                ? new Date(item.startTime).toLocaleString([], {
                  dateStyle: "medium",
                  timeStyle: "short",
                })
                : "N/A"}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <CalendarCheck2 className="w-3.5 h-3.5 text-slate-400" />
            <span>
              End:{" "}
              {item?.endTime
                ? new Date(item.endTime).toLocaleString([], {
                  dateStyle: "medium",
                  timeStyle: "short",
                })
                : "N/A"}
            </span>
          </div>
          <div className="flex items-center gap-2 mt-1 pt-2 border-t border-slate-100">
            <span className="font-semibold text-[#0A1628]">Starting Bid:</span>
            <span className="text-[#0A1628] font-bold">${item?.startingBid}</span>
          </div>
          <div className="flex items-center gap-2 mt-1 pt-2 border-t border-slate-100">
            <span className="font-semibold text-[#0A1628]">Current Bid:</span>
            <span className="text-[#0A1628] font-bold">${item?.currentBid}</span>
          </div>
        </div>

        <div className="mt-auto pt-2 flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className="flex-1 h-9"
            onClick={() => onView(item._id)}
          >
            <Eye className="w-4 h-4 mr-1.5" /> View
          </Button>
          {canEdit ? (
            <Button
              size="sm"
              className="flex-1   h-9"
              onClick={() => onEdit(item)}
            >
              <Pencil className="w-4 h-4 mr-1.5" /> Edit
            </Button>
          ) : (
            <Button
              size="sm"
              variant="outline"
              disabled
              className="flex-1  h-9 cursor-not-allowed"
            >
              <Pencil className="w-4 h-4 mr-1.5" /> Edit
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}