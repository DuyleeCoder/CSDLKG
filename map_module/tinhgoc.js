
function tinhGoc(coordinates1,coordinates2,coordinates3)
{

    let pointA = convertCoordinatesToPoint(coordinates1);
    let pointB = convertCoordinatesToPoint(coordinates2);
    let pointC = convertCoordinatesToPoint(coordinates3);

    var cosA;
    var vectorAB={x:pointB.x-pointA.x,y:pointB.y-pointA.y};
    // console.log('vectorAB');
    // console.log(vectorAB);
    var vectorBC={x:pointC.x-pointB.x,y:pointC.y-pointB.y};
    // console.log('vectorBC');
    // console.log(vectorBC);
    cosA=(vectorAB.x*vectorBC.x+vectorAB.y*vectorBC.y)/(Math.sqrt(vectorAB.x*vectorAB.x+vectorAB.y*vectorAB.y)*Math.sqrt(vectorBC.x*vectorBC.x+vectorBC.y*vectorBC.y));
// console.log(cosA)
var gocA= Math.acos(cosA)*180/Math.PI;
// console.log(gocA)
    function timPTDT (x1,y1,x2,y2) {
        if(x1==x2)
        {
            return {
                "hesogoc" : 1,
                "sohangtudo" : -x1
              
            } 
        }
        if(y1==y2)
        {
            return {
                "hesogoc" : 0,
                "sohangtudo" : y1
              
            } 
        }
        else
        {
            let  a = y1 - y2;
            let  b = x2 - x1;
            let  c = -a*x1-b*y1;
            // ax+by+c=0   
    
            return {
                "hesogoc" : -a/b,
                "sohangtudo" : -c/b
              
            } 
        }     
    }
    var duongAB = timPTDT(pointA.x,pointA.y,pointB.x,pointB.y);
    // console.log(duongAB);
// Nếu ax0+b > y0 thì M(x0, y0) nằm phía dưới, còn ax0+b < y0 thì M nằm phía trên.
// bên trái là ở trên, phải là dưới
function xettuongdoiC (duongAB,c)
{  
    //  console.log(duongAB.hesogoc*c.x+duongAB.sohangtudo);
    let tam=duongAB.hesogoc*c.x+duongAB.sohangtudo>c.y
    return tam
}
var bienxetC= xettuongdoiC (duongAB,pointC)

//console.log(bienxetC);
if(vectorAB.x==0&&vectorAB.y>0)
{
    if(pointC.x>pointA.x)
    {
        gocA=180-gocA
        //console.log(goc);
    }
    if(pointC.x<pointA.x)
    {
        gocA=180+gocA
        //console.log(goc);
    }
}
if(vectorAB.x==0&&vectorAB.y<0)
{
    
    if(pointC.x>pointA.x)
    {
        gocA=180+gocA
        //console.log(goc);
    }
    if(pointC.x<pointA.x)
    {
        gocA=180-gocA
        //console.log(gocA);
    }
}
if(vectorAB.y==0&&vectorAB.x>0)
{   
    if(pointC.y<pointA.y)
    {
        gocA=180-gocA
        //console.log(gocA);
    }
    if(pointC.y>pointA.y)
    {
        gocA=180+gocA
        //console.log(gocA);
    }
}
if(vectorAB.y==0&&vectorAB.x<0)
{   
    if(pointC.y>pointA.y)
    {
        gocA=180-gocA
        //console.log(gocA);
    }
    if(pointC.y<pointA.y)
    {
        gocA=180+gocA
        //console.log(gocA);
    }
}
// o duoi, huong len tren qua trai
if(bienxetC && vectorAB.y!=0 && vectorAB.x!=0 && vectorAB.y>0 && duongAB.hesogoc<0 )
    {
        
        gocA= 180+gocA;
        //console.log(gocA);
    }
 else
    { 
        if(vectorAB.y!=0 && vectorAB.x!=0&& vectorAB.y>0 && duongAB.hesogoc<0 )
        {
            gocA= 180-gocA;
            //console.log(gocA);
        }
        
    }
    if(bienxetC && vectorAB.y!=0 && vectorAB.x!=0 && vectorAB.y>0 && duongAB.hesogoc>0 )
    {
        
        gocA= 180-gocA;
        //console.log(gocA);
    }
 else
    { 
        if(vectorAB.y!=0 && vectorAB.x!=0&& vectorAB.y>0  && duongAB.hesogoc>0  )
        {
            gocA= 180+gocA;
            //console.log(gocA);
        }
        
    }
// Nếu ax0+b > y0 thì M(x0, y0) nằm phía dưới, còn ax0+b < y0 thì M nằm phía trên.
// bên trái là ở trên, phải là dưới
  if(bienxetC && vectorAB.y!=0 && vectorAB.x!=0 &&vectorAB.y<0&& duongAB.hesogoc>0)
    {
            gocA= 180+gocA;
            //console.log(gocA);   
    }
    else
    { 
        if(vectorAB.y!=0 && vectorAB.x!=0&& vectorAB.y<0  && duongAB.hesogoc>0)
        {
            gocA= 180-gocA;
            //console.log(gocA);
        }
        
    }
  if(bienxetC && vectorAB.y!=0 && vectorAB.x!=0 &&vectorAB.y<0 && duongAB.hesogoc<0)
    {
            gocA= 180-gocA;
            //console.log(gocA);   
    }
    else
    { 
        if(vectorAB.y!=0 && vectorAB.x!=0&& vectorAB.y<0 && duongAB.hesogoc<0 )
        {
            gocA= 180+gocA;
            //console.log(gocA);
        } 
    }
return gocA
}

function convertCoordinatesToPoint(coordinates) {
    // Coordinates is an Array: Ex [105,21]
    return  {
        x:coordinates[0],
        y: coordinates[1]
    }

}

function getDirection(angle) {
    if (angle>=0 && angle < 160) {
        return "rẽ phải đường";
    }
    else if (angle <= 200) {
        return "đi thẳng đường";
    }
    else {
        return "rẽ trái đường";
    }
}

export {tinhGoc,getDirection};