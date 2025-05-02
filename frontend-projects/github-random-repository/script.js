document.addEventListener("DOMContentLoaded", () => {
  const elements = {
    selectedLanguage: document.getElementById("language"),
    searchForm: document.getElementById("search-form"),
    stateContainer: document.getElementById("state"),
    refreshButton: document.getElementById("refresh"),
    retryButton: document.getElementById("retry"),
  };

  elements.refreshButton.addEventListener("click", searchRepo);
  elements.retryButton.addEventListener("click", searchRepo);
  elements.selectedLanguage.addEventListener("change", searchRepo);
  elements.searchForm.addEventListener("submit", (e) => {
    e.preventDefault();
    searchRepo();
  });

  async function searchRepo() {
    const language = elements.selectedLanguage.value.trim();
    if (!language) {
      updateState();
    }

    const page = Math.floor(Math.random() * 10) + 1;
    const url = getGithubApiUrl(language, page);

    try {
      updateState(2);
      const response = await fetch(url, {
        headers: { Accept: "application/vnd.github.v3+json" },
      });
      if (!response.ok) {
        updateState(1);
        return;
      }
      const data = await response.json();

      if (!data.items || data.items.length === 0) {
        updateState(3);
        return;
      }

      elements.refreshButton.classList.add("visible");
      elements.retryButton.classList.remove("visible");

      updateState();
      const repo = data.items[0];
      renderRepository(repo);
    } catch (error) {
      updateState(4);
    }
  }

  function updateState(state) {
    switch (state) {
      case 1:
        // LANGUAGE DOES NOT EXIST
        elements.stateContainer.textContent =
          "Select a language that exists please.";
        elements.stateContainer.classList = "state-1";

        elements.refreshButton.classList.remove("visible");
        elements.retryButton.classList.add("visible");
        break;
      case 2:
        // LOADING STATE
        elements.stateContainer.classList = "state-2";
        elements.stateContainer.innerHTML = `Loading...`;
        break;
      case 3:
        // NO ITEMS FOUND
        elements.stateContainer.textContent = "No items found.";
        elements.stateContainer.classList = "state-3";
        break;
      case 4:
        elements.stateContainer.textContent =
          "Ocurrió un error. Intenta de nuevo.";
        elements.stateContainer.classList = "state-error";
        elements.refreshButton.classList.remove("visible");
        elements.retryButton.classList.add("visible");
        break;

      default:
        elements.stateContainer.classList = "state-default";
        break;
    }
  }

  function getGithubApiUrl(language, page) {
    const url = `https://api.github.com/search/repositories?q=language:${encodeURIComponent(
      language
    )}&sort=stars&order=desc&page=${page}&per_page=1`;
    return url;
  }

  function renderRepository(repo) {
    const html = `
        <div id="repo">
            <div class="title">
                <a href="${repo.html_url}" target="_blank">${repo.name}</a>
                <a href="${
                  repo.html_url
                }" class="btn btn-small" target="_blank"><i class="fas fa-arrow-right"></i></a>
            </div>
            <div class="description">${
              repo.description || "Sin descripción"
            }</div>
            <div class="ext-info">
                <div class="username"><i class="fas fa-user"></i>${
                  repo.owner.login
                }</div>
                <div class="language"><i class="fas fa-code"></i>${
                  repo.language
                }</div>
                <div class="stars"><i class="fas fa-star"></i>${
                  repo.stargazers_count
                }</div>
            </div>
        </div>
      `;
    elements.stateContainer.innerHTML = html;
  }
});
