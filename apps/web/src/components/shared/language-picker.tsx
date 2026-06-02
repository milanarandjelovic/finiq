'use client'

import { useState } from 'react'
import { ChevronDownIcon } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { LANGUAGE_AVAILABLE_NAMES } from '@finiq/shared'
import { Button } from '@finiq/ui/components/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@finiq/ui/components/dropdown-menu'
import { useAvailableLanguages } from '@/hooks/data/use-available-languages'
import { changeLanguage } from '@/i18n'

const getLanguageName = (code: string) =>
  LANGUAGE_AVAILABLE_NAMES[code] ?? code.toUpperCase()

export function LanguagePicker() {
  const { i18n } = useTranslation()
  const [loading, setLoading] = useState(false)
  const { data: languages = Object.keys(LANGUAGE_AVAILABLE_NAMES) } =
    useAvailableLanguages()

  const currentLang = i18n.language

  const handleSelect = async (lang: string) => {
    if (lang === currentLang) {
      return
    }

    setLoading(true)

    try {
      await changeLanguage(lang)
    } finally {
      setLoading(false)
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="h-8"
          disabled={loading}
          data-testid="language-picker-trigger"
        >
          {getLanguageName(currentLang)}
          <ChevronDownIcon className="ml-1 size-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {languages.map((lang) => (
          <DropdownMenuItem
            key={lang}
            onClick={() => handleSelect(lang)}
            className={lang === currentLang ? 'font-semibold' : ''}
            data-testid={`language-option-${lang}`}
          >
            {getLanguageName(lang)}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
