import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import Latex from "react-latex-next";

export default function DiagonalDominanteCard() {
  return (
    <div>
        <Card className="w-full max-w-2xl mx-auto border border-border bg-muted/40">
        <CardHeader>
            <CardTitle className="text-xl">¿Qué es una matriz diagonalmente dominante?</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
            <p className="text-sm leading-relaxed">
            Una matriz es <strong>diagonalmente dominante</strong> si, en cada fila,
            el valor absoluto del elemento en la diagonal principal es mayor o igual
            que la suma de los valores absolutos de los demás elementos de esa fila.
            </p>

            <Separator />

            <div className="text-center">
            <Latex>{String.raw`$$
            A =
            \begin{bmatrix}
            4 & -1 & 0 \\
            -2 & 6 & 1 \\
            0 & -1 & 5
            \end{bmatrix}
            $$`}</Latex>
            </div>

            <p className="text-sm">
            Veamos la primera fila:{" "}
            <Latex>{String.raw`$|4| > |-1| + |0| \;\;\; \Rightarrow \;\; 4 > 1$`}</Latex>.  
            Lo mismo pasa en las demás filas, por eso esta matriz es
            <strong> diagonalmente dominante</strong>.
            </p>

            <p className="text-sm italic text-muted-foreground">
            Esto es importante porque el método de Gauss-Seidel (y Jacobi) tiene
            más chances de converger cuando la matriz cumple esta propiedad.
            </p>
        </CardContent>
        </Card>
        <Separator className="my-6" />
    </div>
  );
}
