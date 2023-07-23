var laminationVendors = [];
var idOfTaskToEdit;
var edit = document.getElementById("editVendorInfo");
var currentLaminationPage = 1;
var laminationRowsPerPage = 5;
getLaminationTable();
function saveLamination() {
    var date = document.getElementById("dateInput").value;
    var vendorName = document.getElementById("vendorNameInput").value;
    var contactName = document.getElementById("contactNameInput").value;
    var contactNumber = document.getElementById("contactNumberInput").value;
    var address = document.getElementById("addressInput").value;
    var notes = document.getElementById("notesInput").value;

    if (
      !date ||
      !vendorName ||
      !contactName ||
      !contactNumber ||
      !address ||
      !notes
    ) {
      alert("Please fill in all the required fields.");
      return;
    }
    if (!idOfTaskToEdit) {
      var rowData = {
        date: date,
        vendorName: vendorName,
        contactName: contactName,
        contactNumber: contactNumber,
        address: address,
        notes: notes,
      };

      fetch("http://localhost:3000/laminationTable", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(rowData),
      })
        .then((res) => res.json())
        .then((data) => {
          console.log("Data saved:", data);
          getLaminationTable();
          addRowToTable(data);
          document.location.reload();
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      fetch(`http://localhost:3000/laminationTable/${idOfTaskToEdit}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          date: date,
          vendorName: vendorName,
          contactName: contactName,
          contactNumber: contactNumber,
          address: address,
          notes: notes,
        }),
      })
        .then((res) => {
          return res.json();
        })
        .catch((err) => {
          console.log(err);
        });
      closeModal();
      getLaminationTable();
    }
    document.getElementById("modalForm").removeEventListener("submit", handleSubmit);
  }

function addRowToTable(rowData) {
  var table = document.getElementById("availableVendors");
  var newRow = document.createElement("tr");
  newRow.id = "trVendors";

  var cellsContent = [
    rowData.date,
    rowData.vendorName,
    rowData.contactName,
    rowData.contactNumber,
    rowData.address,
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
  document.getElementById("vendorNameInput").value = "";
  document.getElementById("contactNameInput").value = "";
  document.getElementById("contactNumberInput").value = "";
  document.getElementById("addressInput").value = "";
  document.getElementById("notesInput").value = "";
}
function getLaminationTable() {
  fetch("http://localhost:3000/laminationTable", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.json())
    .then((data) => {
      const header = data[0].header;
      laminationVendors = data.slice(1);
      updateVendors(header);
      document.getElementById("vendorsCount").textContent =
        laminationVendors.length;
    })
    .catch((error) => {
      console.log(error);
    });
}

function updateVendors(header) {
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

  var startIndex = (currentLaminationPage - 1) * laminationRowsPerPage;
  var endIndex = startIndex + laminationRowsPerPage;
  var rowsToShow = laminationVendors.slice(startIndex, endIndex);

  for (var i = 0; i < rowsToShow.length; i++) {
    var vendorNameData = rowsToShow[i];
    var newRow = document.createElement("tr");

    var cellsContent = [
      vendorNameData.date,
      vendorNameData.vendorName,
      vendorNameData.contactName,
      vendorNameData.contactNumber,
      vendorNameData.address,
      vendorNameData.notes,
      createDeleteButton(vendorNameData.id),
      createEditButton(vendorNameData.id),
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
  fetch(`http://localhost:3000/laminationTable/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((res) => {
      return res.json();
    })
    .then((res) => {
      getLaminationTable();
    })
    .catch((err) => {
      console.log(err);
    });
}

function editTask(id) {
  idOfTaskToEdit = id;
  let taskData = laminationVendors.find((task) => task.id === id);
  if (taskData) {
    var modal = document.querySelector("#exampleModal.modal");
    modal.classList.add("show");
    modal.style.display = "block";
    document.getElementById("dateInput").value = taskData.date;
    document.getElementById("vendorNameInput").value = taskData.vendorName;
    document.getElementById("contactNameInput").value = taskData.contactName;
    document.getElementById("contactNumberInput").value =
      taskData.contactNumber;
    document.getElementById("addressInput").value = taskData.address;
    document.getElementById("notesInput").value = taskData.notes;
  }
  var closeButton = document.getElementById("closeVendor1");
  var customCloseButton = document.getElementById("closeVendor2");
  edit.innerHTML = "Edit";
  closeButton.addEventListener("click", closeModal);
  customCloseButton.addEventListener("click", closeModal);
}

function createPagination() {
  var laminationTotalPages = Math.ceil(
    laminationVendors.length / laminationRowsPerPage
  );
  var pagination = document.getElementById("paginationVendors");
  pagination.innerHTML = "";

  var previousLink = document.createElement("a");
  previousLink.classList.add("page-link");
  previousLink.href = "#";
  previousLink.tabIndex = -1;
  previousLink.setAttribute("aria-disabled", "true");
  previousLink.innerHTML = "Previous";

  var previousItem = document.createElement("li");
  previousItem.classList.add("page-item");
  if (currentLaminationPage === 1) {
    previousItem.classList.add("disabled");
  }
  previousItem.appendChild(previousLink);

  pagination.appendChild(previousItem);

  for (var i = 1; i <= laminationTotalPages; i++) {
    var pageLink = document.createElement("a");
    pageLink.classList.add("page-link");
    pageLink.href = "#";
    pageLink.innerHTML = i;
    pageLink.addEventListener("click", handlePageClick);

    var pageItem = document.createElement("li");
    pageItem.classList.add("page-item");
    if (currentLaminationPage === i) {
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
  if (currentLaminationPage === laminationTotalPages) {
    nextItem.classList.add("disabled");
  }
  nextItem.appendChild(nextLink);

  pagination.appendChild(nextItem);

  previousLink.addEventListener("click", function (event) {
    event.preventDefault();
    if (currentLaminationPage > 1) {
      currentLaminationPage--;
      getLaminationTable();
      createPagination();
    }
  });

  nextLink.addEventListener("click", function (event) {
    event.preventDefault();
    if (currentLaminationPage < laminationTotalPages) {
      currentLaminationPage++;
      getLaminationTable();
      createPagination();
    }
  });

  function handlePageClick() {
    currentLaminationPage = parseInt(this.innerHTML);
    getLaminationTable();
    createPagination();
  }
}

function closeModal() {
  clearInputFields();
  var modal = document.querySelectorAll(".modalLamination");
  modal.forEach(function (modal) {
    modal.style.display = "none";
  });
  edit.innerHTML = "Save changes";
  idOfTaskToEdit = "";
}

function handleSubmit(event) {
    saveLamination(); // Call the saveLamination function
    document.location.reload();
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
  