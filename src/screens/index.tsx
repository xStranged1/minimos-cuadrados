import { useState } from 'react';
import { ComposedChart, Line, ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { regressionUtils } from '@/utils/matrix';
import { FileUploader } from '@/components/FileUploader';
import { RegressionCard } from '@/components/RegressionCard';

// ============ COMPONENTE: HEADER ============
const Header = () => (
    <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Método de Mínimos Cuadrados
        </h1>
        <p className="text-gray-600">
            Análisis de regresión: Velocidad vs Distancia de Frenado (DRY y WET)
        </p>
    </div>
);

// ============ COMPONENTE: VIEW TOGGLE BUTTONS ============
const ViewToggleButtons = ({ vistaActual, onVistaChange, colorScheme = 'blue' }) => {
    const activeColor = colorScheme === 'blue' ? 'bg-blue-600' : 'bg-green-600';

    return (
        <div className="flex gap-2">
            <button
                onClick={() => onVistaChange('puntos')}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${vistaActual === 'puntos' ? `${activeColor} text-white` : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
            >
                Solo Puntos
            </button>
            <button
                onClick={() => onVistaChange('funciones')}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${vistaActual === 'funciones' ? `${activeColor} text-white` : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
            >
                Solo Funciones
            </button>
            <button
                onClick={() => onVistaChange('ambos')}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${vistaActual === 'ambos' ? `${activeColor} text-white` : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
            >
                Ambos
            </button>
        </div>
    );
};

// ============ COMPONENTE: SCATTER PLOT ============
const ScatterPlot = ({ data, color, label }) => (
    <ResponsiveContainer width="100%" height={400}>
        <ScatterChart margin={{ top: 20, right: 30, bottom: 60, left: 60 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis
                dataKey="velocidad"
                type="number"
                name="Velocidad"
                unit=" km/h"
                label={{ value: 'Velocidad (km/h)', position: 'insideBottom', offset: -5 }}
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
            <Scatter data={data} fill={color} name={label} />
        </ScatterChart>
    </ResponsiveContainer>
);

// ============ COMPONENTE: REGRESSION LINES CHART ============
const RegressionLinesChart = ({ regression, data, modeloSeleccionado, vistaGrafica, dataColor }) => {
    const getCombinedChartData = () => {
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

    const scatterData = data.map(d => ({
        velocidad: d.velocidad,
        distancia: d.distancia
    }));

    return (
        <ResponsiveContainer width="100%" height={500}>
            <ComposedChart data={getCombinedChartData()} margin={{ top: 20, right: 30, bottom: 60, left: 60 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis
                    dataKey="velocidad"
                    type="number"
                    label={{ value: 'Velocidad (km/h)', position: 'insideBottom', offset: -5 }}
                />
                <YAxis
                    type="number"
                    label={{ value: 'Distancia (m)', angle: -90, position: 'insideLeft', offset: -10 }}
                />
                <Tooltip />
                <Legend />

                {vistaGrafica === 'ambos' && (
                    <Scatter
                        data={scatterData}
                        fill={dataColor}
                        name="Datos"
                        dataKey="distancia"
                    />
                )}

                {regression.modelos.lineal && (
                    <Line
                        type="monotone"
                        dataKey="lineal"
                        stroke="#ef4444"
                        strokeWidth={modeloSeleccionado === 'lineal' ? 3 : 2}
                        strokeDasharray={modeloSeleccionado === 'lineal' ? '0' : '5 5'}
                        name={`Lineal (R²=${regression.modelos.lineal.r2.toFixed(3)})`}
                        dot={false}
                    />
                )}
                {regression.modelos.cuadratica && (
                    <Line
                        type="monotone"
                        dataKey="cuadratica"
                        stroke="#8b5cf6"
                        strokeWidth={modeloSeleccionado === 'cuadratica' ? 3 : 2}
                        strokeDasharray={modeloSeleccionado === 'cuadratica' ? '0' : '5 5'}
                        name={`Cuadrática (R²=${regression.modelos.cuadratica.r2.toFixed(3)})`}
                        dot={false}
                    />
                )}
                {regression.modelos.exponencial && (
                    <Line
                        type="monotone"
                        dataKey="exponencial"
                        stroke="#f59e0b"
                        strokeWidth={modeloSeleccionado === 'exponencial' ? 3 : 2}
                        strokeDasharray={modeloSeleccionado === 'exponencial' ? '0' : '5 5'}
                        name={`Exponencial (R²=${regression.modelos.exponencial.r2.toFixed(3)})`}
                        dot={false}
                    />
                )}
                {regression.modelos.potencial && (
                    <Line
                        type="monotone"
                        dataKey="potencial"
                        stroke="#10b981"
                        strokeWidth={modeloSeleccionado === 'potencial' ? 3 : 2}
                        strokeDasharray={modeloSeleccionado === 'potencial' ? '0' : '5 5'}
                        name={`Potencial (R²=${regression.modelos.potencial.r2.toFixed(3)})`}
                        dot={false}
                    />
                )}
            </ComposedChart>
        </ResponsiveContainer>
    );
};

// ============ COMPONENTE: CHART SECTION ============
const ChartSection = ({ type, data, regression, modeloSeleccionado, vistaGrafica, onVistaChange }) => {
    const isDry = type === 'dry';
    const config = isDry
        ? { icon: '🌞', label: 'DRY', color: '#3b82f6', bgColor: 'bg-blue-50', colorScheme: 'blue' }
        : { icon: '💧', label: 'WET', color: '#10b981', bgColor: 'bg-green-50', colorScheme: 'green' };

    return (
        <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-gray-800">
                    {config.icon} Gráficos {config.label}
                </h2>
                <ViewToggleButtons
                    vistaActual={vistaGrafica}
                    onVistaChange={onVistaChange}
                    colorScheme={config.colorScheme}
                />
            </div>

            {vistaGrafica === 'puntos' && (
                <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-700 mb-3">Datos Observados</h3>
                    <ScatterPlot data={data} color={config.color} label={`Datos ${config.label}`} />
                </div>
            )}

            {(vistaGrafica === 'funciones' || vistaGrafica === 'ambos') && (
                <div>
                    <h3 className="text-lg font-semibold text-gray-700 mb-3">
                        {vistaGrafica === 'ambos' ? 'Datos y Funciones de Regresión' : 'Todas las Funciones'}
                    </h3>
                    <RegressionLinesChart
                        regression={regression}
                        data={data}
                        modeloSeleccionado={modeloSeleccionado}
                        vistaGrafica={vistaGrafica}
                        dataColor={config.color}
                    />
                </div>
            )}

            <div className={`mt-4 p-4 ${config.bgColor} rounded-lg`}>
                <p className="text-sm">
                    <span className="font-semibold">Modelo destacado:</span> {modeloSeleccionado.charAt(0).toUpperCase() + modeloSeleccionado.slice(1)} -
                    <span className="font-mono ml-2">{regression.modelos[modeloSeleccionado]?.ecuacion}</span>
                </p>
                <p className="text-xs text-gray-600 mt-1">
                    💡 Línea gruesa = modelo seleccionado. Líneas punteadas = comparación.
                </p>
            </div>
        </div>
    );
};

// ============ COMPONENTE: INSTRUCTIONS ============
const Instructions = () => (
    <div className="bg-blue-50 rounded-lg shadow-md p-6 border border-blue-200">
        <h3 className="text-lg font-semibold text-blue-900 mb-2">📊 Instrucciones</h3>
        <ul className="space-y-2 text-blue-800">
            <li>• CSV con columnas: velocidad, distancia y condición (DRY/WET)</li>
            <li>• Se calcularán 4 tipos de regresión automáticamente</li>
            <li>• Compara visualmente todas las funciones en el mismo gráfico</li>
        </ul>
    </div>
);

// ============ COMPONENTE PRINCIPAL ============
export default function IndexScreen() {
    const [dataDry, setDataDry] = useState([]);
    const [dataWet, setDataWet] = useState([]);
    const [regressionDry, setRegressionDry] = useState(null);
    const [regressionWet, setRegressionWet] = useState(null);
    const [modeloSeleccionadoDry, setModeloSeleccionadoDry] = useState('lineal');
    const [modeloSeleccionadoWet, setModeloSeleccionadoWet] = useState('lineal');
    const [vistaGraficaDry, setVistaGraficaDry] = useState('ambos');
    const [vistaGraficaWet, setVistaGraficaWet] = useState('ambos');

    const handleDataLoaded = (dry, wet) => {
        setDataDry(dry);
        setDataWet(wet);

        if (dry.length > 0) {
            setRegressionDry(regressionUtils.calcularTodasLasRegresiones(dry));
        }
        if (wet.length > 0) {
            setRegressionWet(regressionUtils.calcularTodasLasRegresiones(wet));
        }
    };

    const totalData = dataDry.length + dataWet.length;

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-7xl mx-auto space-y-6">
                <Header />
                <FileUploader onDataLoaded={handleDataLoaded} />

                {(regressionDry || regressionWet) && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {regressionDry && (
                            <RegressionCard
                                type="dry"
                                regression={regressionDry}
                                modeloSeleccionado={modeloSeleccionadoDry}
                                onModeloChange={setModeloSeleccionadoDry}
                            />
                        )}
                        {regressionWet && (
                            <RegressionCard
                                type="wet"
                                regression={regressionWet}
                                modeloSeleccionado={modeloSeleccionadoWet}
                                onModeloChange={setModeloSeleccionadoWet}
                            />
                        )}
                    </div>
                )}

                {dataDry.length > 0 && regressionDry && (
                    <ChartSection
                        type="dry"
                        data={dataDry}
                        regression={regressionDry}
                        modeloSeleccionado={modeloSeleccionadoDry}
                        vistaGrafica={vistaGraficaDry}
                        onVistaChange={setVistaGraficaDry}
                    />
                )}

                {dataWet.length > 0 && regressionWet && (
                    <ChartSection
                        type="wet"
                        data={dataWet}
                        regression={regressionWet}
                        modeloSeleccionado={modeloSeleccionadoWet}
                        vistaGrafica={vistaGraficaWet}
                        onVistaChange={setVistaGraficaWet}
                    />
                )}

                {totalData === 0 && <Instructions />}
            </div>
        </div>
    );
}