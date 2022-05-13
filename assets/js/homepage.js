//variables that refrence the dom elements in the html document
var userFormEl=document.querySelector("#user-form");
var nameInputEl=document.querySelector("#username");
//needed before we could display the github api responses
var repoContainerEl = document.querySelector("#repos-container");
var repoSearchTerm = document.querySelector("#repo-search-term");

//When we submit the form, 
//we get the value from the <input> element via the nameInputEl DOM variable and 
//store the value in its own variable called username. 
//Note the .trim() at the end: this piece is useful if we accidentally leave a 
//leading or trailing space in the <input> element, such as " octocat" or "octocat".
//Then we check that there's a value in that username variable. 
//We wouldn't want to make an HTTP request without a username, 
//if we accidentally left the <input> field blank! 
//If there is in fact a value to username, we pass that data to getUserRepos() 
//as an argument. Then, to clear the form, we clear out the <input> element's value.
var formSubmitHandler = function(event) {
    event.preventDefault();
    //get value from input element
    var username = nameInputEl.value.trim();

    if(username) {
        getUserRepos(username);
        repoContainerEl.textContent = "";
        nameInputEl.value ="";
    } else {
        alert("please enter a Github username");
    }
    console.log(event);
}

var getUserRepos = function(user) {
    //make a request to the url
    var apiUrl = "https://api.github.com/users/" + user + "/repos";
//Now that we've created the function, let's set it up so that when the response data is converted to JSON, 
//it will be sent from getUserRepos() to displayRepos(). Edit the fetch() callback code in the getUserRepos() function
    fetch(apiUrl).then(function(response) {
        //response successful
        if (response.ok) {
            response.json().then(function(data) {
                displayRepos(data, user);
            })
        } else {
            alert("Error: GitHUb User Not Found");
        }
})
    .catch(function(error) {
        //notice this '.catch()' getting chained to the end of the '.then()' method 
        alert("unable to connect to GitHub")
//When we use fetch() to create a request, the request might go one of two ways: the request may find its destination URL and attempt to get the data in question, 
//which would get returned into the .then() method; or if the request fails, that error will be sent to the .catch() method.
    })
}
//Let's start by creating a new function called displayRepos(). 
//This function will accept both the array of repository data and the term we searched for as parameters.
var displayRepos = function(repos, searchTerm) {
    //check if api returned any repos
    if (repos.length === 0) {
        repoContainerEl.textContent = "No repositories found."
        return;
    }
    console.log(repos);
    console.log(searchTerm);
    //clear old content
    repoContainerEl.textContent ="";
    repoSearchTerm.textContent = searchTerm;
    //loop over repos
    for (let i = 0; i < repos.length; i++) {
        //format repo name
        var repoName = repos[i].owner.login + "/" + repos[i].name;
        //create link for each repo
        //create a container for each repo
        var repoEl = document.createElement("a"); //changed from"div"
        repoEl.classList = "list-item flex-row justify-space-between align-center";
        repoEl.setAttribute("href", "./single-repo.html?repo = " + repoName); //created link to single repo html
        //create a span element to hold repository name
        var titleEl = document.createElement("span");
        titleEl.textContent = repoName;
        //append to container
        repoEl.appendChild(titleEl);
        //create status element
        var statusEl = document.createElement("span");
        statusEl.classList = "flex-row align-center";

        //check if current repo has issues or not
//We use an if statement to check how many issues the repository has.If the number is greater than zero, then we'll display the number of issues and add a red X icon next to it. 
//If there are no issues, we'll display a blue check mark instead.
        if (repos[i].open_issues_count>0) {
            statusEl.innerHTML= "<i class='fas fa-times status-icon icon-danger'></i>" + repos[i].open_issues_count + " issue(s)";
        } else {
            statusEl.innerHTML = "<i class='fas fa-check-square status-icon icon-success'></i>";
        }
        //append to container 
        repoEl.appendChild(statusEl);
        //append container to the dom
        repoContainerEl.appendChild(repoEl);
    }
//How does this work? In the for loop, we're taking each repository (repos[i]) and writing some of its data to the page. 
//First we format the appearance of the name and repository name. Next we create and style a <div> element. 
//Then we create a <span> to hold the formatted repository name. 
//We add that to the <div> and add the entire <div> to the container we created earlier.
}
//event listiner to forms
userFormEl.addEventListener("submit", formSubmitHandler);
