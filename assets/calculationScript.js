getConfig();
// Get_Qty();
// Get_Qty_2();
// Get_Qty_3();
// Get_Qty_4();
// Get_Qty_5();
var CUSTOM_QTY_1 = "24,000";
var CUSTOM_QTY_2 = "36,000";
var CUSTOM_QTY_3 = "48,000";
var CUSTOM_QTY_4 = "1";
var qty1 = document.getElementById("qty1");
var qty2 = document.getElementById("qty2");
var qty3 = document.getElementById("qty3");
var qty4 = document.getElementById("qty4");
var qty5 = document.getElementById("qty5");
var customQty1 = document.getElementById("customQty1");
var customQty2 = document.getElementById("customQty2");
var customQty3 = document.getElementById("customQty3");
var customQty4 = document.getElementById("customQty4");
var moqQtyInBooks = document.getElementById("moqQtyInBooks");
var moqQty2InBooks = document.getElementById("moqQty2InBooks");
var moqQty3InBooks = document.getElementById("moqQty3InBooks");
var moqQty4InBooks = document.getElementById("moqQty4InBooks");
var moqQty5InBooks = document.getElementById("moqQty5InBooks");
// qty2.innerHTML = Get_Qty_2;
// qty3.innerText = Get_Qty_3;
// qty4.innerText = Get_Qty_4;
// qty5.innerText = Get_Qty_5;
customQty1.innerText = CUSTOM_QTY_1;
customQty2.innerText = CUSTOM_QTY_2;
customQty3.innerText = CUSTOM_QTY_3;
customQty4.innerText = CUSTOM_QTY_4;
function updateDateTime() {
  const dateTimeElement = document.getElementById("datetime");
  if (dateTimeElement) {
    const now = new Date();
    const dateTimeString = now.toDateString() + " " + now.toLocaleTimeString();
    dateTimeElement.innerHTML = dateTimeString;
  }
}

// Array of field objects
const fields = [
  {
    id: "selectProduct",
    values: [
      "Flyer",
      "Envelopes",
      "Invoice Pads",
      "Letter Heads",
      "Brochure",
      "Buisness Cards",
      "Paper Bags",
      "Post Cards",
      "Presentation Folder",
      "Stickers",
    ],
  },
  {
    id: "colors",
    values: ["0", "1", "2", "3", "4", "5", "6"],
  },
  {
    id: "size",
    values: [
      "Letter",
      "DL",
      "A-4",
      "A-5",
      "A-3",
      "Buisness Card",
      "Presentation Folder",
    ],
  },
  {
    id: "paperStock",
    values: [
      "Art Paper/Mate",
      "CarbonLess",
      "Glossy/ArtPaper",
      "Mate Paper",
      "News Paper",
      "Uncoated/Offset",
      "White/Linen",
      "Yellow Laid",
      "Bleach Card",
    ],
  },
  {
    id: "grams",
    values: ["113", "128", "150"],
  },
  {
    id: "sheetSize",
    values: [
      { label: 's17x24', value: '17" x 24"' },
      { label: 's18x23', value: '18" x 23"' },
      { label: 's20x30', value: '20" x 30"' },
      { label: 's20x36', value: '20" x 36"' },
      { label: 's23x36', value: '23" x 36"' },
      { label: 's25x36', value: '25" x 36"' },
      { label: 's85x12', value: '8.5" x 12"' },
    ],
  },
  {
    id: "ofUp",
    values: ["4"],
  },
  {
    id: "sideOption",
    values: ["Double Sided", "Single Sided"],
  },
  {
    id: "imposition",
    values: ["Applied", "Not Applicable"],
  },
  {
    id: "jobColors",
    values: ["0", "1", "2", "3", "4", "5", "6"],
  },
];

// function addColumnToRows() {
//   var table = document.getElementById("myTable");
//   var rows = table.getElementsByTagName("tr");

//   fetch("http://localhost:3000/pressMachines")
//     .then((response) => response.json())
//     .then((data) => {
//       var existingColumns = Object.keys(data[0]);
//       var newColumnName = "New Column";

//       // Populate the initial table rows with data
//       data.forEach((item) => {
//         var newRow = document.createElement("tr");
//         existingColumns.forEach((column) => {
//           var cell = document.createElement("td");
//           cell.textContent = item[column];
//           newRow.appendChild(cell);
//         });
//         table.appendChild(newRow);
//       });

