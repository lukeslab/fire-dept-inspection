import { Image } from 'lucide-react';

import { Button } from "@/components/ui/button"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"

export function EmptyOutline() {
  return (
    <Empty className="border border-dashed">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <Image 
            strokeWidth="0.5"
          />
        </EmptyMedia>
        
      </EmptyHeader>
      <EmptyContent>
        <Button variant="outline" size="sm">
          Upload Photo
        </Button>
        <span> JPG, PNG up to 5MB</span>
      </EmptyContent>
    </Empty>
  )
}
