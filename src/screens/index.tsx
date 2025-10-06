import "@/styles/globals.css";
import { ScatterChart, Scatter, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function IndexScreen() {

    // 20 puntos de datos de velocidad y distancia de frenado
    const scatterData = [
        { velocidad: 20, distancia: 8 },
        { velocidad: 25, distancia: 12 },
        { velocidad: 30, distancia: 16 },
        { velocidad: 35, distancia: 22 },
        { velocidad: 40, distancia: 28 },
        { velocidad: 45, distancia: 35 },
        { velocidad: 50, distancia: 42 },
        { velocidad: 55, distancia: 51 },
        { velocidad: 60, distancia: 60 },
        { velocidad: 65, distancia: 70 },
        { velocidad: 70, distancia: 82 },
        { velocidad: 75, distancia: 94 },
        { velocidad: 80, distancia: 108 },
        { velocidad: 85, distancia: 122 },
        { velocidad: 90, distancia: 138 },
        { velocidad: 95, distancia: 152 },
        { velocidad: 100, distancia: 170 },
        { velocidad: 105, distancia: 186 },
        { velocidad: 110, distancia: 205 },
        { velocidad: 115, distancia: 224 }
    ];

    // Datos para las dos funciones lineales
    const linearData = [];
    for (let x = 20; x <= 115; x += 5) {
        linearData.push({
            velocidad: x,
            funcion1: 1.5 * x - 10,  // y = 1.5x - 10
            funcion2: 2.2 * x - 30   // y = 2.2x - 30
        });
    }

    return (
        <div className="p-8 bg-background">
            <div className="max-w-7xl mx-auto space-y-8">
                <div className="bg-card rounded-lg shadow-lg p-6 border border-border">
                    <h2 className="text-2xl font-bold text-foreground mb-2">
                        Velocidad vs Distancia de Frenado
                    </h2>
                    <p className="text-muted-foreground mb-4">
                        Gráfico de dispersión mostrando la relación entre velocidad (km/h) y distancia de frenado (m)
                    </p>
                    <ResponsiveContainer width="100%" height={400}>
                        <ScatterChart margin={{ top: 20, right: 30, bottom: 20, left: 20 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--muted))" />
                            <XAxis
                                type="number"
                                dataKey="velocidad"
                                name="Velocidad"
                                unit=" km/h"
                                label={{ value: 'Velocidad (km/h)', position: 'insideBottom', offset: -10, fill: 'hsl(var(--foreground))' }}
                                stroke="hsl(var(--foreground))"
                                tick={{ fill: 'hsl(var(--foreground))' }}
                            />
                            <YAxis
                                type="number"
                                dataKey="distancia"
                                name="Distancia"
                                unit=" m"
                                label={{ value: 'Distancia de frenado (m)', angle: -90, position: 'insideLeft', fill: 'hsl(var(--foreground))' }}
                                stroke="hsl(var(--foreground))"
                                tick={{ fill: 'hsl(var(--foreground))' }}
                            />
                            <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                            <Legend />
                            <Scatter
                                name="Datos de frenado"
                                data={scatterData}
                                fill="#3b82f6"
                                shape="circle"
                            />
                        </ScatterChart>
                    </ResponsiveContainer>
                </div>

                <div className="bg-card rounded-lg shadow-lg p-6 border border-border">
                    <h2 className="text-2xl font-bold text-foreground mb-2">
                        Funciones Lineales de Comparación
                    </h2>
                    <p className="text-muted-foreground mb-4">
                        <span className="font-semibold text-emerald-600 dark:text-emerald-400">Función 1:</span> y = 1.5x - 10 |
                        <span className="font-semibold text-purple-600 dark:text-purple-400 ml-2">Función 2:</span> y = 2.2x - 30
                    </p>
                    <ResponsiveContainer width="100%" height={400}>
                        <LineChart data={linearData} margin={{ top: 20, right: 30, bottom: 20, left: 20 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--muted))" />
                            <XAxis
                                dataKey="velocidad"
                                label={{ value: 'Velocidad (km/h)', position: 'insideBottom', offset: -10, fill: 'hsl(var(--foreground))' }}
                                stroke="hsl(var(--foreground))"
                                tick={{ fill: 'hsl(var(--foreground))' }}
                            />
                            <YAxis
                                label={{ value: 'Distancia (m)', angle: -90, position: 'insideLeft', fill: 'hsl(var(--foreground))' }}
                                stroke="hsl(var(--foreground))"
                                tick={{ fill: 'hsl(var(--foreground))' }}
                            />
                            <Tooltip />
                            <Legend />
                            <Line
                                type="monotone"
                                dataKey="funcion1"
                                stroke="#10b981"
                                strokeWidth={2}
                                name="Función 1 (y = 1.5x - 10)"
                                dot={false}
                            />
                            <Line
                                type="monotone"
                                dataKey="funcion2"
                                stroke="#8b5cf6"
                                strokeWidth={2}
                                name="Función 2 (y = 2.2x - 30)"
                                dot={false}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    )
}
