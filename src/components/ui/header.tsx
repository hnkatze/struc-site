import { Avatar, AvatarFallback } from "@/components/ui/avatar"

interface HeaderProps {
  name: string
  accountNumber: string
  className: string
  section: string
}
import perfil from '@/assets/perfil.jpeg'
import Image from "next/image"

export default function Header({ name, accountNumber, className, section }: HeaderProps) {
  // Obtener las iniciales del nombre para el avatar fallback
  const initials = name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .toUpperCase()
    .substring(0, 2)

  return (
    <header className="bg-primary text-primary-foreground shadow-md">
      <div className="container mx-auto py-4 px-4 flex flex-col md:flex-row justify-between items-center">
        <div className="flex items-center gap-4 mb-4 md:mb-0">
          <Avatar className="h-12 w-12 border-2 border-primary-foreground">
            <Image src={perfil} alt={name} />
            <AvatarFallback className="bg-secondary text-secondary-foreground">{initials}</AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-xl font-bold">{name}</h1>
            <p className="text-sm opacity-90">Cuenta: {accountNumber}</p>
          </div>
        </div>
        <div className="text-right">
          <h2 className="text-lg font-semibold">{className}</h2>
          <p className="text-sm opacity-90">Sección: {section}</p>
        </div>
      </div>
    </header>
  )
}

