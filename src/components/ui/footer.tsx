import { Github, Linkedin, Mail } from "lucide-react"
import Link from "next/link"

interface FooterProps {
  name: string
  email: string
  github: string
  linkedin: string
}

export default function Footer({ name, email, github, linkedin }: FooterProps) {
  return (
    <footer className="bg-muted py-6 border-t">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-center md:text-left">
            <p className="font-medium">{name}</p>
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} - Visualización de Estructuras de Datos
            </p>
          </div>

          <div className="flex items-center gap-4">
            <Link
              href={`mailto:${email}`}
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <Mail className="h-4 w-4" />
              <span className="hidden md:inline">{email}</span>
            </Link>

            <Link
              href={`https://github.com${github}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <Github className="h-4 w-4" />
              <span className="hidden md:inline">{github}</span>
            </Link>

            <Link
              href={linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <Linkedin className="h-4 w-4" />
              <span className="hidden md:inline">LinkedIn</span>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

