let currUser = new User();
let storyList;
let pageCount = 0;
$('document').ready(function() {
  //Check to see if a users logged in
  if (localStorage.getItem('token')) {
    currUser.loginToken = localStorage.getItem('token');
    currUser.username = JSON.parse(
      atob(localStorage.getItem('token').split('.')[1])
    ).username;
    //Have a welcome screen for the logged in user
    $('.login-form').remove();
    $('.create-account').remove();
    $('.header').append(
      `<div class="my-auto ml-auto mr-5">Welcome, <a href = "profile.html">${
        currUser.username
      }</a></div>`
    );
    $('.header').removeClass('hidden');
    currUser.retrieveDetails(function(res) {
      currUser = res;
      //Get storylist from the server
      StoryList.getStories(function(res) {
        storyList = res;
        renderStories(currUser, storyList);
        //scroll event for infinte scroll
        scroll();
      });
    });
  } else {
    $('.header').removeClass('hidden');
    //Get storylist from the server
    StoryList.getStories(function(res) {
      storyList = res;
      renderStories(currUser, storyList);
      scroll();
    });
  }
  //Login the user
  $('.login-form').on('submit', function(evt) {
    evt.preventDefault();
    currUser = new User($('#username').val(), $('#password').val());
    $('.login-form').trigger('reset');
    currUser.login(function(user) {
      currUser = user;
      location.reload();
    });
  });
  //Show the submit form to submit a new story
  $('.submit').on('click', function(event) {
    $(event.target)
      .parent()
      .next()
      .collapse('toggle');
  });
  //Show the create account form
  $('.create-account').on('click', function(event) {
    $('.create-account-form').collapse('toggle');
  });
  //Create a new user
  $('.create-account-form').on('submit', function(evt) {
    evt.preventDefault();
    User.create(
      $('#new-username').val(),
      $('#new-password').val(),
      $('#new-nickname').val(),
      function(user) {
        user.login(function(user) {
          currUser = user;
        });
      }
    );
    $('.create-account-form').trigger('reset');
  });
  //Submit a new story
  $('.submit-story').on('submit', function(evt) {
    evt.preventDefault();
    if (!currUser.loginToken) alert('Must be logged in to submit a story');
    else {
      storyList.addStory(
        currUser,
        new Story(
          $('#author').val(),
          $('#title').val(),
          $('#url').val(),
          currUser.username
        ),
        function(res) {
          storyList = res;
          renderStories(currUser, storyList);
        }
      );
    }
    $('.submit-story').trigger('reset');
  });
  //Add a favorite
  $('ol').on('click', '.fa-star', function(event) {
    $(event.target).toggleClass('far');
    $(event.target).toggleClass('fas');
    if ($(event.target).hasClass('fas')) {
      let id = $(event.target)
        .parent()
        .attr('id');
      currUser.addFavorite(storyList.stories[id].storyId, function(res) {
        currUser = res;
      });
    } else {
      let id = $(event.target)
        .parent()
        .attr('id');
      currUser.removeFavorite(storyList.stories[id].storyId, function(res) {
        currUser = res;
      });
    }
  });
});
//Show the stories
function renderStories(user, storyList) {
  $('ol').empty();
  let favorite = false;
  let favoritesSet = new Set();
  for (let i = 0; i < user.favorites.length; i++) {
    favoritesSet.add(user.favorites[i].storyId);
  }
  for (let i = 0; i < storyList.stories.length; i++) {
    favorite = false;
    if (user.favorites) {
      if (favoritesSet.has(storyList.stories[i].storyId)) {
        favorite = true;
      }
    }
    $('ol').append(
      $(
        `<li id = "${i}"><i class="${
          favorite ? 'fas' : 'far'
        } fa-star"></i><a href="${
          storyList.stories[i].url
        }" class ="full-opaque title"> ${
          storyList.stories[i].title
        }</a><span class ="url-domain btn btn-link">(${
          storyList.stories[i].url
        })</span></li>`
      )
    );
  }
}

function createStoryList(storyData) {
  const stories = storyData.map(function(val) {
    const { username, title, author, url, storyId } = val;
    return new Story(author, title, url, username, storyId);
  });
  const storyList = new StoryList(stories);
  return storyList;
}

function scroll() {
  $(window).on('scroll', function() {
    var scrollHeight = $(document).height();
    var scrollPosition = $(window).height() + $(window).scrollTop();
    if ((scrollHeight - scrollPosition) / scrollHeight === 0) {
      pageCount++;
      $('.loading').removeClass('hidden');
      $.get(`${BASE_URL}/stories`, { skip: pageCount * 50 }, function(res) {
        let newStoryList = createStoryList(res.data);
        storyList.stories = storyList.stories.concat(newStoryList.stories);
        renderStories(currUser, storyList);
        $('.loading').addClass('hidden');
      });
    }
  });
}
