export const basename = "/gauss-seidel";


export const LATEX_GAUSS_SEIDEL = String.raw`\LARGE
x_i^{(k)} = \frac{1}{a_{ii}} \left[
b_i - \sum_{j=1}^{i-1} a_{ij} x_j^{(k)} - \sum_{j=i+1}^{n} a_{ij} x_j^{(k-1)}
\right] \qquad \forall i = 1:n \quad \forall k = 1:n
`;
export const LATEX_DIAGONALLY_DOMINANT = String.raw`\large
\left| a_{ii} \right| \geq \sum_{\substack{j=1 \\ j \neq i}}^{n} \left| a_{ij} \right|
`;

export const MATRIX_4x4: string[][] = [
    ["-25", "2", "3", "4"],
    ["4", "-15", "7", "-3"],
    ["9", "10", "-34", "12"],
    ["13", "14", "15", "-54"]
];

export const MATRIX_4x1: string[] = [
    "-100",
    "200",
    "-27",
    "34"
]