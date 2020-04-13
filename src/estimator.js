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

const getDollarsInFlight = (data, infectionsByRequestedTime) => {
  Math.floor(
    (infectionsByRequestedTime
            * data.avgDailyIncomePopulation
            * data.avgDailyIncomeInUSD) / 30
  );
};

const covid19ImpactEstimator = (data) => {
//   const normalisedTimeToElapse = getNormalisedTimeToElapse(data.periodType, data.timeToElapse);

  const impact = {};
  impact.currentlyInfected = data.reportedCases * 10;
  //   impact.infectionsByRequestedTime = impact.currentlyInfected
  //                                         * (2 ** getInfectionFactor(normalisedTimeToElapse));
  impact.infectionsByRequestedTime = getiInfectionsByRequestedTime(data, impact.currentlyInfected);
  //   impact.severeCasesByRequestedTime = Math.floor(impact.infectionsByRequestedTime * 0.15);
  impact.severeCasesByRequestedTime = getSevereCasesByRequestedTime(
    impact.infectionsByRequestedTime
  );
  //   impact.tempHospitalBeds = (data.totalHospitalBeds * 0.35)
  //                                             - impact.severeCasesByRequestedTime;
  //   impact.hospitalBedsByRequestedTime = (impact.tempHospitalBeds >= 0 || -1)
  //                                     * Math.floor(Math.abs(impact.tempHospitalBeds));
  impact.hospitalBedsByRequestedTime = getHospitalBedsByRequestedTime(
    data, impact.severeCasesByRequestedTime
  );
  //   impact.casesForICUByRequestedTime = Math.floor(impact.infectionsByRequestedTime * 0.05);
  impact.casesForICUByRequestedTime = getCasesForICUByRequestedTime(
    impact.infectionsByRequestedTime
  );
  // impact.casesForVentilatorsByRequestedTime = Math.floor(impact.infectionsByRequestedTime * 0.02)
  impact.casesForVentilatorsByRequestedTime = getCasesForVentilatorsByRequestedTime(
    impact.infectionsByRequestedTime
  );
  //   impact.dollarsInFlight = Math.floor(
  //     (impact.infectionsByRequestedTime
  //         * data.avgDailyIncomePopulation
  //         * data.avgDailyIncomeInUSD) / 30
  //   );
  impact.dollarsInFlight = getDollarsInFlight(data, impact.infectionsByRequestedTime);

  const severeImpact = {};
  severeImpact.currentlyInfected = data.reportedCases * 50;
  //   severeImpact.infectionsByRequestedTime = severeImpact.currentlyInfected
  // eslint-disable-next-line max-len
  //                                                 * (2 ** getInfectionFactor(normalisedTimeToElapse));
  severeImpact.infectionsByRequestedTime = getiInfectionsByRequestedTime(
    data, severeImpact.currentlyInfected
  );
  //   severeImpact.severeCasesByRequestedTime = Math.floor(
  //     severeImpact.infectionsByRequestedTime * 0.15
  //   );
  severeImpact.severeCasesByRequestedTime = getSevereCasesByRequestedTime(
    severeImpact.infectionsByRequestedTime
  );
  //   severeImpact.tempHospitalBeds = (data.totalHospitalBeds * 0.35)
  //                                     - severeImpact.severeCasesByRequestedTime;
  //   severeImpact.hospitalBedsByRequestedTime = (severeImpact.tempHospitalBeds >= 0 || -1)
  //                                          * Math.floor(Math.abs(severeImpact.tempHospitalBeds));
  severeImpact.hospitalBedsByRequestedTime = getHospitalBedsByRequestedTime(
    data, severeImpact.severeCasesByRequestedTime
  );

  //   severeImpact.casesForICUByRequestedTime = Math.floor(
  //     severeImpact.infectionsByRequestedTime * 0.05
  //   );
  severeImpact.casesForICUByRequestedTime = getCasesForICUByRequestedTime(
    severeImpact.infectionsByRequestedTime
  );
  //   severeImpact.casesForVentilatorsByRequestedTime = Math.floor(
  //     severeImpact.infectionsByRequestedTime * 0.02
  //   );
  severeImpact.casesForVentilatorsByRequestedTime = getCasesForVentilatorsByRequestedTime(
    severeImpact.infectionsByRequestedTime
  );
  //   severeImpact.dollarsInFlight = Math.floor(
  //     (severeImpact.infectionsByRequestedTime
  //         * data.avgDailyIncomePopulation
  //         * data.avgDailyIncomeInUSD) / 30
  //   );
  severeImpact.dollarsInFlight = getDollarsInFlight(data, severeImpact.infectionsByRequestedTime);


  const output = {
    data, // the input data you got
    impact, // your best case estimation
    severeImpact // severe case estimation
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
