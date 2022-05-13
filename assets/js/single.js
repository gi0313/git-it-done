var repoNameEl = document.querySelector("#repo-name");
var limitWarningEl = document.querySelector("#limit-warning");
var issuesContainerEl = document.querySelector("#issues-container");
//a getRepoIssues() function that will take in a repo name as a parameter. 
//For basic testing, console.log() the passed repo name as such:
var getRepoIssues = function(repo) {
    //format the github api url
    var apiUrl ="https://api.github.com/repos/" + repo + "/issues?direction=asc";

    fetch(apiUrl).then(function(response) {
        // request was successful
        if (response.ok) {
          response.json().then(function(data) {
              //pass response data to dom function
            displayIssues(data);
            //check if api has paginated issues
            if (response.headers.get("Link")) {
                displayWarning(repo);
            }
          })
        } else {
          alert("There was a problem with your request!");
        }
    });
}

var displayIssues = function(issues) {
    if (issues.length===0) {
        issuesContainerEl.textContent = "This repo has no open issues!";
        return;
    }
    
//loop over the response data and create an <a> element for each issue, as shown here:
    for (let i = 0; i < issues.length; i++) {
        //create a link element to take users to the githuvb issue
        var issueEl = document.createElement("a");
        issueEl.classList = "list-item flex-row justify-space-between align-center";
        issueEl.setAttribute("href", issues[i].html_url);
        issueEl.setAttribute("target", "_blank");
        //create span to hold issue title
        var titleEl = document.createElement("span");
        titleEl.textContent = issues[i].title;

        //append to container
        issueEl.appendChild(titleEl);

        //create a type element
        var typeEl = document.createElement("span");

        //check if issue is an actual issue or a pull request
        if (issues[i].pull_requests) {
            typeEl.textContent = "(Pull Request)";
        } else {
            typeEl.textContent = "(Issue)";
        }
        //append to container
        issueEl.appendChild(typeEl);
        //append to the dom
        issuesContainerEl.appendChild(issueEl);
    }
}

var displayWarning = function(repo) {
    //add text to warning container
    limitWarningEl.textContent = "To see more than 30 results, visit ";

    var linkEl = document.createElement("a"); 
    linkEl.textContent = "See more issues on GItHub.com";
    linkEl.setAttribute("href", "https://github.com/" + repo + "/issues");
    linkEl.setAttribute("target", "_blank");

    //append to warning container
    limitWarningEl.appendChild(linkEl);
}

getRepoIssues("facebook/react");
