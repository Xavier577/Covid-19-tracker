import React from "react";
import numeral from "numeral";
import { Circle, Popup } from "react-leaflet";

export const sortData = (data) => {
  let sortedData = [...data];
  sortedData.sort((a, b) => (a.cases > b.cases ? -1 : 1));
  return sortedData;
};

export const prettyShowStat = (stat) => {
  return stat ? `+${numeral(stat).format("0.0a")}` : "+0";
};

const casesTypeColors = {
  cases: {
    hex: "#CC1034",
    rgb: "rgb(204,16,52)",
    half_op: "rgba(204,16,52,0.5)",
    multiplier: 800,
  },
  recovered: {
    hex: "#7dd71d",
    rgb: "rgb(125,215,267,0.5)",
    half_op: "rgba(251,215,267,0.5)",
    multiplier: 1200,
  },
  deaths: {
    hex: "fb4443",
    rgb: "rgb(251,68,67)",
    half_op: "rgba(251,68,57,0.5)",
    multiplier: 2000,
  },
};

export const showDataOnMap = (data, casesType = "cases") => {
  return data.map((country) => (
    <Circle
      center={[country.countryInfo.lat, country.countryInfo.long]}
      color={casesTypeColors[casesType].hex}
      fillColor={casesTypeColors[casesType].hex}
      fillOpacity={0.4}
      radius={
        Math.sqrt(country[casesType]) * casesTypeColors[casesType].multiplier
      }
    >
      <Popup>
        <div className="info-container">
          <div
            style={{
              backgroundImage: `url(${country.countryInfo.flag})`,
            }}
            className="info-flag"
          >
            <div className="info-name">{country.country}</div>
            <div className="info-confirmed">
              Cases: {numeral(country.cases).format("0.0")}
            </div>
            <div className="info-recovered">
              Recovered: {numeral(country.cases).format("0.0")}
            </div>
            <div className="info-deaths">
              Deaths: {numeral(country.cases).format("0.0")}
            </div>
          </div>
        </div>
      </Popup>
    </Circle>
  ));
};
