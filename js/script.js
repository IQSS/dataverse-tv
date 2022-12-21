document.addEventListener('DOMContentLoaded', function() {
  populate_cards();
});

async function populate_cards() {
  const url =
    'https://docs.google.com/spreadsheets/d/1uVk_57Ek_A49sLZ5OKdI6QASKloWNzykni3kcYNzpxA/export?gid=0&format=tsv';
  const videoTemplate = document.getElementById('video-template');
  fetch(url)
    .then(response => response.text())
    .then(data => {
      var x = data.split('\n');
      for (var i = 1; i < x.length; i++) {
        y = x[i].split('\t');
        x[i] = y;
        date = y[0];
        speaker = y[1];
        title = y[2];
        description = y[3];
        yurl = '';
        yid = y[4];
        alt = y[5];
        ystart = y[10];
        defaultImage = y[13];
        githubUsername = y[14];
        if (yid === '') {
          yurl = alt;
        } else {
          if (ystart === '') {
            yurl = 'https://www.youtube.com/watch?v=' + yid;
          } else {
            yurl = 'https://www.youtube.com/watch?v=' + yid + '&t=' + ystart + 's';
          }
        }
        slides = y[6];
        const videoInstance = document.importNode(videoTemplate.content, true);
        videoInstance.querySelector('.title').innerHTML = title;
        videoInstance.querySelector('.speaker').innerHTML = speaker;
        videoInstance.querySelector('.description').innerHTML = description;
        videoInstance.querySelector('.date').innerHTML = date;
        videoInstance.querySelector('.title-href').setAttribute('href', yurl);
        videoInstance.querySelector('.title-href').setAttribute('target', '_blank');
        videoInstance.querySelector('.video-image-link').setAttribute('href', yurl);
        videoInstance.querySelector('.video-image-link').setAttribute('target', '_blank');
        // Can't get a thumbnail from YouTube or default image specified.
        if (yid === '' || defaultImage == 1) {
          if (githubUsername.length != 1) {
            // Use GitHub image instead of default image.
            yimg = 'https://github.com/' + githubUsername + '.png';
            videoInstance.querySelector('.imagesrc').setAttribute('src', yimg);
            var vidimg = videoInstance.querySelector('.video-image img');
            vidimg.style.objectFit='scale-down';
          }
        } else {
          // Use YouTube thumbnail.
          yimg = 'https://i.ytimg.com/vi/' + yid + '/hqdefault.jpg';
          videoInstance.querySelector('.imagesrc').setAttribute('src', yimg);
        }
        if (slides === '') {
          videoInstance.querySelectorAll('.slides-link').forEach(e => e.parentNode.removeChild(e));
        } else {
          videoInstance.querySelector('.slides-href').setAttribute('href', slides);
          videoInstance.querySelector('.slides-href').setAttribute('target', '_blank');
        }
        // Append the instance to the DOM
        document.getElementById('videos').appendChild(videoInstance);
      }
    });
}
