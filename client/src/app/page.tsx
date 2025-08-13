"use client";

import { useState, useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import api from '../services/api';

type FilterType = "monthly-procedures" | "patient-demographics" | "procedure-types";

// Available exam types from Prisma enum
const EXAM_TYPES = [
  "TRATAMENTO_POR_ALTA_POTENCIA_FLUORETOS_NA_MUCOSA_ORAL",
  "MOLDAGEM_DENTAL_MAXILAR_PARA_CONSTRUCAO_DE_PROTESE_DENTA",
  "REMBASAMENTO_E_CONSERTO_DE_PROTESE_DENTARIA",
  "SESSAO_DE_IMPOSICAO_DE_MAOS",
  "EXCISAO_E_SUTURA_DE_LESAO_NA_BOCA",
  "ORIENTACAO_DE_HIGIENE_BUCAL",
  "ORIENTACAO_DE_HIGIENIZACAO_DE_PROTESES_DENTARIAS",
  "BIOPSIA_DOS_TECIDOS_MOLES_DA_BOCA",
  "RADIOGRAFIA_PANORAMICA",
  "RADIOGRAFIA_INTERPROXIMAL_BITE_WING",
  "RADIOGRAFIA_PERIAPICAL",
  "RESTAURACAO_DE_DENTE_PERMANENTE_ANTERIOR_COM_RESINA_COMPOSTA",
  "RESTAURACAO_DE_DENTE_DECIDUO_POSTERIOR_COM_RESINA_COMPOSTA",
  "RESTAURACAO_DE_DENTE_DECIDUO_ANTERIOR_COM_RESINA_COMPOSTA",
  "RESTAURACAO_DE_DENTE_PERMANENTE_POSTERIOR_COM_RESINA_COMPOSTA",
  "ADEQUACAO_DO_COMPORTAMENTO_DE_CRIANCAS",
  "PROTESE_PARCIAL_MANDIBULAR_REMOVIVEL",
  "PROTESE_PARCIAL_MAXILAR_REMOVIVEL",
  "PROTESE_TOTAL_MANDIBULAR",
  "PROTESE_TOTAL_MAXILAR"
];

// Helper function to format exam names for display
const formatExamName = (examType: string) => {
  return examType
    .replace(/_/g, ' ')
    .toLowerCase()
    .replace(/\b\w/g, l => l.toUpperCase());
};

interface DashboardData {
  totalProcedures?: number;
  averageAge?: number;
  procedure?: string;
  count?: number;
  months?: number;
  dailyProcedures?: { day: number; count: number }[];
  patientAges?: { patient: number; age: number }[];
  monthlyProcedures?: { month: string; count: number }[];
}

export default function Home() {
  const [activeFilter, setActiveFilter] = useState<FilterType>("monthly-procedures");
  const [selectedExamType, setSelectedExamType] = useState<string>(EXAM_TYPES[5]); // Default to "ORIENTACAO_DE_HIGIENE_BUCAL"
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchData = async (filter: FilterType) => {
    setLoading(true);
    try {
      let response;

      switch (filter) {
        // filtro para pegar a quantidade de procedimentos realizados no mês atual
        case "monthly-procedures":
          response = await api.get('/filters/procedures/count-this-month');
          setData(response.data);
          break;
        // filtro para pegar a media de idade dos pacientes do mes atual
        case "patient-demographics":
          response = await api.get('/filters/patients/average-age-this-month');
          setData(response.data);
          break;
        // filtro para pegar a quantidade e detalhes de procedimentos realizados por tipo
        case "procedure-types":
          response = await api.get('/filters/procedures/details-by-type', {
            params: { type: selectedExamType, months: "6" }
          });
          console.log("Response data:", response.data);
          setData(response.data.count);
          break;
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(activeFilter);
  }, [activeFilter, selectedExamType]); // Re-fetch when exam type changes

  const renderChart = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center h-96 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <div className="text-lg text-gray-600 dark:text-gray-300">Loading...</div>
        </div>
      );
    }

    if (!data) {
      return (
        <div className="flex items-center justify-center h-96 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <div className="text-lg text-gray-600 dark:text-gray-300">No data available</div>
        </div>
      );
    }

    switch (activeFilter) {
      case "monthly-procedures":
        return (
          <div className="h-96 w-full">
            <h3 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-6 text-center">
              Daily Procedures This Month
            </h3>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.dailyProcedures}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e0e4e7" />
                <XAxis 
                  dataKey="day" 
                  tick={false}
                  axisLine={{ stroke: '#6b7280' }}
                />
                <YAxis 
                  tick={{ fill: '#6b7280', fontSize: 12 }}
                  axisLine={{ stroke: '#6b7280' }}
                />
                <Tooltip 
                  formatter={(value: any, name: any) => [value, 'Procedures']}
                  labelFormatter={(label: any) => `Day ${label}`}
                  contentStyle={{ 
                    backgroundColor: '#f8fafc', 
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px'
                  }}
                />
                <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        );

      case "patient-demographics":
        return (
          <div className="h-96 w-full">
            <h3 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-6 text-center">
              Patient Ages Distribution
            </h3>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.patientAges}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e0e4e7" />
                <XAxis 
                  dataKey="patient" 
                  tick={false}
                  axisLine={{ stroke: '#6b7280' }}
                />
                <YAxis 
                  tick={{ fill: '#6b7280', fontSize: 12 }}
                  axisLine={{ stroke: '#6b7280' }}
                  label={{ value: 'Age', angle: -90, position: 'insideLeft' }}
                />
                <Tooltip 
                  formatter={(value: any, name: any) => [value, 'Age']}
                  labelFormatter={(label: any) => `Patient ${label}`}
                  contentStyle={{ 
                    backgroundColor: '#f0fdf4', 
                    border: '1px solid #bbf7d0',
                    borderRadius: '8px'
                  }}
                />
                <Bar dataKey="age" fill="#10b981" radius={[4, 4, 0, 0]} />
                <ReferenceLine 
                  y={data.averageAge} 
                  stroke="#059669" 
                  strokeDasharray="8 8" 
                  strokeWidth={2}
                  label={{ value: `Avg: ${Math.round(data.averageAge || 0)}`, position: "right" }}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        );

      case "procedure-types":
        return (
          <div className="h-96 w-full">
            <h3 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-6 text-center">
              Monthly Procedure Trends
            </h3>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.monthlyProcedures}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e0e4e7" />
                <XAxis 
                  dataKey="month" 
                  tick={{ fill: '#6b7280', fontSize: 12 }}
                  axisLine={{ stroke: '#6b7280' }}
                />
                <YAxis 
                  tick={{ fill: '#6b7280', fontSize: 12 }}
                  axisLine={{ stroke: '#6b7280' }}
                  label={{ value: 'Procedures', angle: -90, position: 'insideLeft' }}
                />
                <Tooltip 
                  formatter={(value: any, name: any) => [value, 'Procedures']}
                  labelFormatter={(label: any) => `Month: ${label}`}
                  contentStyle={{ 
                    backgroundColor: '#faf5ff', 
                    border: '1px solid #d8b4fe',
                    borderRadius: '8px'
                  }}
                />
                <Bar dataKey="count" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            CEO Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Healthcare Analytics & Insights
          </p>
        </div>

        {/* Filter Buttons */}
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          <button
            onClick={() => setActiveFilter("monthly-procedures")}
            className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
              activeFilter === "monthly-procedures"
                ? "bg-blue-600 text-white shadow-lg"
                : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-600"
            }`}
          >
            Monthly Procedures
          </button>
          <button
            onClick={() => setActiveFilter("patient-demographics")}
            className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
              activeFilter === "patient-demographics"
                ? "bg-green-600 text-white shadow-lg"
                : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-600"
            }`}
          >
            Patient Demographics
          </button>
          <button
            onClick={() => setActiveFilter("procedure-types")}
            className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
              activeFilter === "procedure-types"
                ? "bg-purple-600 text-white shadow-lg"
                : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-600"
            }`}
          >
            Procedure Types
          </button>
        </div>

        {/* Exam Type Dropdown - Only show when procedure-types is selected */}
        {activeFilter === "procedure-types" && (
          <div className="flex justify-center mb-6">
            <div className="flex flex-col items-center gap-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Select Procedure Type:
              </label>
              <select
                value={selectedExamType}
                onChange={(e) => setSelectedExamType(e.target.value)}
                className="px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent min-w-[300px] max-w-[500px]"
              >
                {EXAM_TYPES.map((examType) => (
                  <option key={examType} value={examType}>
                    {formatExamName(examType)}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}

        {/* Chart Area */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          {renderChart()}
        </div>
      </div>
    </div>
  );
}
