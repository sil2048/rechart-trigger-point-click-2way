import "./styles.css";
import React, { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from "recharts";

const data = [
  {
    id: 1,
    name: "Page A",
    uv: 4000,
    pv: 2400,
    amt: 2400,
    selected: false
  },
  {
    id: 2,
    name: "Page B",
    uv: 3000,
    pv: 1398,
    amt: 2210,
    selected: false
  },
  {
    id: 3,
    name: "Page D",
    uv: 2780,
    pv: 3908,
    amt: 2000,
    selected: false
  },
  {
    id: 4,
    name: "Page E",
    uv: 1890,
    pv: 4800,
    amt: 2181,
    selected: false
  },
  {
    id: 5,
    name: "Page F",
    uv: 2390,
    pv: 3800,
    amt: 2500,
    selected: false
  },
  {
    id: 6,
    name: "Page G",
    uv: 3490,
    pv: 4300,
    amt: 2100,
    selected: false
  }
];

const CustomizedDot = (props: any) => {
  const { cx, cy, payload, setPointSelectedPayload } = props;
  useEffect(() => {
    if (payload.selected) {
      const payloadSelected = {
        ...payload,
        cx,
        cy
      };
      setPointSelectedPayload(payloadSelected);
    }
  }, [payload.selected]);

  if (payload.selected) {
    return (
      <svg x={cx - 10} y={cy - 10} width={20} height={20} viewBox="0 0 12 12">
        <circle cx="6" cy="6" r="6" fill="#22628F" />
        <circle cx="6" cy="6" r="4" fill="#0F94F3" />
      </svg>
    );
  }
  return (
    <svg x={cx - 10} y={cy - 10} width={20} height={20} viewBox="0 0 12 12">
      <circle cx="6" cy="6" r="3" fill="#0F94F3" />
    </svg>
  );
};

export default function App() {
  const [pointSelectedPayload, setPointSelectedPayload] = useState(null);
  const [chartData, setChartData] = useState(data);

  const setTooltipPos = (payload: any) => {
    const el = document.getElementById("selectedTooltip");
    const x = payload.cx;
    const y = payload.cy;

    if (el) {
      el.style.transform = "translate(" + x + "px," + y + "px)";
      el.style.visibility = "visible";
    }
  };

  const updateChartData = (pointId: any) => {
    const updatedChartData = chartData.map((obj) => {
      if (obj.id === pointId) {
        obj.selected = true;
      } else {
        obj.selected = false;
      }
      return obj;
    });
    setChartData(updatedChartData);
  };

  const onCloseTooltip = () => {
    const el = document.getElementById("selectedTooltip");
    if (el) {
      el.style.visibility = "hidden";
    }
    setPointSelectedPayload(null);
    updateChartData(null);
  };

  const handlePointClick = (_: any, payload: any) => {
    /// trigger point from chart
    const dotDataSelected = {
      ...payload.payload,
      cx: payload.cx,
      cy: payload.cy
    };
    updateChartData(dotDataSelected.id);
    setPointSelectedPayload(dotDataSelected);
  };

  const onSelectPoint = (dotId: any) => {
    /// trigger point from map action
    updateChartData(dotId);
  };

  useEffect(() => {
    if (pointSelectedPayload) {
      setTooltipPos(pointSelectedPayload);
    }
  }, [pointSelectedPayload]);

  const onMouseLineChartMove = (e: any) => {
    // hidden tooltip for point that it has been actived
    if (!e || !pointSelectedPayload) return;
    const pointPayload = e.activePayload && e.activePayload[0].payload;
    if (pointPayload && pointPayload.id === pointSelectedPayload.id) {
      e.isTooltipActive = false;
    }
  };

  return (
    <>
      {pointSelectedPayload && (
        <div
          id="selectedTooltip"
          className="recharts-tooltip-custom recharts-tooltip-wrapper recharts-tooltip-wrapper-right recharts-tooltip-wrapper-bottom"
        >
          <button className="close-tooltip" onClick={onCloseTooltip}>
            X
          </button>
          <div
            className="recharts-default-tooltip"
            style={{
              margin: "0px",
              padding: "10px",
              backgroundColor: "rgb(255, 255, 255)",
              border: "1px solid rgb(204, 204, 204)",
              whiteSpace: "nowrap"
            }}
          >
            <p className="recharts-tooltip-label" style={{ margin: "0px" }}>
              {pointSelectedPayload.name}
            </p>
            <p className="recharts-tooltip-label" style={{ margin: "0px" }}>
              {pointSelectedPayload.pv}
            </p>
            <p className="recharts-tooltip-label" style={{ margin: "0px" }}>
              {pointSelectedPayload.uv}
            </p>
          </div>
        </div>
      )}
      <LineChart
        width={500}
        height={300}
        data={chartData}
        onMouseMove={onMouseLineChartMove}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line
          type="monotone"
          dataKey="pv"
          stroke="#8884d8"
          dot={({ ...props }) => (
            <CustomizedDot
              setPointSelectedPayload={setPointSelectedPayload}
              {...props}
            />
          )}
          activeDot={{ onClick: handlePointClick }}
        />
      </LineChart>
      <button onClick={() => onSelectPoint(3)}>Map Event trigger</button>
    </>
  );
}
