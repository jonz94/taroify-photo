'use client'

import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { LucideMoon, LucideSun } from 'lucide-react'
import { useTheme } from 'next-themes'

type Theme = 'system' | 'light' | 'dark'

const THEME_DISPLAY_NAME_LOOKUP_TABLE = {
  light: '淺色模式',
  dark: '深色模式',
  system: '系統預設',
} as const satisfies Record<Theme, string>

const THEMES = Object.keys(THEME_DISPLAY_NAME_LOOKUP_TABLE) as Theme[]

export function ModeToggle() {
  const { setTheme } = useTheme()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <LucideSun className="size-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <LucideMoon className="absolute size-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {THEMES.map((theme) => (
          <DropdownMenuItem key={theme} className="text-lg" onClick={() => setTheme(theme)}>
            {THEME_DISPLAY_NAME_LOOKUP_TABLE[theme]}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
