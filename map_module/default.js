import dijkstra from "../node_modules/dijkstrajs/dijkstra.js";
import {
  tinhGoc,
  getDirection
} from "./tinhgoc.js";
import edges1 from "../data/edges.js";
import nodes from "../data/nodes.js";
import dalat_RG from "../data/dalat_rg.js";

let view = new ol.View({
  center: [108.45, 11.94],
  zoom: 11,
  projection: "EPSG:4326"
});
let mousePosition = new ol.control.MousePosition({
  target: "mouse-position",
  undefinedHTML: "",
  projection: "EPSG:4326"
});
let map = new ol.Map({
  view: view,
  target: "map",
  controls: [mousePosition]
});




// Layer đường đi 
let lineSource = new ol.source.Vector({})
let lineLayer = new ol.layer.Vector({
  source: lineSource,
  map: map,
  style: function (feature) {
    var style = new ol.style.Style({
      text: new ol.style.Text({
        font: 'bold 11px "Open Sans", "Arial Unicode MS", "sans-serif"',
        placement: 'line',
        fill: new ol.style.Fill({
          color: 'white'
        })
      }),
      stroke: new ol.style.Stroke({
        color: feature.get("bridge") == "F" ? 'green' : "red",
        width: 5,
        lineCap: 'round'
      })
    });
    style.getText().setText(feature.get('name'));
    return style;
  }
})


let travelPoint = new Array();
let travelNodes = new Array();

var startPointSource = new ol.source.Vector({});
var viaPointSource = new ol.source.Vector({});

var startPointLayer = new ol.layer.Vector({
  source: startPointSource,
  style: new ol.style.Style({
    image: new ol.style.Icon(({
      anchor: [0.5, 20],
      anchorXUnits: 'fraction',
      anchorYUnits: 'pixels',
      src: './asset/placeholderGreen.png'
    }))
  }),
  map: map
});

var viaPointLayer = new ol.layer.Vector({
  source: viaPointSource,
  style: new ol.style.Style({
    image: new ol.style.Icon(({
      anchor: [0.5, 20],
      anchorXUnits: 'fraction',
      anchorYUnits: 'pixels',
      src: './asset/placeholderRed.png'
    }))
  }),
  map: map
});


var arrowLineSource = new ol.source.Vector({});
var arrowLineLayer = new ol.layer.Vector({
  source: arrowLineSource,
  map: map,
  style: new ol.style.Style({
    stroke: new ol.style.Stroke({
      color: "blue",
      width: 4,
      lineCap: 'round'
    })
  })
});

var arrows = new ol.source.Vector({});
var arrowLayer = new ol.layer.Vector({
  source: arrows,
  map: map
})

function addArrow(start, end) {
  var dx = end[0] - start[0];
  var dy = end[1] - start[1];
  var rotation = Math.atan2(dy, dx);

  // let x = (start[0]+3*end[0])/4;
  // let y = (start[1]+3*end[1])/4;
  let x = end[0];
  let y = end[1];

  let arrow = new ol.geom.Point([x, y]);
  let arrowFeature = new ol.Feature({
    geometry: arrow
  });
  arrowFeature.setStyle(
    new ol.style.Style({
      image: new ol.style.RegularShape({
        fill: new ol.style.Fill({
          color: 'blue'
        }),
        points: 3,
        radius: 7,
        rotation: -rotation,
        angle: Math.PI / 2 // rotate 90°
      })
    })
  )
  arrows.addFeature(arrowFeature);

}


let prePElementContent = "";
let direction = "";
let preFeature;
let roadLength = 0;

function timer(ms) {
  return new Promise(res => setTimeout(res, ms));
}

