var vendorSize = [];
var idOfTaskToEdit;
var edit = document.getElementById("editVendor");
var currentPage = 1;
var rowsPerPage = 5;
getVendorTable();
function saveVendor() {
  var date = document.getElementById("dateInput").value;
  var vendor = document.getElementById("vendorInput").value;
  var process = document.getElementById("processInput").value;
  var material = document.getElementById("materialInput").value;
  var rate = document.getElementById("rateInput").value;
  var notes = document.getElementById("notesInput").value;

  if (
    !date ||
    !vendor ||
    !process ||
    !material ||
    !rate ||
    !notes
  ) {
    alert("Please fill in all the required fields.");
    return;
  }
  if (!idOfTaskToEdit) {
    var rowData = {
      date: date,
      vendor: vendor,
      process: process,
      material: material,
      rate: rate,
      notes: notes,
    };

    fetch("http://localhost:3000/vendorTable", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(rowData),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("Data saved:", data);
        getVendorTable();
        addRowToTable(data);
        document.location.reload();
      })
      .catch((err) => {
        console.log(err);
      });
  } else {
    fetch(`http://localhost:3000/vendorTable/${idOfTaskToEdit}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        date: date,
        vendor: vendor,
        process: process,
        material: material,
        rate: rate,
        notes: notes
      }),
    })
      .then((res) => {
        return res.json();
      })
      .catch((err) => {
        console.log(err);
      });
    getVendorTable();
  }
}

function addRowToTable(rowData) {
  var table = document.getElementById("availableVendors");
  var newRow = document.createElement("tr");
  newRow.id = "trVendors";

  var cellsContent = [
    rowData.date,
    rowData.vendor,
    rowData.process,
    rowData.material,
    rowData.rate,
    rowData.notes,
    createDeleteButton(rowData.id),
    createEditButton(rowData.id),
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
  document.getElementById("vendorInput").value = "";
  document.getElementById("processInput").value = "";
  document.getElementById("materialInput").value = "";
  document.getElementById("rateInput").value = "";
  document.getElementById("notesInput").value = "";
}
function getVendorTable() {
  fetch("http://localhost:3000/vendorTable", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.json())
    .then((data) => {
      const header = data[0].header;
      vendorSize = data.slice(1);
      updateVendorTable(header);
      document.getElementById("vendorCount").textContent = vendorSize.length;
    })
    .catch((error) => {
      console.log(error);
    });
}


function updateVendorTable(header) {
  const thead = document.querySelector("thead");
  thead.className = "text-center";
  thead.innerHTML = "";
  const headerRow = document.createElement("tr");
  header.forEach((columnName) => {
    const headerCell = document.createElement("th");
    headerCell.textContent = columnName;
    headerRow.appendChild(headerCell);
  });
  thead.appendChild(headerRow);
  var table = document.getElementById("availableVendors");
  table.innerHTML = "";

  var startIndex = (currentPage - 1) * rowsPerPage;
  var endIndex = startIndex + rowsPerPage;
  var rowsToShow = vendorSize.slice(startIndex, endIndex);

  for (var i = 0; i < rowsToShow.length; i++) {
    var vendorData = rowsToShow[i];
    var newRow = document.createElement("tr");

    var cellsContent = [
      vendorData.date,
      vendorData.vendor,
      vendorData.process,
      vendorData.material,
      vendorData.rate,
      vendorData.notes,
      createDeleteButton(vendorData.id),
      createEditButton(vendorData.id)
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

function deleteTask(id) {
  fetch(`http://localhost:3000/vendorTable/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((res) => {
      return res.json();
    })
    .then((res) => {
      getVendorTable();
    })
    .catch((err) => {
      console.log(err);
    });
}

function editTask(id) {
  idOfTaskToEdit = id;
  let taskData = vendorSize.find((task) => task.id === id);
  if (taskData) {
    var modal = document.querySelector("#exampleModal.modal");
    modal.classList.add("show");
    modal.style.display = "block";
    document.getElementById("dateInput").value = taskData.date;
    document.getElementById("vendorInput").value = taskData.vendor;
    document.getElementById("processInput").value = taskData.process;
    document.getElementById("materialInput").value = taskData.material;
    document.getElementById("rateInput").value = taskData.rate;
    document.getElementById("notesInput").value = taskData.notes;
  }
  var closeButton = document.getElementById("closedVendor1");
  var customCloseButton = document.getElementById("closedVendor2");
  edit.innerHTML = "Edit";
  closeButton.addEventListener("click", closeModal);
  customCloseButton.addEventListener("click", closeModal);
}

function createPagination() {
  var totalPages = Math.ceil(vendorSize.length / rowsPerPage);
  var pagination = document.getElementById("paginationVendor");
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
      getVendorTable();
      createPagination();
    }
  });

  nextLink.addEventListener("click", function (event) {
    event.preventDefault();
    if (currentPage < totalPages) {
      currentPage++;
      getVendorTable();
      createPagination();
    }
  });

  function handlePageClick() {
    currentPage = parseInt(this.innerHTML);
    getVendorTable();
    createPagination();
  }
}

function closeModal() {
  clearInputFields();
  var modal = document.getElementsByClassName("modalVendor");
  for (var i = 0; i < modal.length; i++) {
    modal[i].style.display = "none";
  }
  edit.innerHTML = "Save changes";
  idOfTaskToEdit = "";
}
