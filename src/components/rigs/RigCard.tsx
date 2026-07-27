import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import type { Rig } from "@/models/Rig"

export function RigCard({ name }: Rig) {

    return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>{name}</CardTitle>
        <CardDescription>
          Manage rig {name}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Button>Edit</Button>
        <Button variant="destructive">Remove</Button>
      </CardContent>
      <CardFooter className="flex-col gap-2">
    
      </CardFooter>
    </Card>
  )
}
