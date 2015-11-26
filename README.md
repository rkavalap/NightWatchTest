# NightWatchTest

Sample project created to try NightWatch Browser UI Test framework using nodejs, nightwatch and typescript.

#Setup:
<br>Install nodejs from http://nodejs.org
<br>git clone https://github.com/rkavalap/NightWatchTest
<br>cd nightwatchtest
<br>npm install gulp -g
<br>npm install

#To clean & compile:
<br>gulp

#To run:
<br>node node_modules/nightwatch/bin/runner.js -t buildOutput/javascript1.js --env chrome

#Project source:
<br>tests   -> Contains all the UI test
<br>typings -> Contains the typescript definition files for nightwatch, nodejs
<br>globalsmodule.js -> nightwatch globals module file
<br>gulpfile.js -> build file (compiltation from ts to js using gulp)
<br>nightwatch.json -> config file for nightwatch
<br>package.json -> installed nodejs packages used for this project


