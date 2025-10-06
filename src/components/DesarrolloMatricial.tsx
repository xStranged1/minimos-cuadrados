import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Latex from "react-latex-next";
import { Separator } from "@/components/ui/separator";
export default function DesarrolloMatricial() {

  return (

    <div className="px-16 py-6 bg-background min-h-screen">
      <CardTitle className="text-2xl text-center mb-4">Desarrollo matricial</CardTitle>

      <Card className="border border-border my-6">
        <CardContent className="space-y-4">
          <p className="font-medium">
            Sea el sistema de ecuaciones:
          </p>
          <Latex>{String.raw`
\[
A \cdot \vec{x} = \vec{b} \quad (1)
\]
`}</Latex>

          <p>
            Se descompone la matriz <Latex>{String.raw`A`}</Latex> de los
            coeficientes en:
          </p>
          <Latex>{String.raw`
\[
A = (D - E) - F \quad (2)
\]
`}</Latex>
        </CardContent>
      </Card>

      <Card className="w-full mx-auto border border-border">
        <CardContent className="space-y-3 text-sm leading-relaxed">
          <div className="flex items-center justify-center">
            <Latex>
              {String.raw`
                \[
                D = 
                \begin{bmatrix}
                a_{11} & 0 & \cdots & 0 \\
                0 & a_{22} & \cdots & 0 \\
                \vdots & \vdots & \ddots & \vdots \\
                0 & 0 & \cdots & a_{nn}
                \end{bmatrix}
                \quad
                E = -
                \begin{bmatrix}
                0 & 0 & \cdots & 0 & 0 \\
                a_{21} & 0 & \cdots & 0 & 0 \\
                \vdots & \vdots & \ddots & \vdots & \vdots \\
                a_{n1} & a_{n2} & \cdots & a_{n,n-1} & 0
                \end{bmatrix}
                \quad
                F = -
                \begin{bmatrix}
                0 & a_{1,2} & \cdots & a_{1,n-1} & a_{1,n} \\
                0 & 0 & \cdots & a_{2,n-1} & a_{2,n} \\
                \vdots & \vdots & \ddots & \vdots & \vdots \\
                0 & 0 & \cdots & 0 & a_{n-1,n} \\
                0 & 0 & \cdots & 0 & 0
                \end{bmatrix}
                \]

                \[
                \text{Matriz Diagonal} \quad \text{Matriz Triangular Inferior con elementos de la diagonal nulos} \quad \text{Matriz Triangular Superior con elementos de la diagonal nulos}
                \]

                \[
                \text{Reemplazando \textbf{2} en \textbf{1}:}
                \]

                \[
                \big[(D - E) - F\big] \cdot \vec{x} = \vec{b}
                \]

                \[
                (D - E)\cdot \vec{x} - F \cdot \vec{x} = \vec{b}
                \]

                \[
                (D - E)\cdot \vec{x} = F \cdot \vec{x} + \vec{b}
                \]
                  `}
            </Latex>
          </div>
        </CardContent>
      </Card>



      <div className="space-y-6 mt-6">
        {/* Paso: Premultiplicando */}
        <Card className="border border-border max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>Premultiplicando</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Latex>{String.raw`
              \[
              \underbrace{(D - E)^{-1} \cdot (D - E)}_I \cdot \vec{x} 
              = (D - E)^{-1} \cdot F \cdot \vec{x} + (D - E)^{-1} \cdot \vec{b}
              \quad (4)
              \]
              `}
            </Latex>
          </CardContent>
        </Card>

        {/* Paso: Despejando F */}
        <Card className="border border-border max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>Despejando F</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Despejando <Latex>{String.raw`F`}</Latex> de (2):</p>
            <Latex>{String.raw`\[
F = (D - E) - A \quad (5)
\]`}</Latex>
          </CardContent>
        </Card>

        {/* Paso: Reemplazando */}
        <Card className="border border-border max-w-2xl mx-auto">
          <CardContent className="space-y-4">
            <p>
              Reemplazando (5) en (4) se obtiene:
            </p>
            <Latex>{String.raw`
\[
\vec{x} = (D - E)^{-1} \cdot [(D - E) - A] \cdot \vec{x} + (D - E)^{-1} \cdot \vec{b}
\]
`}</Latex>

            <Latex>{String.raw`
\[
\vec{x} = \big[I - (D - E)^{-1} \cdot A\big] \cdot \vec{x} + (D - E)^{-1} \cdot \vec{b}
\]
`}</Latex>
          </CardContent>
        </Card>

        {/* Definición de Ts y c */}
        <Card className="border border-border max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>Matriz de Gauss-Seidel</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              Donde:
            </p>
            <Latex>{String.raw`
\[
T_s = \big[I - (D - E)^{-1} \cdot A\big], 
\quad 
\vec{c} = (D - E)^{-1} \cdot \vec{b}
\]
`}</Latex>
          </CardContent>
        </Card>

        {/* Esquema Iterativo */}
        <Card className="border border-border max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>Esquema Iterativo de Gauss-Seidel</CardTitle>
          </CardHeader>
          <CardContent>
            <Latex>{String.raw`
\[
\vec{x}^{(k+1)} = T_s \cdot \vec{x}^{(k)} + \vec{c}
\]
`}</Latex>
          </CardContent>
        </Card>

        <Card className="border border-border">
          <CardContent className="space-y-4">
            <Latex>{String.raw`
\[
D - E =
\underbrace{
\begin{bmatrix}
a_{11} & 0 & \cdots & 0 \\
0 & a_{22} & \cdots & 0 \\
\vdots & \vdots & \ddots & \vdots \\
0 & 0 & \cdots & a_{nn}
\end{bmatrix}
}_{D}
+
\underbrace{
\begin{bmatrix}
0 & 0 & \cdots & 0 \\
a_{21} & 0 & \cdots & 0 \\
\vdots & \vdots & \ddots & \vdots \\
a_{n1} & a_{n2} & \cdots & 0
\end{bmatrix}
}_{-E}
\]
`}</Latex>

            <p>
              Entonces <Latex>{String.raw`(D - E)`}</Latex> es una matriz
              triangular inferior. Por lo tanto, es más fácil de invertir que{" "}
              <Latex>{String.raw`A`}</Latex>.
            </p>
          </CardContent>
        </Card>

        <Card className="border border-border mt-6">
          <CardHeader>
            <CardTitle>Preguntas para Reflexionar</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">


            <div className="space-y-2">
              <h3 className="font-semibold">Diferencias con Jacobi</h3>
              <p className="text-muted-foreground">¿Cuál converge más rápido?</p>
            </div>

            <Separator />

            <div className="space-y-2">
              <h3 className="font-semibold">¿Cuándo usar Gauss-Seidel?</h3>
              <p className="text-muted-foreground">¿En qué tipo de sistemas es más eficiente este método? ¿Qué condiciones debe cumplir la matriz?</p>
            </div>

            <Separator />

            <div className="space-y-2">
              <h3 className="font-semibold">Criterios de parada</h3>
              <p className="text-muted-foreground">¿Cuándo es más conveniente usar error absoluto vs. error relativo? ¿Cómo afecta la tolerancia a la solución?</p>
            </div>
          </CardContent>
        </Card>
      </div>

    </div>
  );
}
