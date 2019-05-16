### Looking or a maintainer

This repo needs a maintainer, if you want to take it over open an issue.

# DragSort extension for bolt

This extension adds drag-and-drop sorting to bolts overview pages.

**Not compatible with contenttypes that have taxonomies**

To activate it for a contenttype you need to add a integer field called `sortorder` to your fields for the contenttype, and add `sort: sortorder`, `listing_sort: sortorder` and `dragsort: true` to the top-level settings block in the contenttype.

For the default pages contenttype it will look like this:

```
pages:
    name: Pages
    singular_name: Page
    sort: sortorder
    listing_sort: sortorder
    dragsort: true
    fields:
        sortorder:
            type: integer
            default: 0
        title:
            type: text
            class: large
            group: content
        slug:
            type: slug
            uses: title
        image:
            type: image
        teaser:
            type: html
            height: 150px
        body:
            type: html
            height: 300px
        template:
            type: templateselect
            filter: '*.twig'
```
