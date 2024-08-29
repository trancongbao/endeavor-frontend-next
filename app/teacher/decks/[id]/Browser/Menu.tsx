import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { MoreVertical, Edit, Delete } from 'react-feather'

export default function Menu() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Button variant="ghost">
          <MoreVertical color="hsl(180, 10%, 60%)" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem>
          <Button variant="ghost" className="flex items-center gap-2">
            <Edit />
            <span>Edit</span>
          </Button>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Button variant="ghost" className="flex items-center gap-2">
            <Delete />
            <span>Delete</span>
          </Button>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
