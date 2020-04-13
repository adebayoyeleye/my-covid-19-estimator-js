/* eslint-disable linebreak-style */
const normaliseTimeToElapse = (periodType, timeToElapse) => {
  let normalisedTimeToElapse;
  if (periodType === 'week') {
    normalisedTimeToElapse = timeToElapse * 7;
  } else if (periodType === 'months') {
    normalisedTimeToElapse = timeToElapse * 30;
  } else {
    normalisedTimeToElapse = timeToElapse;
  }
  return normalisedTimeToElapse;
};

const getInfectionFactor = (timeToElapse) => Math.floor(timeToElapse / 3);

const covid19ImpactEstimator = (data) => {
  const normalisedTimeToElapse = normaliseTimeToElapse(data.periodType, data.timeToElapse);

  const impact = {};
  impact.currenlyInfected = data.reportedCases * 10;
  impact.infectionsByRequestedTime = impact.currenlyInfected
                                        * (2 ** getInfectionFactor(normalisedTimeToElapse));

  const severeImpact = {};
  severeImpact.currenlyInfected = data.reportedCases * 50;
  severeImpact.infectionsByRequestedTime = severeImpact.currenlyInfected
                                                * (2 ** getInfectionFactor(normalisedTimeToElapse));


  const output = {
    data: data, // the input data you got
    impact: impact, // your best case estimation
    severeImpact: severeImpact // severe case estimation
  };

  return output;
};


export default covid19ImpactEstimator;


/* {
    region: {
    name: "Africa",
    avgAge: 19.7,
    avgDailyIncomeInUSD: 5,
    avgDailyIncomePopulation: 0.71
    },
    periodType: "days",
    timeToElapse: 58,
    reportedCases: 674,
    population: 66622705,
    totalHospitalBeds: 35353
}

{
    data: {}, // the input data you got
    impact: {}, // your best case estimation
    severeImpact: {}
} */
