export const regressionUtils = {
    calcularR2: (datos, prediccionFn) => {
        const n = datos.length;
        const yMedia = datos.reduce((sum, p) => sum + p.distancia, 0) / n;
        let ssTotal = 0, ssRes = 0;

        datos.forEach(punto => {
            const yPred = prediccionFn(punto.velocidad);
            ssTotal += Math.pow(punto.distancia - yMedia, 2);
            ssRes += Math.pow(punto.distancia - yPred, 2);
        });

        return 1 - (ssRes / ssTotal);
    },

    calcularR2Ajustado: (r2, n, p) => {
        // R²ajust = 1 - [SSE/(n-p)] / [SST/(n-1)]
        // Que es equivalente a: R²ajust = 1 - [(1-R²)(n-1)/(n-p)]
        if (n <= p) return null;
        return 1 - ((1 - r2) * (n - 1)) / (n - p);
    },

    resolverSistema3x3: (matrix) => {
        const m = matrix.map(row => [...row]);

        for (let i = 0; i < 3; i++) {
            let maxRow = i;
            for (let k = i + 1; k < 3; k++) {
                if (Math.abs(m[k][i]) > Math.abs(m[maxRow][i])) {
                    maxRow = k;
                }
            }
            [m[i], m[maxRow]] = [m[maxRow], m[i]];

            if (Math.abs(m[i][i]) < 1e-10) return null;

            for (let k = i + 1; k < 3; k++) {
                const factor = m[k][i] / m[i][i];
                for (let j = i; j < 4; j++) {
                    m[k][j] -= factor * m[i][j];
                }
            }
        }

        const solution = new Array(3);
        for (let i = 2; i >= 0; i--) {
            solution[i] = m[i][3];
            for (let j = i + 1; j < 3; j++) {
                solution[i] -= m[i][j] * solution[j];
            }
            solution[i] /= m[i][i];
        }

        return solution;
    },

    calcularRegresionLineal: (datos) => {
        const n = datos.length;
        let sumX = 0, sumY = 0, sumXY = 0, sumX2 = 0;

        datos.forEach(p => {
            sumX += p.velocidad;
            sumY += p.distancia;
            sumXY += p.velocidad * p.distancia;
            sumX2 += p.velocidad * p.velocidad;
        });

        const m = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
        const b = (sumY - m * sumX) / n;
        const r2 = regressionUtils.calcularR2(datos, x => m * x + b);
        const r2Ajustado = regressionUtils.calcularR2Ajustado(r2, n, 2); // p=2 (m, b)

        return {
            r2,
            r2Ajustado,
            ecuacion: `y = ${m.toFixed(4)}x + ${b.toFixed(4)}`,
            params: { m, b }
        };
    },

    calcularRegresionCuadratica: (datos) => {
        const n = datos.length;
        if (n < 3) return null;

        let sumX = 0, sumY = 0, sumX2 = 0, sumX3 = 0, sumX4 = 0;
        let sumXY = 0, sumX2Y = 0;

        datos.forEach(p => {
            const x = p.velocidad;
            const y = p.distancia;
            sumX += x;
            sumY += y;
            sumX2 += x * x;
            sumX3 += x * x * x;
            sumX4 += x * x * x * x;
            sumXY += x * y;
            sumX2Y += x * x * y;
        });

        const matrix = [
            [n, sumX, sumX2, sumY],
            [sumX, sumX2, sumX3, sumXY],
            [sumX2, sumX3, sumX4, sumX2Y]
        ];

        const solution = regressionUtils.resolverSistema3x3(matrix);
        if (!solution) return null;

        const [c, b, a] = solution;
        const r2 = regressionUtils.calcularR2(datos, x => a * x * x + b * x + c);
        const r2Ajustado = regressionUtils.calcularR2Ajustado(r2, n, 3); // p=3 (a, b, c)

        return {
            r2,
            r2Ajustado,
            ecuacion: `y = ${a.toFixed(4)}x² + ${b.toFixed(4)}x + ${c.toFixed(4)}`,
            params: { a, b, c }
        };
    },

    calcularRegresionExponencial: (datos) => {
        const datosTransformados = datos.filter(p => p.distancia > 0).map(p => ({
            x: p.velocidad,
            y: Math.log(p.distancia)
        }));

        if (datosTransformados.length < 2) return null;

        const n = datosTransformados.length;
        let sumX = 0, sumY = 0, sumXY = 0, sumX2 = 0;

        datosTransformados.forEach(p => {
            sumX += p.x;
            sumY += p.y;
            sumXY += p.x * p.y;
            sumX2 += p.x * p.x;
        });

        const b = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
        const lnA = (sumY - b * sumX) / n;
        const a = Math.exp(lnA);
        const r2 = regressionUtils.calcularR2(datos, x => a * Math.exp(b * x));
        const r2Ajustado = regressionUtils.calcularR2Ajustado(r2, datos.length, 2); // p=2 (a, b)

        return {
            r2,
            r2Ajustado,
            ecuacion: `y = ${a.toFixed(4)} * e^(${b.toFixed(4)}x)`,
            params: { a, b }
        };
    },

    calcularRegresionPotencial: (datos) => {
        const datosTransformados = datos.filter(p => p.velocidad > 0 && p.distancia > 0).map(p => ({
            x: Math.log(p.velocidad),
            y: Math.log(p.distancia)
        }));

        if (datosTransformados.length < 2) return null;

        const n = datosTransformados.length;
        let sumX = 0, sumY = 0, sumXY = 0, sumX2 = 0;

        datosTransformados.forEach(p => {
            sumX += p.x;
            sumY += p.y;
            sumXY += p.x * p.y;
            sumX2 += p.x * p.x;
        });

        const b = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
        const lnA = (sumY - b * sumX) / n;
        const a = Math.exp(lnA);
        const r2 = regressionUtils.calcularR2(datos, x => a * Math.pow(x, b));
        const r2Ajustado = regressionUtils.calcularR2Ajustado(r2, datos.length, 2); // p=2 (a, b)

        return {
            r2,
            r2Ajustado,
            ecuacion: `y = ${a.toFixed(4)} * x^${b.toFixed(4)}`,
            params: { a, b }
        };
    },

    calcularTodasLasRegresiones: (datos) => {
        if (datos.length === 0) return null;

        return {
            modelos: {
                lineal: regressionUtils.calcularRegresionLineal(datos),
                cuadratica: regressionUtils.calcularRegresionCuadratica(datos),
                exponencial: regressionUtils.calcularRegresionExponencial(datos),
                potencial: regressionUtils.calcularRegresionPotencial(datos)
            }
        };
    }
};