# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to
[Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Changed

- Added initial integration with Polymer:

  The following entities are created:

  | Resources | Entity `_type`      | Entity `_class` |
  | --------- | ------------------- | --------------- |
  | Account   | `polymer_account`   | `Account`       |
  | Rule      | `polymer_rule`      | `Rule`          |
  | Violation | `polymer_violation` | `Finding`       |

  The following relationships are created:

  | Source Entity `_type` | Relationship `_class` | Target Entity `_type` |
  | --------------------- | --------------------- | --------------------- |
  | `polymer_account`     | **HAS**               | `polymer_rule`        |
  | `polymer_rule`        | **IDENTIFIED**        | `polymer_violation`   |
