# Sovendus Tag Dev Instructions

## Development / Release Flow

1. Upload the template.tpl in any GTM account in the tag editor
2. Edit the plugin in the GTM editor
3. Make code changes only in src/script.ts, don't use any external imports except types, before you start execute:

    ```bash
    yarn install
    ```

4. Build code with:

    ```bash
    yarn build
    ```

5. Copy the content of dist/script.js and paste it into the script section in the GTM tag editor.
6. Export the template from GTM and replace the template.tpl with the just downloaded one
7. Commit your changes
8. Copy the hash of the commit you want to publish and add a new release in the metadata.yaml
9. Commit your changes, after up to a day (or longer) the new version will be accessible in the GTM gallery
