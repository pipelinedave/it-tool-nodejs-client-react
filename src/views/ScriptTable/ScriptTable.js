import React, { Component } from "react";
import MaterialTable from "material-table";
import classNames from "classnames";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import InputAdornment from "@material-ui/core/InputAdornment";
import ArrowForwardOutlined from "@material-ui/icons/ArrowForwardOutlined";
import PlayArrowOutlinedIcon from "@material-ui/icons/PlayArrowOutlined";

import axios from "axios";

const API_URL = "http://localhost:1337";
const API_REQUEST = "/lab";

export default class ScriptTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      columns: [
        { title: "Label", field: "label" },
        { title: "Name", field: "name" },
        { title: "Path", field: "path" },
        { title: "Content", field: "content" },
        { title: "Parameter", field: "parameter" }
      ],
      data: [
        {
          label: "",
          name: "",
          path: "",
          content: "",
          parameter: ""
        }
      ]
    };
  }

  componentDidMount() {
    this.getScripts();
  }

  getScripts = () => {
    axios
      .get(API_URL + API_REQUEST)
      .then(response => {
        let newState = {};
        newState.columns = [
          { title: "Label", field: "label" },
          { title: "Name", field: "name" }
          // { title: "Path", field: "path" },
          // { title: "Content", field: "content" },
          // { title: "Parameter", field: "parameter" }
        ];
        newState.data = [];
        response.data.scripts.forEach(script => {
          newState.data.push(script[1]);
        });
        this.setState(newState, () => {
          console.log("state updated:", this.state);
        });
      })
      .catch(error => {
        console.log(error);
      });
  };

  handleRunButton = target => {
    console.log("Run button pressed", target);
    axios.get(API_URL + "/script/run/" + target).then(response => {
      console.log(response.data);
    });
  };

  render() {
    return (
      <>
        <MaterialTable
          title="Available Scripts"
          columns={this.state.columns}
          data={this.state.data}
          options={{
            pageSize: 10,
            paginationType: "stepped"
          }}
          detailPanel={[
            {
              tooltip: "Show output",
              render: rowData => {
                return (
                  <div>
                    <Button
                      value={rowData.label}
                      color="primary"
                      style={{ margin: 8 }}
                      className={classNames.button}
                      starticon={<PlayArrowOutlinedIcon />}
                      onClick={() => this.handleRunButton(rowData.label)}
                    >
                      Run: {rowData.label}
                    </Button>
                    <form
                      className={classNames.root}
                      noValidate
                      autoComplete="off"
                    >
                      <TextField
                        id="script-output"
                        label="Script Output:"
                        defaultValue="..."
                        multiline
                        rowsmax="4"
                        size="large"
                        variant="outlined"
                        fullWidth
                        style={{ margin: 8 }}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <ArrowForwardOutlined />
                            </InputAdornment>
                          ),
                          readOnly: true
                        }}
                      />
                    </form>
                  </div>
                );
              }
            }
          ]}
          onRowClick={(event, rowData, togglePanel) => togglePanel()}
          // actions={[
          //   {
          //     icon: "favorite_border",
          //     tooltip: "Run script",
          //     onClick: (event, rowData) => alert("Script started!")
          //   }
          // ]}
        />
        <Button onClick={this.getScripts} color="primary" style={{ margin: 8 }}>
          Update Scripts
        </Button>
      </>
    );
  }
}
