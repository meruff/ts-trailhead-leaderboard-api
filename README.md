# ts-trailhead-leaderboard-api

A quick set of [Supabase Edge Functions](https://supabase.com/docs/guides/functions) thrown together to extend my [go-trailhead-leaderboard-api](https://github.com/meruff/go-trailhead-leaderboard-api). Assists with interfacing with Trailhead's graphql queries easier than Golang can. These functions handle creating the graphql query and sending the request to the endpoint.

> 🚨 Note: the URLs below are just the auto-generated project URL from my Supabase project. These can change at any time. And should not be used in production. Create your own Supabase project for use in your own project.

## Endpoints

The endpoints will return data when making a callout using a `POST` and providing some basic request parameters. `<trailhead_profile_id>` below needs to be replaced with the User's Salesforce Id used for their user on Trailhead. This is queried for and handled by my [go-trailhead-leaderboard-api](https://github.com/meruff/go-trailhead-leaderboard-api). See that repo for how I get it, it uses that Id in the request.

I've noticed in playing around with the graphql requests that `queryProfile` seems to be required in all requests.

### Rank

`https://nvmegutajwfwssbzpgdb.functions.supabase.co/rank`

Returns information about a Trailblazer's rank.

`POST` Request:

```json
{
  "queryProfile": true,
  "trailblazerId": "<trailhead_user_id>"
}
```

Response:

```json
"trailheadStats": {
    "__typename": "TrailheadProfileStats",
    "earnedPointsSum": 167050,
    "earnedBadgesCount": 168,
    "completedTrailCount": 21,
    "rank": {
        "__typename": "TrailheadRank",
        "title": "Ranger",
        "requiredPointsSum": 50000,
        "requiredBadgesCount": 100,
        "imageUrl": "https://trailhead.salesforce.com/assets/ranks/ranger-c18ceeaa67bb14bf214edd30a4343f40e766012a0dbda79b5c758209acaeb334.png"
    },
    "nextRank": null
}
```

### Skills

`https://nvmegutajwfwssbzpgdb.functions.supabase.co/skills`

Returns information about a Trailblazer's skill distribution based on completed modules.

`POST` Request:

```json
{
  "queryProfile": true,
  "trailblazerId": "<trailhead_user_id>"
}
```

Response:

```json
"earnedSkills": [
    {
        "__typename": "EarnedSkill",
        "earnedPointsSum": 5724,
        "id": "c9aa3b88-c72d-4a5f-b92e-ec65af02674d",
        "itemProgressEntryCount": 51,
        "skill": {
            "__typename": "Skill",
            "apiName": "crm",
            "id": "0246ac31-20f5-9502-7e50-097c19144f62",
            "name": "CRM"
        }
    },
    {
        "__typename": "EarnedSkill",
        "earnedPointsSum": 1200,
        "id": "ea021f86-cf16-42c7-a0c2-198ae58c249e",
        "itemProgressEntryCount": 4,
        "skill": {
            "__typename": "Skill",
            "apiName": "chatter",
            "id": "0246ac31-20f5-9515-92dc-618d160498da",
            "name": "Chatter"
        }
    },
    ...
]
```

### Badges

`https://nvmegutajwfwssbzpgdb.functions.supabase.co/badges`

Badges returns the first 25 badges. You can add additional filters for type, count, and previous page (returned in the response).

`POST` Request:

```json
{
  "queryProfile": true,
  "count": null,
  "after": null,
  "filter": "SUPERBADGE",
  "trailblazerId": "<trailhead_user_id>"
}
```

The request for badges takes multiple parameters.

| Parameter | Possible Values                                              |
| --------- | ------------------------------------------------------------ |
| `count`   | 1-? I've tested up to 50 per page.                           |
| `after`   | id of the `pageInfo` response to start at in the next query. |
| `filter`  | type of badge to return: "MODULE", "EVENT", "SUPERBADGE"     |

Response:

```json
"earnedAwards": {
    "edges": [
        {
            "node": {
                "__typename": "EarnedAwardBase",
                "id": "029ad362-ad42-2964-ce13-e9a8c6959b39",
                "award": {
                    "__typename": "Award",
                    "id": "0299a056-d802-aeeb-0499-f8530d1f8b28",
                    "title": "Administrator Certification Maintenance (Spring '22)",
                    "type": "MODULE",
                    "icon": "https://res.cloudinary.com/hy4kyit2a/f_auto,fl_lossy,q_70/learn/modules/administrator-certification-maintenance-spring-22/adeda0c8102c2b18988e32b86754e4b2_badge.png",
                    "content": {
                        "__typename": "Content",
                        "webUrl": "https://trailhead.salesforce.com/content/learn/modules/administrator-certification-maintenance-spring-22",
                        "description": "Review updates to Salesforce to maintain your Administrator certification."
                    }
                }
            }
        },
        ...
    ],
    "pageInfo": {
        "__typename": "PageInfo",
        "endCursor": "eyJzIjoiMDI4NjYwMGQtZTJmNS05NWFhLWJhZjEtNWZlYTg2Mzk1NzA5IiwicHAiOjEwLCJwbiI6MX0",
        "hasNextPage": true,
        "startCursor": "eyJzIjoiMDI5YWQzNjItYWQ0Mi0yOTY0LWNlMTMtZTlhOGM2OTU5YjM5IiwicHAiOjEwLCJwbiI6MX0",
        "hasPreviousPage": false
    }
```

You'll see `pageInfo` holds data about the current page "cursor" and whether or not there is a previous or next page. The cursor is what you'll use in subsequent calls to get the next or previous page by passing it to the `after` param in the request.

---

_I can add more endpoints once Trailhead converts them to graphql. For now they still have profile and cerfitication data in their Apex services._
