"use client";

import api from "../services/api"
import { useState, useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';

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
  selectedMonth?: string;
  dailyProcedures?: { day: number; count: number }[];
  patientAges?: { patient: number; age: number }[];
  monthlyProcedures?: { month: string; count: number }[];
}

export default function Home() {
  const [activeFilter, setActiveFilter] = useState<FilterType>("monthly-procedures");
  const [selectedExamType, setSelectedExamType] = useState<string>(EXAM_TYPES[5]);
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(false);

  // State for month selection
  const [selectedMonth, setSelectedMonth] = useState<string>(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  });

  const fetchData = async (filter: FilterType) => {
    setLoading(true);
    try {
      let response;

      switch (filter) {
        case "monthly-procedures": {
          const [year, month] = selectedMonth.split("-");
          response = await api.get('filters/procedures/count-by-month', {
            params: { year: parseInt(year), month: parseInt(month) }
          });
          setData(response.data);
          break;
        }
        case "patient-demographics":
          response = await api.get('filters/patients/average-age-this-month');
          setData(response.data);
          break;
        case "procedure-types":
          response = await api.get('filters/procedures/details-by-type', {
            params: { type: selectedExamType, months: "6" }
          });
          setData(response.data.count);
          break;
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(activeFilter);
  }, [activeFilter, selectedExamType, selectedMonth]); // Re-fetch when month changes

  const renderChart = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center h-[360px] bg-amber-50 rounded-lg">
          <div className="text-lg text-gray-900">Carregando...</div>
        </div>
      );
    }

    if (!data) {
      return (
        <div className="flex items-center justify-center h-[360px] bg-amber-50 rounded-lg">
          <div className="text-lg text-gray-900">Nenhum dado disponível</div>
        </div>
      );
    }

    switch (activeFilter) {
      case "monthly-procedures":
        return (
          <div className="h-[360px] w-full">
            <h3 className="text-2xl font-semibold text-gray-900 mb-6 text-center">
              Quantidade de Exames Diários - {(() => {
                const [year, month] = selectedMonth.split("-");
                const monthName = new Date(parseInt(year), parseInt(month) - 1, 1).toLocaleDateString('pt-BR', { 
                  month: 'long', 
                  year: 'numeric' 
                });
                return monthName.charAt(0).toUpperCase() + monthName.slice(1);
              })()}
            </h3>
            <div className="mb-4 text-center">
              <span className="text-lg font-medium text-gray-800">
                Total de exames neste mês: {data.totalProcedures}
              </span>
            </div>
            <ResponsiveContainer width="100%" height="70%">
              <BarChart data={data.dailyProcedures}>
                <CartesianGrid strokeDasharray="3 3" stroke="#9ca3af" />
                <XAxis 
                  dataKey="day" 
                  tick={{ fill: '#374151', fontSize: 11 }}
                  axisLine={{ stroke: '#374151' }}
                />
                <YAxis 
                  tick={{ fill: '#374151', fontSize: 12 }}
                  axisLine={{ stroke: '#374151' }}
                  label={{ value: 'Número de Exames', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle' } }}
                />
                <Tooltip 
                  formatter={(value: any) => [value, 'Procedimentos']}
                  labelFormatter={(label: any) => `Dia ${label}`}
                  contentStyle={{ 
                    backgroundColor: '#ffffff', 
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    color: '#374151'
                  }}
                />
                <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        );

      case "patient-demographics":
        return (
          <div className="h-[360px] w-full">
            <h3 className="text-2xl font-semibold text-gray-900 mb-6 text-center">
              Distribuição de Idades dos Pacientes
            </h3>
            <div className="mb-4 text-center">
              <span className="text-lg font-medium text-gray-800">
                Idade média: {data.averageAge ? data.averageAge.toFixed(1) : '0.0'} anos
              </span>
            </div>
            <ResponsiveContainer width="100%" height="70%">
              <BarChart data={data.patientAges}>
                <CartesianGrid strokeDasharray="3 3" stroke="#9ca3af" />
                <XAxis 
                  dataKey="patient" 
                  tick={false}
                  axisLine={{ stroke: '#374151' }}
                />
                <YAxis 
                  tick={{ fill: '#374151', fontSize: 12 }}
                  axisLine={{ stroke: '#374151' }}
                  label={{ value: 'Idade', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle' } }}
                />
                <Tooltip 
                  formatter={(value: any) => [value, 'Idade']}
                  labelFormatter={(label: any) => `Paciente ${label}`}
                  contentStyle={{ 
                    backgroundColor: '#ffffff', 
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    color: '#374151'
                  }}
                />
                <Bar dataKey="age" fill="#10b981" radius={[4, 4, 0, 0]} />
                <ReferenceLine 
                  y={data.averageAge} 
                  stroke="#059669" 
                  strokeDasharray="8 8" 
                  strokeWidth={2}
                  label={{ value: `Média: ${Math.round(data.averageAge || 0)}`, position: "right" }}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        );

      case "procedure-types":
        return (
          <div className="h-[360px] w-full">
            <h3 className="text-2xl font-semibold text-gray-900 mb-6 text-center">
              Tendências Mensais de Procedimentos
            </h3>
            <div className="mb-4 text-center">
              <span className="text-lg font-medium text-gray-800">
                Total de procedimentos deste tipo: {data.monthlyProcedures?.reduce((sum, item) => sum + item.count, 0) || 0}
              </span>
            </div>
            <ResponsiveContainer width="100%" height="70%">
              <BarChart data={data.monthlyProcedures}>
                <CartesianGrid strokeDasharray="3 3" stroke="#9ca3af" />
                <XAxis 
                  dataKey="month" 
                  tick={{ fill: '#374151', fontSize: 12 }}
                  axisLine={{ stroke: '#374151' }}
                />
                <YAxis 
                  tick={{ fill: '#374151', fontSize: 12 }}
                  axisLine={{ stroke: '#374151' }}
                  label={{ value: 'Procedimentos', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle' } }}
                />
                <Tooltip 
                  formatter={(value: any) => [value, 'Procedimentos']}
                  labelFormatter={(label: any) => `Mês: ${label}`}
                  contentStyle={{ 
                    backgroundColor: '#ffffff', 
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    color: '#374151'
                  }}
                />
                <Bar dataKey="count" fill="#f97316" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-amber-50 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-2">
            CEO Dashboard
          </h1>
          <p className="text-gray-800">
            Análises e Insights de Saúde
          </p>
        </div>

        {/* Filter Buttons and Controls */}
        <div className="flex flex-wrap justify-center items-center gap-4 mb-8">
          {/* Filter Buttons */}
          <button
            onClick={() => setActiveFilter("monthly-procedures")}
            className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
              activeFilter === "monthly-procedures"
                ? "bg-blue-600 text-white shadow-lg"
                : "bg-amber-100 text-gray-900 hover:bg-amber-200 border border-amber-200"
            }`}
          >
            Quantidade de exames
          </button>
          <button
            onClick={() => setActiveFilter("patient-demographics")}
            className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
              activeFilter === "patient-demographics"
                ? "bg-green-600 text-white shadow-lg"
                : "bg-amber-100 text-gray-900 hover:bg-amber-200 border border-amber-200"
            }`}
          >
            Demografia dos Pacientes
          </button>
          <button
            onClick={() => setActiveFilter("procedure-types")}
            className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
              activeFilter === "procedure-types"
                ? "bg-orange-600 text-white shadow-lg"
                : "bg-amber-100 text-gray-900 hover:bg-amber-200 border border-amber-200"
            }`}
          >
            Tipos de Procedimento
          </button>

          {/* Month Selector - Only show when monthly-procedures is selected */}
          {activeFilter === "monthly-procedures" && (
            <div className="ml-6">
              <input
                type="month"
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="px-3 py-2 rounded-lg border border-amber-200 bg-amber-100 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              />
            </div>
          )}

          {/* Exam Type Dropdown - Only show when procedure-types is selected */}
          {activeFilter === "procedure-types" && (
            <div className="ml-6">
              <select
                value={selectedExamType}
                onChange={(e) => setSelectedExamType(e.target.value)}
                className="px-3 py-2 rounded-lg border border-amber-200 bg-amber-100 text-gray-900 focus:ring-2 focus:ring-orange-500 focus:border-transparent min-w-[250px] max-w-[350px] text-sm"
              >
                {EXAM_TYPES.map((examType) => (
                  <option key={examType} value={examType}>
                    {formatExamName(examType)}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        {/* Chart Area */}
        <div className="bg-amber-100 rounded-xl shadow-lg p-8">
          {renderChart()}
        </div>
      </div>
    </div>
  );
}