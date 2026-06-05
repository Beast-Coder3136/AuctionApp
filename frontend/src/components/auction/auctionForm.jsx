import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";

export default function AuctionFormDialog({ open, setOpen, edit, onSubmit, formState, setters }) {
  const { title, description, startingBid, startTime, endTime } = formState;
  const { setTitle, setDescription, setStartingBid, setStartTime, setEndTime, handleImage } = setters;

  return (
    <DialogContent className="flex flex-col gap-0   max-w-lg overflow-hidden rounded-xl ">
      <DialogHeader className="px-6 pt-6 pb-4 border-b ">
        <DialogTitle className="text-xl font-bold ">
          {edit ? "Edit Auction" : "Create New Auction"}
        </DialogTitle>

      </DialogHeader>

      <div className="flex flex-col gap-5 px-2 py-4 overflow-y-auto max-h-[70vh]">
        <div className="flex flex-col gap-2">
          <Label htmlFor="auction-title" className="text-sm font-semibold text-[#0A1628]">
            Item Title
          </Label>
          <Input
            id="auction-title"
            type="text"
            placeholder="e.g. Vintage Gibson Les Paul Guitar"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className=" h-10"
          />
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="auction-desc" className="text-sm font-semibold ">
            Description
          </Label>
          <Textarea
            id="auction-desc"
            placeholder="Describe the item condition, features, and why it's valuable..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className=" min-h-[90px] resize-none"
          />
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="auction-bid" className="text-sm font-semibold ">
            Starting Bid ($)
          </Label>
          <Input
            id="auction-bid"
            type="number"
            min="0"
            placeholder="e.g. 100"
            value={startingBid}
            onChange={(e) => setStartingBid(e.target.value)}
            className=" h-10"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="auction-start" className="text-sm font-semibold text-[#0A1628]">
              Start Time
            </Label>
            <Input
              id="auction-start"
              type="datetime-local"
              value={startTime || ""}
              onChange={(e) => setStartTime(e.target.value)}
              className=" h-10"
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="auction-end" className="text-sm font-semibold ">
              End Time
            </Label>
            <Input
              id="auction-end"
              type="datetime-local"
              value={endTime || ""}
              onChange={(e) => setEndTime(e.target.value)}
              className=" h-10"
            />
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="auction-image" className="text-sm font-semibold ">
            Item Image
          </Label>
          <div className="border border-dashed  transition-colors">
            <Input
              id="auction-image"
              type="file"
              accept="image/*"
              onChange={handleImage}
              className="border-0 bg-transparent p-0 text-sm  file:mr-4 file:py-1.5 file:px-4 file:rounded-md file:border-0 file:text-xs file:font-semibold "
            />
          </div>
        </div>
      </div>

      <DialogFooter className="px-6 py-4 border-t  flex justify-end gap-3">
        <DialogClose asChild>
          <Button
            variant="outline"
            className="cursor-pointer"
            onClick={() => setOpen(false)}
          >
            Cancel
          </Button>
        </DialogClose>
        <Button
          onClick={onSubmit}
          className=" min-w-[120px] cursor-pointer"
        >
          {edit ? "Save Changes" : "Create Auction"}
        </Button>
      </DialogFooter>
    </DialogContent>
  );
}