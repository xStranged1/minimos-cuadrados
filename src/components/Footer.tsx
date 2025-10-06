import { Github, ExternalLink } from "lucide-react";

export function Footer() {
    return (
        <footer className="border-t border-border mt-auto py-6">
            <div className="container mx-auto px-4">
                <div className="flex flex-col items-center gap-4 text-sm text-muted-foreground">
                    <a
                        href="https://github.com/xStranged1/minimos-cuadrados"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-foreground transition-colors flex flex-row items-center gap-2"
                    >
                        <Github className="w-4 h-4" />
                        <div>Repositorio</div>
                    </a>

                    <p>Grupo 10: Federico Valle, Gonzalo Perez, Lucio Borda</p>

                    <a
                        href="https://enaltecs.frlp.utn.edu.ar/AnalisisNumerico/index.html"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 hover:text-foreground transition-colors"
                    >
                        Análisis Numérico
                        <ExternalLink className="w-3 h-3" />
                    </a>
                </div>
            </div>
        </footer>
    );
}