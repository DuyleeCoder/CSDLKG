async function duongngannhat() {
let chua_xet = [];
let so_thanh_pho;
let graph = [];
let min_of_graph_element=9999;
let min = 9999;
let current_cost = 0;
let result=[];

async function init() {
    for (let i=0;i<so_thanh_pho;i++) {
        chua_xet[i]=true;
        result[i]=0;        
    }
    for (let i=0;i<so_thanh_pho;i++) {
        for (let j=0;j<so_thanh_pho;j++) {
            if (graph[i][j]!==0 && min_of_graph_element>graph[i][j]) {
                min_of_graph_element=graph[i][j];
            }
        }
    }
}

async function Try(para) {
    if (current_cost+min_of_graph_element*(n-para+1)>=min) {
        return;
    }
    
    for (let j=1;j<so_thanh_pho;j++) {
        if(chua_xet[j]){
            result[para]=j;
            chua_xet[j]=false;
            current_cost+=graph[result[para-1]][j];
            if (para==so_thanh_pho){
                if(current_cost+graph[result[so_thanh_pho]][result[1]]<min) {
                    min=current_cost+graph[result[so_thanh_pho]][result[1]];
                }
            }
            else {
                Try(para+1);
            }
            current_cost-=graph[result[para-1]][j];
            chua_xet[j]=true;
        }
    }
}
await init();
// chua_xet[1]=false;
// x[1]=1;
await Try(1);

console.log(result);

}