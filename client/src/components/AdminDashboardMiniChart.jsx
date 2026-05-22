import { memo } from 'react';
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

const formatCurrency = (value) =>
  new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    maximumFractionDigits: 0,
  }).format(Number(value || 0));

function AdminDashboardMiniChart({ data = [], loading = false, totalSales = 0 }) {
  const hasSalesData = data.some((item) => Number(item?.total || 0) > 0);
  const hasHistoricalSales = Number(totalSales || 0) > 0;

  if (loading) {
    return (
      <section className="admin-dashboard-panel admin-mini-chart-panel">
        <div className="admin-panel-header">
          <div>
            <span className="admin-panel-eyebrow">Ventas</span>
            <h2>Ultimos 7 dias</h2>
          </div>
        </div>
        <div className="admin-chart-skeleton admin-mini-chart-compact placeholder-glow">
          <span className="placeholder col-12" />
          <span className="placeholder col-10" />
          <span className="placeholder col-8" />
        </div>
      </section>
    );
  }

  if (!hasSalesData) {
    return (
      <section className="admin-dashboard-panel admin-mini-chart-panel admin-mini-chart-empty-panel">
        <div className="admin-panel-header">
          <div>
            <span className="admin-panel-eyebrow">Ventas</span>
            <h2>Ultimos 7 dias</h2>
          </div>
          <span className="admin-panel-chip">Resumen</span>
        </div>

        <div className="admin-mini-chart-empty">
          <span className="admin-mini-chart-empty-icon">
            <i className="bi bi-graph-up-arrow" aria-hidden="true" />
          </span>
          <div>
            <strong>
              {hasHistoricalSales ? 'No hay ventas en los últimos 7 días' : 'Aún no hay ventas registradas'}
            </strong>
            <p>
              {hasHistoricalSales
                ? 'Las ventas historicas siguen disponibles en el resumen general.'
                : 'Cuando ingresen ordenes pagadas, veras una tendencia compacta aca.'}
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="admin-dashboard-panel admin-mini-chart-panel">
      <div className="admin-panel-header">
        <div>
          <span className="admin-panel-eyebrow">Ventas</span>
          <h2>Ultimos 7 dias</h2>
        </div>
        <span className="admin-panel-chip">Resumen</span>
      </div>

      <div className="admin-mini-chart">
        <ResponsiveContainer width="100%" height={150}>
          <AreaChart data={data} margin={{ top: 8, right: 6, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="salesMiniGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#42c4ff" stopOpacity={0.42} />
                <stop offset="95%" stopColor="#42c4ff" stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <XAxis dataKey="label" axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 12 }} />
            <YAxis hide domain={[0, 'dataMax']} />
            <Tooltip
              cursor={{ stroke: 'rgba(66,196,255,0.18)', strokeWidth: 1 }}
              contentStyle={{
                background: '#0b1220',
                border: '1px solid rgba(255,255,255,0.12)',
                borderRadius: '10px',
                color: '#f4f7ff',
              }}
              itemStyle={{ color: '#f4f7ff' }}
              formatter={(value) => [formatCurrency(value), 'Ventas']}
              labelFormatter={(label) => `Dia ${label}`}
            />
            <Area
              type="monotone"
              dataKey="total"
              stroke="#42c4ff"
              strokeWidth={2.4}
              fill="url(#salesMiniGradient)"
              dot={false}
              activeDot={{ r: 4, strokeWidth: 0, fill: '#8d5cff' }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}

export default memo(AdminDashboardMiniChart);
