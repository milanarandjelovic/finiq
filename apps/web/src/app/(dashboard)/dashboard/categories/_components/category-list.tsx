import { Pencil, Trash2 } from 'lucide-react'

import { Button } from '@finiq/ui/components/button'
import { Card, CardContent } from '@finiq/ui/components/card'
import { Separator } from '@finiq/ui/components/separator'
import { Skeleton } from '@finiq/ui/components/skeleton'
import { Category } from '@/api/__generated__/models'

export function CategoryList({
  title,
  categories,
  isLoading,
  onEdit,
  onDelete,
}: {
  title: string
  categories: Category[]
  isLoading: boolean
  onEdit: (c: Category) => void
  onDelete: (c: Category) => void
}) {
  return (
    <div className="space-y-3">
      <h2 className="text-muted-foreground text-sm font-medium tracking-wide uppercase">
        {title}
      </h2>
      {isLoading ? (
        <Card>
          <CardContent className="p-0">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i}>
                <div className="flex items-center gap-3 px-5 py-4">
                  <Skeleton className="size-10 rounded-full" />
                  <Skeleton className="h-4 w-32" />
                  <div className="ml-auto flex items-center gap-3">
                    <Skeleton className="size-3 rounded-full" />
                    <Skeleton className="size-7 rounded" />
                    <Skeleton className="size-7 rounded" />
                  </div>
                </div>
                {i < 3 && <Separator />}
              </div>
            ))}
          </CardContent>
        </Card>
      ) : categories.length === 0 ? (
        <p className="text-muted-foreground text-sm">No categories yet.</p>
      ) : (
        <Card>
          <CardContent className="p-0">
            {categories.map((cat, index) => (
              <div key={cat.id}>
                <div className="flex items-center gap-3 px-5 py-4">
                  <div
                    className="flex size-10 shrink-0 items-center justify-center rounded-full text-lg"
                    style={{
                      backgroundColor: `${cat.color}25`,
                      border: `1.5px solid ${cat.color}40`,
                    }}
                  >
                    {cat.emoji}
                  </div>

                  <p className="flex-1 truncate font-medium">{cat.name}</p>

                  <div className="flex items-center gap-3">
                    <div
                      className="size-3 rounded-full"
                      style={{ backgroundColor: cat.color }}
                    />
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      className="text-muted-foreground hover:text-foreground"
                      onClick={() => onEdit(cat)}
                    >
                      <Pencil className="size-3.5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      className="text-muted-foreground hover:text-destructive"
                      onClick={() => onDelete(cat)}
                    >
                      <Trash2 className="size-3.5" />
                    </Button>
                  </div>
                </div>
                {index < categories.length - 1 && <Separator />}
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
