import React, { useEffect, useRef, useState } from "react";
import "@fontsource/poppins";
import './App.scss';
import { Chart } from "chart.js/auto";

function App() {
  const [investment, setInvestment] = useState(250);
  // const [depositPerYear, setDepositPerYear] = useState(1);
  const [maturityAmount, setMaturityAmount] = useState(11970);
  const [totalAmount, setTotalAmount] = useState(3750);
  const [totalInterest, setTotalInterest] = useState(8220);
  const [startYear, SetStartYear] = useState(2015);
  const [maturityYear, setMaturityYear] = useState(startYear + 21);
  const [yearlyData, setYearlyData] = useState([]);
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  const interestRate = 8.2 / 100;
  const investmentYears = 15;
  const maturityYears = 21;
  const compoundingFrequency = 1;


  useEffect(() => {
    if (chartInstance.current) {
      chartInstance.current.destroy()
    }

    const mychartRef = chartRef.current.getContext('2d')
    if (mychartRef) {
      chartInstance.current = new Chart(mychartRef, {
        type: 'doughnut',
        data: {
          labels: ["Total Investment", "Total Interest"],
          datasets: [{
            data: [totalAmount, totalInterest],
            backgroundColor: ['#42a5f5', '#66bb6a'],
          }],
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              position: 'top',
            },
          },
        },
      });
    }
    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy()
      }
    }
  }, [totalAmount, totalInterest])

  const handleInvestmentChange = (e) => {
    const value = e.target.value;
    if (value === '' || /^\d*$/.test(value)) {
      setInvestment(value);
    }
  };

  const handleInvestmentBlur = () => {
    const numericValue = Number(investment);
    if (numericValue > 150000) {
      setInvestment(150000);
    } else if (numericValue < 250) {
      setInvestment(250);
    }
    calculateMaturityAmount();
  };

  const handleInvestmentSliderChange = (e) => {
    const value = e.target.value;
    setInvestment(value);
    calculateMaturityAmount();
  };

  // const handleDepositPerYearChange = (e) => {
  //   const value = e.target.value;
  //   if (value === '' || /^\d*$/.test(value)) {
  //     setDepositPerYear(value);
  //   }
  // };

  // const handleDepositPerYearBlur = () => {
  //   const numericValue = Number(depositPerYear);
  //   if (numericValue > 12) {
  //     setDepositPerYear(12);
  //   } else if (numericValue < 1) {
  //     setDepositPerYear(1);
  //   }
  //   calculateMaturityAmount();
  // };

  // const handleDepositPerYearSliderChange = (e) => {
  //   const value = e.target.value;
  //   setDepositPerYear(value);
  //   calculateMaturityAmount(); 
  // };


  const handleStartYearChange = (e) => {
    const value = e.target.value;
    if (value === '' || /^\d*$/.test(value)) {
      SetStartYear(value);
    }
  };

  const handleStartYearBlur = () => {
    const numericValue = Number(startYear);
    if (numericValue > 2035) {
      SetStartYear(2035);
    } else if (numericValue < 2015) {
      SetStartYear(2015);
    }
    calculateMaturityYear(numericValue);
  };


  const handleStartYearSliderChange = (e) => {
    const value = e.target.value;
    SetStartYear(value);
    calculateMaturityYear(value);
  };

  const calculateMaturityYear = (startYear) => {
    setMaturityYear(Number(startYear) + 21);
  };


  const calculateMaturityAmount = () => {
    const P = Number(investment); // Principal (yearly investment)
    const r = interestRate; // Annual interest rate
    const n = compoundingFrequency; // Compounded yearly
    const t_investment = investmentYears; // Investment period (15 years)
    const t_maturity = maturityYears; // Maturity period (21 years)

    // 1. Calculate maturity value at the end of the investment period (15 years)
    let maturityValueAtInvestmentEnd = 0;
    let maturityValueAtMaturityEnd = 0;
    const yearlyDataArray = [];


    for (let i = 0; i < t_investment; i++) {
      maturityValueAtInvestmentEnd += P * Math.pow((1 + r / n), n * (t_investment - i));
    }

    // 2. After 15 years of deposits, calculate the interest for the remaining 6 years
    maturityValueAtMaturityEnd = maturityValueAtInvestmentEnd * Math.pow((1 + r / n), n * (t_maturity - t_investment));

    let totalInvestment = 0;
    let yearEndBalance = 0;

    for (let year = 1; year <= t_maturity; year++) {
      if (year <= t_investment) {
        totalInvestment += P; // Add yearly deposit
        yearEndBalance += P; // Year-end balance includes the yearly deposit
      }

      // Interest calculation for current year
      let interestEarned = yearEndBalance * r;
      yearEndBalance += interestEarned; // Update year-end balance with interest

      yearlyDataArray.push({
        year,
        depositedAmount: totalInvestment.toFixed(2),
        interestEarned: interestEarned.toFixed(2),
        yearEndBalance: yearEndBalance.toFixed(2),
      });
    }
    setMaturityAmount(Number(maturityValueAtMaturityEnd).toFixed(2)); // Maturity amount at the end of 21 years
    setTotalAmount(Number(totalInvestment).toFixed(2)); // Total investment amount
    setTotalInterest((maturityValueAtMaturityEnd - totalInvestment).toFixed(2)); // Total interest earned
    setYearlyData(yearlyDataArray); // Set yearly data for the table
  };

  return (
    <div className="App">
      <div id="ssy">
        <div className="container">
          <div className="main-heading">
            Sukanya Samriddhi Yojana (SSY) Calculator
          </div>
          <div className="body-text">
            Sukanya Samriddhi Yojana is a small deposit scheme launched in 2015 by the Prime Minister, Mr. Narendra Modi, as a part of the Beti Bachao Beti Padao campaign to help the guardians or parents meet their girl child’s education and marriage expenses. The investor can use the Sukanya Samriddhi Yojana (SSY) calculator to estimate the maturity amount and decipher how much corpus she/he will be exactly able to save for his/her daughter’s education and marriage.
          </div>
          <div className="current-intrate">
            <div className="intrate-text">2024 Latest interest rate @ 8.2 % p.a.</div>
          </div>
          <div className="calci-bg">


            <form>
              <div className="slider-flex">
                <div className="width40">
                  <div className="input-flex">
                    <div>
                      <label className="calci-label" id="typeLabel">
                        Yearly Investment Amount :
                      </label>
                      <div className="min-value">₹250</div>
                    </div>
                    <div>
                      <div className="calci-input-ctrl large-field prefix-rupee">
                        <span className="cl-error_info error-msg"></span>
                        <span className="rupee-symbol">₹</span>
                        <input
                          className="form-ctrl"
                          type="tel"
                          value={investment}
                          data-min="250"
                          data-max="150000"
                          id="input-amount"
                          name="amount"
                          maxLength="12"
                          onChange={handleInvestmentChange}
                          onBlur={handleInvestmentBlur} // Validate on blur
                        />
                        <span className="focused-br"></span>

                      </div>
                      <div className="max-value">₹150000</div>
                    </div>

                  </div>

                  <div className="calci-input__elements range-input-slider">
                    <div className="slidecontainer">
                      <input
                        type="range"
                        min="250"
                        max="150000"
                        value={investment}
                        onChange={handleInvestmentSliderChange}
                        className="input-slider input-amount"
                        step="250"
                        id="nps-invest-slider"
                      />
                    </div>
                  </div>



                  <div>
                    {/* <div className="input-flex">
                  <div>
                    <label className="calci-label" id="typeLabel">
                      Number of Deposit Per Year : 
                    </label>
                    <div className="min-value">1</div>
                    </div>
                    <div>
                    <div className="calci-input-ctrl large-field prefix-rupee">
                      
                      <input
                        className="form-ctrl"
                        type="tel"
                        value={depositPerYear}
                        data-min="1"
                        data-max="12"
                        id="deposit-per-year"
                        name="amount"
                        maxLength="2"
                        onChange={handleDepositPerYearChange}
                        onBlur={handleDepositPerYearBlur} // Validate on blur
                      />
                      <span className="focused-br"></span>
                    </div>

                    <div className="max-value">12</div>
                    </div>
                  </div> */}

                    {/* <div className="calci-input__elements range-input-slider">
                    <div className="slidecontainer">
                      <input
                        type="range"
                        min="1"
                        max="12"
                        value={depositPerYear}
                        onChange={handleDepositPerYearSliderChange}
                        className="input-slider input-amount"
                        step="1"
                        id="nps-invest-slider1"
                      />
                    </div>
                  </div> */}
                  </div>



                  <div>
                    <div className="input-flex">
                      <div>
                        <label className="calci-label" id="typeLabel">Start Year : </label>
                      </div>
                      <div>
                        <div className="calci-input-ctrl large-field prefix-rupee">

                          <input
                            className="form-ctrl"
                            type="tel"
                            value={startYear}

                            id="start-year"
                            name="amount"
                            maxLength="4"
                            onChange={handleStartYearChange}
                            onBlur={handleStartYearBlur} // Validate on blur
                          />
                          <span className="focused-br"></span>
                        </div>
                      </div>
                    </div>

                    <div className="calci-input__elements range-input-slider">
                      <div className="slidecontainer">
                        <input
                          type="range"
                          min="2015"
                          max="2035"
                          value={startYear}
                          onChange={handleStartYearSliderChange}
                          className="input-slider input-amount"
                          id="nps-invest-slider1"
                        />
                      </div>
                    </div>

                    <div className="slider-flex">
                      <div>Duration : <span className="bold">15 Years</span></div>
                      <div>Maturity Period : <span className="bold">21 Years</span></div>
                    </div>
                    <div className="note"><span className="bold">Note :</span> Girl's Age must be less then 10 year.</div>
                  </div>
                </div>


                <div className="width-55">
                  <div className="graph-flex">
                    <div className="amt-with-interest-bg">
                      <div className="amt-flex">
                        <div className="fifty">
                          <div className="amt-interest-heading">Maturity Amount</div>
                          <div className="amt-heading">₹ {maturityAmount}</div>
                        </div>
                        <div>
                          <div className="amt-interest-heading">Total Amount Deposit</div>
                          <div className="amt-heading">₹ {totalAmount}</div>
                        </div>
                      </div>

                      <div className="amt-flex">
                        <div className="fifty">
                          <div className="amt-interest-heading">Total Interest</div>
                          <div className="amt-heading">₹ {totalInterest}</div>
                        </div>
                        <div className="fifty">
                          <div className="amt-interest-heading">Maturity Year</div>
                          <div className="amt-heading">{maturityYear}</div>
                        </div>
                      </div>



                    </div>

                    <div className="">
                      <div className="chart-area">
                        <canvas ref={chartRef} style={{ width: "300px", height: "300px" }} />
                      </div>
                    </div>

                  </div>
                </div>
              </div>


            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
