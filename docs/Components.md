
## Designer

- [ ] As Component is dropped on, open the dialog
- [ ] Clicking the ... next to the `name` does the same thing
- [ ] When selected, the property sheet loads the `schema` and pulls the `name`, `displayName`, and property `type`, 


## API

- [ ] Create new Azure function, components.adaptivecards.io
- [ ] DNS request for components
- [ ] CORS

### List

https://components.adaptivecards.io/list

### Search

https://components.adaptivecards.io/find?name=<WHAT-USER-TYPED>

A barebones /find will return the top 10 components.

```json
[
    {
        "type": "AdaptiveComponent",
        "name": "schema.org/Thing",
        "views": {
            "default": {

            }
        },
        "sampleData": {}
    },
    {
        "type": "AdaptiveComponent",
        "name": "schema.org/LocalBusiness"
    }
]
```

### Get component

https://components.adaptivecards.io/<NAME>

E.g.: https://components.adaptivecards.io/schema.org/Thing.json


Usage:

```json
{
    "type": "Component",
    "name": "schema.org/Thing",
    "properties": {
        "name": "Adaptive Cards",
        "description": "A card-like render format"
    }
}
```

Definition:

```json
{
    "type": "AdaptiveComponent",
    "name": "schema.org/Thing",
    "sampleData": {
        "name": "Adaptive Cards",
        "description": "A card-like render format",
        "image": "https://adaptivecards.io/content/icon.png"
    },
    "schema": {
        "properties": {
            "name": {
                "type": "string",
                "displayName": "Name"
            },
            "description": {
                "type": "string",
                "displayName": "Description",
                "editor:isMultiLine": "true"
            },
            "image": {
                "type": "string",
                "displayName": "Image"
            }
        }
    },
    "views": {
        "default": {
            "type": "Container",
            "items": [
                {
                    "type": "TextBlock",
                    "text": "${name}"
                }
            ]
        }
    }
}
```