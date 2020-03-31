import React, { Component } from "react";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
// core components
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import Table from "components/Table/ScriptTable.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardBody from "components/Card/CardBody.js";

import axios from "axios";

const API_URL = "http://localhost:1337";
const API_REQUEST = "/lab";

const styles = {
  cardCategoryWhite: {
    "&,& a,& a:hover,& a:focus": {
      color: "rgba(255,255,255,.62)",
      margin: "0",
      fontSize: "14px",
      marginTop: "0",
      marginBottom: "0"
    },
    "& a,& a:hover,& a:focus": {
      color: "#FFFFFF"
    }
  },
  cardTitleWhite: {
    color: "#FFFFFF",
    marginTop: "0px",
    minHeight: "auto",
    fontWeight: "300",
    fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
    marginBottom: "3px",
    textDecoration: "none",
    "& small": {
      color: "#777",
      fontSize: "65%",
      fontWeight: "400",
      lineHeight: "1"
    }
  }
};

const useStyles = makeStyles(styles);

function ScriptTables() {
  const classes = useStyles();
  return classes;
}

export default class ScriptTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: {
        scripts: {
          label: "",
          name: "",
          path: "",
          parameter: ""
        }
      },
      tableData: [["", "", "", ""], ["", "", "", ""]]
    };
  }

  componentDidMount() {
    this.getScripts();
  }

  getScripts = () => {
    axios
      .get(API_URL + API_REQUEST)
      .then(response => {
        const data = response.data;
        this.setState({ data });
        this.putScriptsIntoTable();
      })
      .catch(error => {
        console.log(error);
      });
  };

  putScriptsIntoTable = () => {
    const tableData = [];
    const scripts = this.state.data.scripts;
    scripts.forEach((script, index) => {
      tableData.push([
        script[1].label,
        script[1].name,
        script[1].path,
        `${script[1].parameter[0]}, ${script[1].parameter[1]}`
      ]);
    });
    const data = this.state.data;
    data.tableData = tableData;
    this.setState(data);
  };

  render() {
    return (
      <GridContainer>
        <GridItem xs={12} sm={12} md={12}>
          <Card>
            <CardHeader color="primary">
              <h4 className={ScriptTables.cardTitleWhite}>Available scripts</h4>
              <p className={ScriptTables.cardCategoryWhite}>
                These are all the scripts our API returned
              </p>
            </CardHeader>
            <CardBody>
              <Table
                tableHeaderColor="primary"
                tableHead={["Label", "Name", "Path", "Parameter"]}
                tableData={this.state.tableData}
              />
            </CardBody>
          </Card>
        </GridItem>
      </GridContainer>
    );
  }
}
