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

// ----------------- COMPONENTES -----------------
const FiltrosRelatorio = ({ filtros, setFiltros }) => {
  function handleChange(e) {
    setFiltros(prev => ({ ...prev, [e.target.name]: e.target.value }));
  }
  return (
    <div className="bg-white p-6 rounded-xl shadow-lg border-t-4 border-sea">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">Filtros do Relatório</h2>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Data De</label>
          <input type="date" name="dataDe" value={filtros.dataDe} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-md" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Data Até</label>
          <input type="date" name="dataAte" value={filtros.dataAte} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-md" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
          <select name="status" value={filtros.status} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-md bg-white">
            <option value="todos">Todos</option>
            <option value="placed">placed</option>
            <option value="shipped">shipped</option>
            <option value="delivered">delivered</option>
            <option value="canceled">canceled</option>
          </select>
        </div>
      </div>
    </div>
  );
};

// Chart: lucro por período (line)
const ChartLucro = ({ dados }) => {
  if (!Array.isArray(dados) || dados.length === 0) {
    return (
      <div className="bg-white p-6 rounded-xl shadow-lg h-96 flex items-center justify-center">
        <p className="text-gray-500 italic">Sem dados para exibir o gráfico de lucro.</p>
      </div>
    );
  }
  const dataChart = dados.map(v => ({ data: new Date(v.data).toLocaleDateString(), lucro: Number(v.lucro) || 0 }));
  return (
    <div className="bg-white p-6 rounded-xl shadow-lg" style={{ minHeight: 320 }}>
      <h3 className="text-lg font-semibold mb-3">Lucro por Período</h3>
      <ResponsiveContainer width="100%" height={260}>
        <LineChart data={dataChart}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="data" />
          <YAxis />
          <Tooltip formatter={(v) => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })} />
          <Legend />
          <Line type="monotone" dataKey="lucro" stroke="#16a34a" strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

// Chart: vendas por status (bar)
// Recebe dadosFiltrados (array de vendas com campo status e valorVenda)
const ChartVendasPorStatus = ({ dados }) => {
  if (!Array.isArray(dados) || dados.length === 0) {
    return (
      <div className="bg-white p-6 rounded-xl shadow-lg h-96 flex items-center justify-center">
        <p className="text-gray-500 italic">Sem dados para o gráfico de status.</p>
      </div>
    );
  }
  // agrupa por status
  const map = {};
  dados.forEach(d => {
    const s = d.status || 'placed';
    map[s] = (map[s] || 0) + (Number(d.valorVenda || 0));
  });
  const chartData = Object.entries(map).map(([status, total]) => ({ status, total }));
  return (
    <div className="bg-white p-6 rounded-xl shadow-lg" style={{ minHeight: 320 }}>
      <h3 className="text-lg font-semibold mb-3">Vendas por Status</h3>
      <ResponsiveContainer width="100%" height={260}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="status" />
          <YAxis />
          <Tooltip formatter={(v) => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })} />
          <Legend />
          <Bar dataKey="total" fill="#0284c7" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

