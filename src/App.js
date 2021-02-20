import React, { Component } from "react";
import "./App.css";
import InfoBox from "./component/InfoBox/InfoBox";
import numeral from "numeral";
import { format } from "numeral";
import Map from "./component/Map/Map";
import LineGraph from "./component/LineGraph/lineGraph";
import Table from "./component/Table/table";
import { prettyShowStat, sortData } from "./util";
import "leaflet/dist/leaflet.css";

import {
  Card,
  CardContent,
  Typography,
  FormControl,
  Select,
  MenuItem,
} from "@material-ui/core";

export default class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      countries: [],
      country: "worldwide",
      casesType: "cases",
      countryInfo: {},
      tableData: [],
      mapCenter: { lat: 34.80746, lng: -40.4796 },
      mapZoom: 3,
      mapCountries: [],
    };
  }
  componentDidMount() {
    const allInfo = async () => {
      fetch("https://disease.sh/v3/covid-19/all")
        .then((response) => response.json())
        .then((data) => {
          this.setState({
            countryInfo: data,
          });
        });
    };
    allInfo();

    const getCountriesData = async () => {
      try {
        const fetchData = await fetch(
          "https://disease.sh/v3/covid-19/countries"
        );
        const data = await fetchData.json();
        const countries = data.map((country) => ({
          name: country.country,
          value: country.countryInfo.iso2,
        }));
        let sortedData = sortData(data);
        this.setState({
          countries: countries,
          tableData: sortedData,
          mapCountries: data,
        });
        console.log(data);
      } catch (err) {
        console.log(err.message);
      }
    };

    getCountriesData();
  }

  onCountryChange = (e) => {
    const countryCode = e.target.value;
    const url =
      countryCode === "worldwide"
        ? "https://disease.sh/v3/covid-19/all"
        : `https://disease.sh/v3/covid-19/countries/${countryCode}`;

    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        this.setState({
          mapCenter: [data.countryInfo.lat, data.countryInfo.long],
          mapZoom: 4,
          country: countryCode,
          countryInfo: data,
        });
      });
  };
  render() {
    return (
      <div className="app">
        <div className="app-left">
          <div className="app-header">
            <h1> COVID-19 Tracker</h1>
            <FormControl className="app-dropdowm">
              <Select
                variant="outlined"
                value={this.state.country}
                onChange={this.onCountryChange}>
                <MenuItem value="worldwide">Worldwide</MenuItem>
                {this.state.countries.map((country) => (
                  <MenuItem key={country.name} value={country.value}>
                    {country.name}
                  </MenuItem>
                ))}

                {/* <MenuItem value = 'Nigeria'>Nigeria</MenuItem>
                <MenuItem value = 'China'>China</MenuItem> */}
              </Select>
            </FormControl>
          </div>

          <div className="app-stats">
            <InfoBox
              onClick={(e) => {
                this.setState({
                  casesType: "cases",
                });
              }}
              title="Coronavirus Cases"
              cases={prettyShowStat(this.state.countryInfo.todayCases)}
              total={numeral(this.state.countryInfo.cases).format("0.0a")}
              active={this.state.casesType === "cases"}
              isRed
            />
            <InfoBox
              onClick={(e) => {
                this.setState({
                  casesType: "recovered",
                });
              }}
              title="Recovered"
              active={this.state.casesType === "recovered"}
              cases={prettyShowStat(this.state.countryInfo.todayRecovered)}
              total={numeral(this.state.countryInfo.recovered).format("0.0a")}
            />
            <InfoBox
              onClick={(e) => {
                this.setState({
                  casesType: "deaths",
                });
              }}
              title="Death"
              isRed
              active={this.state.casesType === "deaths"}
              cases={prettyShowStat(this.state.countryInfo.todayDeaths)}
              total={numeral(this.state.countryInfo.deaths).format("0.0a")}
            />
          </div>
          <Map
            countries={this.state.mapCountries}
            casesType={this.state.casesType}
            center={this.state.mapCenter}
            zoom={this.state.mapZoom}
          />
        </div>

        <Card className="app-right">
          <CardContent>
            <div className="app-information">
              <h3>Live Cases by Country</h3>
              <Table countries={this.state.tableData} />
              <h3>Worldwide new {this.state.casesType}</h3>
              <LineGraph casesType={this.state.casesType} />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }
}
