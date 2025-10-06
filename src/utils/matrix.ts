import { matrix, multiply, inv, add, subtract, abs } from "mathjs";

export function parseFraction(input: string): number {
    const trimmed = input.trim();
    if (trimmed.includes("/")) {
        const [numerator, denominator] = trimmed.split("/").map(Number);
        if (!isNaN(numerator) && !isNaN(denominator) && denominator !== 0) {
            return numerator / denominator;
        }
        return NaN;
    }
    return Number(trimmed);
}


// Convierte array JS a matriz mathjs
export const toMatrix = (arr: number[][]) => matrix(arr);

// ✅ Multiplicación de matrices
export const multiplyMatrices = (A: number[][], B: number[][]) =>
    multiply(matrix(A), matrix(B)).toArray() as number[][];

// ✅ Inversa de matriz
export const inverseMatrix = (A: number[][]) => inv(matrix(A)).toArray() as number[][];

// ✅ Suma de matrices
export const addMatrices = (A: number[][], B: number[][]) =>
    add(matrix(A), matrix(B)).toArray() as number[][];

// ✅ Resta de matrices
export const subtractMatrices = (A: number[][], B: number[][]) =>
    subtract(matrix(A), matrix(B)).toArray() as number[][];

// ✅ Verificar si es diagonalmente dominante
export const isDiagonallyDominant = (A: number[][]): boolean => {
    for (let i = 0; i < A.length; i++) {
        const diag = abs(A[i][i]);
        const rowSum = A[i].reduce((sum, val, j) => sum + (j !== i ? abs(val) : 0), 0);
        if (diag <= rowSum) return false;
    }
    return true;
};

// ✅ Matriz triangular inferior (diagonal nula)
export const lowerTriangularZeroDiagonal = (A: number[][]): number[][] => {
    const n = A.length;
    const L = Array.from({ length: n }, () => Array(n).fill(0));
    for (let i = 0; i < n; i++) {
        for (let j = 0; j < i; j++) {
            L[i][j] = A[i][j];
        }
    }
    return L;
};

// ✅ Premultiplicar (M * A)
export const premultiply = (M: number[][], A: number[][]): number[][] =>
    multiply(matrix(M), matrix(A)).toArray() as number[][];

// ✅ Método de Gauss-Seidel
export const gaussSeidel = (
    A: number[][],
    b: number[],
    tol = 1e-6,
    errorType: "absolute" | "relative" = "absolute",
    maxIter = 100,
    x0?: number[]
): { solution: number[]; steps: number[][]; iterations: number } => {
    const n = A.length;
    if (b.length !== n) {
        throw new Error("Dimensiones incompatibles entre A y b");
    }

    // Inicialización de x
    let x = x0 ? [...x0] : Array(n).fill(0);
    const steps: number[][] = [];

    for (let iter = 0; iter < maxIter; iter++) {
        const xNew = [...x];

        for (let i = 0; i < n; i++) {
            if (A[i][i] === 0) {
                throw new Error(`El elemento diagonal A[${i}][${i}] no puede ser 0`);
            }

            let sum = 0;
            for (let j = 0; j < n; j++) {
                if (j !== i) {
                    sum += A[i][j] * (j < i ? xNew[j] : x[j]);
                }
            }
            xNew[i] = (b[i] - sum) / A[i][i];
        }

        steps.push([...xNew]);

        // Calcular error
        let error: number;
        if (errorType === "absolute") {
            error = Math.max(...xNew.map((xi, k) => Math.abs(xi - x[k])));
        } else {
            error = Math.max(...xNew.map((xi, k) =>
                Math.abs(xi - x[k]) / Math.max(1, Math.abs(xi))
            ));
        }

        if (error < tol) {
            return { solution: xNew, steps, iterations: iter + 1 };
        }

        x = xNew;
    }

    return { solution: x, steps, iterations: maxIter };
};
