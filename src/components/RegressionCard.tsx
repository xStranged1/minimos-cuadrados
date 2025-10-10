export const RegressionCard = ({ type, regression, modeloSeleccionado, onModeloChange }) => {
    const isDry = type === 'dry';
    const colors = isDry
        ? { gradient: 'from-blue-50 to-blue-100', border: 'border-blue-200', text: 'text-blue-900', highlight: 'text-blue-700' }
        : { gradient: 'from-green-50 to-emerald-100', border: 'border-green-200', text: 'text-green-900', highlight: 'text-green-700' };

    const icon = isDry ? '🌞' : '💧';
    const label = isDry ? 'DRY' : 'WET';

    return (
        <div className={`bg-gradient-to-r ${colors.gradient} rounded-lg shadow-md p-6 border ${colors.border}`}>
            <h2 className={`text-xl font-bold ${colors.text} mb-4`}>{icon} {label}</h2>

            <div className="mb-4">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Modelo principal:
                </label>
                <select
                    value={modeloSeleccionado}
                    onChange={(e) => onModeloChange(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                >
                    <option value="lineal">Lineal</option>
                    <option value="cuadratica">Cuadrática</option>
                    <option value="exponencial">Exponencial</option>
                    <option value="potencial">Potencial</option>
                </select>
            </div>

            <div className="bg-white rounded-lg p-4 mb-4 shadow-sm">
                <p className={`text-lg font-mono text-center ${colors.highlight} break-words`}>
                    {regression.modelos[modeloSeleccionado]?.ecuacion || 'N/A'}
                </p>
            </div>

            <div className="bg-white rounded-lg p-3 shadow-sm mb-3">
                <p className="text-xs text-gray-600 mb-1">R²</p>
                <p className={`text-2xl font-bold ${colors.highlight}`}>
                    {(regression.modelos[modeloSeleccionado]?.r2 || 0).toFixed(6)}
                </p>
            </div>

            <div className="bg-white rounded-lg p-3 shadow-sm">
                <p className="text-xs font-semibold text-gray-700 mb-2">Comparación R²:</p>
                <div className="space-y-1 text-xs">
                    {Object.entries(regression.modelos).map(([tipo, datos]) => datos && (
                        <div key={tipo} className={`flex justify-between ${tipo === modeloSeleccionado ? `font-bold ${colors.highlight}` : 'text-gray-600'}`}>
                            <span className="capitalize">{tipo}:</span>
                            <span>{datos.r2.toFixed(6)}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};