var idOfTaskToEdit;
var edit = document.getElementById("changeToEdit");
var currentPage = 1;
var rowsPerPage = 5;
var tableData = [];
getTasks();

function addRow() {
  var date = document.getElementById("dateInput").value;
  var paperStock = document.getElementById("paperStockInput").value;
  var gsm = document.getElementById("gsmInput").value;
  var length = document.getElementById("lengthInput").value;
  var width = document.getElementById("widthInput").value;
  var dimension = document.getElementById("dimensionInput").value;
  var qty = document.getElementById("qtyInput").value;
  var rate = document.getElementById("rateInput").value;
  var verified = document.getElementById("verifiedInput").value;
  var notes = document.getElementById("notesInput").value;

  if (
    !date ||
    !paperStock ||
    !gsm ||
    !length ||
    !width ||
    !dimension ||
    !qty ||
    !rate ||
    !verified ||
    !notes
  ) {
    alert("Please fill in all the required fields.");
    return;
  }
if (!idOfTaskToEdit) {
  var rowData = {
    date: date,
    paperStock: paperStock,
    gsm: gsm,
    length: length,
    width: width,
    dimension: dimension,
    qty: qty,
    rate: rate,
    verified: verified,
    notes: notes,
  };

  fetch("http://localhost:3000/paperMarketRate", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(rowData),
  })
    .then((res) => res.json())
    .then((data) => {
      // Success handling
      console.log("Data saved:", data);
      getTasks();
      addRowToTable(data);
      closeModal();
    })
    .catch((err) => {
      console.log(err);
    });
  }else{
    fetch(`http://localhost:3000/paperMarketRate/${idOfTaskToEdit}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
            date: date,
            paperStock: paperStock,
            gsm: gsm,
            length: length,
            width: width,
            dimension: dimension,
            qty: qty,
            rate: rate,
            verified: verified,
            notes: notes
        }),
      })
        .then((res) => {
          return res.json();
        })
        .catch((err) => {
          console.log(err);
        });
        closeModal();
        getTasks();
  }
}

function addRowToTable(rowData) {
  var table = document.getElementById("paperMarketRate");
  var newRow = document.createElement("tr");
  newRow.id = "TrpaperMarketRate";

  var cellsContent = [
    rowData.date,
    rowData.paperStock,
    rowData.gsm,
    rowData.length,
    rowData.width,
    rowData.dimension,
    rowData.qty,
    rowData.rate,
    rowData.verified,
    rowData.notes,
  ];

  for (var i = 0; i < cellsContent.length; i++) {
    var cell = document.createElement("td");
    cell.innerHTML = cellsContent[i];
    newRow.appendChild(cell);
  }

  table.appendChild(newRow);
}

function createDeleteButton(id) {
  var button = document.createElement("button");
  button.className = "btn";
  button.innerHTML = '<i class="fa-solid fa-trash text-danger"></i>';
  button.setAttribute("onclick", `deleteTask(${id})`);
  return button.outerHTML;
}

function createEditButton(id) {
  var button = document.createElement("button");
  button.className = "btn";
  button.innerHTML = '<i class="fa-solid fa-pen-to-square text-success"></i>';
  button.setAttribute("onclick", `editTask(${id})`);
  return button.outerHTML;
}

function clearInputFields() {
  document.getElementById("dateInput").value = "";
  document.getElementById("paperStockInput").value = "";
  document.getElementById("gsmInput").value = "";
  document.getElementById("lengthInput").value = "";
  document.getElementById("widthInput").value = "";
  document.getElementById("dimensionInput").value = "";
  document.getElementById("qtyInput").value = "";
  document.getElementById("rateInput").value = "";
  document.getElementById("verifiedInput").value = "";
  document.getElementById("notesInput").value = "";
}

function getTasks() {
  fetch("http://localhost:3000/paperMarketRate", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((res) => {
      return res.json();
    })
    .then((data) => {
      const header = data[0].header;

      taskArray = data.slice(1);
      tableData = taskArray;
      updateTable(header);
      createPagination();
      document.getElementById("recordCount").textContent = taskArray.length;
    })
    .catch((err) => {
      console.log(err);
    });
}

function updateTable(header) {
  const thead = document.querySelector("thead");
  thead.className = "text-center"
  thead.innerHTML = ""; // Clear existing content
  const headerRow = document.createElement("tr");

  // Create header cells
  header.forEach((columnName) => {
    const headerCell = document.createElement("th");
    headerCell.textContent = columnName;
    headerRow.appendChild(headerCell);
  });

  thead.appendChild(headerRow);

  var table = document.getElementById("paperMarketRate");
  table.innerHTML = "";

  var startIndex = (currentPage - 1) * rowsPerPage;
  var endIndex = startIndex + rowsPerPage;
  var rowsToShow = tableData.slice(startIndex, endIndex);

  for (var i = 0; i < rowsToShow.length; i++) {
    var rowData = rowsToShow[i];
    var newRow = document.createElement("tr");
    newRow.id = "TrpaperMarketRate";

    var cellsContent = [
      rowData.date,
      rowData.paperStock,
      rowData.gsm,
      rowData.length,
      rowData.width,
      rowData.dimension,
      rowData.qty,
      rowData.rate,
      rowData.verified,
      rowData.notes,
      createDeleteButton(rowData.id),
      createEditButton(rowData.id),
    ];

    for (var j = 0; j < cellsContent.length; j++) {
      var cell = document.createElement("td");
      cell.innerHTML = cellsContent[j];
      newRow.appendChild(cell);
    }

    table.appendChild(newRow);
  }

  createPagination();
}

function createPagination() {
  var totalPages = Math.ceil(tableData.length / rowsPerPage);
  var pagination = document.getElementById("pagination");
  pagination.innerHTML = "";

  var previousLink = document.createElement("a");
  previousLink.classList.add("page-link");
  previousLink.href = "#";
  previousLink.tabIndex = -1;
  previousLink.setAttribute("aria-disabled", "true");
  previousLink.innerHTML = "Previous";

  var previousItem = document.createElement("li");
  previousItem.classList.add("page-item");
  if (currentPage === 1) {
    previousItem.classList.add("disabled");
  }
  previousItem.appendChild(previousLink);

  pagination.appendChild(previousItem);

  for (var i = 1; i <= totalPages; i++) {
    var pageLink = document.createElement("a");
    pageLink.classList.add("page-link");
    pageLink.href = "#";
    pageLink.innerHTML = i;
    pageLink.addEventListener("click", handlePageClick);

    var pageItem = document.createElement("li");
    pageItem.classList.add("page-item");
    if (currentPage === i) {
      pageItem.classList.add("active");
    }
    pageItem.appendChild(pageLink);

    pagination.appendChild(pageItem);
  }

  var nextLink = document.createElement("a");
  nextLink.classList.add("page-link");
  nextLink.href = "#";
  nextLink.innerHTML = "Next";

  var nextItem = document.createElement("li");
  nextItem.classList.add("page-item");
  if (currentPage === totalPages) {
    nextItem.classList.add("disabled");
  }
  nextItem.appendChild(nextLink);

  pagination.appendChild(nextItem);

  previousLink.addEventListener("click", function (event) {
    event.preventDefault();
    if (currentPage > 1) {
      currentPage--;
      getTasks();
      createPagination();
    }
  });

  nextLink.addEventListener("click", function (event) {
    event.preventDefault();
    if (currentPage < totalPages) {
      currentPage++;
      getTasks();
      createPagination();
    }
  });

  function handlePageClick() {
    currentPage = parseInt(this.innerHTML);
    getTasks();
    createPagination();
  }
}



function deleteTask(id) {
  fetch(`http://localhost:3000/paperMarketRate/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((res) => {
      return res.json();
    })
    .then((res) => {
      getTasks();
    })
    .catch((err) => {
      console.log(err);
    });
}