// Tabela de vendas
const TabelaVendas = ({ dados }) => (
  <div className="bg-white p-8 rounded-xl shadow-lg">
    <h2 className="text-2xl font-semibold mb-6">Tabela de Vendas ({dados.length} resultados)</h2>
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
          {dados.slice(0, 10).map(venda => (
            <tr key={venda.id}>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{venda.id}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(venda.data).toLocaleDateString()}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{venda.status}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">R$ {(venda.valorVenda || 0).toFixed(2)}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-green-600">R$ {(venda.lucro || 0).toFixed(2)}</td>
            </tr>
          ))}
          {dados.length > 10 && (
            <tr>
              <td colSpan="5" className="text-center py-4 text-sm text-gray-500 italic">... e mais {dados.length - 10} vendas</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  </div>
);

// ----------------- Componente principal -----------------
export default function Relatorios() {
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState("");
  const [summary, setSummary] = useState({ totalSales: 0, totalProfit: 0, totalOrders: 0 });
  const [vendas, setVendas] = useState([]);
  const [monthly, setMonthly] = useState([]);
  const [filtros, setFiltros] = useState({ dataDe: "", dataAte: "", status: "todos"});
  const [topProducts, setTopProducts] = useState([]);

  const loadVendasData = useCallback(async () => {
    setLoading(true);
    setErro("");
    try {
      const res = await api.listVendas();
      const data = res.data;
      const orders = Array.isArray(data?.orders) ? data.orders : [];
      
      setVendas(orders);
      setSummary(data?.summary || { totalSales: 0, totalProfit: 0, totalOrders: 0 });
      setTopProducts(data?.topProducts);
      setMonthly(data?.monthly);
      setLoading(false);
    } catch (e) {
      console.error("Erro ao carregar dados de vendas da API:", e);
      setErro("Falha ao conectar com o backend. Verifique o servidor.");
      toast.error("Falha ao carregar dados do relatório.");
      setVendas([]);
      setMonthly([]);
      setTopProducts([]);
      setSummary({ totalSales: 0, totalProfit: 0, totalOrders: 0 });
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadVendasData();
  }, [loadVendasData]);

  // Filtragem local
  const { dadosFiltrados, resumo } = useMemo(() => {
    if (loading) return { dadosFiltrados: [], resumo: { totalVendas: 0, totalLucro: 0, numeroVendas: 0 } };

    let vendasFiltradas = vendas.slice();

    if (filtros.status !== "todos") vendasFiltradas = vendasFiltradas.filter(v => v.status === filtros.status);
    if (filtros.dataDe) {
      const dataDe = new Date(filtros.dataDe);
      vendasFiltradas = vendasFiltradas.filter(v => new Date(v.data) >= dataDe);
    }
    if (filtros.dataAte) {
      const dataAte = new Date(filtros.dataAte);
      dataAte.setDate(dataAte.getDate() + 1);
      vendasFiltradas = vendasFiltradas.filter(v => new Date(v.data) < dataAte);
    }

    let totalVendas = 0;
    let totalLucro = 0;
    const vendasComMetricas = vendasFiltradas.map(venda => {
      const valorVenda = Number(venda.valorVenda || 0);
      const lucro = Number(venda.lucro || 0);
      totalVendas += valorVenda;
      totalLucro += lucro;
      return { ...venda, valorVenda, lucro };
    });

    return { dadosFiltrados: vendasComMetricas, resumo: { totalVendas, totalLucro, numeroVendas: vendasComMetricas.length } };
  }, [vendas, filtros, loading]);

  return (
    <div className="container mx-auto py-12 px-6 space-y-12">
      <h1 className="text-4xl font-bold text-center md:text-left text-gray-800">Relatórios de Vendas</h1>

      {loading && (
        <div className="bg-blue-100 border-l-4 border-blue-500 text-blue-700 p-4 rounded-md shadow" role="alert">
          <p className="font-bold">Carregando</p>
          <p>Buscando dados de vendas do servidor...</p>
        </div>
      )}

      {erro && !loading && (
        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 rounded-md shadow" role="alert">
          <p className="font-bold">Atenção</p>
          <p>{erro}</p>
        </div>
      )}

      <section className="bg-white p-8 rounded-xl shadow-lg">
        <h2 className="text-2xl font-semibold mb-6">Resumo ({resumo.numeroVendas} Vendas)</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-6 rounded-xl shadow text-center bg-gray-50 border-t-4 border-sea">
            <h3 className="text-xl font-semibold text-sea mb-2">Total Bruto de Vendas</h3>
            <p className="text-3xl font-bold text-gray-800">{(resumo.totalVendas || summary.totalSales || 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</p>
          </div>

          <div className="p-6 rounded-xl shadow text-center bg-gray-50 border-t-4 border-green-500">
            <h3 className="text-xl font-semibold text-green-700 mb-2">Lucro Total Estimado</h3>
            <p className="text-3xl font-bold text-green-600">{(resumo.totalLucro || summary.totalProfit || 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</p>
          </div>

          <div className="p-6 rounded-xl shadow text-center bg-gray-50 border-t-4 border-orange-500">
            <h3 className="text-xl font-semibold text-orange-700 mb-2">Ticket Médio por Venda</h3>
            <p className="text-3xl font-bold text-gray-800">{((resumo.totalVendas / (resumo.numeroVendas || summary.totalOrders || 1)) || 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</p>
          </div>
        </div>
      </section>

      <section><FiltrosRelatorio filtros={filtros} setFiltros={setFiltros} /></section>

      <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <ChartLucro dados={dadosFiltrados} />
        <ChartVendasPorStatus dados={dadosFiltrados} />
      </section>

      <section><TabelaVendas dados={dadosFiltrados} /></section>
    </div>
  );
}
