import { serve } from "https://deno.land/std@0.131.0/http/server.ts";
import {
  request,
  gql,
} from "https://deno.land/x/graphql_request@v4.1.0/src/index.ts";

serve(async (req) => {
  const endpoint = "https://profile.api.trailhead.com/graphql";

  const query = `
    fragment TrailheadRank on TrailheadRank {
      __typename
      title
      requiredPointsSum
      requiredBadgesCount
      imageUrl
    }

    fragment PublicProfile on PublicProfile {
      __typename
      trailheadStats {
        __typename
        earnedPointsSum
        earnedBadgesCount
        completedTrailCount
        rank {
          ...TrailheadRank
        }
        nextRank {
          ...TrailheadRank
        }
      }
    }

    query GetTrailheadRank($trailblazerId: String, $queryProfile: Boolean!) {
      profile(trailblazerId: $trailblazerId) @include(if: $queryProfile) {
        ... on PublicProfile {
          ...PublicProfile
        }
        ... on PrivateProfile {
          __typename
        }
      }
    }
  `;

  const data = await request(endpoint, query, await req.json());

  return new Response(JSON.stringify(data), {
    headers: { "Content-Type": "application/json" },
  });
});
