import { Card, CardContent } from "@/components/ui/card";
import Latex from "react-latex-next";

export default function GaussSeidelFormulaCard() {
  return (
    <Card className="w-full max-w-3xl mx-auto border border-border bg-muted/40">
      <CardContent className="space-y-4">
        

        <p className="text-sm leading-relaxed">
          Esta fórmula indica cómo calcular el valor de cada incógnita{" "}
          <Latex>{`$x_i$`}</Latex> en la <strong>iteración</strong> número{" "}
          <Latex>{`$k$`}</Latex>.  
        </p>

        <ul className="list-disc list-inside text-sm space-y-1">
          <li>
            El término <Latex>{`$x_j^{(k)}$`}</Latex> significa que se usa el valor
            actualizado de la misma iteración (ya calculado en esta vuelta).
          </li>
          <li>
            El término <Latex>{`$x_j^{(k-1)}$`}</Latex> significa que se usa el valor
            de la iteración anterior porque aún no se recalculó en la actual.
          </li>
          <li>
            En cada paso, se va reemplazando incógnita por incógnita hasta recorrer
            toda la fila, y luego se repite el proceso hasta que el error sea pequeño.
          </li>
        </ul>

        <p className="text-sm italic text-muted-foreground">
          En otras palabras, esta fórmula muestra cómo se van corrigiendo las
          soluciones paso a paso, usando siempre los valores más recientes
          disponibles.
        </p>
      </CardContent>
    </Card>
  );
}
