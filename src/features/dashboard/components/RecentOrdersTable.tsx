import { type DashboardOrder } from '../../../api/dashboard';
import { Clock, Zap, MoreHorizontal, AlertCircle } from 'lucide-react';

interface Props {
  orders: DashboardOrder[];
  isLoading: boolean;
}

const statusConfig: Record<string, { label: string; className: string }> = {
  Pending:    { label: 'Pending',    className: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400' },
  Processing: { label: 'Diproses',  className: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400' },
  Ready:      { label: 'Siap',      className: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' },
  Completed:  { label: 'Selesai',   className: 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400' },
  Cancelled:  { label: 'Dibatalkan',className: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400' },
};

export default function RecentOrdersTable({ orders, isLoading }: Props) {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-transparent dark:border-slate-800 transition-colors">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Pesanan Terkini</h2>
        <span className="text-xs text-slate-400 dark:text-slate-500">{orders.length} pesanan</span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm text-slate-700 dark:text-slate-300">
          <thead className="text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800">
            <tr>
              <th className="text-left py-3 pr-4">Pelanggan</th>
              <th className="text-left py-3 pr-4">Layanan</th>
              <th className="text-left py-3 pr-4">No. Plat</th>
              <th className="text-left py-3 pr-4">Level</th>
              <th className="text-left py-3 pr-4">Biaya</th>
              <th className="text-left py-3 pr-4">Status</th>
              <th className="text-right py-3">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {isLoading ? (
              <tr>
                <td colSpan={7} className="py-12 text-center">
                  <div className="flex justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
                  </div>
                </td>
              </tr>
            ) : orders.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-12 text-center">
                  <div className="flex flex-col items-center gap-2 text-slate-400 dark:text-slate-500">
                    <AlertCircle size={32} />
                    <p className="text-sm">Belum ada pesanan</p>
                  </div>
                </td>
              </tr>
            ) : (
              orders.map((order) => {
                const date = new Date(order.order_date).toLocaleDateString('id-ID', {
                  day: 'numeric', month: 'short', year: 'numeric',
                });
                const status = statusConfig[order.status] ?? { label: order.status, className: 'bg-slate-100 text-slate-600' };
                const isExpress = order.service_level === 'EXPRESS';

                return (
                  <tr key={order.order_id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="py-3.5 pr-4">
                      <p className="font-medium text-slate-900 dark:text-white">{order.customer_name}</p>
                      <p className="text-xs text-slate-400 dark:text-slate-500">{date}</p>
                    </td>
                    <td className="py-3.5 pr-4 max-w-[160px] truncate" title={order.service_name}>
                      {order.service_name}
                    </td>
                    <td className="py-3.5 pr-4">
                      <span className="font-mono text-xs bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded">
                        {order.plate_number}
                      </span>
                    </td>
                    <td className="py-3.5 pr-4">
                      <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full ${isExpress ? 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'}`}>
                        {isExpress ? <Zap size={11} /> : <Clock size={11} />}
                        {order.service_level}
                      </span>
                    </td>
                    <td className="py-3.5 pr-4 font-semibold text-slate-900 dark:text-white">
                      Rp {(order.total_cost || 0).toLocaleString('id-ID')}
                    </td>
                    <td className="py-3.5 pr-4">
                      <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${status.className}`}>
                        {status.label}
                      </span>
                    </td>
                    <td className="py-3.5 text-right">
                      <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-400 dark:text-slate-500 transition-colors cursor-pointer">
                        <MoreHorizontal size={16} />
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
