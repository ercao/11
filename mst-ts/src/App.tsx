import { useRef, useEffect, useState } from "react";
import { getCenter, getDistance, isPointWithinRadius } from "geolib";
import { useMapContext, APILoader, Provider, useMap } from "@uiw/react-baidu-map";
import { EdgeInfo, Graph } from "./lib/Graph";
import { kruskal, prim } from "./lib/mst";
import { compare } from "./lib/utils";

function getMst(points: BMap.Point[], usePrim = true): EdgeInfo<BMap.Point, number>[] {
  const graph = new Graph<BMap.Point, number>();
  points.forEach((p1) => {
    points.forEach((p2) => {
      if (p1 === p2) return;
      graph.addEdge(p1, p2, getDistance(p1, p2));
    });
  });

  return usePrim ? prim(graph, compare) : kruskal(graph, compare);

  // console.log(edges);
  //
  // return edges;
}

// 选取的点
const dataSet = new Set<BMap.Point>();

const Page = () => {
  const divElm = useRef(null);

  const [algo, setAlgo] = useState("kruskal");
  // const [points, setPoints] = useState<BMap.Point[]>([]);

  const { BMap } = useMapContext();
  const { setContainer, map } = useMap({
    zoom: 17,
    center: "燕山大学",
    widget: [],
    enableDoubleClickZoom: false,
    enableScrollWheelZoom: true,
    enableMapClick: false,
    onDblClick: ({ point }) => {
      if (!(BMap && map)) return;

      // 10 米内就删除
      let ps = [...dataSet.values()].filter((value) => isPointWithinRadius(point, value, 10));
      // console.log(ps);

      if (ps.length < 1) {
        dataSet.add(point);
      } else {
        ps.forEach((p) => {
          dataSet.delete(p);
        });
      }

      /// 重新绘制
      map.clearOverlays();
      dataSet.forEach((point) => map.addOverlay(new BMap.Marker(point)));

      getMst([...dataSet.values()]).forEach((points) => {
        map.addOverlay(new BMap.Polyline([points.to, points.from]));

        // 两点连线中间添加 weight 标签
        let center = getCenter([points.to, points.from]);
        if (center === false) {
          console.log(center);
        } else {
          map.addOverlay(
            new BMap.Label(points.weight.toString(), { position: { lng: center.longitude, lat: center.latitude } })
          );
        }
      });
    },
  });

  useEffect(() => {
    if (divElm.current) {
      setContainer(divElm.current);
    }
  });

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-around",
        gap: "10px",
      }}
    >
      <button
        onClick={() => {
          dataSet.clear();
          map?.clearOverlays();
        }}
      >
        重置
      </button>
      <div
        style={{
          padding: "10px",
          display: "flex",
          gap: "10px",
          alignItems: "start",
          justifyContent: "center",
        }}
      >
        <label style={{}}>
          <input
            onChange={() => setAlgo("kruskal")}
            name="algo"
            type="radio"
            value={"kruskal"}
            checked={algo === "kruskal"}
          />
          Kruskal 算法
        </label>
        <label>
          <input onChange={() => setAlgo("prim")} name="algo" type="radio" value={"prim"} checked={algo === "prim"} />
          Prim 算法
        </label>
      </div>

      <div ref={divElm} style={{ width: "100%", height: "100%" }} />
    </div>
  );
};

export default function App() {
  return (
    <div style={{ width: "100%", height: "100%" }}>
      <APILoader akay="0x1anp01fRY0604KWuCHX3MW0MOvR7Yz">
        <Provider>
          <Page />
        </Provider>
      </APILoader>
    </div>
  );
}
