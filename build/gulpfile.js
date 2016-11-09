const path = require('path');
const gulp = require('gulp');
const open = require('open');
const ngrok = require('ngrok');
const util = require('gulp-util');
const nodemon = require('gulp-nodemon');

gulp.task('run', () => {
  ngrok.connect(3000, (ngrokError, url) => {
    if (ngrokError) {
      throw ngrokError;
    }

    nodemon({
      script: './ui/devserver.js',
      ext: 'js json',
      env: {
        NODE_ENV: 'development',
        WT_URL: url
      },
      ignore: [
        path.join(__dirname, '../build/'),
        path.join(__dirname, '../components/'),
        path.join(__dirname, '../containers/'),
        path.join(__dirname, '../reducers/'),
        path.join(__dirname, '../node_modules/')
      ]
    });

    setTimeout(() => {
      const publicUrl = `${url.replace('https://', 'http://')}/login`;
      open(publicUrl);
      util.log('Public Url:', publicUrl);
    }, 4000);
  });
});
