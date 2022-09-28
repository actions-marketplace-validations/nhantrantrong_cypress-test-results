# cypress-test-results

This is repository to retrieve cypress test results summary after execution in github action. The retrieved Test Results Summary would be stored in the corresponding Github Action outputs.
```
  outputs:
    numOfTestFiles:
      description: "Total number of test files"
    numOfTests:
      description: "Total number of tests"
    numOfPassed:
      description: "Total number of tests with PASSED result"
    numOfFailed:
      description: "Total number of tests with FAILED result"
    numOfPending:
      description: "Total number of tests with PENDING result"
    numOfSkipped:
      description: "Total number of tests with SKIPPED result"
    duration:
      description: "Cypress tests executed duration which is already formatted in hms"
    durationInMilliseconds:
      description: "Cypress tests executed duration in milliseconds"
    dashboardUrl:
      description: "Cypress Dashboard URL if the run was recorded"
```

# Install

Add this plugin as a dev dependency to your Cypress project

```
# install using NPM
$ npm i -D cypress-test-results
# or using Yarn
$ yarn add -D cypress-test-results
```

Register the plugin from your **_cypress.config.js_** file

```
setupNodeEvents(on, config) {
  // implement node event listeners here

  cypressTestResults(on, config)
},
```

# Sample Usages

Please the sample code of using cypress-test-results plug-in [here](https://github.com/nhantrantrong/sample-cypress-test-results)

- Register the plugin from your **_cypress.config.js_** file

![image](https://user-images.githubusercontent.com/64664332/192759455-9896c467-3f1c-4d18-93c4-da0d335a375d.png)

- Test execution on your local

![image](https://user-images.githubusercontent.com/64664332/192760764-8c187b74-ecbe-453e-a3cd-765dff02d99d.png)

- Test Run on Github Action Workflow

![image](https://user-images.githubusercontent.com/64664332/192761233-d0c85086-c4c8-4f1c-bda7-0290a079a18c.png)

![image](https://user-images.githubusercontent.com/64664332/192761341-2e1dbce3-b834-4eeb-9dc7-8d0cb7024331.png)


