import {map,travelPoint,travelNodes,veticesSource} from "./map_module/default.js"

document.getElementById("btn-addPlace").addEventListener("click",()=>{  

    let places = document.getElementsByClassName("place-input");
        while(travelPoint.length>0) {
            travelPoint.pop();
            travelNodes.pop();
        }
    for (let place of places) {
        travelPoint.push(place.dataset.coordinate.split(",").map((item)=>Number(item)));
    }

    for (let coordinate of travelPoint) {
        travelNodes.push(veticesSource.getClosestFeatureToCoordinate(coordinate).get("gid"))
    }
    
    console.log(travelNodes);


});

