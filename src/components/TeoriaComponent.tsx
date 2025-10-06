import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import Latex from "react-latex-next";

// Componente FlipCard corregido
function FlipCard({
  title,
  theory,
  example,
}: {
  title: string;
  theory: string[];
  example: string[];
}) {
  const [flipped, setFlipped] = useState(false);

  return (
    <Card
      className={`w-full max-w-3xl mx-auto border border-border cursor-pointer transition-transform duration-700 transform ${flipped ? "rotate-y-180" : "rotate-y-0"
        } shadow-md hover:shadow-xl my-6`}
      onClick={() => setFlipped(!flipped)}
    >
      <CardHeader>
        <div className={`${flipped ? "rotate-y-180-content" : ""}`}>
          <CardTitle className="text-lg">{title}</CardTitle>
        </div>
      </CardHeader>

      <CardContent className="space-y-4 text-center">
        <div className={`${flipped ? "rotate-y-180-content" : ""}`}>
          {(flipped ? example : theory).map((latex, idx) => (
            <Latex key={idx}>{latex}</Latex>
          ))}
          <p className="text-xs text-muted-foreground">
            {flipped
              ? "Ejemplo numérico (haz click para volver a la fórmula general)."
              : "Fórmula general (haz click para ver un ejemplo numérico)."}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

export default function GaussSeidelTheory() {
  return (
    <div className="px-4 py-6 bg-background min-h-screen">
      {/* Introducción */}
      <Card className="w-full max-w-3xl mx-auto border border-border shadow-md">
        <CardHeader>
          <CardTitle className="text-2xl">Método de Gauss - Seidel</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm leading-relaxed">
          <p>
            El método de Gauss-Seidel es muy semejante al método de Jacobi. En
            Jacobi se usan los valores de la iteración anterior, mientras que en
            Gauss-Seidel se combinan valores recién calculados en la misma
            iteración con valores anteriores.
          </p>
          <p>
            Si el sistema es{" "}
            <span className="italic font-semibold">diagonalmente dominante</span>, se garantiza la convergencia y el método es más rápido que Jacobi.
          </p>
        </CardContent>
      </Card>

      <Separator className="my-6" />

      {/* Sistema 3x3 */}
      <FlipCard
        title="Ejemplo: Sistema 3x3"
        theory={[
          String.raw`$$
          \begin{cases}
          a_{11}x_1 + a_{12}x_2 + a_{13}x_3 = b_1 \\
          a_{21}x_1 + a_{22}x_2 + a_{23}x_3 = b_2 \\
          a_{31}x_1 + a_{32}x_2 + a_{33}x_3 = b_3
          \end{cases}
          $$`,
        ]}
        example={[
          String.raw`$$
          \begin{cases}
          4x_1 + x_2 + x_3 = 7 \\
          2x_1 + 5x_2 + x_3 = -8 \\
          x_1 + x_2 + 3x_3 = 6
          \end{cases}
          $$`,
        ]}
      />

      {/* Despejes */}
      <FlipCard
        title="Despejes"
        theory={[
          String.raw`$$x_1 = \frac{1}{a_{11}} \Big( b_1 - (a_{12}x_2 + a_{13}x_3) \Big)$$`,
          String.raw`$$x_2 = \frac{1}{a_{22}} \Big( b_2 - (a_{21}x_1 + a_{23}x_3) \Big)$$`,
          String.raw`$$x_3 = \frac{1}{a_{33}} \Big( b_3 - (a_{31}x_1 + a_{32}x_2) \Big)$$`,
        ]}
        example={[
          String.raw`$$x_1 = \frac{1}{4} (7 - (1\cdot x_2 + 1\cdot x_3))$$`,
          String.raw`$$x_2 = \frac{1}{5} (-8 - (2\cdot x_1 + 1\cdot x_3))$$`,
          String.raw`$$x_3 = \frac{1}{3} (6 - (1\cdot x_1 + 1\cdot x_2))$$`,
        ]}
      />

      {/* Iteraciones */}
      <FlipCard
        title="Esquema Iterativo"
        theory={[
          String.raw`$$x_1^{(k)} = \frac{1}{a_{11}} \Big( b_1 - (a_{12}x_2^{(k-1)} + a_{13}x_3^{(k-1)}) \Big)$$`,
          String.raw`$$x_2^{(k)} = \frac{1}{a_{22}} \Big( b_2 - (a_{21}x_1^{(k)} + a_{23}x_3^{(k-1)}) \Big)$$`,
          String.raw`$$x_3^{(k)} = \frac{1}{a_{33}} \Big( b_3 - (a_{31}x_1^{(k)} + a_{32}x_2^{(k)}) \Big)$$`,
        ]}
        example={[
          String.raw`$$x_1^{(k)} = \frac{1}{4} (7 - (1\cdot x_2^{(k-1)} + 1\cdot x_3^{(k-1)}))$$`,
          String.raw`$$x_2^{(k)} = \frac{1}{5} (-8 - (2\cdot x_1^{(k)} + 1\cdot x_3^{(k-1)}))$$`,
          String.raw`$$x_3^{(k)} = \frac{1}{3} (6 - (1\cdot x_1^{(k)} + 1\cdot x_2^{(k)}))$$`,
        ]}
      />
      <Separator />
    </div>
  );
}
