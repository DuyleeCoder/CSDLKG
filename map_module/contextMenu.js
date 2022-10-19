import {map,startPointSource,viaPointSource} from "./default.js"
var contextmenu = new ContextMenu({
    width: 250,
    defaultItems: false, // defaultItems are (for now) Zoom In/Zoom Out
    items: [     
      {
        text: 'Thêm điểm bắt đầu đi',     
        icon: './asset/placeholderGreen.png', 
        callback: addFirstPoint
      },
      {
        text: 'Thêm địa điểm du lịch',  
        icon: './asset/placeholderRed.png',   
        callback: addTravelingPoint
      },
      '-' // this is a separator
    ]
  });

  function addFirstPoint (obj) {
      let coordinate = obj.coordinate;
      let startPoint = document.getElementById("place-start");
    fetch(`http://nominatim.openstreetmap.org/reverse.php?lat=${coordinate[1]}&lon=${coordinate[0]}&zoom=18&format=jsonv2`)
    .then((response)=>{
       return response.json();        
    }).then((data)=>{
        startPoint.value =data.display_name; 
        startPoint.dataset.place_id = data.place_id;   
        startPoint.dataset.coordinate = coordinate;   
        try {
          startPointSource.clear();
        } catch (error) {
          
        }
        let feature = new ol.Feature({
          geometry:new ol.geom.Point(coordinate),
          place_id:data.place_id,
          display_name:data.display_name, 

        });
        startPointSource.addFeature(feature)
        // console.log(data)      
    })
  }
  function addTravelingPoint (obj) {
    let coordinate = obj.coordinate;
    let startPoint = document.getElementById("place-start");
        fetch(`http://nominatim.openstreetmap.org/reverse.php?lat=${coordinate[1]}&lon=${coordinate[0]}&zoom=18&format=jsonv2`)
        .then((response)=>{
            return response.json();        
        }).then((data)=>{
             let placeDiv = addPlaces(data.place_id);
            
            placeDiv.firstChild.value =data.display_name;    
            placeDiv.firstChild.dataset.place_id = data.place_id;    
            placeDiv.firstChild.dataset.coordinate = coordinate;   

            let feature = new ol.Feature({
              geometry:new ol.geom.Point(coordinate),
              place_id:data.place_id,
              display_name:data.display_name,    
            });
            viaPointSource.addFeature(feature);

            // console.log(viaPointSource.getFeatures())
        })
    

  }
  function getNodeClosestCoordinate (coordinate) {

  }

  function addPlaces (id) {
    let listPlaces = document.getElementById("list-places");
    // let id ="close-place-container"+listPlaces.children.length;
    let placeDiv = document.createElement("div");
    placeDiv.id="places"+listPlaces.children.length;
    placeDiv.className="place";
    placeDiv.innerHTML=`<input type="text" class="place-input place-middle"  placeholder="Nhập vào các điểm đến">
    <i class="fas fa-times"  id="${id}"></i> `

    listPlaces.appendChild(placeDiv);

    document.getElementById(id).addEventListener("click",()=>{
        listPlaces.removeChild(placeDiv);
       viaPointSource.removeFeature(viaPointSource.getFeatures().filter((item)=>item.getProperties().place_id==id)[0]);
    });

    return placeDiv;
  }

  export default contextmenu;