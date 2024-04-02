import React, { useState, useEffect } from "react";
import data from "../data"; // Import data from data.js

import "./Home.css"; // Import CSS file for styling
import toast from "react-hot-toast";

const Home: React.FC = () => {
    type StockData = {
        date: string;
        open: number;
        close: number;
      };


  let previousDayPrices:number=-1;
  const [selectedStock, setSelectedStock] = useState<string>("");
  const [numberOfDays, setNumberOfDays] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [dataToShow, setDataToShow] = useState<StockData[]>([]);
  const [showButton, setShowButton] = useState<boolean>(false);

  const pages: number[] = [3, 5, 10];
  useEffect(() => {
    // Filter data based on selected stock and number of days
    const filteredData = data.find(
      (stock) => stock.stockName === selectedStock
    );
    if (filteredData) {
      setDataToShow(
        filteredData.info.slice(
          (currentPage - 1) * pages[numberOfDays],
          currentPage * pages[numberOfDays]
        )
      );
    }
  }, [selectedStock, numberOfDays, currentPage]);

  useEffect(()=>{

    // setShowButton(true);

    if(selectedStock){

      setShowButton(true);
      setNumberOfDays(0);
      setCurrentPage(1);
      toast.success(`Statistics of day ${pages[0]}`)

    }
  },[selectedStock])

  // Logic to calculate open/close price differences and apply styling
  const openStockStyle = (open: number, close: number): React.CSSProperties => {

    if ( open >=previousDayPrices) {
      previousDayPrices = close; // Update previousDayClose with current day's close price
      return { color: "green" };
    }
    else if (open <= previousDayPrices){
      previousDayPrices = close;
      return { color: "red" };
    } 
    else return {};
  };

  const closeStockStyle = (open: number, close: number): React.CSSProperties => {
    if (open <= close) return { color: "green" };
    else if (open >= close) return { color: "red" };
    else return {};
  };

  // Handle page change
  const prevPageChange = (pageNumber: number): void => {
    if (pageNumber - 1 >= 0) {
      setNumberOfDays(pageNumber - 1);
      toast.success(`Statistics of day ${pages[numberOfDays-1]}`)
    }
    else{
      toast.error("You can't move Previous")
    }

  };
  const nextPageChange = (page: number): void => {
    if (page + 1 !== 3) {
      setNumberOfDays(page + 1);
      toast.success(`Statistics of day ${pages[numberOfDays+1]}`)

    }
    else{
      toast.error("You can't move Forword")
    }

   
  };

  return (
    <div>
     <div>
      <h2 style={{color:"#6495ED"}}>Indian Stock Market Statistics</h2>
     <select
        value={selectedStock}
        onChange={(e) => setSelectedStock(e.target.value)}
       
        className="form-select" aria-label="Disabled select example" 
        
      >
        <option value="">Select a stock</option>
        {data.map((stock, index) => (
          <option
            key={index}
            value={stock.stockName}
            
          >
            {stock.stockName}
          </option>
        ))}
      </select>

      {/* Display table with open and close prices */}
      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Open</th>
            <th>Close</th>
          </tr>
        </thead>
        <tbody>
          {dataToShow.map((item, index) => (
            <tr key={index}>
              <td>{item.date}</td>
              <td style={openStockStyle(item.open, item.close)}>{item.open}</td>
              <td style={closeStockStyle(item.open, item.close)}>{item.close}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      <div>
        {showButton ? (
          <div>
            <button onClick={() => prevPageChange(numberOfDays)}>Prev</button>
            <button>{pages[numberOfDays]}</button>
            <button onClick={() => nextPageChange(numberOfDays)}>Next</button>
          </div>
        ) : (
          ""
        )}

        {/* ))} */}
      </div>
     </div>
     
      
    </div>
  );
};

export default Home;
