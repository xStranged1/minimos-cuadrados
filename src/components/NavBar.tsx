import { ModeToggle } from "./mode-toggle";

export function Navbar() {

    return (
        <div className="pt-12 text-foreground bg-background">
            <div>
                <div className="flex flex-row justify-center relative">
                    <h1 className="text-3xl font-semibold">Mínimos cuadrados</h1>
                    <div className="absolute top-0 right-12">
                        <ModeToggle />
                    </div>
                </div>
                <div className="flex flex-row justify-center">
                    <h2 className="font-medium text-muted-foreground">
                        Método de regresión lineal para ajuste de datos
                    </h2>
                </div>
            </div>

        </div>
    );
}
