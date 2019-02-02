Feature: Main test features

  Scenario: Load all test items
    Given the user navigates to the test page
    When the application loads
    Then all test items should be listed