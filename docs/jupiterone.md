# Polymer

## Integration Benefits

- Visualize Polymer rules and violations in the JupiterOne graph.
- Monitor changes to Polymer rules and violations using JupiterOne alerts.

## How it Works

- JupiterOne periodically fetches rules and violations from Polymer to update
  the graph.
- Users can then write JupiterOne queries to review and monitor updates to the
  graph or leverage existing queries.
- Additionally, users can configure alerts to take action when the JupiterOne
  graph changes or leverage existing alerts.

## Prerequisites

- JupiterOne requires an API key. You need permission to create a user in
  Polymer that is used to obtain the API key.
- You must have permission in JupiterOne to install new integrations.

## Support

If you need help with this integration, contact
[JupiterOne Support](https://support.jupiterone.io).

## How to Use This Integration

### In Polymer

TODO: List specific actions that must be taken in the provider. Remove this
section when there are no actions to take in the provider.

1. [Generate a REST API key](https://example.com/docs/generating-api-keys)

### In JupiterOne

TODO: List specific actions that the user must take in JupiterOne. Many of the
following steps will be reusable; take care to be sure they remain accurate.

1. From the top navigation of the J1 Search homepage, select **Integrations**.
2. Scroll down to **Polymer** and click it.
3. Click **Add Configuration** and configure the following settings:

- Enter the account name by which you want to identify this Polymer account in
  JupiterOne. Select **Tag with Account Name** to store this value in
  `tag.AccountName` of the ingested assets.
- Enter a description to help your team identify the integration.
- Select a polling interval that is sufficient for your monitoring requirements.
  You can leave this as `DISABLED` and manually execute the integration.
- {{additional provider-specific settings}} Enter the Polymer API key generated
  for use by JupiterOne.

4. Click **Create Configuration** after you have entered all the values.

## How to Uninstall

TODO: List specific actions that must be taken to uninstall the integration.
Many of the following steps will be reusable; take care to be sure they remain
accurate.

1. From the top navigation of the J1 Search homepage, select **Integrations**.
2. Scroll down to **Polymer** and click it.
3. Identify and click the **integration to delete**.
4. Click the trash can icon.
5. Click **Remove** to delete the integration.

<!-- {J1_DOCUMENTATION_MARKER_START} -->
<!--
********************************************************************************
NOTE: ALL OF THE FOLLOWING DOCUMENTATION IS GENERATED USING THE
"j1-integration document" COMMAND. DO NOT EDIT BY HAND! PLEASE SEE THE DEVELOPER
DOCUMENTATION FOR USAGE INFORMATION:

https://github.com/JupiterOne/sdk/blob/main/docs/integrations/development.md
********************************************************************************
-->

## Data Model

### Entities

The following entities are created:

| Resources | Entity `_type`      | Entity `_class` |
| --------- | ------------------- | --------------- |
| Account   | `polymer_account`   | `Account`       |
| Rule      | `polymer_rule`      | `Rule`          |
| Violation | `polymer_violation` | `Finding`       |

### Relationships

The following relationships are created:

| Source Entity `_type` | Relationship `_class` | Target Entity `_type` |
| --------------------- | --------------------- | --------------------- |
| `polymer_account`     | **HAS**               | `polymer_rule`        |
| `polymer_rule`        | **IDENTIFIED**        | `polymer_violation`   |

### Mapped Relationships

The following mapped relationships are created:

| Source Entity `_type` | Relationship `_class` | Target Entity `_type` | Direction |
| --------------------- | --------------------- | --------------------- | --------- |
| `Person`              | **HAS**               | `*polymer_violation*` | REVERSE   |

<!--
********************************************************************************
END OF GENERATED DOCUMENTATION AFTER BELOW MARKER
********************************************************************************
-->
<!-- {J1_DOCUMENTATION_MARKER_END} -->
