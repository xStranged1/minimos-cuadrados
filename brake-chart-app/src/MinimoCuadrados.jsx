import React, { useState } from 'react';
import { ComposedChart, Line, ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import Papa from 'papaparse';

export default function MinimoCuadradosApp() {
    const [dataDry, setDataDry] = useState([]);
    const [dataWet, setDataWet] = useState([]);
    const [fileName, setFileName] = useState('');
    const [regressionDry, setRegressionDry] = useState(null);
    const [regressionWet, setRegressionWet] = useState(null);
    const [modeloSeleccionadoDry, setModeloSeleccionadoDry] = useState('lineal');
    const [modeloSeleccionadoWet, setModeloSeleccionadoWet] = useState('lineal');
    const [vistaGraficaDry, setVistaGraficaDry] = useState('ambos');
    const [vistaGraficaWet, setVistaGraficaWet] = useState('ambos');

    const calcularR2 = (datos, prediccionFn) => {
        const n = datos.length;
        const yMedia = datos.reduce((sum, p) => sum + p.distancia, 0) / n;
        
        let ssTotal = 0, ssRes = 0;
        datos.forEach(punto => {
            const yPred = prediccionFn(punto.velocidad);
            ssTotal += Math.pow(punto.distancia - yMedia, 2);
            ssRes += Math.pow(punto.distancia - yPred, 2);
        });

        return 1 - (ssRes / ssTotal);
    };

    const resolverSistema3x3 = (matrix) => {
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
    };

    const calcularRegresionCuadratica = (datos) => {
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

        const solution = resolverSistema3x3(matrix);
        if (!solution) return null;

        const [c, b, a] = solution;
        const r2 = calcularR2(datos, x => a * x * x + b * x + c);

        return {
            r2,
            ecuacion: `y = ${a.toFixed(4)}x² + ${b.toFixed(4)}x + ${c.toFixed(4)}`,
            params: { a, b, c }
        };
    };

    const calcularRegresionExponencial = (datos) => {
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

        const r2 = calcularR2(datos, x => a * Math.exp(b * x));

        return {
            r2,
            ecuacion: `y = ${a.toFixed(4)} * e^(${b.toFixed(4)}x)`,
            params: { a, b }
        };
    };

    const calcularRegresionPotencial = (datos) => {
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

        const r2 = calcularR2(datos, x => a * Math.pow(x, b));

        return {
            r2,
            ecuacion: `y = ${a.toFixed(4)} * x^${b.toFixed(4)}`,
            params: { a, b }
        };
    };

    const calcularRegresion = (datos) => {
        const n = datos.length;
        if (n === 0) return null;
        
        let sumX = 0, sumY = 0, sumXY = 0, sumX2 = 0;

        datos.forEach(punto => {
            sumX += punto.velocidad;
            sumY += punto.distancia;
            sumXY += punto.velocidad * punto.distancia;
            sumX2 += punto.velocidad * punto.velocidad;
        });

        const m = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
        const b = (sumY - m * sumX) / n;

        const r2 = calcularR2(datos, x => m * x + b);

        const cuadratica = calcularRegresionCuadratica(datos);
        const exponencial = calcularRegresionExponencial(datos);
        const potencial = calcularRegresionPotencial(datos);

        return { 
            modelos: {
                lineal: { r2, ecuacion: `y = ${m.toFixed(4)}x + ${b.toFixed(4)}`, params: { m, b } },
                cuadratica,
                exponencial,
                potencial
            }
        };
    };

    const handleFileUpload = (event) => {
        const file = event.target.files?.[0];
        if (!file) return;

        setFileName(file.name);

        Papa.parse(file, {
            header: true,
            dynamicTyping: true,
            skipEmptyLines: true,
            complete: (results) => {
                const dry = [];
                const wet = [];

                results.data.forEach((row) => {
                    const velocidadKey = Object.keys(row).find(key => 
                        key.toLowerCase().includes('velocidad') || key.toLowerCase().includes('speed')
                    );
                    const distanciaKey = Object.keys(row).find(key => 
                        key.toLowerCase().includes('distancia') || key.toLowerCase().includes('frenado') || key.toLowerCase().includes('distance')
                    );
                    const condicionKey = Object.keys(row).find(key =>
                        key.toLowerCase().includes('condicion') || key.toLowerCase().includes('condition') || 
                        key.toLowerCase().includes('estado') || key.toLowerCase().includes('surface')
                    );

                    if (velocidadKey && distanciaKey && condicionKey) {
                        const punto = {
                            velocidad: parseFloat(row[velocidadKey]),
                            distancia: parseFloat(row[distanciaKey]),
                            condicion: row[condicionKey]
                        };

                        if (!isNaN(punto.velocidad) && !isNaN(punto.distancia)) {
                            const condicionNormalizada = punto.condicion?.toString().toLowerCase().trim();
                            if (condicionNormalizada === 'dry' || condicionNormalizada === 'seco') {
                                dry.push(punto);
                            } else if (condicionNormalizada === 'wet' || condicionNormalizada === 'mojado') {
                                wet.push(punto);
                            }
                        }
                    }
                });

                setDataDry(dry);
                setDataWet(wet);

                if (dry.length > 0) {
                    const regDry = calcularRegresion(dry);
                    setRegressionDry(regDry);
                }
                if (wet.length > 0) {
                    const regWet = calcularRegresion(wet);
                    setRegressionWet(regWet);
                }
            },
            error: (error) => {
                alert('Error al cargar el archivo: ' + error.message);
            }
        });
    };

    const getCombinedChartData = (regression, data) => {
        if (!regression || data.length === 0) return [];

        const minX = Math.min(...data.map(d => d.velocidad));
        const maxX = Math.max(...data.map(d => d.velocidad));

        const combinedData = [];
        
        for (let x = minX; x <= maxX; x += (maxX - minX) / 100) {
            const punto = { velocidad: x };
            
            if (regression.modelos.lineal) {
                const m = regression.modelos.lineal.params.m ?? 0;
                const b = regression.modelos.lineal.params.b ?? 0;
                punto.lineal = m * x + b;
            }
            
            if (regression.modelos.cuadratica) {
                const a = regression.modelos.cuadratica.params.a ?? 0;
                const b = regression.modelos.cuadratica.params.b ?? 0;
                const c = regression.modelos.cuadratica.params.c ?? 0;
                punto.cuadratica = a * x * x + b * x + c;
            }
            
            if (regression.modelos.exponencial) {
                const a = regression.modelos.exponencial.params.a ?? 0;
                const b = regression.modelos.exponencial.params.b ?? 0;
                punto.exponencial = a * Math.exp(b * x);
            }
            
            if (regression.modelos.potencial) {
                const a = regression.modelos.potencial.params.a ?? 0;
                const b = regression.modelos.potencial.params.b ?? 0;
                punto.potencial = a * Math.pow(x, b);
            }
            
            combinedData.push(punto);
        }
        
        return combinedData;
    };

    const totalData = dataDry.length + dataWet.length;

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-7xl mx-auto space-y-6">
                <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500">
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">
                        Método de Mínimos Cuadrados
                    </h1>
                    <p className="text-gray-600">
                        Análisis de regresión: Velocidad vs Distancia de Frenado (DRY y WET)
                    </p>
                </div>

                <div className="bg-white rounded-lg shadow-md p-6">
                    <label className="block mb-4">
                        <span className="text-lg font-semibold text-gray-700 mb-2 block">
                            Cargar archivo CSV
                        </span>
                        <input
                            type="file"
                            accept=".csv"
                            onChange={handleFileUpload}
                            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
                        />
                    </label>
                    {fileName && (
                        <div className="mt-2 space-y-1">
                            <div className="text-sm text-gray-600">
                                <span className="font-medium">Archivo:</span> {fileName}
                            </div>
                            <div className="text-sm text-gray-600">
                                <span className="font-medium text-blue-600">DRY:</span> {dataDry.length} | 
                                <span className="font-medium text-green-600 ml-2">WET:</span> {dataWet.length}
                            </div>
                        </div>
                    )}
                </div>

                {(regressionDry || regressionWet) && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {regressionDry && (
                            <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg shadow-md p-6 border border-blue-200">
                                <h2 className="text-xl font-bold text-blue-900 mb-4">🌞 DRY</h2>
                                
                                <div className="mb-4">
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Modelo principal:
                                    </label>
                                    <select 
                                        value={modeloSeleccionadoDry}
                                        onChange={(e) => setModeloSeleccionadoDry(e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                                    >
                                        <option value="lineal">Lineal</option>
                                        <option value="cuadratica">Cuadrática</option>
                                        <option value="exponencial">Exponencial</option>
                                        <option value="potencial">Potencial</option>
                                    </select>
                                </div>

                                <div className="bg-white rounded-lg p-4 mb-4 shadow-sm">
                                    <p className="text-lg font-mono text-center text-blue-700 break-words">
                                        {regressionDry.modelos[modeloSeleccionadoDry]?.ecuacion || 'N/A'}
                                    </p>
                                </div>
                                
                                <div className="bg-white rounded-lg p-3 shadow-sm mb-3">
                                    <p className="text-xs text-gray-600 mb-1">R²</p>
                                    <p className="text-2xl font-bold text-blue-700">
                                        {(regressionDry.modelos[modeloSeleccionadoDry]?.r2 || 0).toFixed(6)}
                                    </p>
                                </div>

                                <div className="bg-white rounded-lg p-3 shadow-sm">
                                    <p className="text-xs font-semibold text-gray-700 mb-2">Comparación R²:</p>
                                    <div className="space-y-1 text-xs">
                                        {Object.entries(regressionDry.modelos).map(([tipo, datos]) => datos && (
                                            <div key={tipo} className={`flex justify-between ${tipo === modeloSeleccionadoDry ? 'font-bold text-blue-700' : 'text-gray-600'}`}>
                                                <span className="capitalize">{tipo}:</span>
                                                <span>{datos.r2.toFixed(6)}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {regressionWet && (
                            <div className="bg-gradient-to-r from-green-50 to-emerald-100 rounded-lg shadow-md p-6 border border-green-200">
                                <h2 className="text-xl font-bold text-green-900 mb-4">💧 WET</h2>
                                
                                <div className="mb-4">
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Modelo principal:
                                    </label>
                                    <select 
                                        value={modeloSeleccionadoWet}
                                        onChange={(e) => setModeloSeleccionadoWet(e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                                    >
                                        <option value="lineal">Lineal</option>
                                        <option value="cuadratica">Cuadrática</option>
                                        <option value="exponencial">Exponencial</option>
                                        <option value="potencial">Potencial</option>
                                    </select>
                                </div>

                                <div className="bg-white rounded-lg p-4 mb-4 shadow-sm">
                                    <p className="text-lg font-mono text-center text-green-700 break-words">
                                        {regressionWet.modelos[modeloSeleccionadoWet]?.ecuacion || 'N/A'}
                                    </p>
                                </div>
                                
                                <div className="bg-white rounded-lg p-3 shadow-sm mb-3">
                                    <p className="text-xs text-gray-600 mb-1">R²</p>
                                    <p className="text-2xl font-bold text-green-700">
                                        {(regressionWet.modelos[modeloSeleccionadoWet]?.r2 || 0).toFixed(6)}
                                    </p>
                                </div>

                                <div className="bg-white rounded-lg p-3 shadow-sm">
                                    <p className="text-xs font-semibold text-gray-700 mb-2">Comparación R²:</p>
                                    <div className="space-y-1 text-xs">
                                        {Object.entries(regressionWet.modelos).map(([tipo, datos]) => datos && (
                                            <div key={tipo} className={`flex justify-between ${tipo === modeloSeleccionadoWet ? 'font-bold text-green-700' : 'text-gray-600'}`}>
                                                <span className="capitalize">{tipo}:</span>
                                                <span>{datos.r2.toFixed(6)}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )}

{dataDry.length > 0 && regressionDry && (
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-2xl font-bold text-gray-800">
                                🌞 Gráficos DRY
                            </h2>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setVistaGraficaDry('puntos')}
                                    className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
                                        vistaGraficaDry === 'puntos'
                                            ? 'bg-blue-600 text-white'
                                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                    }`}
                                >
                                    Solo Puntos
                                </button>
                                <button
                                    onClick={() => setVistaGraficaDry('funciones')}
                                    className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
                                        vistaGraficaDry === 'funciones'
                                            ? 'bg-blue-600 text-white'
                                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                    }`}
                                >
                                    Solo Funciones
                                </button>
                                <button
                                    onClick={() => setVistaGraficaDry('ambos')}
                                    className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
                                        vistaGraficaDry === 'ambos'
                                            ? 'bg-blue-600 text-white'
                                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                    }`}
                                >
                                    Ambos
                                </button>
                            </div>
                        </div>

                        {(vistaGraficaDry === 'puntos' || vistaGraficaDry === 'ambos') && (
                            <div className="mb-6">
                                <h3 className="text-lg font-semibold text-gray-700 mb-3">Datos Observados</h3>
                                <ResponsiveContainer width="100%" height={400}>
                                    <ScatterChart margin={{ top: 20, right: 30, bottom: 60, left: 60 }}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                                        <XAxis
                                            dataKey="velocidad"
                                            type="number"
                                            name="Velocidad"
                                            unit=" km/h"
                                            label={{ value: 'Velocidad (km/h)', position: 'insideBottom', offset: -20 }}
                                        />
                                        <YAxis
                                            dataKey="distancia"
                                            type="number"
                                            name="Distancia"
                                            unit=" m"
                                            label={{ value: 'Distancia (m)', angle: -90, position: 'insideLeft', offset: -10 }}
                                        />
                                        <Tooltip />
                                        <Legend />
                                        <Scatter data={dataDry} fill="#3b82f6" name="Datos DRY" />
                                    </ScatterChart>
                                </ResponsiveContainer>
                            </div>
                        )}

                        {(vistaGraficaDry === 'funciones' || vistaGraficaDry === 'ambos') && (
                            <div>
                                <h3 className="text-lg font-semibold text-gray-700 mb-3">
                                    {vistaGraficaDry === 'ambos' ? 'Funciones de Regresión' : 'Todas las Funciones'}
                                </h3>
                                <ResponsiveContainer width="100%" height={500}>
                                    <ComposedChart data={getCombinedChartData(regressionDry, dataDry)} margin={{ top: 20, right: 30, bottom: 60, left: 60 }}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                                        <XAxis
                                            dataKey="velocidad"
                                            type="number"
                                            label={{ value: 'Velocidad (km/h)', position: 'insideBottom', offset: -20 }}
                                        />
                                        <YAxis
                                            type="number"
                                            label={{ value: 'Distancia (m)', angle: -90, position: 'insideLeft', offset: -10 }}
                                        />
                                        <Tooltip />
                                        <Legend />
                                        
                                        {regressionDry.modelos.lineal && (
                                            <Line
                                                type="monotone"
                                                dataKey="lineal"
                                                stroke="#ef4444"
                                                strokeWidth={modeloSeleccionadoDry === 'lineal' ? 3 : 2}
                                                strokeDasharray={modeloSeleccionadoDry === 'lineal' ? '0' : '5 5'}
                                                name={`Lineal (R²=${regressionDry.modelos.lineal.r2.toFixed(3)})`}
                                                dot={false}
                                            />
                                        )}
                                        {regressionDry.modelos.cuadratica && (
                                            <Line
                                                type="monotone"
                                                dataKey="cuadratica"
                                                stroke="#8b5cf6"
                                                strokeWidth={modeloSeleccionadoDry === 'cuadratica' ? 3 : 2}
                                                strokeDasharray={modeloSeleccionadoDry === 'cuadratica' ? '0' : '5 5'}
                                                name={`Cuadrática (R²=${regressionDry.modelos.cuadratica.r2.toFixed(3)})`}
                                                dot={false}
                                            />
                                        )}
                                        {regressionDry.modelos.exponencial && (
                                            <Line
                                                type="monotone"
                                                dataKey="exponencial"
                                                stroke="#f59e0b"
                                                strokeWidth={modeloSeleccionadoDry === 'exponencial' ? 3 : 2}
                                                strokeDasharray={modeloSeleccionadoDry === 'exponencial' ? '0' : '5 5'}
                                                name={`Exponencial (R²=${regressionDry.modelos.exponencial.r2.toFixed(3)})`}
                                                dot={false}
                                            />
                                        )}
                                        {regressionDry.modelos.potencial && (
                                            <Line
                                                type="monotone"
                                                dataKey="potencial"
                                                stroke="#10b981"
                                                strokeWidth={modeloSeleccionadoDry === 'potencial' ? 3 : 2}
                                                strokeDasharray={modeloSeleccionadoDry === 'potencial' ? '0' : '5 5'}
                                                name={`Potencial (R²=${regressionDry.modelos.potencial.r2.toFixed(3)})`}
                                                dot={false}
                                            />
                                        )}
                                        
                                        {vistaGraficaDry === 'ambos' && (
                                            <Scatter data={dataDry} fill="#3b82f6" name="Datos" />
                                        )}
                                    </ComposedChart>
                                </ResponsiveContainer>
                            </div>
                        )}

                        <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                            <p className="text-sm">
                                <span className="font-semibold">Modelo destacado:</span> {modeloSeleccionadoDry.charAt(0).toUpperCase() + modeloSeleccionadoDry.slice(1)} - 
                                <span className="font-mono ml-2">{regressionDry.modelos[modeloSeleccionadoDry]?.ecuacion}</span>
                            </p>
                            <p className="text-xs text-gray-600 mt-1">
                                💡 Línea gruesa = modelo seleccionado. Líneas punteadas = comparación.
                            </p>
                        </div>
                    </div>
                )}

                {dataWet.length > 0 && regressionWet && (
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-2xl font-bold text-gray-800">
                                💧 Gráficos WET
                            </h2>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setVistaGraficaWet('puntos')}
                                    className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
                                        vistaGraficaWet === 'puntos'
                                            ? 'bg-green-600 text-white'
                                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                    }`}
                                >
                                    Solo Puntos
                                </button>
                                <button
                                    onClick={() => setVistaGraficaWet('funciones')}
                                    className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
                                        vistaGraficaWet === 'funciones'
                                            ? 'bg-green-600 text-white'
                                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                    }`}
                                >
                                    Solo Funciones
                                </button>
                                <button
                                    onClick={() => setVistaGraficaWet('ambos')}
                                    className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
                                        vistaGraficaWet === 'ambos'
                                            ? 'bg-green-600 text-white'
                                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                    }`}
                                >
                                    Ambos
                                </button>
                            </div>
                        </div>

                        {(vistaGraficaWet === 'puntos' || vistaGraficaWet === 'ambos') && (
                            <div className="mb-6">
                                <h3 className="text-lg font-semibold text-gray-700 mb-3">Datos Observados</h3>
                                <ResponsiveContainer width="100%" height={400}>
                                    <ScatterChart margin={{ top: 20, right: 30, bottom: 60, left: 60 }}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                                        <XAxis
                                            dataKey="velocidad"
                                            type="number"
                                            name="Velocidad"
                                            unit=" km/h"
                                            label={{ value: 'Velocidad (km/h)', position: 'insideBottom', offset: -20 }}
                                        />
                                        <YAxis
                                            dataKey="distancia"
                                            type="number"
                                            name="Distancia"
                                            unit=" m"
                                            label={{ value: 'Distancia (m)', angle: -90, position: 'insideLeft', offset: -10 }}
                                        />
                                        <Tooltip />
                                        <Legend />
                                        <Scatter data={dataWet} fill="#10b981" name="Datos WET" />
                                    </ScatterChart>
                                </ResponsiveContainer>
                            </div>
                        )}

                        {(vistaGraficaWet === 'funciones' || vistaGraficaWet === 'ambos') && (
                            <div>
                                <h3 className="text-lg font-semibold text-gray-700 mb-3">
                                    {vistaGraficaWet === 'ambos' ? 'Funciones de Regresión' : 'Todas las Funciones'}
                                </h3>
                                <ResponsiveContainer width="100%" height={500}>
                                    <ComposedChart data={getCombinedChartData(regressionWet, dataWet)} margin={{ top: 20, right: 30, bottom: 60, left: 60 }}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                                        <XAxis
                                            dataKey="velocidad"
                                            type="number"
                                            label={{ value: 'Velocidad (km/h)', position: 'insideBottom', offset: -20 }}
                                        />
                                        <YAxis
                                            type="number"
                                            label={{ value: 'Distancia (m)', angle: -90, position: 'insideLeft', offset: -10 }}
                                        />
                                        <Tooltip />
                                        <Legend />
                                        
                                        {regressionWet.modelos.lineal && (
                                            <Line
                                                type="monotone"
                                                dataKey="lineal"
                                                stroke="#ef4444"
                                                strokeWidth={modeloSeleccionadoWet === 'lineal' ? 3 : 2}
                                                strokeDasharray={modeloSeleccionadoWet === 'lineal' ? '0' : '5 5'}
                                                name={`Lineal (R²=${regressionWet.modelos.lineal.r2.toFixed(3)})`}
                                                dot={false}
                                            />
                                        )}
                                        {regressionWet.modelos.cuadratica && (
                                            <Line
                                                type="monotone"
                                                dataKey="cuadratica"
                                                stroke="#8b5cf6"
                                                strokeWidth={modeloSeleccionadoWet === 'cuadratica' ? 3 : 2}
                                                strokeDasharray={modeloSeleccionadoWet === 'cuadratica' ? '0' : '5 5'}
                                                name={`Cuadrática (R²=${regressionWet.modelos.cuadratica.r2.toFixed(3)})`}
                                                dot={false}
                                            />
                                        )}
                                        {regressionWet.modelos.exponencial && (
                                            <Line
                                                type="monotone"
                                                dataKey="exponencial"
                                                stroke="#f59e0b"
                                                strokeWidth={modeloSeleccionadoWet === 'exponencial' ? 3 : 2}
                                                strokeDasharray={modeloSeleccionadoWet === 'exponencial' ? '0' : '5 5'}
                                                name={`Exponencial (R²=${regressionWet.modelos.exponencial.r2.toFixed(3)})`}
                                                dot={false}
                                            />
                                        )}
                                        {regressionWet.modelos.potencial && (
                                            <Line
                                                type="monotone"
                                                dataKey="potencial"
                                                stroke="#14b8a6"
                                                strokeWidth={modeloSeleccionadoWet === 'potencial' ? 3 : 2}
                                                strokeDasharray={modeloSeleccionadoWet === 'potencial' ? '0' : '5 5'}
                                                name={`Potencial (R²=${regressionWet.modelos.potencial.r2.toFixed(3)})`}
                                                dot={false}
                                            />
                                        )}
                                        
                                        {vistaGraficaWet === 'ambos' && (
                                            <Scatter data={dataWet} fill="#10b981" name="Datos" />
                                        )}
                                    </ComposedChart>
                                </ResponsiveContainer>
                            </div>
                        )}

                        <div className="mt-4 p-4 bg-green-50 rounded-lg">
                            <p className="text-sm">
                                <span className="font-semibold">Modelo destacado:</span> {modeloSeleccionadoWet.charAt(0).toUpperCase() + modeloSeleccionadoWet.slice(1)} - 
                                <span className="font-mono ml-2">{regressionWet.modelos[modeloSeleccionadoWet]?.ecuacion}</span>
                            </p>
                            <p className="text-xs text-gray-600 mt-1">
                                💡 Línea gruesa = modelo seleccionado. Líneas punteadas = comparación.
                            </p>
                        </div>
                    </div>
                )}

                {totalData === 0 && (
                    <div className="bg-blue-50 rounded-lg shadow-md p-6 border border-blue-200">
                        <h3 className="text-lg font-semibold text-blue-900 mb-2">📊 Instrucciones</h3>
                        <ul className="space-y-2 text-blue-800">
                            <li>• CSV con columnas: velocidad, distancia y condición (DRY/WET)</li>
                            <li>• Se calcularán 4 tipos de regresión automáticamente</li>
                            <li>• Compara visualmente todas las funciones en el mismo gráfico</li>
                        </ul>
                    </div>
                )}
            </div>
        </div>
    );
}