async function drawRoad(directionArr, roadsArr) {
  try {
    lineSource.clear();
  } catch (error) {

  }
  try {
    arrows.clear();
  } catch {

  }
  document.getElementById("data").innerHTML = "";
  console.log("direction", directionArr);
  console.log("roads", roadsArr);
  for (let i = 0; i < directionArr.length; i++) {
    let arrPoint = (i < directionArr.length - 1) ? roadsArr[directionArr[i]][directionArr[i + 1]] : roadsArr[directionArr[i]][directionArr[0]];
    for (let index = 0; index < arrPoint.length - 1; index++) {
      await timer(100);
      try {
        //  console.log(index + ":  "+ arrPoint[index] +" " + arrPoint[index+1] );
        let drawLineArrow;
        let featureName = `${arrPoint[index]}to${arrPoint[index+1]}`;
        let featureName2 = `${arrPoint[index+1]}to${arrPoint[index]}`;
        let feature;
        // let feature = new ol.format.GeoJSON().readFeature(featuresEdge[featureName]?featuresEdge[featureName]:featuresEdge[featureName2]);


        if (featuresEdge[featureName]) {
          feature = new ol.format.GeoJSON().readFeature(featuresEdge[featureName]);
        } else {
          let reverseFea = featuresEdge[featureName2];
          reverseFea.geometry.coordinates[0] = reverseFea.geometry.coordinates[0].reverse();
          feature = new ol.format.GeoJSON().readFeature(reverseFea);
        }

        // console.log(feature.getProperties())
        let name = feature.getProperties().name;
        let roadlength = feature.getProperties().roadlength;
        let isBridge = feature.getProperties().bridge == "T" ? true : false;
        roadLength += roadlength;
        if (preFeature) {
          let coordinates1 = preFeature.getGeometry().getCoordinates()[0][preFeature.getGeometry().getCoordinates()[0].length - 2];
          let coordinates2 = feature.getGeometry().getCoordinates()[0][0];
          let coordinates3 = feature.getGeometry().getCoordinates()[0][1];

          // console.log("coordinates1 ",coordinates1);
          // console.log("coordinates2 ",coordinates2);
          // console.log("coordinates3 ",coordinates3);
          direction = getDirection(tinhGoc(coordinates1, coordinates2, coordinates3));

          drawLineArrow = () => {
            try {
              arrowLineSource.clear();
            } catch (error) {

            }
            try {
              arrows.clear();
            } catch (error) {

            }
            arrowLineSource.addFeature(new ol.Feature({
              geometry: new ol.geom.LineString([coordinates1, coordinates2, coordinates3])
            }));
            addArrow(coordinates2, coordinates3);
            map.getView().animate({
              zoom: 17
            }, {
              center: coordinates2
            }, {
              duration: 0
            });
          }

          // console.log(direction)
        }

        if ( /*name!=prePElementContent*/ true) {

          let pElement = document.createElement("tr");
          pElement.className = "road-agenda";
          pElement.onclick = drawLineArrow;

          if (isBridge) {
            pElement.innerHTML = `<td>${direction} ${name?"Cầu"+name:"Cầu"}</td> <td>  ${roadLength.toFixed(2)}Km</td>`;
          } else {
            pElement.innerHTML = `<td>${direction} ${name?name:"đường nhỏ"}</td> <td>  ${roadLength.toFixed(2)}Km</td>`;
          }
          document.getElementById("data").appendChild(pElement);
          prePElementContent = name;


        }

        preFeature = feature;

        lineSource.addFeature(feature);
      } catch (error) {
        console.log(error.message)
      }

    }

    let pElement = document.createElement("tr");
    pElement.innerHTML = `<td><strong>ĐẾN ĐIỂM ${i+1}</strong></td> <td>  ${roadLength.toFixed(2)}Km</td>`;
    document.getElementById("data").appendChild(pElement);


  }
}


let features;
let featuresEdge = {};
let urlEdges = `http://localhost:8080/geoserver/routing/ows?service=WFS&version=2.0.0&request=GetFeature&typeName=routing%3Adalat_routing&maxFeatures=50&outputFormat=application%2Fjson`
let urlNodes = `http://localhost:8080/geoserver/routing/ows?service=WFS&version=2.0.0&request=GetFeature&typeName=routing:dalat_nodes&maxFeatures=50&outputFormat=application/json`;
let graph = {};

