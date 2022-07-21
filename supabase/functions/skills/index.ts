import { serve } from "https://deno.land/std@0.131.0/http/server.ts";
import {
  request,
  gql,
} from "https://deno.land/x/graphql_request@v4.1.0/src/index.ts";

serve(async (req) => {
  const endpoint = "https://profile.api.trailhead.com/graphql";

  const query = `
    fragment EarnedSkill on EarnedSkill {
      __typename
      earnedPointsSum
      id
      itemProgressEntryCount
      skill {
        __typename
        apiName
        id
        name
      }
    }

    query GetEarnedSkills($trailblazerId: String, $queryProfile: Boolean!) {
      profile(trailblazerId: $trailblazerId) @include(if: $queryProfile) {
        __typename
        ... on PublicProfile {
          id
          earnedSkills {
            ...EarnedSkill
          }
        }
      }
    }
  `;

  const data = await request(endpoint, query, await req.json());

  return new Response(JSON.stringify(data), {
    headers: { "Content-Type": "application/json" },
  });
});
