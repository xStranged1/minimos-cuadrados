import { useState } from "react";
import Papa from 'papaparse';

export const FileUploader = ({ onDataLoaded }) => {
    const [fileName, setFileName] = useState('');
    const [dataCounts, setDataCounts] = useState({ dry: 0, wet: 0 });

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

                setDataCounts({ dry: dry.length, wet: wet.length });
                onDataLoaded(dry, wet);
            },
            error: (error) => {
                alert('Error al cargar el archivo: ' + error.message);
            }
        });
    };

    return (
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
                        <span className="font-medium text-blue-600">DRY:</span> {dataCounts.dry} |
                        <span className="font-medium text-green-600 ml-2">WET:</span> {dataCounts.wet}
                    </div>
                </div>
            )}
        </div>
    );
};