import StatCard from "./components/StatCard";
import LineChart from "./components/LineChart";
import HorizontalBarChart from "./components/HorizontalBarChart";
import DocumentItem from "./components/DocumentItem";
import DocumentDetail from "./components/DocumentDetail";
import { useState } from "react";
import { FileText, Clock, CheckCircle, TrendingUp } from "lucide-react";
import { documents } from "../../data/document";
import InvoiceTable from "./components/InvoiceTable";

export default function Dashboard() {
  const [activeDoc, setActiveDoc] = useState<any | null>(null);

  return (
    <>
      <div className="w-full bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto px-6 py-6 space-y-6">
          <h1 className="text-2xl font-bold">Dashboard Analytics</h1>

          {/* KPI */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              title="Total Pengajuan"
              value={120}
              description="Naik 12% dari minggu lalu"
              variant="info"
              icon={FileText}
            />
            <StatCard
              title="Hari Ini"
              value={8}
              description="8 pengajuan baru hari ini"
              variant="warning"
              icon={Clock}
            />
            <StatCard
              title="Sukses"
              value={90}
              description="90% berhasil diproses"
              variant="success"
              icon={CheckCircle}
            />
            <StatCard
              title="Pending"
              value={30}
              description="30 pengajuan menunggu review"
              variant="warning"
              icon={TrendingUp}
            />
          </div>

          {/* CHART SECTION */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Line Chart */}
            <div className="bg-white p-4 rounded-xl shadow">
              <h2 className="font-semibold mb-4">Pengajuan Mingguan</h2>
              <LineChart />
            </div>

            {/* Horizontal Bar */}
            <div className="bg-white p-4 rounded-xl shadow">
              <h2 className="font-semibold mb-4">Layanan Populer</h2>
              <HorizontalBarChart />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-10">
            {/* KIRI */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl p-5 space-y-4 shadow-sm">
                <h2 className="text-lg font-semibold">Dokumen Aktif</h2>

                {documents.map((doc) => (
                  <DocumentItem
                    key={doc.id}
                    data={doc}
                    active={activeDoc?.id === doc.id}
                    onClick={() => setActiveDoc(doc)}
                  />
                ))}
              </div>
            </div>

            {/* KANAN */}
            <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow">
              <DocumentDetail doc={activeDoc} />
            </div>
          </div>

          <div className="mt-12 pt-6 border-t border-gray-200">
            <InvoiceTable />
          </div>
        </div>
      </div>
    </>
  );
}
