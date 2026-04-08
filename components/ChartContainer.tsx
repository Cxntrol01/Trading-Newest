import ChartHeader from "./ChartHeader";
import FullscreenChart from "./FullscreenChart";
import ChartSettings from "./ChartSettings";

export default function ChartContainer({ children, symbol }: { children: React.ReactNode; symbol: string }) {
  return (
    <div className="chart-container">
      <ChartHeader symbol={symbol} />

      <FullscreenChart>
        {children}
      </FullscreenChart>

      <ChartSettings onChange={(setting) => console.log("Setting changed:", setting)} />
    </div>
  );
}
