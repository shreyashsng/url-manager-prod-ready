import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { BarChart } from "@mui/x-charts/BarChart";

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalLinks: 0,
    totalClicks: 0,
    activeLinks: 0,
  });
  const [urls, setUrls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectAnalytics, setSelectAnalytics] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");

    const fetchData = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/urls/my-urls`,
          {
            headers: { Authorization: `Bearer ${token}` },
            withCredentials: true,
          }
        );
        console.log("Dashboard API response:", res.data);
        setStats(res.data.stats);
        setUrls(res.data.urls);
      } catch (error) {
        console.error("Error loading dashboard: ", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const fetchAnalytics = async(shortCode) => {
    const token = localStorage.getItem("token");
    try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/urls/analytics/${shortCode}`, {headers: {Authorization: `Bearer ${token}`}});
        setSelectAnalytics(res.data);
        setModalOpen(true);
    } catch (error) {
        console.error(error);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-50">Loading dashboard...</p>
      </div>
    );
  }

  const chartData = urls.map((u) => ({
    shortCode: u.shortCode,
    clicks: u.clicks,
  }));

  return (
    <main className="min-h-screen flex flex-col">
      <header className="px-6 py-4 flex items-center justify-between">
        <h1 className="text-2xl">Dashboard</h1>
        <nav className="flex">
          <ul className="flex gap-6 text-gray-600">
            <Link to={"/"}>Home</Link>
          </ul>
        </nav>
      </header>

      <section className="p-6 grid gap-6 md:grid-cols-3">
        <div className="p-6 rounded-xl shadow">
          <h2 className="text-lg font-semibold">Total shortened links</h2>
          <p className="mt-2 text-3xl font-bold">{stats.totalLinks}</p>
        </div>
        <div className="p-6 rounded-xl shadow">
          <h2 className="text-lg font-semibold">Total Clicks</h2>
          <p className="mt-2 text-3xl font-bold">{stats.totalClicks}</p>
        </div>
        <div className="p-6 rounded-xl shadow">
          <h2 className="text-lg font-semibold">Active Links</h2>
          <p className="mt-2 text-3xl font-bold">{stats.activeLinks}</p>
        </div>
      </section>

      {urls.length > 0 && (
        <section className="p-6">
          <h3 className="text-lg font-semibold mb-4 text-gray-800">Clicks per URL</h3>
          <BarChart
            dataset={chartData}
            xAxis={[{ dataKey: "shortCode", label: "Short Code" }]}
            series={[{ dataKey: "clicks", label: "Clicks", color: '#2563eb' }]}
            height={300}
          />
        </section>
      )}

      <section className="p-6">
        <h3 className="font-lg font-semibold mb-3 text-gray-800">Your URLs</h3>
        {urls.length === 0 ? (
          <p className="text-gray-600">No URLs yet</p>
        ) : (
          <ul>
            {urls.map((u) => (
              <li
                key={u.id}
                className="p-3 rounded shadow flex flex-col sm:flex-row sm:item-center sm:jutify-between"
              >
                <a
                  href={u.original}
                  target="_blank"
                  className="text-blue-700 max-w-xs truncate"
                  title={u.original}
                >
                  {u.original}
                </a>
                <a
                  href={`${import.meta.env.VITE_API_URL}/urls/${u.shortCode}`}
                  target="_blank"
                  className="text-green-600 hover:underline break-all"
                >
                  {window.location.origin}/{u.shortCode}
                </a>
                <button onClick={() => fetchAnalytics(u.shortCode)} className="bg-indigo-500 hover:bg-indigo-600 text-white px-3 py-1 rounded mt-2 sm:mt-0">Analytics</button>
              </li>
            ))}
          </ul>
        )}
      </section>

      {modalOpen && selectAnalytics &&  (
        <div className="fixed inset-0 flex flex items-center justify-center bg-opacity-50 z-50">
            <div className="bg-white p-6 rounded-lg max-w-lg w-full max-h-[80vh] overflow-y-auto shadow-lg">
                <h2 className="text-xl font-bold mb-4">Analytics</h2>
                <p className="mb-2">
                    <strong>Total Clicks:</strong>{selectAnalytics.totalClicks}
                </p>
                <p className="mb-2">
                    <strong>Unique Visitors:</strong>{selectAnalytics.uniqueVisitors}
                </p>

                <h3 className="font-semibold mb-2">Daily Clicks:</h3>
                <ul className="list-disc list-inside max-h-32 overflow-y-auto">
                    {selectAnalytics.dailyClicks.map((d, idx) => (
                        <li key={idx}>
                            {new Date(d.createdAt).toLocaleString()} - {d._count} click {d._count>1 ? "s" : ""}
                        </li>
                    ))}
                </ul>

                <h3 className="font-semibold mb-2">Events</h3>
                <ul className="list-disc list-inside max-h-48 overflow-y-auto">
                    {selectAnalytics.events.map((e) => (
                        <li key={e.id} className="mb-1">
                            <span className="block text-sm text-gray-600">
                                {new Date(e.createdAt).toLocaleString()} - IP: {e.ip}
                            </span>
                            <span className="block text-sm text-gray-500 truncate">
                                {e.userAgent}
                            </span>
                            {e.referer && (
                                <span className="block text-xs text-blue-500 truncate">
                                    Referer: {e.referer}
                                </span>
                            )}
                        </li>
                    ))}
                </ul>

                <div className="mt-4 text-right">
                    <button onClick={() => setModalOpen(false)} className="mt-4 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded">Close</button>
                </div>
            </div>
        </div>
      )}
    </main>
  );
};

export default Dashboard;
