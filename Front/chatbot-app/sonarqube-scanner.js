const scanner = require('sonarqube-scanner');scanner(
    {
    serverUrl: "http://localhost:9000",
    options: {
      "sonar.sources": "./src",
      "sonar.login" : "admin",
      "sonar.password": "gabi123"
    },
  },
  () => process.exit()
  );