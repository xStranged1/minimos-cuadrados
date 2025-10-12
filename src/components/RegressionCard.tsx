import React, { useState, useEffect, useRef } from 'react';
import { Info } from 'lucide-react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import katex from 'katex';

const LatexFormula = ({ formula }) => {
    const ref = useRef(null);

    useEffect(() => {
        if (ref.current) {
            try {
                katex.render(formula, ref.current, {
                    throwOnError: false,
                    displayMode: true
                });
            } catch (error) {
                console.error('Error rendering KaTeX:', error);
            }
        }
    }, [formula]);

    return <div ref={ref} className="overflow-x-auto" />;
};

const FormulaModal = ({ tipo }) => {
    const formulas = {
        lineal: {
            title: "Regresión Lineal",
            modelo: "y = mx + b",
            calculos: [
                { label: "Pendiente (m)", formula: "m = \\frac{n\\sum xy - \\sum x \\sum y}{n\\sum x^2 - (\\sum x)^2}" },
                { label: "Intercepto (b)", formula: "b = \\frac{\\sum y - m\\sum x}{n}" },
                { label: "R²", formula: "R^2 = 1 - \\frac{\\text{SSE}}{\\text{SST}} = 1 - \\frac{\\sum(y_i - \\hat{y}_i)^2}{\\sum(y_i - \\bar{y})^2}" },
                { label: "R² ajustado", formula: "R^2_{\\text{adj}} = 1 - \\frac{\\text{SSE}/(n-p)}{\\text{SST}/(n-1)}" },
            ],
            params: "donde p = 2 (número de parámetros: m, b)"
        },
        cuadratica: {
            title: "Regresión Cuadrática",
            modelo: "y = ax^2 + bx + c",
            calculos: [
                { label: "Sistema de ecuaciones normales", formula: "\\begin{bmatrix} n & \\sum x & \\sum x^2 \\\\ \\sum x & \\sum x^2 & \\sum x^3 \\\\ \\sum x^2 & \\sum x^3 & \\sum x^4 \\end{bmatrix} \\begin{bmatrix} c \\\\ b \\\\ a \\end{bmatrix} = \\begin{bmatrix} \\sum y \\\\ \\sum xy \\\\ \\sum x^2y \\end{bmatrix}" },
                { label: "R²", formula: "R^2 = 1 - \\frac{\\sum(y_i - \\hat{y}_i)^2}{\\sum(y_i - \\bar{y})^2}" },
                { label: "R² ajustado", formula: "R^2_{\\text{adj}} = 1 - \\frac{\\text{SSE}/(n-p)}{\\text{SST}/(n-1)}" },
            ],
            params: "donde p = 3 (número de parámetros: a, b, c)"
        },
        exponencial: {
            title: "Regresión Exponencial",
            modelo: "y = ae^{bx}",
            calculos: [
                { label: "Transformación logarítmica", formula: "\\ln(y) = \\ln(a) + bx" },
                { label: "Regresión lineal en", formula: "Y = \\ln(y), \\quad X = x" },
                { label: "Parámetro b", formula: "b = \\frac{n\\sum xY - \\sum x \\sum Y}{n\\sum x^2 - (\\sum x)^2}" },
                { label: "Parámetro a", formula: "a = e^{\\frac{\\sum Y - b\\sum x}{n}}" },
                { label: "R²", formula: "R^2 = 1 - \\frac{\\sum(y_i - ae^{bx_i})^2}{\\sum(y_i - \\bar{y})^2}" },
                { label: "R² ajustado", formula: "R^2_{\\text{adj}} = 1 - \\frac{\\text{SSE}/(n-p)}{\\text{SST}/(n-1)}" },
            ],
            params: "donde p = 2 (número de parámetros: a, b)"
        },
        potencial: {
            title: "Regresión Potencial",
            modelo: "y = ax^b",
            calculos: [
                { label: "Transformación logarítmica", formula: "\\ln(y) = \\ln(a) + b\\ln(x)" },
                { label: "Regresión lineal en", formula: "Y = \\ln(y), \\quad X = \\ln(x)" },
                { label: "Parámetro b", formula: "b = \\frac{n\\sum XY - \\sum X \\sum Y}{n\\sum X^2 - (\\sum X)^2}" },
                { label: "Parámetro a", formula: "a = e^{\\frac{\\sum Y - b\\sum X}{n}}" },
                { label: "R²", formula: "R^2 = 1 - \\frac{\\sum(y_i - ax_i^b)^2}{\\sum(y_i - \\bar{y})^2}" },
                { label: "R² ajustado", formula: "R^2_{\\text{adj}} = 1 - \\frac{\\text{SSE}/(n-p)}{\\text{SST}/(n-1)}" },
            ],
            params: "donde p = 2 (número de parámetros: a, b)"
        }
    };

    const formula = formulas[tipo];

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="w-full">
                    <Info className="w-4 h-4 mr-2" />
                    Ver fórmulas
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>{formula.title}</DialogTitle>
                    <DialogDescription>Fórmulas y método de cálculo</DialogDescription>
                </DialogHeader>

                <div className="space-y-4 mt-4">
                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                        <p className="text-sm font-semibold text-gray-700 mb-2">Modelo:</p>
                        <div className="text-center">
                            <LatexFormula formula={formula.modelo} />
                        </div>
                    </div>

                    <div className="space-y-3">
                        <p className="text-sm font-semibold text-gray-700">Cálculos:</p>
                        {formula.calculos.map((calc, idx) => (
                            <div key={idx} className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                                <p className="text-xs font-semibold text-gray-600 mb-2">{calc.label}:</p>
                                <div className="bg-white p-3 rounded border border-gray-300">
                                    <LatexFormula formula={calc.formula} />
                                </div>
                            </div>
                        ))}
                    </div>

                    {formula.params && (
                        <div className="bg-amber-50 p-3 rounded-lg border border-amber-200">
                            <p className="text-xs text-amber-900">{formula.params}</p>
                        </div>
                    )}

                    <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 text-xs text-gray-600">
                        <p className="font-semibold mb-1">Notación:</p>
                        <ul className="list-disc list-inside space-y-1">
                            <li>n = número de datos</li>
                            <li>SSE = suma de cuadrados de los errores</li>
                            <li>SST = suma total de cuadrados</li>
                            <li>ȳ = media de y</li>
                            <li>ŷᵢ = valor predicho para yᵢ</li>
                        </ul>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};

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

            <div className="mb-3">
                <FormulaModal tipo={modeloSeleccionado} />
            </div>

            <div className="bg-white rounded-lg p-4 mb-4 shadow-sm">
                <p className={`text-lg font-mono text-center ${colors.highlight} break-words`}>
                    {regression.modelos[modeloSeleccionado]?.ecuacion || 'N/A'}
                </p>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-3">
                <div className="bg-white rounded-lg p-3 shadow-sm">
                    <p className="text-xs text-gray-600 mb-1">R²</p>
                    <p className={`text-xl font-bold ${colors.highlight}`}>
                        {(regression.modelos[modeloSeleccionado]?.r2 || 0).toFixed(6)}
                    </p>
                </div>

                <div className="bg-white rounded-lg p-3 shadow-sm">
                    <p className="text-xs text-gray-600 mb-1">R² ajustado</p>
                    <p className={`text-xl font-bold ${colors.highlight}`}>
                        {(regression.modelos[modeloSeleccionado]?.r2Ajustado || 0).toFixed(6)}
                    </p>
                </div>
            </div>

            <div className="bg-white rounded-lg p-3 shadow-sm">
                <p className="text-xs font-semibold text-gray-700 mb-2">Comparación de modelos:</p>
                <div className="space-y-1 text-xs">
                    {Object.entries(regression.modelos).map(([tipo, datos]) => datos && (
                        <div key={tipo} className={`${tipo === modeloSeleccionado ? `font-bold ${colors.highlight}` : 'text-gray-600'}`}>
                            <div className="flex justify-between">
                                <span className="capitalize">{tipo}:</span>
                                <span>R² = {datos.r2.toFixed(6)}</span>
                            </div>
                            <div className="flex justify-between pl-4 text-gray-500">
                                <span></span>
                                <span>R²ₐⱼ = {datos.r2Ajustado?.toFixed(6) || 'N/A'}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};