//       if (!existingColumns.includes(newColumnName)) {
//         existingColumns.push(newColumnName);

//         // Update the JSON data for each row
//         data.forEach((item, index) => {
//           item[newColumnName] = "";

//           fetch(`http://localhost:3000/pressMachines/${item.id}`, {
//             method: "PUT",
//             headers: {
//               "Content-Type": "application/json",
//             },
//             body: JSON.stringify(item),
//           })
//             .then((response) => response.json())
//             .then((result) => {
//               console.log("Column added:", result);
//               var cell = document.createElement("td");
//               cell.textContent = result[newColumnName];
//               rows[index].appendChild(cell);
//             })
//             .catch((error) => {
//               console.error("Error:", error);
//             });
//         });
//       }
//     })
//     .catch((error) => {
//       console.error("Error:", error);
//     });
// }

function getConfig() {
  fetch("http://localhost:3000/pressMachines", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((res) => res.json())
    .then((res) => {
      const table = document.getElementById("configRate");
      const thead = document.createElement("thead");
      const tbody = document.createElement("tbody");
      const headerRow = document.createElement("tr");
      const columnName = res[0].header[0];
      const headerCell = document.createElement("th");
      headerCell.className = "text-start";
      headerCell.textContent = columnName + " SPECIFICATION";
      headerCell.colSpan = 2;
      headerRow.appendChild(headerCell);
      thead.appendChild(headerRow);

      // Create the selectable options row in tbody
      const selectableRow = document.createElement("tr");
      const selectableCell = document.createElement("td");
      selectableCell.colSpan = 2;
      selectableCell.style.height = "10px";
      const selectElement = document.createElement("select");
      selectElement.className = "w-100 border-0 ";

      // Add the press values as options
      for (let i = 1; i < res.length; i++) {
        const press = res[i].press;
        const option = document.createElement("option");
        option.value = press;
        option.textContent = press;
        selectElement.appendChild(option);
      }

      selectableCell.appendChild(selectElement);
      selectableRow.appendChild(selectableCell);
      tbody.appendChild(selectableRow);

      const impressionsRow = document.createElement("tr");
      const impressionsCell1 = document.createElement("td");
      const impressionsCell2 = document.createElement("td");
      const selectedPress = selectElement.value;

      const selectedPressData = res.find(
        (item) => item.press === selectedPress
      );
      if (selectedPressData) {
        const impressionsValue = selectedPressData.impressions;
        const impressionsTimes2Value = impressionsValue * 2;
        impressionsCell1.textContent = "IMPRESSION RATE: " + impressionsValue;
        impressionsCell1.className = "fs-6 col-6";
        impressionsCell2.textContent =
          "BASE RATE (COST) : " + impressionsTimes2Value;
        impressionsCell2.className = "fs-6 col-6";
      }
      impressionsRow.appendChild(impressionsCell1);
      impressionsRow.appendChild(impressionsCell2);
      tbody.appendChild(impressionsRow);

      // Create the CTP and custom value row in tbody
      const ctpRow = document.createElement("tr");
      const ctpCell1 = document.createElement("td");
      const ctpCell2 = document.createElement("td");

      const updateCTPCell = (pressData) => {
        ctpCell1.textContent = "CTP RATE: " + pressData.ctp;
      
        const selectedSheetSizeElement = document.getElementById("sheetSize");
        const selectedSheetSizeValue = selectedSheetSizeElement.value;
      
        // Find the label corresponding to the selected value in pressData
        let sheetPiecesLabel = "Error";
        const selectedSheetSizeOption = fields.find((field) => field.id === "sheetSize").values.find((option) => option.value === selectedSheetSizeValue);
        if (selectedSheetSizeOption) {
          sheetPiecesLabel = selectedSheetSizeOption.label;
        }
      
        // Now you can use sheetPiecesLabel for whatever purpose you need.
        // If you want to use it to retrieve the value from pressData, you can do it like this:
        const sheetPieces = pressData[sheetPiecesLabel] || "Error";
        const sizesValue = (sheetPieces === "-" ? "Error!" : "SHEET PIECES: 1/" + sheetPieces);
        ctpCell2.textContent = sizesValue;
      
        // Extract the numeric value from sheetPieces
        const numericValue = sheetPieces === "-" ? "Error!" : parseInt(sheetPieces);
      
        // Update the quantity element with the numeric value
        if (!isNaN(numericValue)) {
          qty1.innerText = numericValue * 1000;
          qty2.innerText = (numericValue * 1000) * 2;
          qty3.innerText = (numericValue * 1000) * 3;
          qty4.innerText = (numericValue * 1000) * 4;
          qty5.innerText = (numericValue * 1000) * 5;
          moqQtyInBooks.innerText = Math.ceil(parseInt(qty1.innerText) / 300);
          moqQty2InBooks.innerText = Math.ceil(parseInt(qty2.innerText) / 300);
          moqQty3InBooks.innerText = Math.ceil(parseInt(qty3.innerText) / 300);
          moqQty4InBooks.innerText = Math.ceil(parseInt(qty4.innerText) / 300);
          moqQty5InBooks.innerText = Math.ceil(parseInt(qty5.innerText) / 300);
        } else {
          qty1.innerText = numericValue;
          qty2.innerText = numericValue;
          qty3.innerText = numericValue;
          qty4.innerText = numericValue;
          qty5.innerText = numericValue;
          moqQtyInBooks.innerText = Math.ceil(parseInt(numericValue) / 300);
          moqQty2InBooks.innerText = Math.ceil(parseInt(numericValue) / 300);
          moqQty3InBooks.innerText = Math.ceil(parseInt(numericValue) / 300);
          moqQty4InBooks.innerText = Math.ceil(parseInt(numericValue) / 300);
          moqQty5InBooks.innerText = Math.ceil(parseInt(numericValue) / 300);
        }
      };
      
      // Initial call to update the CTP cell with the selectedPressData
      updateCTPCell(selectedPressData);
      
      // Add event listener to update the CTP cell whenever the sheetSize dropdown selection changes
      const sheetSizeElement = document.getElementById("sheetSize");
      sheetSizeElement.addEventListener("change", () => {
        updateCTPCell(selectedPressData);
      });
      
      
      
      
      // Append the cells to the row
      ctpRow.appendChild(ctpCell1);
      ctpRow.appendChild(ctpCell2);

      // Append the row to the table body
      tbody.appendChild(ctpRow);

      // Clear existing table content and append the new table header and body
      table.innerHTML = "";
      table.appendChild(thead);
      table.appendChild(tbody);

      // Add event listener to select element to update impressions and CTP values when selection changes
      selectElement.addEventListener("change", () => {
        const selectedPress = selectElement.value;
        const selectedPressData = res.find(
          (item) => item.press === selectedPress
        );
        if (selectedPressData) {
          const impressionsValue = selectedPressData.impressions;
          const impressionsTimes2Value = impressionsValue * 2;
          impressionsCell1.textContent = "IMPRESSION RATE: " + impressionsValue;
          impressionsCell2.textContent =
            "BASE RATE (COST) : " + impressionsTimes2Value;

          updateCTPCell(selectedPressData);
        }
      });
    })
    .catch((err) => {
      console.log(err);
    });
}

function getLamination() {
  fetch("http://localhost:3000/lamination", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((res) => {
      return res.json();
    })
    .then((res) => {
      let tableHTML = "";
      for (let i = 0; i < res.length; i++) {
        tableHTML += `
          <tr>
            <th colspan="2" class="ps-2 text-lg-start fs-6">${res[i].lamination} <a class="text-info offset-3">${res[i].option}</a></th>
          </tr>
          <tr>
            <th colspan="2" class="ps-2 text-lg-start fs-6">${res[i].selected}</th>
          </tr>
          <tr>
            <td colspan="2" class="ps-2 text-lg-start fs-6">${res[i].selectedLamination}</td>
          </tr>
          <tr>
          <td class="ps-2 text-lg-start fs-6">${res[i].process}</td>
          <td class="ps-2 text-lg-start fs-6">${res[i].material}</td>
          </tr>
          <tr>
            <td class="ps-2 text-lg-start fs-6">${res[i].dimension}</td>
            <td class="ps-2 text-lg-start fs-6">${res[i].printArea}</td>
          </tr>
          <tr>
            <td colspan="2" class="ps-2 text-lg-start fs-6">${res[i].vendor}</td>
          </tr>
        `;
      }
      var table = document.getElementById("laminationTable");
      table.innerHTML = tableHTML;
    })
    .catch((err) => {
      console.log(err);
    });
}

function getSpecs() {
  fetch("http://localhost:3000/press", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((res) => {
      return res.json();
    })
    .then((res) => {
      let tableHTML = "";
      for (let i = 0; i < res.length; i++) {
        tableHTML += `
          <tr>
            <th colspan="2" class="ps-2 text-lg-start fs-6">${res[i].press}</th>
          </tr>
          <tr>
          <td class="text-center fs-6 col-6">${res[i].selectedPart}</td>
          <td class="text-center fs-6 col-6">${res[i].part}</td>
          </tr>
          <tr>
            <td class="text-center fs-6 col-6">${res[i].enterCount}</td>
            <td class="text-center fs-6 col-6">${res[i].enter}</td>
          </tr>
        `;
      }
      var table = document.getElementById("specsTable");
      table.innerHTML = tableHTML;
    })
    .catch((err) => {
      console.log(err);
    });
}

fields.forEach((field) => {
  const selectElement = document.getElementById(field.id);

  if (field.values && Array.isArray(field.values)) {
    // Check if the field values are an array
    if (field.values.every((item) => item.hasOwnProperty("label") && item.hasOwnProperty("value"))) {
      // If the field values are an array of objects with both 'label' and 'value'
      field.values.forEach((option) => {
        const optionElement = document.createElement("option");
        optionElement.value = option.value;
        optionElement.textContent = option.value;
        selectElement.appendChild(optionElement);
      });
    } else {
      // If the field values are an array of strings
      field.values.forEach((value) => {
        const optionElement = document.createElement("option");
        optionElement.value = value;
        optionElement.textContent = value;
        selectElement.appendChild(optionElement);
      });
    }
  }
});



// function Get_Qty() {
//   fetch("http://localhost:3000/pressMachines", {
//     method: "GET",
//     headers: {
//       "Content-Type": "application/json",
//     },
//   })
//     .then((res) => res.json())
//     .then((res) => {
//       const pressData = res.find((item) => item.id === 3);
//       console.log(pressData);
//       qty1.textContent = pressData.size4 * 1000;
//     })
//     .catch((error) => {
//       console.error(error);
//     });
// }

// function Get_Qty_2() {
//   fetch("http://localhost:3000/pressMachines", {
//     method: "GET",
//     headers: {
//       "Content-Type": "application/json",
//     },
//   })
//     .then((res) => res.json())
//     .then((res) => {
//       const pressData = res.find((item) => item.id === 3);
//       console.log(pressData);
//       if (pressData.press === "ROTA (SPOT COLOR)" || pressData.size4 === "2") {
//         qty2.textContent = pressData.size4 * 1000 * 2;
//         console.log(pressData);
//       }
//     })
//     .catch((error) => {
//       console.error(error);
//     });
// }

// function Get_Qty_3() {
//   fetch("http://localhost:3000/pressMachines", {
//     method: "GET",
//     headers: {
//       "Content-Type": "application/json",
//     },
//   })
//     .then((res) => res.json())
//     .then((res) => {
//       const pressData = res.find((item) => item.id === 3);
//       console.log(pressData);
//       if (pressData.press === "ROTA (SPOT COLOR)" || pressData.size4 === "2") {
//         qty3.textContent = pressData.size4 * 1000 * 3;
//         console.log(pressData);
//       }
//     })
//     .catch((error) => {
//       console.error(error);
//     });
// }

// function Get_Qty_4() {
//   fetch("http://localhost:3000/pressMachines", {
//     method: "GET",
//     headers: {
//       "Content-Type": "application/json",
//     },
//   })
//     .then((res) => res.json())
//     .then((res) => {
//       const pressData = res.find((item) => item.id === 3);
//       console.log(pressData);
//       if (pressData.press === "ROTA (SPOT COLOR)" || pressData.size4 === "2") {
//         qty4.textContent = pressData.size4 * 1000 * 4;
//         console.log(pressData);
//       }
//     })
//     .catch((error) => {
//       console.error(error);
//     });
// }

// function Get_Qty_5() {
//   fetch("http://localhost:3000/pressMachines", {
//     method: "GET",
//     headers: {
//       "Content-Type": "application/json",
//     },
//   })
//     .then((res) => res.json())
//     .then((res) => {
//       const pressData = res.find((item) => item.id === 3);
//       console.log(pressData);
//       if (pressData.press === "ROTA (SPOT COLOR)" || pressData.size4 === "2") {
//         qty5.textContent = pressData.size4 * 1000 * 5;
//         console.log(pressData);
//       }
//     })
//     .catch((error) => {
//       console.error(error);
//     });
// }

updateDateTime();
setInterval(updateDateTime, 1000);
