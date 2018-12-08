//Allow the submit button in the header to open the form to put in a item in the list
$('.submit').on('click', function(event) {
  $(event.target)
    .parent()
    .next()
    .collapse('toggle');
});

//Create the new elements in the list when submitting the form
$('form').on('submit', function(event) {
  //Prevent refresh when submitting
  //event.preventDefault();
  //Get values from the form
  let title = $('.form-control')
    .eq(0)
    .val();
  let url = $('.form-control')
    .eq(1)
    .val();
  let urlDomain = getUrlDomain(url);
  $('form')[0].reset();
  $(event.target).collapse('toggle');
  //Create new list items and append to list
  let $newLine = $('<li>');
  $newLine.html(
    `<i class="far fa-star"></i><span class ="full-opaque"> ${title}</span><span class ="url-domain btn btn-link">(${urlDomain})</span>`
  );
  $('ol').append($newLine);
  //Make sure to show all of the list when submitting so that hiding doesn't conflict
  $('.fa-star')
    .parent()
    .removeClass('star-hide url-hide');
});

//Helper function to get just the url domain to list
function getUrlDomain(url) {
  let urlDomain = url.split('/');
  urlDomain = urlDomain[2].split('.');
  if (urlDomain.length === 3) {
    return `${urlDomain[1]}.com`;
  }
  return `${urlDomain[0]}.com`;
}

//Add click listener to turn the star into a solid star
$('ol').on('click', '.fa-star', function(event) {
  $(event.target).toggleClass('far');
  $(event.target).toggleClass('fas');
});

//Add event listener on the favorites link to toggle hiding favorites
$('.favorites').on('click', function(event) {
  $('.fa-star')
    .parent()
    .removeClass('url-hide');
  $('.far')
    .parent()
    .toggleClass('star-hide');
});

//Add event listener to the URLs so that when you click on a URL only those show
$('ol').on('click', '.url-domain', function(event) {
  $('.fa-star')
    .parent()
    .removeClass('url-hide');
  let urlDomain = $(event.target).text();
  let $urlDomainElems = $('.url-domain');
  for (let i = 0; i < $urlDomainElems.length; i++) {
    if ($urlDomainElems.eq(i).text() !== urlDomain) {
      $urlDomainElems
        .eq(i)
        .parent()
        .addClass('url-hide');
    }
  }
});
