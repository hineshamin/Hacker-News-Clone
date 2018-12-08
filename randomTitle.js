let hipsum =
  'synth af wolf, banjo distillery cliche shoreditch tote bag salvia gluten-free. Portland brunch scenester try-hard health goth hell of williamsburg unicorn whatever. Ramps chillwave bushwick tumeric taiyaki wayfarers brooklyn craft beer migas. Next level street art snackwave bitters DIY master cleanse. Meh chartreuse tattooed franzen woke try-hard, pabst mumblecore raw denim pickled glossier pour-over cray semiotics squid. Mustache church-key hella, chillwave fam chambray aesthetic williamsburg PBR&B waistcoat irony';
let words = hipsum.split(' ');
function createString(words) {
  let randomString = '';
  for (let i = 0; i < 6; i++) {
    randomString += words[parseInt(Math.random() * words.length - 1)] + ' ';
  }
  return randomString;
}
for (let i = 0; i < 200; i++) {
  let obj = {
    author: `Walrus ${parseInt(Math.random() * 1000)}`,
    title: createString(words),
    url: 'https://github.com/new'
  };
  storyList.addStory(currUser, obj, function(res) {});
}
