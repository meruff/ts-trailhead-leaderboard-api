import { serve } from "https://deno.land/std@0.131.0/http/server.ts";
import {
  request,
  gql,
} from "https://deno.land/x/graphql_request@v4.1.0/src/index.ts";

serve(async (req) => {
  const endpoint = "https://profile.api.trailhead.com/graphql";

  const query = `
    fragment EarnedAward on EarnedAwardBase {
      __typename
      id
      award {
        __typename
        id
        title
        type
        icon
        content {
          __typename
          webUrl
          description
        }
      }
    }

    fragment EarnedAwardSelf on EarnedAwardSelf {
      __typename
      id
      award {
        __typename
        id
        title
        type
        icon
        content {
          __typename
          webUrl
          description
        }
      }
      earnedAt
      earnedPointsSum
    }

    fragment StatsBadgeCount on TrailheadProfileStats {
      __typename
      earnedBadgesCount
    }

    fragment ProfileBadges on PublicProfile {
      __typename
      trailheadStats {
        ... on TrailheadProfileStats {
          ...StatsBadgeCount
        }
      }
      earnedAwards(first: $count, after: $after, awardType: $filter) {
        edges {
          node {
            ... on EarnedAwardBase {
              ...EarnedAward
            }
            ... on EarnedAwardSelf {
              ...EarnedAwardSelf
            }
          }
        }
        pageInfo {
          ...PageInfoBidirectional
        }
      }
    }

    fragment PageInfoBidirectional on PageInfo {
      __typename
      endCursor
      hasNextPage
      startCursor
      hasPreviousPage
    }

    query GetTrailheadBadges($trailblazerId: String, $queryProfile: Boolean = false, $count: Int = null, $after: String = null, $filter: AwardTypeFilter = null) {
      profile(trailblazerId: $trailblazerId) @include(if: $queryProfile) {
        __typename
        ... on PublicProfile {
          ...ProfileBadges
        }
      }
    }
  `;

  const data = await request(endpoint, query, await req.json());

  return new Response(JSON.stringify(data), {
    headers: { "Content-Type": "application/json" },
  });
});
