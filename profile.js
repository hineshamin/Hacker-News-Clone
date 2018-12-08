let currUser = new User();
let storyList = new StoryList();
$(document).ready(function() {
  if (localStorage.getItem('token')) {
    currUser.loginToken = localStorage.getItem('token');
    currUser.username = JSON.parse(
      atob(localStorage.getItem('token').split('.')[1])
    ).username;
    $('.header').append(
      `<div class="my-auto ml-auto mr-5">Welcome, <a href = "profile.html">${
        currUser.username
      }</a></div>`
    );
    currUser.retrieveDetails(function(res) {
      currUser = res;
      $('.user-info').append($(`<h3>Nickname: ${currUser.name}</h3>`));
      $('.user-info').append($(`<h3>Username: ${currUser.username}</h3>`));
      renderUserStoryInfo(currUser, 'favorites');
      renderUserStoryInfo(currUser, 'ownStories');
      //Create click handler for removing stories from user info
      $('ol').on('click', '.fa-trash-alt', function(evt) {
        let removeStory = $(evt.target)
          .parent()
          .parent()
          .attr('id');

        $(evt.target)
          .parent()
          .parent()
          .remove();

        if (removeStory.split(' ')[1] === 'ownStories') {
          let ownStories = createStoryList(currUser.ownStories);
          let id = removeStory.split(' ')[0];
          ownStories.removeStory(
            currUser,
            currUser.ownStories[id].storyId,
            function(res) {
              currUser.ownStories.splice(id, 1);
              renderUserStoryInfo(currUser, 'ownStories');
            }
          );
        } else {
          let id = removeStory.split(' ')[0];
          currUser.removeFavorite(currUser.favorites[id].storyId, function(
            res
          ) {
            renderUserStoryInfo(currUser, 'favorites');
          });
        }
      });
    });
  } else {
    alert('Need to login to access this page');
  }
});

function createStoryList(storyData) {
  const stories = storyData.map(function(val) {
    const { username, title, author, url, storyId } = val;
    return new Story(author, title, url, username, storyId);
  });
  const storyList = new StoryList(stories);
  return storyList;
}

//Show the stories
function renderUserStoryInfo(user, type) {
  $(`.${type} ol`).empty();
  for (let i = 0; i < user[type].length; i++) {
    $(`.${type} ol`).append(
      $(
        `<li id = "${i} ${type}"><a href="${
          user[type][i].url
        }" class ="full-opaque title"> ${
          user[type][i].title
        }</a><span class ="url-domain btn btn-link">(${
          user[type][i].url
        })</span><span><i class="far fa-trash-alt"></i></span></li>`
      )
    );
  }
}