let edgesSource = new ol.source.Vector();

let verticesSource = new ol.source.Vector({});
let verticesLayer = new ol.layer.Vector({
  source: verticesSource,
  //   map:map
})


var getEdgeFeatures = async () => {
  //  await fetch(urlEdges).then((response)=>{
  //     return response.json();
  //   }).then((result)=>{
  //     // console.log(result);
  //     let features=result.features;
  //     let props;
  //     for (let feature of features) {   
  //       props=feature.properties;  
  //       featuresEdge[props.objkey]=feature;
  //     }
  //   }).then(()=>{
  //     // console.log(featuresEdge)
  //   })

  let features = edges1.features;
  let props;
  for (let feature of features) {
    props = feature.properties;
    featuresEdge[props.objkey] = feature;
  }
}

var getNodesFeature = async () => {
  // fetch(urlNodes).then((response)=>{
  //   return response.json();  
  // }).then((result)=>{   
  //   features=result.features;
  //   let props;
  //   for (let feature of features) {
  //       var verticesFeature = new ol.format.GeoJSON().readFeature(feature);
  //       verticesSource.addFeature(verticesFeature);
  //       let sourceId = feature.properties.gid;
  //       props=feature.properties;  
  //       let relation = props.relation.split(",");
  //       for (let targetId of relation) {            
  //         let target = features[targetId-1];
  //         if (!target) continue;      
  //         let dist = featuresEdge[`${sourceId}to${targetId}`]?featuresEdge[`${sourceId}to${targetId}`].properties.roadlength:featuresEdge[`${targetId}to${sourceId}`].properties.roadlength;     
  //         graph[props.gid]={...graph[props.gid],[targetId]:dist};
  //       }
  //   }
  // }).then(()=>{
  //   // console.log(graph)
  // })

  features = nodes.features;
  let props;
  for (let feature of features) {
    var verticesFeature = new ol.format.GeoJSON().readFeature(feature);
    verticesSource.addFeature(verticesFeature);
    let sourceId = feature.properties.gid;
    props = feature.properties;
    let relation = props.relation.split(",");
    for (let targetId of relation) {
      let target = features[targetId - 1];
      if (!target) continue;
      let dist = featuresEdge[`${sourceId}to${targetId}`] ? featuresEdge[`${sourceId}to${targetId}`].properties.roadlength : featuresEdge[`${targetId}to${sourceId}`].properties.roadlength;
      graph[props.gid] = {
        ...graph[props.gid],
        [targetId]: dist
      };
    }
  }
}

getEdgeFeatures().then(() => getNodesFeature());

var convertTravelPointsToNodes = async () => {
  let places = document.getElementsByClassName("place-input");
  while (travelPoint.length > 0) {
    travelPoint.pop();
    travelNodes.pop();
  }
  for (let place of places) {
    travelPoint.push(place.dataset.coordinate.split(",").map((item) => Number(item)));
  }
  for (let coordinate of travelPoint) {
    travelNodes.push(verticesSource.getClosestFeatureToCoordinate(coordinate).get("gid"))
  }
  console.log(travelNodes);
};

let waysTravel; //Ma trận đường di chuyển.
let graphTravel; //Ma trận khoảng cách di chuyển. 

async function initTravelGraph() {
  waysTravel = [];
  graphTravel = [];
  async function createTravelData() {
    for (let i = 0; i < travelNodes.length; i++) {
      let graphs = new Array();
      let result = new Array();
      for (let j = 0; j < travelNodes.length; j++) {
        let solution = await dijkstra.find_path(graph, travelNodes[i], travelNodes[j]);
        graphs[j] = solution.dist;
        result[j] = solution.solutions;
      }
      graphTravel.push(graphs);
      waysTravel.push(result);
    }
  };

  await createTravelData();
}

