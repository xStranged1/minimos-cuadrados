import { useState } from "react";
import Papa from 'papaparse';

export const FileUploader = ({ onDataLoaded }) => {
    const [fileName, setFileName] = useState('');
    const [dataCounts, setDataCounts] = useState({ dry: 0, wet: 0 });
    const [loading, setLoading] = useState(false);

    const processData = (data, filename) => {
        const dry = [];
        const wet = [];

        data.forEach((row) => {
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

        setDataCounts({ dry: dry.length, wet: wet.length });
        setFileName(filename);
        onDataLoaded(dry, wet);
    };

    const handleFileUpload = (event) => {
        const file = event.target.files?.[0];
        if (!file) return;

        setLoading(true);
        Papa.parse(file, {
            header: true,
            dynamicTyping: true,
            skipEmptyLines: true,
            complete: (results) => {
                processData(results.data, file.name);
                setLoading(false);
            },
            error: (error) => {
                alert('Error al cargar el archivo: ' + error.message);
                setLoading(false);
            }
        });
    };

    const handleUseSampleData = async () => {
        setLoading(true);
        try {
            const response = await fetch('./minimos-cuadrados/src/assets/Ejercicio 4.csv');
            const csvText = await response.text();

            Papa.parse(csvText, {
                header: true,
                dynamicTyping: true,
                skipEmptyLines: true,
                complete: (results) => {
                    processData(results.data, 'Ejercicio 4.csv');
                    setLoading(false);
                },
                error: (error) => {
                    alert('Error al cargar datos de ejemplo: ' + error.message);
                    setLoading(false);
                }
            });
        } catch (error) {
            alert('No se pudo cargar el archivo de ejemplo: ' + error.message);
            setLoading(false);
        }
    };

    const handleDownloadSample = async () => {
        try {
            const response = await fetch('./minimos-cuadrados/src/assets/Ejercicio 4.csv');
            const blob = await response.blob();
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'Ejercicio 4.csv';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        } catch (error) {
            alert('No se pudo descargar el archivo: ' + error.message);
        }
    };

    return (
        <div className="bg-white rounded-lg shadow-md p-6">
            <div className="mb-4">
                <span className="text-lg font-semibold text-gray-700 mb-3 block">
                    Cargar datos
                </span>

                <div className="flex gap-3 mb-4">
                    <button
                        onClick={handleUseSampleData}
                        disabled={loading}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                    >
                        {loading ? '⏳ Cargando...' : '📊 Usar datos de ejemplo'}
                    </button>
                    <button
                        onClick={handleDownloadSample}
                        disabled={loading}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                    >
                        ⬇️ Descargar CSV ejemplo
                    </button>
                </div>

                <div className="relative">
                    <div className="text-center text-gray-500 text-sm mb-2">o</div>
                    <label className="block">
                        <input
                            type="file"
                            accept=".csv"
                            onChange={handleFileUpload}
                            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
                        />
                    </label>
                </div>
            </div>

            {fileName && (
                <div className="mt-4 p-3 bg-gray-50 rounded-lg space-y-1">
                    <div className="text-sm text-gray-600">
                        <span className="font-medium">Archivo:</span> {fileName}
                    </div>
                    <div className="text-sm text-gray-600">
                        <span className="font-medium text-blue-600">DRY:</span> {dataCounts.dry} |
                        <span className="font-medium text-green-600 ml-2">WET:</span> {dataCounts.wet}
                    </div>
                </div>
            )}
        </div>
    );
};