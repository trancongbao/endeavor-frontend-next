import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { ReactNode } from 'react'
import { MoreVertical } from 'react-feather'

export interface MenuOption {
  label: string
  icon: ReactNode
  onSelect: () => void
}

export default function KebabMenu({ menuOptions }: { menuOptions: MenuOption[] }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <MoreVertical color="hsl(180, 10%, 60%)" />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {menuOptions.map(({ label, icon, onSelect }, index) => (
          <DropdownMenuItem key={index} onSelect={onSelect}>
            <Button variant="ghost" className="flex items-center gap-2">
              {icon}
              <span>{label}</span>
            </Button>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
