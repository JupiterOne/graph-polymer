# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to
[Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [1.2.0] - 2023-06-08

### Fixed

- Instances where violation rules are empty are now properly handled.

## [1.1.0] - 2023-05-22

### Added

- Added additional mapped relationships. | Source Entity `_type` | Relationship
  `_class` | Target Entity `_type` | Direction | | --------------------- |
  --------------------- | --------------------- | --------- | |
  `polymer_violation` | **HAS** | `*github_user*` | REVERSE | |
  `polymer_violation` | **HAS** | `*google_user*` | REVERSE | |
  `polymer_violation` | **HAS** | `*slack_channel*` | REVERSE | |
  `polymer_violation` | **HAS** | `*slack_user*` | REVERSE |

## [1.0.0] - 2022-12-20

### Added

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

  The following mapped relationships are created:

  | Source Entity `_type` | Relationship `_class` | Target Entity `_type` | Direction |
  | --------------------- | --------------------- | --------------------- | --------- |
  | `polymer_violation`   | **HAS**               | `*Person*`            | REVERSE   |