function editTask(id) {
  idOfTaskToEdit = id;
  var taskData = taskArray.find((task) => task.id === id);
  if (taskData) {
    var modal = document.querySelector("#exampleModal.modal");
    modal.classList.add("show");
    modal.style.display = "block";
    document.getElementById("dateInput").value = taskData.date;
    document.getElementById("paperStockInput").value = taskData.paperStock;
    document.getElementById("gsmInput").value = taskData.gsm;
    document.getElementById("lengthInput").value = taskData.length;
    document.getElementById("widthInput").value = taskData.width;
    document.getElementById("dimensionInput").value = taskData.dimension;
    document.getElementById("qtyInput").value = taskData.qty;
    document.getElementById("rateInput").value = taskData.rate;
    document.getElementById("verifiedInput").value = taskData.verified;
    document.getElementById("notesInput").value = taskData.notes;
  }
  var closeButton = document.querySelector("#exampleModal .btn-close");
  var customCloseButton = document.getElementById("closed");
  edit.innerHTML = "Edit";
  closeButton.addEventListener("click", closeModal);
  customCloseButton.addEventListener("click", closeModal);
}

// function updateRow(id) {
//   fetch(`http://localhost:3000/paperMarketRate/${id}`, {
//     method: "put",
//     headers: {
//       "Content-Type": "application/json",
//     },
//   })
//     .then((res) => {
//       return res.json();
//     })
//     .then((res) => {
//       getTasks();
//     })
//     .catch((err) => {
//       console.log(err);
//     });
// }

function closeModal() {
  clearInputFields();
  var modal = document.querySelector("#exampleModal.modal");
  modal.style.display = "none";
    edit.innerHTML = "Save Changes";
    idOfTaskToEdit = "";
  }

  function handleSubmit(event) {
    addRow();
  }
  
  document.getElementById("exampleModal").addEventListener("submit", handleSubmit);
  
  const modalInputs = document.querySelectorAll("#exampleModal.modal input");
  modalInputs.forEach((input) => {
    input.addEventListener("keypress", (event) => {
      if (event.key === "Enter") {
          handleSubmit(event);
      }
    });
  });
  

