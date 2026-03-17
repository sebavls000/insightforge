"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

type PreviewRow = Record<string, string | number>;
type ChartChannelRow = Record<string, string | number>;

type Insights = {
  rows?: number;
  columns_count?: number;
  total_sales?: number;
  avg_sales?: number;
  top_channel?: string;
};

export default function UploadPage() {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [message, setMessage] = useState("");
  const [columns, setColumns] = useState<string[]>([]);
  const [preview, setPreview] = useState<PreviewRow[]>([]);
  const [insights, setInsights] = useState<Insights>({});
  const [findings, setFindings] = useState<string[]>([]);
  const [chartChannel, setChartChannel] = useState<ChartChannelRow[]>([]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
      maximumFractionDigits: 0,
    }).format(value);
  };

  const resetAnalysis = () => {
    setSelectedFile(null);
    setMessage("");
    setColumns([]);
    setPreview([]);
    setInsights({});
    setFindings([]);
    setChartChannel([]);
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  const handleOpenFilePicker = () => {
    inputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    setSelectedFile(file);
    setMessage("");
    setColumns([]);
    setPreview([]);
    setInsights({});
    setFindings([]);
    setChartChannel([]);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setMessage("Primero seleccioná un archivo.");
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const response = await fetch("http://127.0.0.1:8000/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      setMessage("Análisis generado para " + data.filename);
      setColumns(data.columns || []);
      setPreview(data.preview || []);
      setInsights(data.insights || {});
      setFindings(data.findings || []);
      setChartChannel(data.chart_channel || []);
    } catch {
      setMessage("Error al analizar el archivo.");
      setColumns([]);
      setPreview([]);
      setInsights({});
      setFindings([]);
      setChartChannel([]);
    }
  };

  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      <section className="mx-auto max-w-7xl px-6 py-8">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="inline-flex rounded-full border border-zinc-800 bg-zinc-900 px-4 py-1 text-sm text-zinc-300">
              AI-powered business data analysis
            </div>
            <h1 className="mt-4 text-4xl font-bold tracking-tight md:text-5xl">
              InsightForge Workspace
            </h1>
            <p className="mt-3 max-w-2xl text-zinc-400">
              Convertí archivos en decisiones: subí datasets, generá métricas,
              hallazgos automáticos y visualizaciones claras en segundos.
            </p>
          </div>

          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-2xl border border-zinc-700 px-4 py-3 text-sm font-semibold text-white transition hover:bg-zinc-900"
          >
            Volver al inicio
          </Link>
        </div>

        <div className="rounded-[28px] border border-zinc-800 bg-zinc-900/80 p-5 shadow-2xl md:p-6">
          <div className="rounded-[24px] border border-zinc-800 bg-zinc-950/60 p-5">
            <h2 className="text-2xl font-semibold">Subir archivos</h2>
            <p className="mt-2 text-zinc-400">
              Seleccioná un archivo para iniciar el análisis automático.
            </p>

            <input
              ref={inputRef}
              type="file"
              accept=".csv,.xlsx,.pdf"
              className="hidden"
              onChange={handleFileChange}
            />

            <button
              type="button"
              onClick={handleOpenFilePicker}
              className="mt-5 w-full rounded-[24px] border-2 border-dashed border-zinc-700 bg-zinc-900/40 p-8 text-zinc-400 transition hover:border-zinc-500 hover:bg-zinc-800/40"
            >
              <div className="text-base font-medium text-zinc-300">
                Arrastrá tus archivos acá o hacé clic para seleccionar
              </div>
              <div className="mt-2 text-sm text-zinc-500">
                Formatos permitidos: .csv, .xlsx, .pdf
              </div>
            </button>

            {selectedFile && (
              <div className="mt-5 rounded-2xl border border-zinc-700 bg-zinc-800/50 p-4 text-left">
                <p className="text-sm text-zinc-400">Archivo seleccionado</p>
                <p className="mt-1 font-medium text-white">{selectedFile.name}</p>
              </div>
            )}

            <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center">
              <button
                type="button"
                onClick={handleUpload}
                className="rounded-2xl bg-white px-6 py-3 font-semibold text-zinc-950 transition hover:scale-[1.02]"
              >
                Analizar archivo
              </button>

              <button
                type="button"
                onClick={resetAnalysis}
                className="rounded-2xl border border-zinc-700 px-6 py-3 font-semibold text-white transition hover:bg-zinc-900"
              >
                Limpiar
              </button>

              {message && <p className="text-sm text-zinc-300">{message}</p>}
            </div>
          </div>

          {Object.keys(insights).length > 0 && (
            <div className="mt-6 grid gap-4 md:grid-cols-5">
              <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-5">
                <p className="text-sm text-zinc-400">Filas</p>
                <p className="mt-2 text-3xl font-bold">{insights.rows ?? "-"}</p>
              </div>

              <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-5">
                <p className="text-sm text-zinc-400">Columnas</p>
                <p className="mt-2 text-3xl font-bold">{insights.columns_count ?? "-"}</p>
              </div>

              <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-5">
                <p className="text-sm text-zinc-400">Ventas totales</p>
                <p className="mt-2 text-3xl font-bold">
                  {insights.total_sales !== undefined
                    ? formatCurrency(insights.total_sales)
                    : "-"}
                </p>
              </div>

              <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-5">
                <p className="text-sm text-zinc-400">Promedio ventas</p>
                <p className="mt-2 text-3xl font-bold">
                  {insights.avg_sales !== undefined
                    ? formatCurrency(insights.avg_sales)
                    : "-"}
                </p>
              </div>

              <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-5">
                <p className="text-sm text-zinc-400">Canal más frecuente</p>
                <p className="mt-2 text-3xl font-bold">{insights.top_channel ?? "-"}</p>
              </div>
            </div>
          )}

          {findings.length > 0 && (
            <div className="mt-6 rounded-3xl border border-zinc-800 bg-zinc-950 p-6 text-left">
              <h2 className="text-2xl font-semibold">Hallazgos automáticos</h2>
              <p className="mt-2 text-zinc-400">
                Resumen automático generado a partir del archivo cargado.
              </p>

              <div className="mt-5 space-y-3">
                {findings.map((finding, index) => (
                  <div
                    key={index}
                    className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-4 text-zinc-300"
                  >
                    {finding}
                  </div>
                ))}
              </div>
            </div>
          )}

          {preview.length > 0 && (
            <div className="mt-6 rounded-3xl border border-zinc-800 bg-zinc-950 p-6 text-left">
              <h2 className="text-2xl font-semibold">Ventas por fecha</h2>
              <p className="mt-2 text-zinc-400">
                Evolución de ventas por registro temporal.
              </p>

              <div className="mt-5 h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={preview}>
                    <CartesianGrid stroke="#3f3f46" strokeDasharray="3 3" />
                    <XAxis dataKey="fecha" stroke="#a1a1aa" />
                    <YAxis stroke="#a1a1aa" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#18181b",
                        border: "1px solid #3f3f46",
                        borderRadius: "12px",
                        color: "#ffffff",
                      }}
                    />
                    <Bar dataKey="ventas" fill="#a78bfa" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {chartChannel.length > 0 && (
            <div className="mt-6 rounded-3xl border border-zinc-800 bg-zinc-950 p-6 text-left">
              <h2 className="text-2xl font-semibold">Ventas por canal</h2>
              <p className="mt-2 text-zinc-400">
                Comparación acumulada entre canales de venta.
              </p>

              <div className="mt-5 h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartChannel}>
                    <CartesianGrid stroke="#3f3f46" strokeDasharray="3 3" />
                    <XAxis dataKey="canal" stroke="#a1a1aa" />
                    <YAxis stroke="#a1a1aa" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#18181b",
                        border: "1px solid #3f3f46",
                        borderRadius: "12px",
                        color: "#ffffff",
                      }}
                    />
                    <Bar dataKey="ventas" fill="#60a5fa" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {columns.length > 0 && preview.length > 0 && (
            <div className="mt-6 rounded-3xl border border-zinc-800 bg-zinc-950 p-6 text-left">
              <h2 className="text-2xl font-semibold">Vista previa del dataset</h2>
              <p className="mt-2 text-zinc-400">
                Primeras filas del archivo cargado.
              </p>

              <div className="mt-5 overflow-x-auto rounded-2xl border border-zinc-800">
                <table className="min-w-full text-sm">
                  <thead className="bg-zinc-800">
                    <tr>
                      {columns.map((column) => (
                        <th
                          key={column}
                          className="px-4 py-3 text-left font-semibold text-white"
                        >
                          {column}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {preview.map((row, index) => (
                      <tr key={index} className="border-t border-zinc-800">
                        {columns.map((column) => (
                          <td key={column} className="px-4 py-3 text-zinc-300">
                            {column === "ventas" && typeof row[column] === "number"
                              ? formatCurrency(row[column] as number)
                              : String(row[column] ?? "")}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
