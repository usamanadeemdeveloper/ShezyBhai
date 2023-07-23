var vendorsSelect;

// The function to populate the vendors select element
function populateOptionsSelect() {
  fetch("http://localhost:3000/vendorTable", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((res) => res.json())
    .then((jsonData) => {
      vendorsSelect = document.getElementById("vendors");
      vendorsSelect.addEventListener("change", () =>
        updateVendorFields(jsonData)
      ); // Pass jsonData as a parameter
      const uniqueVendors = new Set(); // To store unique vendor names

      // Loop through the vendorTable data and add unique vendors to the set
      jsonData.forEach((item) => {
        if (typeof item.vendor === "string") {
          const vendor = item.vendor.trim();
          if (vendor !== "" && !uniqueVendors.has(vendor)) {
            uniqueVendors.add(vendor);
          }
        }
      });

      // Clear existing options in the select element
      vendorsSelect.innerHTML = "";

      // Create and add the options for each unique vendor
      uniqueVendors.forEach((vendor) => {
        const option = document.createElement("option");
        option.value = vendor;
        option.textContent = vendor;
        vendorsSelect.appendChild(option);
      });
    })
    .catch((err) => {
      console.log("Fetch error:", err);
    });
}

function updateVendorFields(vendorTable) {
    const selectedVendor = vendorsSelect.value;
  
    // Find all the entries for the selected vendor
    const selectedVendorEntries = vendorTable.filter((item) => item.vendor === selectedVendor);
  
    // Collect all the unique processes for the selected vendor
    const uniqueProcesses = new Set();
    selectedVendorEntries.forEach((entry) => {
      if (typeof entry.process === "string") {
        uniqueProcesses.add(entry.process);
      }
    });
  
    // Update the "process" select element
    const processSelect = document.getElementById("process");
    processSelect.innerHTML = "";
    uniqueProcesses.forEach((processOption) => {
      const option = document.createElement("option");
      option.value = processOption;
      option.textContent = processOption;
      processSelect.appendChild(option);
    });
  }  
populateOptionsSelect();
