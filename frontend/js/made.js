function renderSearchResults(search_results) {
    console.log("In renderSearchResults");
    const displayContainer = document.getElementById("result");
    var displayableResults = "";
    console.log(`Forming results`);
    search_results.results.forEach(targetResults => {
        console.log("In loop");
        displayableResults += `
  <div class="col-xs-6 col-sm-4 col-md-3">
   <div class="thumbnail">
    <a href="https://youtu.be/${targetResults.id}">
     <img alt="${targetResults.title}" class="lazyload ythumbnail" data-src="https://i.ytimg.com/vi/${targetResults.id}/0.jpg" src="https://i.ytimg.com/vi/${targetResults.id}/0.jpg"/>
    </a>
    <div class="search-info">
     <a href="https://youtu.be/${targetResults.id}">
      ${targetResults.title}
     </a>
     <br/>
    </div>
   </div>
  </div>
        `;

    });
    console.log("Done forming now writing");
    displayContainer.innerHTML = `<div class="row" id="list-video">${displayableResults}</div>`;
    hideLoading();
}


function showLoading(){
    const loading_img = document.getElementById("loading_img");
    w3.showElement(loading_img);
    const displayContainer = document.getElementById("result");
    displayContainer.innerHTML = "";
}

function hideLoading(){
    const loading_img = document.getElementById("loading_img");
    w3.hideElement(loading_img);
}

function searchVideos() {
    showLoading();
    const query = document.querySelector("#txt-url").value;
    console.log("Fetching results from API");
    w3.getHttpObject("http://localhost:8000/api/v1/search?limit=4&q=" + query, renderSearchResults);
    console.log("Done rendering search results");
}
