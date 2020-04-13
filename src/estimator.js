const covid19ImpactEstimator = (data) => {

    let normalisedTimeToElapse = normaliseTimeToElapse(data.periodType, data.timeToElapse);

    let impact = {}
    impact.currenlyInfected = data.reportedCases * 10;
    impact.infectionsByRequestedTime = impact.currenlyInfected * (2 ** getInfectionFactor(normalisedTimeToElapse));

    let severeImpact = {}
    severeImpact.currenlyInfected = data.reportedCases * 50;
    severeImpact.infectionsByRequestedTime = severeImpact.currenlyInfected * (2 ** getInfectionFactor(normalisedTimeToElapse));


    let output = {
        data: data, // the input data you got
        impact: impact, // your best case estimation
        severeImpact: severeImpact  //severe case estimation
    };

    return output;

};

const normaliseTimeToElapse = (periodType, timeToElapse) => {
    return (periodType==="week"?timeToElapse*7:(periodType==="months"?timeToElapse*30:timeToElapse));
};

const getInfectionFactor = (timeToElapse) => Math.floor(timeToElapse/3);

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