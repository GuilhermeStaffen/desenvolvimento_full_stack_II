import React, { useState, useEffect, useMemo, useCallback } from "react";
import toast from "react-hot-toast";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";
import api from "../services/api";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

// ----------------- COMPONENTS -----------------
const ReportFilters = ({ filters, setFilters }) => {
  function handleChange(e) {
    setFilters(prev => ({ ...prev, [e.target.name]: e.target.value }));
  }
  return (
    <div className="bg-white p-6 rounded-xl shadow-lg border-t-4 border-sea">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">Filtros do Relatório</h2>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Data De</label>
          <input
            type="date"
            name="dateFrom"
            value={filters.dateFrom}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Data Até</label>
          <input
            type="date"
            name="dateTo"
            value={filters.dateTo}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
          <select
            name="status"
            value={filters.status}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md bg-white"
          >
            <option value="all">Todos</option>
            <option value="placed">Placed</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="canceled">Canceled</option>
          </select>
        </div>
      </div>
    </div>
  );
};

// Chart: profit per period (line)
const ProfitChart = ({ data }) => {
  if (!Array.isArray(data) || data.length === 0) {
    return (
      <div className="bg-white p-6 rounded-xl shadow-lg h-96 flex items-center justify-center">
        <p className="text-gray-500 italic">Sem dados para exibir o gráfico de lucro.</p>
      </div>
    );
  }
  const chartData = data.map(v => ({
    date: new Date(v.date).toLocaleDateString(),
    profit: Number(v.profit) || 0,
  }));
  return (
    <div className="bg-white p-6 rounded-xl shadow-lg" style={{ minHeight: 320 }}>
      <h3 className="text-lg font-semibold mb-3">Lucro por Período</h3>
      <ResponsiveContainer width="100%" height={260}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip formatter={(v) => v.toLocaleString('en-US', { style: 'currency', currency: 'USD' })} />
          <Legend />
          <Line type="monotone" dataKey="profit" stroke="#16a34a" strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

// Chart: sales by status (bar)
const SalesByStatusChart = ({ data }) => {
  if (!Array.isArray(data) || data.length === 0) {
    return (
      <div className="bg-white p-6 rounded-xl shadow-lg h-96 flex items-center justify-center">
        <p className="text-gray-500 italic">Sem dados para o gráfico de status.</p>
      </div>
    );
  }

  const map = {};
  data.forEach(d => {
    const s = d.status || "placed";
    map[s] = (map[s] || 0) + Number(d.saleValue || 0);
  });
  const chartData = Object.entries(map).map(([status, total]) => ({ status, total }));

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg" style={{ minHeight: 320 }}>
      <h3 className="text-lg font-semibold mb-3">Vndas por Status</h3>
      <ResponsiveContainer width="100%" height={260}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="status" />
          <YAxis />
          <Tooltip formatter={(v) => v.toLocaleString('en-US', { style: 'currency', currency: 'USD' })} />
          <Legend />
          <Bar dataKey="total" fill="#0284c7" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

// Sales Table
const SalesTable = ({ data }) => {
  const exportPDF = () => {
    const doc = new jsPDF();
    doc.text("Relatório de Vendas", 14, 15);

    autoTable(doc, {
      head: [["ID", "Data", "Status", "Total Venda", "Lucro"]],
      body: data.map(sale => [
        sale.id,
        new Date(sale.date).toLocaleDateString(),
        sale.status,
        (sale.saleValue || 0).toFixed(2),
        (sale.profit || 0).toFixed(2),
      ]),
      startY: 25,
      headStyles: { fillColor: [59, 130, 246] },
      styles: { fontSize: 9 },
    });

    doc.save("relatorio-vendas.pdf");
  };

  return (
    <div className="bg-white p-8 rounded-xl shadow-lg">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">Tabela de Vendas ({data.length} resultados)</h2>
        <button
          onClick={exportPDF}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          Exportar PDF
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Venda</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Lucro</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data.map(sale => (
              <tr key={sale.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{sale.id}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(sale.date).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{sale.status}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                  ${(sale.saleValue || 0).toFixed(2)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-green-600">
                  ${(sale.profit || 0).toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// ----------------- Main Component -----------------
export default function Report() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [summary, setSummary] = useState({ totalSales: 0, totalProfit: 0, totalOrders: 0 });
  const [sales, setSales] = useState([]);
  const [monthly, setMonthly] = useState([]);
  const [filters, setFilters] = useState({ dateFrom: "", dateTo: "", status: "all" });
  const [topProducts, setTopProducts] = useState([]);

  const loadSalesData = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await api.listSales();
      const data = res.data;
      const orders = Array.isArray(data?.orders) ? data.orders : [];

      setSales(orders);
      setSummary(data?.summary || { totalSales: 0, totalProfit: 0, totalOrders: 0 });
      setTopProducts(data?.topProducts);
      setMonthly(data?.monthly);
      setLoading(false);
    } catch (e) {
      console.error("Erro ao carregar dados:", e);
      setError("Falha ao conectar ao servidor para carregar os dados do relatório.");
      toast.error("Falha ao carregar dados do relatório.");
      setSales([]);
      setMonthly([]);
      setTopProducts([]);
      setSummary({ totalSales: 0, totalProfit: 0, totalOrders: 0 });
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadSalesData();
  }, [loadSalesData]);

  // Local filtering
  const { filteredData, summaryLocal } = useMemo(() => {
    if (loading) return { filteredData: [], summaryLocal: { totalSales: 0, totalProfit: 0, salesCount: 0 } };

    let filteredSales = sales.slice();

    if (filters.status !== "all") filteredSales = filteredSales.filter(v => v.status === filters.status);
    if (filters.dateFrom) {
      const dateFrom = new Date(filters.dateFrom);
      filteredSales = filteredSales.filter(v => new Date(v.date) >= dateFrom);
    }
    if (filters.dateTo) {
      const dateTo = new Date(filters.dateTo);
      dateTo.setDate(dateTo.getDate() + 1);
      filteredSales = filteredSales.filter(v => new Date(v.date) < dateTo);
    }

    let totalSales = 0;
    let totalProfit = 0;
    const salesWithMetrics = filteredSales.map(sale => {
      const saleValue = Number(sale.saleValue || 0);
      const profit = Number(sale.profit || 0);
      totalSales += saleValue;
      totalProfit += profit;
      return { ...sale, saleValue, profit };
    });

    return {
      filteredData: salesWithMetrics,
      summaryLocal: { totalSales, totalProfit, salesCount: salesWithMetrics.length },
    };
  }, [sales, filters, loading]);

  return (
    <div className="container mx-auto py-12 px-6 space-y-12">
      <h1 className="text-4xl font-bold text-center md:text-left text-gray-800">Relatório de vendas</h1>

      {loading && (
        <div className="bg-blue-100 border-l-4 border-blue-500 text-blue-700 p-4 rounded-md shadow" role="alert">
          <p className="font-bold">Carregando</p>
          <p>Buscando dados do servidor...</p>
        </div>
      )}

      {error && !loading && (
        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 rounded-md shadow" role="alert">
          <p className="font-bold">Atenção</p>
          <p>{error}</p>
        </div>
      )}

      <section className="bg-white p-8 rounded-xl shadow-lg">
        <h2 className="text-2xl font-semibold mb-6">
          Resumo ({summaryLocal.salesCount} Vendas)
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-6 rounded-xl shadow text-center bg-gray-50 border-t-4 border-sea">
            <h3 className="text-xl font-semibold text-sea mb-2">Total Bruto de Vendas</h3>
            <p className="text-3xl font-bold text-gray-800">
              {(summaryLocal.totalSales || summary.totalSales || 0).toLocaleString("en-US", {
                style: "currency",
                currency: "USD",
              })}
            </p>
          </div>

          <div className="p-6 rounded-xl shadow text-center bg-gray-50 border-t-4 border-green-500">
            <h3 className="text-xl font-semibold text-green-700 mb-2">Lucro Total Estimado</h3>
            <p className="text-3xl font-bold text-green-600">
              {(summaryLocal.totalProfit || summary.totalProfit || 0).toLocaleString("en-US", {
                style: "currency",
                currency: "USD",
              })}
            </p>
          </div>

          <div className="p-6 rounded-xl shadow text-center bg-gray-50 border-t-4 border-orange-500">
            <h3 className="text-xl font-semibold text-orange-700 mb-2">Ticket Médio por Venda</h3>
            <p className="text-3xl font-bold text-gray-800">
              {(
                (summaryLocal.totalSales /
                  (summaryLocal.salesCount || summary.totalOrders || 1)) || 0
              ).toLocaleString("en-US", { style: "currency", currency: "USD" })}
            </p>
          </div>
        </div>
      </section>

      <section>
        <ReportFilters filters={filters} setFilters={setFilters} />
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <ProfitChart data={filteredData} />
        <SalesByStatusChart data={filteredData} />
      </section>

      <section>
        <SalesTable data={filteredData} />
      </section>
    </div>
  );
}
