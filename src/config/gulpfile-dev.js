// commonjs
const path = require('path')
const { src, dest, series, parallel, watch } = require('gulp')
const connect = require('gulp-connect')
const sass = require('gulp-sass')
const webpack = require('webpack-stream')
const proxy = require('http-proxy-middleware')
const devPath = '../../dev'
// copyhtml
function copyhtml() {
  return src('../*.html')
    .pipe(dest(devPath))
    .pipe(connect.reload())
}


function copylibs(){
  return src('../libs/**/*')
    .pipe(dest(`${devPath}/libs`))
    .pipe(connect.reload())
}

function copyassets(){
  return src('../assets/**/*')
    .pipe(dest(`${devPath}/assets`))
    .pipe(connect.reload())
}


// 编译sass
function packSCSS() {
  return src('../styles/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(dest(`${devPath}/styles`))
    .pipe(connect.reload())
}

//js模块化
function packJS(){
  return src('../scripts/app.js')
    .pipe(webpack({
      mode:'development',
      entry:{
        app:'../scripts/app.js',
        'app-search':'../scripts/app-search.js',
        'app-profile':'../scripts/app-profile.js',
      },
      output:{
        path:path.resolve(__dirname, devPath),
        filename:'[name].js'
      },
      module:{
        rules:[
          {
            test:/\.html$/,
            loader:'string-loader'
          },
          {
            test:/\.art$/,
            loader:"art-template-loader"
          },
          {
            test:/\.scss$/,
            loader:[
              'style-loader',
              'css-loader',
              'sass-loader'
            ]
          }
        ]
      }
    }))
    .pipe(dest(`${devPath}/scripts`))
    .pipe(connect.reload())
}

// 启动server
function gulpServer() {
  return connect.server({
    name: 'Dist App',
    root: devPath,
    port: 8000,
    livereload: true,
    middleware:()=>{
      return [
        proxy('/api',{
          target:'https://m.lagou.com',
          changeOrigin:true,
          pathRewrite:{
            '^/api':''
          }
        })
      ]
    }
  })
}

function watchFiles(){
  watch('../*.html',series(copyhtml))
  watch('../libs/*',series(copylibs))
  watch('../assets/**/*',series(copyassets))
  watch('../**/*',series(packJS))
  watch('../**/*.scss',series(packSCSS))
}
exports.default = series(parallel(copyhtml, copyassets, copylibs, packSCSS, packJS), parallel(gulpServer, watchFiles))

