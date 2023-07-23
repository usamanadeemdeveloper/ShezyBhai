var paperSize = [];
var idOfTaskToEdit;
var edit = document.getElementById("editMode");
var currentPage = 1;
var rowsPerPage = 5;
getUpingTable();
getPaperSizeTable();
function saveProduct() {
  var product = document.getElementById("productInput").value;
  var s17x24 = document.getElementById("size1Input").value;
  var s23x36 = document.getElementById("size2Input").value;
  var s25x36 = document.getElementById("size3Input").value;
  var s18x23 = document.getElementById("size4Input").value;
  var s85x12 = document.getElementById("size5Input").value;
  var s20x30 = document.getElementById("size6Input").value;

  if (
    !product ||
    !s17x24 ||
    !s23x36 ||
    !s25x36 ||
    !s18x23 ||
    !s85x12 ||
    !s20x30
  ) {
    alert("Please fill in all the required fields.");
    return;
  }
  if (!idOfTaskToEdit) {
    var rowData = {
      product: product,
      s17x24: s17x24,
      s23x36: s23x36,
      s25x36: s25x36,
      s18x23: s18x23,
      s85x12: s85x12,
      s20x30: s20x30,
    };

    fetch("http://localhost:3000/uping", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(rowData),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("Data saved:", data);
        getUpingTable();
        addRowToTable(data);
        location.reload();
      })
      .catch((err) => {
        console.log(err);
      });
  } else {
    fetch(`http://localhost:3000/uping/${idOfTaskToEdit}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        product: product,
        s17x24: s17x24,
        s23x36: s23x36,
        s25x36: s25x36,
        s18x23: s18x23,
        s85x12: s85x12,
        s20x30: s20x30,
      }),
    })
      .then((res) => {
        return res.json();
      })
      .catch((err) => {
        console.log(err);
      });
      closeModal();
    getUpingTable();
  }
}

function addRowToTable(rowData) {
  var table = document.getElementById("availableUping");
  var newRow = document.createElement("tr");
  newRow.id = "trUping";

  var cellsContent = [
    rowData.product,
    rowData.s17x24,
    rowData.s23x36,
    rowData.s25x36,
    rowData.s18x23,
    rowData.s85x12,
    rowData.s20x30,
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
  document.getElementById("productInput").value = "";
  document.getElementById("size1Input").value = "";
  document.getElementById("size2Input").value = "";
  document.getElementById("size3Input").value = "";
  document.getElementById("size4Input").value = "";
  document.getElementById("size5Input").value = "";
  document.getElementById("size6Input").value = "";
}
function getUpingTable() {
  fetch("http://localhost:3000/uping", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.json())
    .then((data) => {
      const header = data[0].header;
      paperSize = data.slice(1);
      updateUpingTable(header);
    })
    .catch((error) => {
      console.log(error);
    });
}


function updateUpingTable(header) {
  const thead = document.querySelector("thead");
  thead.className = "text-center"
  thead.innerHTML = "";
  const headerRow = document.createElement("tr");

  // Create header cells
  header.forEach((columnName) => {
    const headerCell = document.createElement("th");
    headerCell.textContent = columnName;
    headerRow.appendChild(headerCell);
  });

  thead.appendChild(headerRow);

  var table = document.getElementById("availableUping");
  table.innerHTML = "";

  var startIndex = (currentPage - 1) * rowsPerPage;
  var endIndex = startIndex + rowsPerPage;
  var rowsToShow = paperSize.slice(startIndex, endIndex);

  for (var i = 0; i < rowsToShow.length; i++) {
    var rowData = rowsToShow[i];
    var newRow = document.createElement("tr");
    newRow.id = "trAvailableUping";

    var cellsContent = [
      rowData.product,
      rowData.s17x24,
      rowData.s23x36,
      rowData.s23x36,
      rowData.s18x23,
      rowData.s85x12,
      rowData.s20x30,
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

function getPaperSizeTable() {
  fetch("http://localhost:3000/uping", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.json())
    .then((data) => {
      const header = data[0].header;
      handlePaperSizeHeader(header);
    })
    .catch((error) => {
      console.log(error);
    });
}

function handlePaperSizeHeader(header) {
  const table = document.getElementById("sizeSettings");
  table.innerHTML = "";
  const headerRow = document.createElement("tr");
  const headerCell = document.createElement("th");
  headerCell.className = "bg-dark text-white"
  headerCell.textContent = "PAPER SIZE";
  headerRow.appendChild(headerCell);
  table.className = "text-center fw-bolder fs-6"
  table.appendChild(headerRow);

  for (let i = 1; i < header.length - 2; i++) {
    const row = document.createElement("tr");
    const cell = document.createElement("td");
    cell.textContent = header[i];
    row.appendChild(cell);
    table.appendChild(row);
  }
}


function deleteTask(id) {
  fetch(`http://localhost:3000/uping/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((res) => {
      return res.json();
    })
    .then((res) => {
      getUpingTable();
    })
    .catch((err) => {
      console.log(err);
    });
}

function editTask(id) {
  idOfTaskToEdit = id;
  let taskData = paperSize.find((task) => task.id === id);
  if (taskData) {
    var modal = document.querySelector("#exampleModal.modal");
    modal.classList.add("show");
    modal.style.display = "block";
    document.getElementById("productInput").value = taskData.product;
    document.getElementById("size1Input").value = taskData.s17x24;
    document.getElementById("size2Input").value = taskData.s23x36;
    document.getElementById("size3Input").value = taskData.s25x36;
    document.getElementById("size4Input").value = taskData.s18x23;
    document.getElementById("size5Input").value = taskData.s85x12;
    document.getElementById("size6Input").value = taskData.s20x30;
  }
  var closeButton = document.getElementById("closed1");
  var customCloseButton = document.getElementById("closed2");
  edit.innerHTML = "Edit";
  closeButton.addEventListener("click", closeModal);
  customCloseButton.addEventListener("click", closeModal);
}


function createPagination() {
  var totalPages = Math.ceil(paperSize.length / rowsPerPage);
  var pagination = document.getElementById("upingPagination");
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
      getUpingTable();
      createPagination();
    }
  });

  nextLink.addEventListener("click", function (event) {
    event.preventDefault();
    if (currentPage < totalPages) {
      currentPage++;
      getUpingTable();
      createPagination();
    }
  });

  function handlePageClick() {
    currentPage = parseInt(this.innerHTML);
    getUpingTable();
    createPagination();
  }
}

function closeModal() {
  clearInputFields();
  var modal = document.querySelector("#exampleModal");
  modal.style.display = "none";
  edit.innerHTML = "Save changes";
  idOfTaskToEdit = "";
}

function handleSubmit(event) {
  saveProduct();
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