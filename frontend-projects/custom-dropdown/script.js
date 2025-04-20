document.addEventListener("DOMContentLoaded", function () {
  const dropdownButton = document.querySelector(".dropdown-button");
  const dropdownList = document.querySelector(".dropdown-list");
  const dropdownItems = document.querySelectorAll(".dropdown-list .item");

  dropdownButton.addEventListener("click", () => {
    toggleDropdown();
  });
  dropdownItems.forEach((item) => {
    item.addEventListener("click", () => {
      selectDropdownItem(item);
    });
  });
  function toggleDropdown() {
    dropdownList.classList.toggle("open");
  }
  function selectDropdownItem(item) {
    dropdownItems.forEach((listItem) => {
      listItem.classList.remove("selected");
    });
    item.classList.add("selected");
    const itemText = item.textContent;

    dropdownButton.textContent = itemText;
    toggleDropdown();
  }
});
