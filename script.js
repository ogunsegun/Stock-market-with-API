//Q2
function createGraph(stocData) {
   const graphType  =  document.getElementById("graphType").value;
   const  ctx = document.getElementById("stockChart").getContext("2d");

   let Chart;

   if(graphType === "line"){
      chart=new Chart(ctx,  {
         type:"line",
      });
   }  else if(graphType==="bar"){
      chart = new Chart(ctx, {
         type:"bar",
      });
   }

   chart.data =  {
      labels:stockData.timestamp,
      datasets:[
        {
         label:"Stock Price",
         data: stockData.prices,
         backgroundColor:"rgba(0,123,255,0.5)",
         borderColor:"rgb(0, 123, 255)",
         borderWidth: 1
        }
      ]
   };

   chart.options = {
      responsive:true,
      maintainAspectRatio:false,
      scales:{
         x:{
            display:true,
            title:{
               display:true,
               text:"Date"
            }
         },
         y:{
            display:true,
            title:{
               display:true,
               text:"Price"
            }
         }
      },
      tooltips: {
         callbacks:{
            title:function(tooltipItem){
               return stockData.timestamp[tooltipltem[0].dataIndex];
            },
            label:fuuction(tooltipItem){
               return "Price: $" + tooltipItem.formattedValue;
            }
         }
      }
   };

   chart.update();
}
async function fetchStockData(){
   const symbol = "AAPL";
   const  data = await fetch('https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?range=1y')
   .then(response=>response.json())
   .then(data=>{
      const timestamps = data.chart.result[0].timestamp;
      const prices  =data.chart.result[0].indicators.adjclose[0].adjclose;
      return{timestamps, prices};
   });

   return data;
}


//Function to  handle  manual data entry(Q3)
function handleManualDataEntry()  {
   const manualDataInput = document.getElementById("manualDataInput");
   const data = manualDataInput.value.split(",").map(value=>Number(value.trim()));

   if(data.length > 0){
      const timestamps = generateTimestamps(data.length);
      const stockData = {  timestamps, prices:data};
      createGraph(stockData);
      manualDataInput.value="";
   }
}

//function to handle CSV  file  upload
function handleCSVFileUpload(event)  {
   const file = event.target.file[0];
   const reader = new FileReader();

   reader.onload = fuuction(e) {
      const contents = e.target.result;
      const data = parseCSVData(contents);

      if(data){
         const stockData = {timestamps: data.timestamps, prices: data.prices};
         createGraph(stockData);
      }else{
         console.error("Invalid CSV   file  format");
      }
   } ;

   reader.readAsText(file);
}

//Event listeners for manual data entry and CSV file  uupload
document.getElementById("addDataButton").addEventListener("click", handleManualDataEntry);
document.getElementById("csvFileInput").addEventListener("change", handleCSVFileUpload);

//Fetch stock data and create the graph when the page  is loaded
window.onload =  async function(){
   const dataSourceCSV =  document.getElementById("dataSourceCSV");
   if(dataSourceCSV.checked){
      //Handle csv data source
      document.getElementById("manualDataInput").disabled =true;
      document.getElementById("addDataButton").disabled = true;
      document.getElementById("csvFileInput").disabled =  false;
      document.getElementById("uploadCSVButton").disabled =false;
   } else{
      //Handle Yahoo Finance data source
      document.getElementById("manualDataInput").disabled =false;
      document.getElementById("addDataButton").disabled = false;
      document.getElementById("csvFileInput").disabled =  true;
      document.getElementById("uploadCSVButton").disabled =true;

      const stockData = await fetchStockData();
      createGraph(stockData);
   }
};

//Event listener for data source change
document.querySelectorAll('input[name="dataSource"]').forEach(radio=>{
   radio.addEventListener("change", function() {
      if(this.value==="csv"){
         document.getElementById("manualDataInput").disabled = true;
         document.getElementById("addDataButton").disabled = true;
         //document.getElementById
      }
   })
})



