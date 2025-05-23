import { useEffect, useState } from "react";
import PageComponent from "../components/PageComponent";
import axiosClient from "../axios";
import { useParams } from "react-router-dom";
import Loading from "../views/Loading";
import {
  ResponsiveContainer,
  BarChart,
  XAxis,
  YAxis,
  Tooltip,
  Bar,
  CartesianGrid,
} from 'recharts';

export default function Analytics() {
  const { short_url } = useParams();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    unique: 0,
    by_country: {},
    by_referrer: {},
    by_device: {},
    by_browser: {},
    by_os: {},
  });
  const [monthlyData, setMonthlyData] = useState([]);
  const [filter, setFilter] = useState('last_6_months');

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await axiosClient.get(`/get-analytics/${short_url}`);
      const { data } = response;
      if (data) {
        setStats({
          total: data.total,
          unique: data.unique,
          by_country: data.by_country,
          by_referrer: data.by_referrer,
          by_device: data.by_device,
          by_browser: data.by_browser,
          by_os: data.by_os,
        });
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMonthly = async (period) => {
    try {
      const response = await axiosClient.get(
        `/get-analytics/${short_url}/monthly`,
        { params: { period } }
      );
      if (response.data && response.data.monthly) {
        setMonthlyData(response.data.monthly);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchData();
    fetchMonthly(filter);
  }, [short_url, filter]);

  if (loading) {
    return (
      <PageComponent title="Analytics">
        <div className="flex justify-center items-center min-h-screen">
          <Loading />
        </div>
      </PageComponent>
    );
  }

  const renderList = (title, dataObj) => (
    <div className="">
      <h3 className="text-lg font-bold text-primary-bg mb-2">{title}</h3>
      <ul className="space-y-1">
        {Object.entries(dataObj).map(([key, count]) => (
          <li key={key} className="text-light">
            {key} &nbsp;|&nbsp; {count}
          </li>
        ))}
      </ul>
    </div>
  );

  return (
    <PageComponent title="Analytics">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-primary-bg text-primary-text p-6 rounded-2xl shadow">
          <h2 className="text-xl font-semibold">Total Visits</h2>
          <p className="text-4xl mt-2">{stats.total}</p>
        </div>
        <div className="bg-primary-bg text-primary-text p-6 rounded-2xl shadow">
          <h2 className="text-xl font-semibold">Unique Visits</h2>
          <p className="text-4xl mt-2">{stats.unique}</p>
        </div>
      </div>

      {/* Monthly Visits Chart */}
      <div className="mt-10 bg-secondary-bg text-secondary-text p-6 rounded-2xl shadow">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-blue">Monthly Visits</h3>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="bg-theme-secondary text-white rounded-full px-4 py-1 outline-none"
          >
            <option value="last_6_months">Last 6 Months</option>
            <option value="this_year">This Year</option>
            <option value="last_year">Last Year</option>
          </select>
        </div>
        {monthlyData.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthlyData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#091696" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-center text-dark">No data available for selected period.</p>
        )}
      </div>

        <div className="flex justify-between bg-zinc-900 mt-10 rounded-2xl shadow p-6">
          {renderList('Visits by Country', stats.by_country)}
          {renderList('Visits by Referrer', stats.by_referrer)}
          {renderList('Visits by Device Type', stats.by_device)}
          {renderList('Visits by Browser', stats.by_browser)}
          {renderList('Visits by OS', stats.by_os)}
        </div>
    </PageComponent>
  );
}
