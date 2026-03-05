import type React from "react";

interface SkeletonRowProps {
  labelWidth?: string;
  valueWidth?: string;
}

const SkeletonRow: React.FC<SkeletonRowProps> = ({ labelWidth = "120px", valueWidth = "60%" }) => (
  <div className="skeleton-row">
    <span className="skeleton-pulse" style={{ width: labelWidth, height: 14 }} />
    <span className="skeleton-pulse" style={{ width: valueWidth, height: 14 }} />
  </div>
);

interface SkeletonTableProps {
  rows?: number;
  columns?: number;
}

const SkeletonTable: React.FC<SkeletonTableProps> = ({ rows = 5, columns = 5 }) => (
  <div className="skeleton-table">
    <div className="skeleton-table-header">
      {Array.from({ length: columns }).map((_, i) => (
        // biome-ignore lint/suspicious/noArrayIndexKey: skeleton placeholder
        <span key={i} className="skeleton-pulse" style={{ width: `${100 / columns - 2}%`, height: 12 }} />
      ))}
    </div>
    {Array.from({ length: rows }).map((_, i) => (
      // biome-ignore lint/suspicious/noArrayIndexKey: skeleton placeholder
      <div key={i} className="skeleton-table-row">
        {Array.from({ length: columns }).map((_, j) => (
          // biome-ignore lint/suspicious/noArrayIndexKey: skeleton placeholder
          <span key={j} className="skeleton-pulse" style={{ width: `${100 / columns - 2}%`, height: 14 }} />
        ))}
      </div>
    ))}
  </div>
);

interface SkeletonCardProps {
  lines?: number;
}

const SkeletonCard: React.FC<SkeletonCardProps> = ({ lines = 3 }) => (
  <div className="skeleton-card">
    <span className="skeleton-pulse" style={{ width: "40%", height: 18, marginBottom: 12 }} />
    {Array.from({ length: lines }).map((_, i) => (
      // biome-ignore lint/suspicious/noArrayIndexKey: skeleton placeholder
      <span key={i} className="skeleton-pulse" style={{ width: `${70 + Math.random() * 25}%`, height: 14, marginBottom: 8 }} />
    ))}
  </div>
);

interface SkeletonDashboardProps {
  statCards?: number;
}

const SkeletonDashboard: React.FC<SkeletonDashboardProps> = ({ statCards = 3 }) => (
  <div className="skeleton-dashboard">
    <div className="skeleton-stats-row">
      {Array.from({ length: statCards }).map((_, i) => (
        // biome-ignore lint/suspicious/noArrayIndexKey: skeleton placeholder
        <div key={i} className="skeleton-stat-card">
          <span className="skeleton-pulse" style={{ width: "60%", height: 12 }} />
          <span className="skeleton-pulse" style={{ width: "40%", height: 22, marginTop: 8 }} />
        </div>
      ))}
    </div>
    <div className="skeleton-panels-row">
      <SkeletonTable rows={5} columns={4} />
      <SkeletonTable rows={5} columns={4} />
    </div>
  </div>
);

interface SkeletonDetailProps {
  rows?: number;
}

const SkeletonDetail: React.FC<SkeletonDetailProps> = ({ rows = 8 }) => (
  <div className="skeleton-detail">
    {Array.from({ length: rows }).map((_, i) => (
      // biome-ignore lint/suspicious/noArrayIndexKey: skeleton placeholder
      <SkeletonRow key={i} valueWidth={`${40 + Math.random() * 40}%`} />
    ))}
  </div>
);

export { SkeletonRow, SkeletonTable, SkeletonCard, SkeletonDashboard, SkeletonDetail };