document.getElementById("btn-addPlace").addEventListener("click", async () => {
  // document.getElementById("loading").style.display="block";
  await convertTravelPointsToNodes();
  await initTravelGraph();
  console.log("graph Travel", graphTravel);
  console.log("way Travel", waysTravel);


  // await new Promise(r => setTimeout(r, 1000));

  duongngannhat().then((result) => {
    console.log(result);
    // document.getElementById("loading").style.display="none";

    drawRoad(result, waysTravel);

  });





});



async function duongngannhat() {
  let c;
  let n = travelNodes.length;
  let x = [];
  let chuaxet = [];
  let ketqua = [];

  function taoDuLieu() {
    c = graphTravel;
    for (var i = 1; i < n; i++) {
      chuaxet[i] = 1;
      x[i] = 0
    }
  }

  await taoDuLieu();

  var MIN = 0;
  var a = 1;
  x[0] = 0;

  function Work() {
    var S = 0;
    for (var i = 0; i < n - 1; i++) {
      S = S + c[x[i]][x[i + 1]];
    }
    S = S + c[x[n - 1]][0];
    if (S < MIN || a == 1) {
      a = 0;
      MIN = S;
      for (var i = 0; i < n; i++) {
        ketqua[i] = x[i];
      }
    }
  }

  function Try(i) {
    for (var j = 1; j < n; j++) {
      if (chuaxet[j]) {
        x[i] = j;
        chuaxet[j] = 0;
        if (i == (n - 1)) {
          Work();
        } else {
          Try(i + 1);
        }
        chuaxet[j] = 1;
      }
    }

  }
  Try(1);
  // // quang duong di
  // console.log("ketqua",ketqua);
  // console.log(MIN);
  return ketqua;
}
// async function duongngannhat() {
//   let chua_xet = [];
//   let so_thanh_pho=travelNodes.length;
//   let graph = [];
//   graph=[...graphTravel];
//   let min_of_graph_element=9999;
//   let min = 9999;
//   let current_cost = 0;
//   let result=[];
  
//   async function init() {
//       for (let i=0;i<so_thanh_pho;i++) {
//           chua_xet[i]=true;
//           result[i]=0;        
//       }
//       for (let i=0;i<so_thanh_pho;i++) {
//           for (let j=0;j<so_thanh_pho;j++) {
//               if (graph[i][j]!==0 && min_of_graph_element>graph[i][j]) {
//                   min_of_graph_element=graph[i][j];
//               }
//           }
//       }
//   }
  
//   function Try(para) {
//       if (current_cost+min_of_graph_element*(so_thanh_pho-para+1)>=min) {
//           return;
//       }
      
//       for (let j=1;j<so_thanh_pho;j++) {
//           if(chua_xet[j]){
//               result[para]=j;
//               chua_xet[j]=false;
//               current_cost+=graph[result[para-1]][j];
//               if (para==so_thanh_pho){
//                   if(current_cost+graph[result[so_thanh_pho]][result[1]]<min) {
//                       min=current_cost+graph[result[so_thanh_pho]][result[1]];
//                   }
//               }
//               else {
//                   Try(para+1);
//               }
//               current_cost-=graph[result[para-1]][j];
//               chua_xet[j]=true;
//           }
//       }
//   }
//   await init();
//   // chua_xet[1]=false;
//   // x[1]=1;
//   Try(1);
  
//   console.log(result);
//   return result;
//   }




let dalatRanhGioiSource = new ol.source.Vector({
  features: (new ol.format.GeoJSON()).readFeatures(dalat_RG)
});
let dalatRanhGioi = new ol.layer.Vector({
  source: dalatRanhGioiSource,
  map: map
})

export {
  map,
  view,
  travelPoint,
  graph,
  featuresEdge,
  travelNodes,
  verticesSource,
  startPointSource,
  viaPointSource
}