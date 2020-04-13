/* eslint-disable linebreak-style */
const getNormalisedTimeToElapse = (periodType, timeToElapse) => {
  let normalisedTimeToElapse;
  if (periodType === 'weeks') {
    normalisedTimeToElapse = timeToElapse * 7;
  } else if (periodType === 'months') {
    normalisedTimeToElapse = timeToElapse * 30;
  } else {
    normalisedTimeToElapse = timeToElapse;
  }
  return normalisedTimeToElapse;
};

const getInfectionFactor = (timeToElapse) => Math.floor(timeToElapse / 3);

const getiInfectionsByRequestedTime = (data, currentlyInfected) => currentlyInfected
        * (2 ** getInfectionFactor(getNormalisedTimeToElapse(data.periodType, data.timeToElapse)));

const getSevereCasesByRequestedTime = (infectionsByRequestedTime) => Math.floor(
  infectionsByRequestedTime * 0.15
);

const getHospitalBedsByRequestedTime = (data, severeCasesByRequestedTime) => {
  const tempHospitalBeds = (data.totalHospitalBeds * 0.35) - severeCasesByRequestedTime;
  return (tempHospitalBeds >= 0 || -1) * Math.floor(Math.abs(tempHospitalBeds));
};

const getCasesForICUByRequestedTime = (infectionsByRequestedTime) => Math.floor(
  infectionsByRequestedTime * 0.05
);

const getCasesForVentilatorsByRequestedTime = (infectionsByRequestedTime) => Math.floor(
  infectionsByRequestedTime * 0.02
);

const getDollarsInFlight = (data, infectionsByRequestedTime) => Math.floor(
  (infectionsByRequestedTime
    * data.region.avgDailyIncomePopulation
    * data.region.avgDailyIncomeInUSD)
    / getNormalisedTimeToElapse(data.periodType, data.timeToElapse)
);

const covid19ImpactEstimator = (data) => {
  const impact = {};
  impact.currentlyInfected = data.reportedCases * 10;

  impact.infectionsByRequestedTime = getiInfectionsByRequestedTime(data, impact.currentlyInfected);

  impact.severeCasesByRequestedTime = getSevereCasesByRequestedTime(
    impact.infectionsByRequestedTime
  );

  impact.hospitalBedsByRequestedTime = getHospitalBedsByRequestedTime(
    data, impact.severeCasesByRequestedTime
  );

  impact.casesForICUByRequestedTime = getCasesForICUByRequestedTime(
    impact.infectionsByRequestedTime
  );

  impact.casesForVentilatorsByRequestedTime = getCasesForVentilatorsByRequestedTime(
    impact.infectionsByRequestedTime
  );

  impact.dollarsInFlight = getDollarsInFlight(data, impact.infectionsByRequestedTime);


  const severeImpact = {};
  severeImpact.currentlyInfected = data.reportedCases * 50;

  severeImpact.infectionsByRequestedTime = getiInfectionsByRequestedTime(
    data, severeImpact.currentlyInfected
  );

  severeImpact.severeCasesByRequestedTime = getSevereCasesByRequestedTime(
    severeImpact.infectionsByRequestedTime
  );

  severeImpact.hospitalBedsByRequestedTime = getHospitalBedsByRequestedTime(
    data, severeImpact.severeCasesByRequestedTime
  );

  severeImpact.casesForICUByRequestedTime = getCasesForICUByRequestedTime(
    severeImpact.infectionsByRequestedTime
  );

  severeImpact.casesForVentilatorsByRequestedTime = getCasesForVentilatorsByRequestedTime(
    severeImpact.infectionsByRequestedTime
  );

  severeImpact.dollarsInFlight = getDollarsInFlight(data, severeImpact.infectionsByRequestedTime);


  const output = {
    data, // the input data you got
    impact, // your best case estimation
    severeImpact // severe case estimation
  };

  return output;
};


export default covid19ImpactEstimator;


/* const input = {
  region: {
    name: 'Africa',
    avgAge: 19.7,
    avgDailyIncomeInUSD: 5,
    avgDailyIncomePopulation: 0.71
  },
  periodType: 'days',
  timeToElapse: 58,
  reportedCases: 674,
  population: 66622705,
  totalHospitalBeds: 35353
}; */

// const output = covid19ImpactEstimator(input);
// console.log('severeImpact.infectionsByRequestedTime: ',
//                  output.severeImpact.infectionsByRequestedTime);
// console.log('data.region.avgDailyIncomeInUSD: ', output.data.region.avgDailyIncomeInUSD);
// console.log('data.region.avgDailyIncomePopulation): ',
//                  output.data.region.avgDailyIncomePopulation);
// console.log('severeImpact.dollarsInFlight: ', output.severeImpact.dollarsInFlight);
// console.log('severeImpact.infectionsByRequestedTime: ',
//                  output.severeImpact.infectionsByRequestedTime);
// // console.log('impact.casesForVentilatorsByRequestedTime: ',
//                  output.impact.casesForVentilatorsByRequestedTime);
// console.log('impact.dollarsInFlight: ', output.impact.dollarsInFlight);

/* {
    data: {}, // the input data you got
    impact: {}, // your best case estimation
    severeImpact: {}
}  */
