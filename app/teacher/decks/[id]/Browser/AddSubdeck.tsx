import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"

export default function AddSubdeck() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="w-36 bg-orange-400  text-white text-md hover:bg-orange-300 hover:text-black py-2 px-4 rounded"
        >
          Add Subdeck
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit profile</DialogTitle>
          <DialogDescription>Make changes to your profile here. Click save when you're done.</DialogDescription>
        </DialogHeader>
        <p>Hello</p>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            {/* <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input
              id="name"
              defaultValue="Pedro Duarte"
              className="col-span-3"
            /> */}
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            {/* <Label htmlFor="username" className="text-right">
              Username
            </Label>
            <Input
              id="username"
              defaultValue="@peduarte"
              className="col-span-3"
            /> */}
          </div>
        </div>
        <DialogFooter>{/* <Button type="submit">Save changes</Button> */}</DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
